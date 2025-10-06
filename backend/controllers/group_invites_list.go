// controllers/group_invites_list.go
package controllers

import (
	"net/http"
	"strconv"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func ListGroupInvitesForGroup(c *gin.Context) {
	gid, _ := strconv.Atoi(c.Param("id"))
	actorID := c.GetInt("user_id")

	// admin gate
	ok, err := models.IsAdmin(gid, actorID)
	if err != nil || !ok {
		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
		return
	}

	rows, err := models.GetPendingInvitesForGroup(gid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invites"})
		return
	}
	c.JSON(http.StatusOK, rows)
}
