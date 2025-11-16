// routes/notifications.go
package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterNotificationRoutes(r *gin.Engine) {
	g := r.Group("/notifications")
	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		g.GET("", controllers.GetNotifications)                    // GET /notifications?limit=50&unread=true
		g.GET("/unread-count", controllers.GetUnreadCount)         // GET /notifications/unread-count
		g.PATCH("/:id/read", controllers.MarkNotificationRead)     // PATCH /notifications/123/read
		g.PATCH("/read-all", controllers.MarkAllNotificationsRead) // PATCH /notifications/read-all
		g.DELETE("/:id", controllers.DeleteNotification)           // DELETE /notifications/123
	}
}
