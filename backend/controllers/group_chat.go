package controllers

import (
	"log"
	"net/http"
	"strconv"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// GET /groups/:group_id/conversations
// Returns all conversations for the current user within this group (direct chats with group members + group chat)
func GetGroupConversationsHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	convs, err := models.GetGroupConversations(gid, userID)
	if err != nil {
		log.Printf("[GetGroupConversations] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch group conversations"})
		return
	}

	c.JSON(http.StatusOK, convs)
}

// GET /groups/:group_id/chat
// Returns the group conversation for this group (ensures it exists and user is a member)
func GetGroupChatHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Get group info to use as conversation title
	group, err := models.GetGroupByID(gid)
	if err != nil {
		log.Printf("[GetGroupChat] Failed to get group: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "group not found"})
		return
	}

	// Ensure group conversation exists and user is added to it
	groupNamePtr := &group.Name
	conv, convCreated, memberAdded, err := models.AddUserToGroupConversationOnJoin(gid, userID, groupNamePtr)
	if err != nil {
		log.Printf("[GetGroupChat] Failed to ensure group conversation: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get group chat"})
		return
	}

	if convCreated {
		log.Printf("[GetGroupChat] Created new group conversation for group %d", gid)
	}
	if memberAdded {
		log.Printf("[GetGroupChat] Added user %d to group conversation for group %d", userID, gid)
	}

	c.JSON(http.StatusOK, conv)
}

// GET /groups/:group_id/chat/unread-count
// Returns total unread message count for all group conversations
func GetGroupChatUnreadCountHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	count, err := models.GetGroupChatUnreadCount(gid, userID)
	if err != nil {
		log.Printf("[GetGroupChatUnreadCount] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch unread count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

