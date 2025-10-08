// package controllers

// import (
// 	"database/sql"
// 	"net/http"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// )

// // GET /groups/invites  -> invites for logged-in user
// func ListMyInvites(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	inv, err := models.ListPendingInvitesForUser(uid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invites"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, inv)
// }

// // POST /groups/invites/:inviteId/accept
// func AcceptInvite(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
// 	gid, err := models.AcceptInvite(inviteID, uid)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"group_id": gid, "status": "accepted"})
// }

// GET /groups/invites  (invitee’s inbox)
// func ListMyInvites(c *gin.Context) {
// 	uid := userIDFromCtx(c)
// 	rows, err := models.GetPendingInvitesForUser(uid) // helper noted below
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invites"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"invites": rows})
// }

// // POST /groups/invites/:inviteId/accept
// func AcceptInvite(c *gin.Context) {
// 	inviteID, ok := mustParamInt(c, "inviteId")
// 	if !ok {
// 		return
// 	}
// 	// Optional: verify this invite actually belongs to the current user
// 	uid := userIDFromCtx(c)
// 	okOwner, err := models.IsInviteForUser(inviteID, uid) // helper noted below
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify invite"})
// 		return
// 	}
// 	if !okOwner {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
// 		return
// 	}

// 	added, err := models.UpdateInviteStatus(inviteID, "accepted")
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to accept invite"})
// 		return
// 	}

// 	// (Optional) wire chat membership here if you want:
// 	// conv, convCreated, memberAdded, _ := models.AddUserToGroupConversationOnJoin(groupID, uid, nil)

// 	c.JSON(http.StatusOK, gin.H{"accepted": true, "member_added": added})
// }

// // // POST /groups/invites/:inviteId/decline
// // func DeclineInvite(c *gin.Context) {
// // 	uid := c.GetInt("user_id")
// // 	_ = uid // we validate ownership in the model
// // 	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
// // 	if err := models.DeclineInvite(inviteID, uid); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, gin.H{"status": "declined"})
// // }

// // POST /groups/invites/:inviteId/decline
// func DeclineInvite(c *gin.Context) {
// 	inviteID, ok := mustParamInt(c, "inviteId")
// 	if !ok {
// 		return
// 	}
// 	uid := userIDFromCtx(c)
// 	okOwner, err := models.IsInviteForUser(inviteID, uid) // helper noted below
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify invite"})
// 		return
// 	}
// 	if !okOwner {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
// 		return
// 	}

// 	_, err = models.UpdateInviteStatus(inviteID, "declined") // this will hard-delete the invite per your latest logic
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to decline invite"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"declined": true})
// }

// // func CancelGroupInviteHandler(c *gin.Context) {
// // 	actorID := c.GetInt("user_id")
// // 	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
// // 	if err := models.CancelGroupInvite(inviteID, actorID); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, gin.H{"ok": true})
// // }

// // POST /groups/invites/:inviteId/cancel (admin-only)
// func CancelGroupInviteHandler(c *gin.Context) {
// 	inviteID, ok := mustParamInt(c, "inviteId")
// 	if !ok {
// 		return
// 	}
// 	uid := userIDFromCtx(c)

// 	// Get group_id for this invite and verify admin
// 	groupID, err := models.GetGroupIDByInvite(inviteID) // helper noted below
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "invite not found"})
// 			return
// 		}
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invite"})
// 		return
// 	}
// 	isAdmin, err := models.IsAdmin(groupID, uid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
// 		return
// 	}
// 	if !isAdmin {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
// 		return
// 	}

// 	_, err = models.UpdateInviteStatus(inviteID, "canceled")
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel invite"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"canceled": true})
// }

package controllers

import (
	"database/sql"
	"net/http"
	"strconv"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// GET /groups/invites (show pending invites for current user)
func ListMyInvites(c *gin.Context) {
	userParam := c.Param("userId")
	userID, err := strconv.Atoi(userParam)
	invites, err := models.GetPendingInvitesForUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invites"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invites": invites})
}

// POST /groups/invites/:inviteId/accept
func AcceptInvite(c *gin.Context) {
	inviteParam := c.Param("inviteId")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}
	userID := c.GetInt("userID")

	// Check ownership
	isOwner, err := models.IsInviteForUser(inviteID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "verification failed"})
		return
	}
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
		return
	}

	added, err := models.UpdateInviteStatus(inviteID, "accepted")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to accept invite"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"invite_id":    inviteID,
		"accepted":     true,
		"member_added": added,
	})
}

// POST /groups/invites/:inviteId/decline
func DeclineInvite(c *gin.Context) {
	inviteParam := c.Param("inviteId")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}
	userID := c.GetInt("userID")

	isOwner, err := models.IsInviteForUser(inviteID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "verification failed"})
		return
	}
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
		return
	}

	_, err = models.UpdateInviteStatus(inviteID, "declined") // auto-deletes on decline
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to decline invite"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"invite_id": inviteID,
		"declined":  true,
	})
}

// POST /groups/invites/:inviteId/cancel (admin-only)
func CancelGroupInviteHandler(c *gin.Context) {
	inviteParam := c.Param("inviteId")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}
	userID := c.GetInt("userID")

	// Get related group ID
	groupID, err := models.GetGroupIDByInvite(inviteID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "invite not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invite"})
		return
	}

	// Ensure user is admin of that group
	isAdmin, err := models.IsAdmin(groupID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
		return
	}

	_, err = models.UpdateInviteStatus(inviteID, "canceled")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel invite"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"invite_id": inviteID,
		"canceled":  true,
	})
}
