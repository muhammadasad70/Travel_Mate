package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterChatRoutes(router *gin.Engine) {
	// WebSocket endpoint (kept public since handler reads ?user_id=)
	// If you later bind auth, adapt the handler to read user id from context.
	router.GET("/ws", controllers.HandleWS)

	chat := router.Group("/")
	chat.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// Follow → ensure/create direct conversation & membership
		chat.POST("/follows/ensure-direct", controllers.EnsureDirectOnFollow)

		// Group → ensure/create group chat & add member (on accepted invite)
		chat.POST("/groups/:group_id/chat/add", controllers.AddUserToGroupChat)

		// List conversations for a user
		chat.GET("/users/:id/conversations", controllers.GetConversationsForUser)

		// Messages for a conversation
		chat.GET("/conversations/:id/messages", controllers.GetMessagesByConversation)
		chat.POST("/conversations/:id/messages", controllers.CreateMessage)

		// Mark message read
		chat.POST("/messages/:id/read", controllers.MarkMessageRead)
	}
}
