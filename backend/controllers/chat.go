package controllers

import (
	"log"
	"net/http"
	"strconv"

	"travel_mate/backend/models"
	"travel_mate/backend/ws"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

/*
=========================

	FOLLOW → ensure/create DIRECT conversation & add both users
	Body: { "follower_id": X, "following_id": Y }
	Call this when a follow is created/accepted.
	=========================
*/
func EnsureDirectOnFollow(c *gin.Context) {
	var body struct {
		FollowerID  int `json:"follower_id" binding:"required"`
		FollowingID int `json:"following_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	conv, created, err := models.EnsureDirectConversationOnFollow(body.FollowerID, body.FollowingID)
	if err != nil {
		log.Printf("[EnsureDirectOnFollow] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to ensure direct conversation"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"conversation": conv,
		"created":      created,
	})
}

/*
=========================

	GROUP → ensure/create GROUP conversation & add member
	Params: :group_id
	Body: { "user_id": N, "title": "optional group title" }
	Call this when a group add/invite is accepted.
	=========================
*/
func AddUserToGroupChat(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}
	var body struct {
		UserID int     `json:"user_id" binding:"required"`
		Title  *string `json:"title"` // optional
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	conv, convCreated, memberAdded, err := models.AddUserToGroupConversationOnJoin(groupID, body.UserID, body.Title)
	if err != nil {
		log.Printf("[AddUserToGroupChat] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add user to group chat"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"conversation":       conv,
		"conversation_new":   convCreated,
		"member_newly_added": memberAdded,
	})
}

/*
=========================

	List Conversations for User
	GET /users/:user_id/conversations
	=========================
*/
func GetConversationsForUser(c *gin.Context) {
	uid, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	convs, err := models.GetConversationsForUser(uid)
	if err != nil {
		log.Printf("[GetConversationsForUser] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
		return
	}
	c.JSON(http.StatusOK, convs)
}

/*
=========================

	List Messages by Conversation
	GET /conversations/:id/messages?limit=100
	=========================
*/
func GetMessagesByConversation(c *gin.Context) {
	convID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation id"})
		return
	}
	limit := 100
	if s := c.Query("limit"); s != "" {
		if n, err := strconv.Atoi(s); err == nil && n > 0 {
			limit = n
		}
	}
	msgs, err := models.GetMessagesByConversation(convID, limit)
	if err != nil {
		log.Printf("[GetMessagesByConversation] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
		return
	}
	c.JSON(http.StatusOK, msgs)
}

/*
=========================

	Create Message
	POST /conversations/:id/messages
	Body: { "content": "...", "file_url": "...", "message_type": "text|image|file|video|signal|call" }
	SenderID taken from auth middleware (ctx key "user_id"); if absent, message can be system (nil).
	=========================
*/
func CreateMessage(c *gin.Context) {
	convID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation id"})
		return
	}

	var body struct {
		Content     *string `json:"content"`
		FileURL     *string `json:"file_url"`
		MessageType string  `json:"message_type" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var senderID *int
	if v, ok := c.Get("user_id"); ok {
		switch x := v.(type) {
		case int:
			senderID = &x
		case int32:
			i := int(x)
			senderID = &i
		case int64:
			i := int(x)
			senderID = &i
		}
	}

	msg, err := models.CreateMessage(convID, senderID, body.Content, body.FileURL, body.MessageType)
	if err != nil {
		log.Printf("[CreateMessage] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create message"})
		return
	}
	c.JSON(http.StatusCreated, msg)
}

/*
=========================

	Mark Message Read
	POST /messages/:id/read
	=========================
*/
func MarkMessageRead(c *gin.Context) {
	msgID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid message id"})
		return
	}
	uidVal, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var uid int
	switch v := uidVal.(type) {
	case int:
		uid = v
	case int32:
		uid = int(v)
	case int64:
		uid = int(v)
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user id in context"})
		return
	}

	if err := models.MarkMessageRead(msgID, uid); err != nil {
		log.Printf("[MarkMessageRead] model err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to mark read"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "read marked"})
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // TODO: tighten for production
	},
}

func HandleWS(c *gin.Context) {
	uidVal, ok := c.Get("user_id") // from AuthMiddleware
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var uid int
	switch v := uidVal.(type) {
	case int:
		uid = v
	case int64:
		uid = int(v)
	case string:
		if i, err := strconv.Atoi(v); err == nil {
			uid = i
		}
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user id"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("[HandleWS] upgrade error: %v", err)
		return
	}

	client := &ws.Client{UserID: uid, Conn: conn}
	ws.DefaultHub.AddClient(uid, client)

	// simple reader loop (you can expand this)
	go func() {
		defer ws.DefaultHub.RemoveClient(uid)
		for {
			var msg map[string]interface{}
			if err := conn.ReadJSON(&msg); err != nil {
				log.Printf("[HandleWS] read error user=%d: %v", uid, err)
				break
			}
			log.Printf("[HandleWS] recv from user=%d: %+v", uid, msg)
			// handle incoming message types if needed
		}
	}()
}
