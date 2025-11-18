// controllers/notifications.go
package controllers

import (
	"net/http"
	"strconv"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// Get all notifications for the logged-in user
func GetNotifications(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))

	// Optional query params
	limitStr := c.DefaultQuery("limit", "50")
	onlyUnread := c.Query("unread") == "true"

	limit, _ := strconv.Atoi(limitStr)

	notifications, err := models.GetUserNotifications(userID, limit, onlyUnread)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

// Get unread notification count
func GetUnreadCount(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))

	count, err := models.GetUnreadNotificationCount(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

// Mark a notification as read
func MarkNotificationRead(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))
	notificationID, err := strconv.ParseInt(c.Param("id"), 10, 64)

	if err != nil || notificationID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification id"})
		return
	}

	if err := models.MarkNotificationAsRead(userID, notificationID); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "notification not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}

	c.Status(http.StatusNoContent)
}

// Mark all notifications as read
func MarkAllNotificationsRead(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))

	if err := models.MarkAllNotificationsAsRead(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}

	c.Status(http.StatusNoContent)
}

// Delete a notification
func DeleteNotification(c *gin.Context) {
	userID := int64(c.GetInt("user_id"))
	notificationID, err := strconv.ParseInt(c.Param("id"), 10, 64)

	if err != nil || notificationID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification id"})
		return
	}

	if err := models.DeleteNotification(userID, notificationID); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "notification not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}

	c.Status(http.StatusNoContent)
}
