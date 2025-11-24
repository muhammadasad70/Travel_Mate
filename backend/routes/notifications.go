

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
		g.POST("/:id/read", controllers.MarkNotificationRead)      // POST /notifications/123/read (changed from PATCH)
		g.POST("/read-all", controllers.MarkAllNotificationsRead)  // POST /notifications/read-all (changed from PATCH)
		g.PATCH("/:id/read", controllers.MarkNotificationRead)     // Keep PATCH for backwards compatibility
		g.PATCH("/read-all", controllers.MarkAllNotificationsRead) // Keep PATCH for backwards compatibility
		g.DELETE("/:id", controllers.DeleteNotification)           // DELETE /notifications/123
	}
}
