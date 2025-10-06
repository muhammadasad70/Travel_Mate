// controllers/group_invites_extras.go
package controllers

import (
	"net/http"
	"strconv"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// controllers/group_invites_extras.go
func CreateGroupInvite(c *gin.Context) {
	inviterID := c.GetInt("user_id")
	gid, _ := strconv.Atoi(c.Param("group_id")) // <-- changed
	var in struct {
		InviteeID int `json:"inviteeId"`
	}
	if err := c.ShouldBindJSON(&in); err != nil || in.InviteeID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid inviteeId"})
		return
	}
	ok, err := models.IsAdmin(gid, inviterID)
	if err != nil || !ok {
		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
		return
	}
	if err := models.CreateGroupInvite(gid, inviterID, in.InviteeID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
