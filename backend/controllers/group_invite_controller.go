package controllers

import (
	"net/http"
	"strconv"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// GET /groups/invites  -> invites for logged-in user
func ListMyInvites(c *gin.Context) {
	uid := c.GetInt("user_id")
	inv, err := models.ListPendingInvitesForUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invites"})
		return
	}
	c.JSON(http.StatusOK, inv)
}

// POST /groups/invites/:inviteId/accept
func AcceptInvite(c *gin.Context) {
	uid := c.GetInt("user_id")
	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
	gid, err := models.AcceptInvite(inviteID, uid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"group_id": gid, "status": "accepted"})
}

// POST /groups/invites/:inviteId/decline
func DeclineInvite(c *gin.Context) {
	uid := c.GetInt("user_id")
	_ = uid // we validate ownership in the model
	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
	if err := models.DeclineInvite(inviteID, uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "declined"})
}
func CancelGroupInviteHandler(c *gin.Context) {
	actorID := c.GetInt("user_id")
	inviteID, _ := strconv.Atoi(c.Param("inviteId"))
	if err := models.CancelGroupInvite(inviteID, actorID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
