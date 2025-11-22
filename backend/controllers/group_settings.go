// controllers/group_settings.go
package controllers

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// UpdateGroupName updates the group name (all members can update)
// PUT /groups/:group_id
func UpdateGroupName(c *gin.Context) {
	userID := c.GetInt("user_id")
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	// Verify user is a member of the group (all members can update name)
	isMember, _, _, err := models.IsUserInGroup(groupID, userID)
	if err != nil {
		log.Printf("[UpdateGroupName] Error checking member status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify permissions"})
		return
	}
	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "only group members can update group name"})
		return
	}

	var req struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	name := strings.TrimSpace(req.Name)
	if len(name) < 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "group name must be at least 4 characters"})
		return
	}

	err = models.UpdateGroupName(groupID, name)
	if err != nil {
		log.Printf("[UpdateGroupName] Error updating group name: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update group name"})
		return
	}

	// Fetch updated group to return
	group, err := models.GetGroupByID(groupID)
	if err != nil {
		log.Printf("[UpdateGroupName] Error fetching updated group: %v", err)
		c.JSON(http.StatusOK, gin.H{"message": "group name updated successfully", "name": name})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "group name updated successfully", "group": group})
}

// DeleteGroup deletes a group (admin only)
// DELETE /groups/:group_id
func DeleteGroup(c *gin.Context) {
	userID := c.GetInt("user_id")
	if userID <= 0 {
		log.Printf("[DeleteGroup] Invalid user_id: %d", userID)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		log.Printf("[DeleteGroup] Invalid group_id param: %s", c.Param("group_id"))
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	log.Printf("[DeleteGroup] User %d attempting to delete group %d", userID, groupID)

	// Verify user is admin of the group
	isAdmin, err := models.IsAdmin(groupID, userID)
	if err != nil {
		log.Printf("[DeleteGroup] Error checking admin status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify permissions"})
		return
	}
	if !isAdmin {
		log.Printf("[DeleteGroup] User %d is not admin of group %d", userID, groupID)
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can delete groups"})
		return
	}

	log.Printf("[DeleteGroup] User %d is admin, proceeding with deletion of group %d", userID, groupID)
	err = models.DeleteGroup(groupID)
	if err != nil {
		log.Printf("[DeleteGroup] Error deleting group %d: %v", groupID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete group", "details": err.Error()})
		return
	}

	log.Printf("[DeleteGroup] Successfully deleted group %d", groupID)
	c.JSON(http.StatusOK, gin.H{"message": "group deleted successfully"})
}

