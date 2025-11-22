// controllers/notifications_group.go
package controllers

import (
	"log"
	"net/http"
	"strconv"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// Get notifications for a specific group
func GetGroupNotifications(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		log.Printf("[GetGroupNotifications] Invalid group_id: %v", c.Param("group_id"))
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	log.Printf("[GetGroupNotifications] Fetching notifications for group %d, user %d", groupID, userID)

	limitStr := c.DefaultQuery("limit", "100")
	onlyUnread := c.Query("unread") == "true"
	limit, _ := strconv.Atoi(limitStr)

	notifications, err := models.GetGroupNotifications(userID, groupID, limit, onlyUnread)
	if err != nil {
		log.Printf("[GetGroupNotifications] Error fetching notifications: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch notifications"})
		return
	}

	log.Printf("[GetGroupNotifications] Found %d notifications for group %d", len(notifications), groupID)
	c.JSON(http.StatusOK, notifications)
}

// Get unread notification count for a specific group
func GetGroupUnreadCount(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	count, err := models.GetUnreadGroupNotificationCount(userID, groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

