package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterBookingChatRoutes(router *gin.Engine) {
	g := router.Group("/booking-chat")
	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// Get all booking conversations for user
		g.GET("/conversations", controllers.ListBookingConversations)

		// Get or create conversation for a specific booking
		g.GET("/bookings/:booking_id", controllers.GetBookingConversation)

		// Get messages for a conversation
		g.GET("/conversations/:conversation_id/messages", controllers.GetBookingMessages)

		// Send a message
		g.POST("/conversations/:conversation_id/messages", controllers.SendBookingMessage)

		// ✅ ADD THIS ONE LINE - Mark messages as read
		g.POST("/conversations/:conversation_id/read", controllers.MarkConversationAsRead)

		// Get unread count
		g.GET("/unread-count", controllers.GetUnreadBookingCount)
	}
}
