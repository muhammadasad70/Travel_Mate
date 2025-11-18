// // package controllers

// // import (
// // 	"log"
// // 	"net/http"
// // 	"strconv"
// // 	"strings"

// // 	"travel_mate/backend/database"
// // 	"travel_mate/backend/models"

// // 	"github.com/gin-gonic/gin"
// // )

// // // GetBookingConversation gets or creates a conversation for a booking
// // func GetBookingConversation(c *gin.Context) {
// // 	userID := c.GetInt("user_id")
// // 	bookingIDStr := c.Param("booking_id")
// // 	bookingID, err := strconv.Atoi(bookingIDStr)

// // 	if err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking_id"})
// // 		return
// // 	}

// // 	// Verify user has access to this booking
// // 	var travelerId, vendorId int
// // 	err = database.DB.QueryRow(`
// // 		SELECT traveler_id, vendor_id
// // 		FROM cultural_service_bookings
// // 		WHERE id = $1
// // 	`, bookingID).Scan(&travelerId, &vendorId)

// // 	if err != nil {
// // 		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
// // 		return
// // 	}

// // 	if userID != travelerId && userID != vendorId {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// // 		return
// // 	}

// // 	// Get or create conversation
// // 	conv, err := models.GetOrCreateBookingConversation(bookingID)
// // 	if err != nil {
// // 		log.Printf("Error creating booking conversation: %v", err)
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create conversation"})
// // 		return
// // 	}

// // 	c.JSON(http.StatusOK, conv)
// // }

// // // GetBookingMessages retrieves messages for a booking conversation
// // func GetBookingMessages(c *gin.Context) {
// // 	userID := c.GetInt("user_id")
// // 	conversationIDStr := c.Param("conversation_id")
// // 	conversationID, err := strconv.Atoi(conversationIDStr)

// // 	if err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
// // 		return
// // 	}

// // 	// Verify user has access
// // 	var travelerId, vendorId int
// // 	err = database.DB.QueryRow(`
// // 		SELECT traveler_id, vendor_id
// // 		FROM booking_conversations
// // 		WHERE id = $1
// // 	`, conversationID).Scan(&travelerId, &vendorId)

// // 	if err != nil {
// // 		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
// // 		return
// // 	}

// // 	if userID != travelerId && userID != vendorId {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// // 		return
// // 	}

// // 	limit := 100
// // 	if limitStr := c.Query("limit"); limitStr != "" {
// // 		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
// // 			limit = l
// // 		}
// // 	}

// // 	messages, err := models.GetBookingMessages(conversationID, limit)
// // 	if err != nil {
// // 		log.Printf("Error fetching messages: %v", err)
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
// // 		return
// // 	}

// // 	// Mark messages as read
// // 	_ = models.MarkBookingMessagesAsRead(conversationID, userID)

// // 	c.JSON(http.StatusOK, messages)
// // }

// // // SendBookingMessage sends a message in a booking conversation
// // func SendBookingMessage(c *gin.Context) {
// // 	userID := c.GetInt("user_id")
// // 	conversationIDStr := c.Param("conversation_id")
// // 	conversationID, err := strconv.Atoi(conversationIDStr)

// // 	if err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
// // 		return
// // 	}

// // 	var payload struct {
// // 		Message     string  `json:"message" binding:"required"`
// // 		MessageType string  `json:"message_type"`
// // 		FileURL     *string `json:"file_url"`
// // 	}

// // 	if err := c.ShouldBindJSON(&payload); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// // 		return
// // 	}

// // 	if strings.TrimSpace(payload.Message) == "" {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "message cannot be empty"})
// // 		return
// // 	}

// // 	// Verify user has access
// // 	var travelerId, vendorId int
// // 	err = database.DB.QueryRow(`
// // 		SELECT traveler_id, vendor_id
// // 		FROM booking_conversations
// // 		WHERE id = $1
// // 	`, conversationID).Scan(&travelerId, &vendorId)

// // 	if err != nil {
// // 		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
// // 		return
// // 	}

// // 	if userID != travelerId && userID != vendorId {
// // 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// // 		return
// // 	}

// // 	// Default message type
// // 	if payload.MessageType == "" {
// // 		payload.MessageType = "text"
// // 	}

// // 	// Create message
// // 	message, err := models.CreateBookingMessage(
// // 		conversationID,
// // 		userID,
// // 		payload.Message,
// // 		payload.MessageType,
// // 		payload.FileURL,
// // 	)

// // 	if err != nil {
// // 		log.Printf("Error creating message: %v", err)
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send message"})
// // 		return
// // 	}

// // 	c.JSON(http.StatusCreated, message)
// // }

// // // ListBookingConversations gets all booking conversations for current user
// // func ListBookingConversations(c *gin.Context) {
// // 	userID := c.GetInt("user_id")

// // 	conversations, err := models.GetUserBookingConversations(userID)
// // 	if err != nil {
// // 		log.Printf("Error fetching conversations: %v", err)
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
// // 		return
// // 	}

// // 	c.JSON(http.StatusOK, conversations)
// // }

// // // GetUnreadBookingCount gets unread message count for booking chats
// // func GetUnreadBookingCount(c *gin.Context) {
// // 	userID := c.GetInt("user_id")

// // 	count, err := models.GetUnreadBookingMessageCount(userID)
// // 	if err != nil {
// // 		log.Printf("Error fetching unread count: %v", err)
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch count"})
// // 		return
// // 	}

// // 	c.JSON(http.StatusOK, gin.H{"unread_count": count})
// // }

// package controllers

// import (
// 	"log"
// 	"net/http"
// 	"strconv"
// 	"strings"

// 	"travel_mate/backend/database"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// )

// // GetBookingConversation gets or creates a conversation for a booking
// func GetBookingConversation(c *gin.Context) {
// 	userID := c.GetInt("user_id")
// 	bookingIDStr := c.Param("booking_id")
// 	bookingID, err := strconv.Atoi(bookingIDStr)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking_id"})
// 		return
// 	}

// 	// Verify user has access to this booking
// 	var travelerId, vendorId int
// 	err = database.DB.QueryRow(`
// 		SELECT traveler_id, vendor_id
// 		FROM cultural_service_bookings
// 		WHERE id = $1
// 	`, bookingID).Scan(&travelerId, &vendorId)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
// 		return
// 	}

// 	if userID != travelerId && userID != vendorId {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// 		return
// 	}

// 	// Get or create conversation
// 	conv, err := models.GetOrCreateBookingConversation(bookingID)
// 	if err != nil {
// 		log.Printf("Error creating booking conversation: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create conversation"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, conv)
// }

// // GetBookingMessages retrieves messages for a booking conversation
// func GetBookingMessages(c *gin.Context) {
// 	userID := c.GetInt("user_id")
// 	conversationIDStr := c.Param("conversation_id")
// 	conversationID, err := strconv.Atoi(conversationIDStr)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
// 		return
// 	}

// 	// Verify user has access
// 	var travelerId, vendorId int
// 	err = database.DB.QueryRow(`
// 		SELECT traveler_id, vendor_id
// 		FROM booking_conversations
// 		WHERE id = $1
// 	`, conversationID).Scan(&travelerId, &vendorId)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
// 		return
// 	}

// 	if userID != travelerId && userID != vendorId {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// 		return
// 	}

// 	limit := 100
// 	if limitStr := c.Query("limit"); limitStr != "" {
// 		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
// 			limit = l
// 		}
// 	}

// 	// ✅ Get messages with sender information
// 	messages, err := models.GetBookingMessagesWithSender(conversationID, limit)
// 	if err != nil {
// 		log.Printf("Error fetching messages: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
// 		return
// 	}

// 	// Mark messages as read
// 	_ = models.MarkBookingMessagesAsRead(conversationID, userID)

// 	c.JSON(http.StatusOK, messages)
// }

// // SendBookingMessage sends a message in a booking conversation
// func SendBookingMessage(c *gin.Context) {
// 	userID := c.GetInt("user_id")
// 	conversationIDStr := c.Param("conversation_id")
// 	conversationID, err := strconv.Atoi(conversationIDStr)

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
// 		return
// 	}

// 	var payload struct {
// 		Message     string  `json:"message" binding:"required"`
// 		MessageType string  `json:"message_type"`
// 		FileURL     *string `json:"file_url"`
// 	}

// 	if err := c.ShouldBindJSON(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if strings.TrimSpace(payload.Message) == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "message cannot be empty"})
// 		return
// 	}

// 	// Verify user has access
// 	var travelerId, vendorId int
// 	err = database.DB.QueryRow(`
// 		SELECT traveler_id, vendor_id
// 		FROM booking_conversations
// 		WHERE id = $1
// 	`, conversationID).Scan(&travelerId, &vendorId)

// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
// 		return
// 	}

// 	if userID != travelerId && userID != vendorId {
// 		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
// 		return
// 	}

// 	// Default message type
// 	if payload.MessageType == "" {
// 		payload.MessageType = "text"
// 	}

// 	// Create message
// 	message, err := models.CreateBookingMessage(
// 		conversationID,
// 		userID,
// 		payload.Message,
// 		payload.MessageType,
// 		payload.FileURL,
// 	)

// 	if err != nil {
// 		log.Printf("Error creating message: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send message"})
// 		return
// 	}

// 	// ✅ Get sender name for the response
// 	var senderName string
// 	err = database.DB.QueryRow(`
// 		SELECT name FROM users WHERE id = $1
// 	`, userID).Scan(&senderName)

// 	if err != nil {
// 		senderName = "Unknown"
// 	}

// 	// ✅ Add sender_name to response
// 	response := map[string]interface{}{
// 		"id":              message.ID,
// 		"conversation_id": message.ConversationID,
// 		"sender_id":       message.SenderID,
// 		"sender_name":     senderName,
// 		"message":         message.Message,
// 		"message_type":    message.MessageType,
// 		"file_url":        message.FileURL,
// 		"is_read":         message.IsRead,
// 		"created_at":      message.CreatedAt,
// 		"updated_at":      message.UpdatedAt,
// 	}

// 	c.JSON(http.StatusCreated, response)
// }

// // ListBookingConversations gets all booking conversations for current user
// func ListBookingConversations(c *gin.Context) {
// 	userID := c.GetInt("user_id")

// 	conversations, err := models.GetUserBookingConversations(userID)
// 	if err != nil {
// 		log.Printf("Error fetching conversations: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, conversations)
// }

// // GetUnreadBookingCount gets unread message count for booking chats
// func GetUnreadBookingCount(c *gin.Context) {
// 	userID := c.GetInt("user_id")

// 	count, err := models.GetUnreadBookingMessageCount(userID)
// 	if err != nil {
// 		log.Printf("Error fetching unread count: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch count"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"unread_count": count})
// }

package controllers

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// GetBookingConversation gets or creates a conversation for a booking
func GetBookingConversation(c *gin.Context) {
	userID := c.GetInt("user_id")
	bookingIDStr := c.Param("booking_id")
	bookingID, err := strconv.Atoi(bookingIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking_id"})
		return
	}

	// Verify user has access to this booking
	var travelerId, vendorId int
	err = database.DB.QueryRow(`
		SELECT traveler_id, vendor_id
		FROM cultural_service_bookings
		WHERE id = $1
	`, bookingID).Scan(&travelerId, &vendorId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	if userID != travelerId && userID != vendorId {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	// Get or create conversation
	conv, err := models.GetOrCreateBookingConversation(bookingID)
	if err != nil {
		log.Printf("Error creating booking conversation: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create conversation"})
		return
	}

	c.JSON(http.StatusOK, conv)
}

// GetBookingMessages retrieves messages for a booking conversation
func GetBookingMessages(c *gin.Context) {
	userID := c.GetInt("user_id")
	conversationIDStr := c.Param("conversation_id")
	conversationID, err := strconv.Atoi(conversationIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
		return
	}

	// Verify user has access
	var travelerId, vendorId int
	err = database.DB.QueryRow(`
		SELECT traveler_id, vendor_id
		FROM booking_conversations
		WHERE id = $1
	`, conversationID).Scan(&travelerId, &vendorId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
		return
	}

	if userID != travelerId && userID != vendorId {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	limit := 100
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	// Get messages with sender information
	messages, err := models.GetBookingMessagesWithSender(conversationID, limit)
	if err != nil {
		log.Printf("Error fetching messages: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
		return
	}

	// Mark messages as read
	_ = models.MarkBookingMessagesAsRead(conversationID, userID)

	c.JSON(http.StatusOK, messages)
}

// SendBookingMessage sends a message in a booking conversation
func SendBookingMessage(c *gin.Context) {
	userID := c.GetInt("user_id")
	conversationIDStr := c.Param("conversation_id")
	conversationID, err := strconv.Atoi(conversationIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
		return
	}

	var payload struct {
		Message     string  `json:"message" binding:"required"`
		MessageType string  `json:"message_type"`
		FileURL     *string `json:"file_url"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if strings.TrimSpace(payload.Message) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "message cannot be empty"})
		return
	}

	// Verify user has access
	var travelerId, vendorId int
	err = database.DB.QueryRow(`
		SELECT traveler_id, vendor_id
		FROM booking_conversations
		WHERE id = $1
	`, conversationID).Scan(&travelerId, &vendorId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
		return
	}

	if userID != travelerId && userID != vendorId {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	// Default message type
	if payload.MessageType == "" {
		payload.MessageType = "text"
	}

	// Create message
	message, err := models.CreateBookingMessage(
		conversationID,
		userID,
		payload.Message,
		payload.MessageType,
		payload.FileURL,
	)

	if err != nil {
		log.Printf("Error creating message: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send message"})
		return
	}

	// Get sender name for the response
	var senderName string
	err = database.DB.QueryRow(`
		SELECT COALESCE(name, email) FROM users WHERE id = $1
	`, userID).Scan(&senderName)

	if err != nil {
		senderName = "Unknown"
	}

	// Add sender_name to response
	response := map[string]interface{}{
		"id":              message.ID,
		"conversation_id": message.ConversationID,
		"sender_id":       message.SenderID,
		"sender_name":     senderName,
		"message":         message.Message,
		"message_type":    message.MessageType,
		"file_url":        message.FileURL,
		"is_read":         message.IsRead,
		"created_at":      message.CreatedAt,
	}

	c.JSON(http.StatusCreated, response)
}

// ListBookingConversations gets all booking conversations for current user
func ListBookingConversations(c *gin.Context) {
	userID := c.GetInt("user_id")

	conversations, err := models.GetUserBookingConversations(userID)
	if err != nil {
		log.Printf("Error fetching conversations: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
		return
	}

	c.JSON(http.StatusOK, conversations)
}

// GetUnreadBookingCount gets unread message count for booking chats
func GetUnreadBookingCount(c *gin.Context) {
	userID := c.GetInt("user_id")

	count, err := models.GetUnreadBookingMessageCount(userID)
	if err != nil {
		log.Printf("Error fetching unread count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_count": count})
}

// Add this function to booking_chat_controller.go
func MarkConversationAsRead(c *gin.Context) {
	userID := c.GetInt("user_id")
	conversationIDStr := c.Param("conversation_id")
	conversationID, err := strconv.Atoi(conversationIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid conversation_id"})
		return
	}

	// Verify user has access
	var travelerId, vendorId int
	err = database.DB.QueryRow(`
		SELECT traveler_id, vendor_id
		FROM booking_conversations
		WHERE id = $1
	`, conversationID).Scan(&travelerId, &vendorId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "conversation not found"})
		return
	}

	if userID != travelerId && userID != vendorId {
		c.JSON(http.StatusForbidden, gin.H{"error": "access denied"})
		return
	}

	// Mark messages as read
	err = models.MarkBookingMessagesAsRead(conversationID, userID)
	if err != nil {
		log.Printf("Error marking messages as read: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to mark as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
