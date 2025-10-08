// // controllers/group_invites_extras.go
// package controllers

// import (
// 	"database/sql"
// 	"errors"
// 	"log"
// 	"net/http"
// 	"strconv"
// 	"strings"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// )

// // controllers/group_invites_extras.go
// // func CreateGroupInvite(c *gin.Context) {
// // 	inviterID := c.GetInt("user_id")
// // 	gid, _ := strconv.Atoi(c.Param("group_id")) // <-- changed
// // 	var in struct {
// // 		InviteeID int `json:"inviteeId"`
// // 	}
// // 	if err := c.ShouldBindJSON(&in); err != nil || in.InviteeID <= 0 {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid inviteeId"})
// // 		return
// // 	}
// // 	ok, err := models.IsAdmin(gid, inviterID)
// // 	if err != nil || !ok {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
// // 		return
// // 	}
// // 	if err := models.CreateGroupInvite(gid, inviterID, in.InviteeID); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, gin.H{"ok": true})
// // }

// // POST /groups/:group_id/invites (admin-only)
// // Body: {"invitee_id": 123} OR {"invitee_email": "someone@example.com"}
// // func CreateGroupInvite(c *gin.Context) {
// // 	groupID, ok := mustParamInt(c, "group_id")
// // 	if !ok {
// // 		return
// // 	}
// // 	uid := userIDFromCtx(c)
// // 	isAdmin, err := models.IsAdmin(groupID, uid)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
// // 		return
// // 	}
// // 	if !isAdmin {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
// // 		return
// // 	}

// // 	var body struct {
// // 		InviteeID    *int    `json:"invitee_id"`
// // 		InviteeEmail *string `json:"invitee_email"`
// // 	}
// // 	if err := c.ShouldBindJSON(&body); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// // 		return
// // 	}

// // 	inviteID, err := models.InviteUserToGroup(groupID, body.InviteeID, body.InviteeEmail)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, gin.H{"invite_id": inviteID, "status": "pending"})
// // }

// // func CreateGroupInvite(c *gin.Context) {
// // 	// Extract group_id from the route: /groups/:group_id/invites
// // 	groupParam := c.Param("group_id")
// // 	groupID, err := strconv.Atoi(groupParam)
// // 	if err != nil || groupID <= 0 {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
// // 		return
// // 	}

// // 	// Extract userID (from JWT middleware)
// // 	userQ := c.Query("userID")
// // 	userID, err := strconv.Atoi(userQ)
// // 	if err != nil || userID <= 0 {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
// // 		return
// // 	}

// // 	// Verify admin rights
// // 	isAdmin, err := models.IsAdmin(groupID, userID)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
// // 		return
// // 	}
// // 	if !isAdmin {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can invite members"})
// // 		return
// // 	}

// // 	// Extract invite details from URL query params instead of JSON body
// // 	// Example: POST /groups/5/invites?invitee_id=8  OR  /groups/5/invites?invitee_email=test@example.com
// // 	inviteeIDStr := c.Query("invitee_id")
// // 	inviteeEmail := c.Query("invitee_email")

// // 	var inviteeID *int
// // 	var inviteeEmailPtr *string

// // 	if inviteeIDStr != "" {
// // 		if id, err := strconv.Atoi(inviteeIDStr); err == nil && id > 0 {
// // 			inviteeID = &id
// // 		} else {
// // 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invitee_id"})
// // 			return
// // 		}
// // 	}
// // 	if inviteeEmail != "" {
// // 		inviteeEmailPtr = &inviteeEmail
// // 	}

// // 	if inviteeID == nil && inviteeEmailPtr == nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "either invitee_id or invitee_email is required"})
// // 		return
// // 	}

// // 	// Create invite
// // 	inviteID, err := models.InviteUserToGroup(groupID, inviteeID, inviteeEmailPtr)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
// // 		return
// // 	}

// // 	c.JSON(http.StatusOK, gin.H{
// // 		"group_id":   groupID,
// // 		"invite_id":  inviteID,
// // 		"status":     "pending",
// // 		"created_by": userID,
// // 	})
// // }

// // imports you likely already have:
// // import (
// //     "database/sql"
// //     "errors"
// //     "log"
// //     "net/http"
// //     "strconv"
// //
// //     "github.com/gin-gonic/gin"
// //     "travel_mate/backend/models" // adjust to your module path
// // )

// func CreateGroupInvite(c *gin.Context) {
// 	/* ---------- route param: group_id ---------- */
// 	groupParam := c.Param("group_id")
// 	groupID, err := strconv.Atoi(groupParam)
// 	if err != nil || groupID <= 0 {
// 		log.Printf("[CreateGroupInvite] bad group_id=%q err=%v", groupParam, err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
// 		return
// 	}

// 	/* ---------- inviter from auth middleware ---------- */
// 	var inviterID int
// 	if v, ok := c.Get("userId"); ok {
// 		switch x := v.(type) {
// 		case int:
// 			inviterID = x
// 		case int64:
// 			inviterID = int(x)
// 		case float64: // some JWT libs put numbers as float64
// 			inviterID = int(x)
// 		default:
// 			log.Printf("[CreateGroupInvite] unexpected userId type=%T value=%v", v, v)
// 		}a
// 	}
// 	if inviterID <= 0 {
// 		log.Printf("[CreateGroupInvite] missing/invalid inviterID in context (JWT)")
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
// 		return
// 	}

// 	/* ---------- permission check: must be admin ---------- */
// 	isAdmin, err := models.IsAdmin(groupID, inviterID)
// 	if err != nil {
// 		log.Printf("[CreateGroupInvite] IsAdmin(group=%d, user=%d) err=%v", groupID, inviterID, err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
// 		return
// 	}
// 	if !isAdmin {
// 		log.Printf("[CreateGroupInvite] user %d not admin of group %d", inviterID, groupID)
// 		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can invite members"})
// 		return
// 	}

// 	/* ---------- invitee from query (support id OR email) ---------- */
// 	inviteeIDStr := c.Query("invitee_id")
// 	inviteeEmail := c.Query("invitee_email")

// 	// prefer id if present
// 	if inviteeIDStr != "" {
// 		inviteeID, err := strconv.Atoi(inviteeIDStr)
// 		if err != nil || inviteeID <= 0 {
// 			log.Printf("[CreateGroupInvite] invalid invitee_id=%q", inviteeIDStr)
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invitee_id"})
// 			return
// 		}

// 		// === Path: invite by numeric user id ===
// 		log.Printf("[CreateGroupInvite] invite by id -> group=%d inviter=%d invitee=%d", groupID, inviterID, inviteeID)
// 		if err := models.CreateGroupInvite(groupID, inviterID, inviteeID); err != nil {
// 			// Map common logical errors to 409, others as 500
// 			if errors.Is(err, sql.ErrNoRows) ||
// 				strings.Contains(err.Error(), "already a member") ||
// 				strings.Contains(err.Error(), "duplicate key") ||
// 				strings.Contains(err.Error(), "already exists") {
// 				log.Printf("[CreateGroupInvite] conflict: %v", err)
// 				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
// 				return
// 			}
// 			log.Printf("[CreateGroupInvite] db error: %v", err)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
// 			return
// 		}

// 		c.JSON(http.StatusCreated, gin.H{
// 			"group_id":   groupID,
// 			"invitee_id": inviteeID,
// 			"status":     "pending",
// 			"created_by": inviterID,
// 		})
// 		return
// 	}

// 	// fallback: invite by email (optional flow if you support it)
// 	if inviteeEmail != "" {
// 		log.Printf("[CreateGroupInvite] invite by email -> group=%d inviter=%d invitee_email=%s",
// 			groupID, inviterID, inviteeEmail)

// 		// If you have a dedicated method, call it here:
// 		// inviteID, err := models.CreateGroupInviteByEmail(groupID, inviterID, inviteeEmail)
// 		// if err != nil { ... map 409/500 like above ... }

// 		// For now, if unsupported:
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invite by email not supported yet"})
// 		return
// 	}

// 	log.Printf("[CreateGroupInvite] missing invitee_id or invitee_email")
// 	c.JSON(http.StatusBadRequest, gin.H{"error": "either invitee_id or invitee_email is required"})
// }

package controllers

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/models" // adjust to your module path

	"github.com/gin-gonic/gin"
)

type createInviteBody struct {
	InviterID    int     `json:"inviter_id"`              // REQUIRED in body
	InviteeID    *int    `json:"invitee_id,omitempty"`    // one of id/email required
	InviteeEmail *string `json:"invitee_email,omitempty"` // optional alternate
}

func CreateGroupInvite(c *gin.Context) {
	/* ---------- route param: group_id ---------- */
	groupParam := c.Param("group_id")
	groupID, err := strconv.Atoi(groupParam)
	if err != nil || groupID <= 0 {
		log.Printf("[CreateGroupInvite] bad group_id=%q err=%v", groupParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	/* ---------- body: inviter_id + invitee(_id|_email) ---------- */
	var body createInviteBody
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[CreateGroupInvite] bind json error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON body"})
		return
	}
	inviterID := body.InviterID
	if inviterID <= 0 {
		log.Printf("[CreateGroupInvite] invalid inviter_id: %v", inviterID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "inviter_id is required and must be > 0"})
		return
	}

	// Accept invitee_id from query as a fallback if not in body (optional)
	if body.InviteeID == nil {
		if q := c.Query("invitee_id"); q != "" {
			if id, err := strconv.Atoi(q); err == nil && id > 0 {
				body.InviteeID = &id
			}
		}
	}

	// Validate invitee presence
	if body.InviteeID == nil && body.InviteeEmail == nil {
		log.Printf("[CreateGroupInvite] missing invitee")
		c.JSON(http.StatusBadRequest, gin.H{"error": "either invitee_id or invitee_email is required"})
		return
	}

	/* ---------- permission check: must be admin ---------- */
	isAdmin, err := models.IsAdmin(groupID, inviterID)
	if err != nil {
		log.Printf("[CreateGroupInvite] IsAdmin(group=%d, user=%d) err=%v", groupID, inviterID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
		return
	}
	if !isAdmin {
		log.Printf("[CreateGroupInvite] user %d not admin of group %d", inviterID, groupID)
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can invite members"})
		return
	}

	/* ---------- invite by ID (preferred) ---------- */
	if body.InviteeID != nil {
		inviteeID := *body.InviteeID
		log.Printf("[CreateGroupInvite] invite by id -> group=%d inviter=%d invitee=%d", groupID, inviterID, inviteeID)

		if err := models.CreateGroupInvite(groupID, inviterID, inviteeID); err != nil {
			// Map likely logical conflicts to 409
			if errors.Is(err, sql.ErrNoRows) ||
				strings.Contains(err.Error(), "already a member") ||
				strings.Contains(err.Error(), "duplicate key") ||
				strings.Contains(err.Error(), "already exists") {
				log.Printf("[CreateGroupInvite] conflict: %v", err)
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
				return
			}
			log.Printf("[CreateGroupInvite] db error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"group_id":   groupID,
			"invitee_id": inviteeID,
			"status":     "pending",
			"created_by": inviterID,
		})
		return
	}

	/* ---------- invite by email (if you support it) ---------- */
	if body.InviteeEmail != nil {
		inviteeEmail := strings.TrimSpace(*body.InviteeEmail)
		if inviteeEmail == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invitee_email cannot be empty"})
			return
		}
		log.Printf("[CreateGroupInvite] invite by email -> group=%d inviter=%d email=%s", groupID, inviterID, inviteeEmail)

		// If you have a function like this, call it; otherwise return 400 for now.
		// inviteID, err := models.CreateGroupInviteByEmail(groupID, inviterID, inviteeEmail)
		// if err != nil {
		// 	if strings.Contains(err.Error(), "already") || strings.Contains(err.Error(), "exists") {
		// 		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		// 		return
		// 	}
		// 	log.Printf("[CreateGroupInvite] db error (email): %v", err)
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
		// 	return
		// }
		// c.JSON(http.StatusCreated, gin.H{
		// 	"group_id":    groupID,
		// 		"invite_id":   inviteID,
		// 	"invitee_email": inviteeEmail,
		// 	"status":      "pending",
		// 	"created_by":  inviterID,
		// })
		// return

		c.JSON(http.StatusBadRequest, gin.H{"error": "invite by email not supported yet"})
		return
	}
}
