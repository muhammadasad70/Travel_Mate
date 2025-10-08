// controllers/group_invites_list.go
package controllers

import (
	"net/http"
	"strconv"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// func ListGroupInvitesForGroup(c *gin.Context) {
// 	gid, _ := strconv.Atoi(c.Param("id"))
// 	actorID := c.GetInt("user_id")

// 	// admin gate
// 	ok, err := models.IsAdmin(gid, actorID)
// 	if err != nil || !ok {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
// 		return
// 	}

// 	rows, err := models.GetPendingInvitesForGroup(gid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invites"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, rows)
// }

// GET /groups/:group_id/invites (admin-only, pending only)
// func ListGroupInvitesForGroup(c *gin.Context) {
// 	groupID, ok := mustParamInt(c, "group_id")
// 	if !ok {
// 		return
// 	}
// 	uid := userIDFromCtx(c)

// 	isAdmin, err := models.IsAdmin(groupID, uid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
// 		return
// 	}
// 	if !isAdmin {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
// 		return
// 	}

// 	rows, err := models.GetPendingInvitesForGroup(groupID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list invites"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"invites": rows})
// }

func ListGroupInvitesForGroup(c *gin.Context) {
	// Extract group_id from the URL path (e.g. /groups/:group_id/invites)
	groupParam := c.Param("group_id")
	groupID, err := strconv.Atoi(groupParam)
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	// Extract userID from JWT middleware
	userID := c.GetInt("userID")

	// Check if requester is admin of the group
	isAdmin, err := models.IsAdmin(groupID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can view group invites"})
		return
	}

	// Fetch pending invites for this group
	invites, err := models.GetPendingInvitesForGroup(groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list invites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"group_id": groupID,
		"invites":  invites,
	})
}
