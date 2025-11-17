package models

import (
	"database/sql"
	"time"
	"travel_mate/backend/database"
)

// BookingConversation represents a chat between traveler and vendor for a specific booking
type BookingConversation struct {
	ID            int       `json:"id"`
	BookingID     int       `json:"booking_id"`
	TravelerID    int       `json:"traveler_id"`
	VendorID      int       `json:"vendor_id"`
	ServiceID     int       `json:"service_id"`
	LastMessageAt time.Time `json:"last_message_at"`
	CreatedAt     time.Time `json:"created_at"`
}

// BookingMessage represents a message in a booking conversation
type BookingMessage struct {
	ID             int       `json:"id"`
	ConversationID int       `json:"conversation_id"`
	SenderID       int       `json:"sender_id"`
	Message        string    `json:"message"`
	MessageType    string    `json:"message_type"`
	FileURL        *string   `json:"file_url,omitempty"`
	IsRead         bool      `json:"is_read"`
	CreatedAt      time.Time `json:"created_at"`
}

// BookingConversationDetail includes additional info for display
type BookingConversationDetail struct {
	ID            int       `json:"id"`
	BookingID     int       `json:"booking_id"`
	TravelerID    int       `json:"traveler_id"`
	VendorID      int       `json:"vendor_id"`
	ServiceID     int       `json:"service_id"`
	ServiceTitle  string    `json:"service_title"`
	TravelerName  string    `json:"traveler_name"`
	VendorName    string    `json:"vendor_name"`
	LastMessage   string    `json:"last_message"`
	LastMessageAt time.Time `json:"last_message_at"`
	UnreadCount   int       `json:"unread_count"`
	BookingStatus string    `json:"booking_status"`
	CreatedAt     time.Time `json:"created_at"`
}

// GetOrCreateBookingConversation creates a conversation for a booking if it doesn't exist
func GetOrCreateBookingConversation(bookingID int) (*BookingConversation, error) {
	db := database.DB
	var conv BookingConversation

	// Try to find existing conversation
	err := db.QueryRow(`
		SELECT id, booking_id, traveler_id, vendor_id, service_id, last_message_at, created_at
		FROM booking_conversations
		WHERE booking_id = $1
	`, bookingID).Scan(
		&conv.ID, &conv.BookingID, &conv.TravelerID, &conv.VendorID,
		&conv.ServiceID, &conv.LastMessageAt, &conv.CreatedAt,
	)

	if err == nil {
		return &conv, nil // Found existing
	}

	if err != sql.ErrNoRows {
		return nil, err
	}

	// Get booking details to create conversation
	var travelerId, vendorId, serviceId int
	err = db.QueryRow(`
		SELECT traveler_id, vendor_id, service_id
		FROM cultural_service_bookings
		WHERE id = $1
	`, bookingID).Scan(&travelerId, &vendorId, &serviceId)

	if err != nil {
		return nil, err
	}

	// Create new conversation
	err = db.QueryRow(`
		INSERT INTO booking_conversations (booking_id, traveler_id, vendor_id, service_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, booking_id, traveler_id, vendor_id, service_id, last_message_at, created_at
	`, bookingID, travelerId, vendorId, serviceId).Scan(
		&conv.ID, &conv.BookingID, &conv.TravelerID, &conv.VendorID,
		&conv.ServiceID, &conv.LastMessageAt, &conv.CreatedAt,
	)

	return &conv, err
}

// CreateBookingMessage creates a new message in a booking conversation
func CreateBookingMessage(conversationID, senderID int, message, messageType string, fileURL *string) (*BookingMessage, error) {
	db := database.DB

	var msg BookingMessage
	err := db.QueryRow(`
		INSERT INTO booking_messages (conversation_id, sender_id, message, message_type, file_url)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, conversation_id, sender_id, message, message_type, file_url, is_read, created_at
	`, conversationID, senderID, message, messageType, fileURL).Scan(
		&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.Message,
		&msg.MessageType, &msg.FileURL, &msg.IsRead, &msg.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	// Update last_message_at
	_, _ = db.Exec(`
		UPDATE booking_conversations 
		SET last_message_at = CURRENT_TIMESTAMP 
		WHERE id = $1
	`, conversationID)

	return &msg, nil
}

// GetBookingMessages retrieves all messages for a conversation
func GetBookingMessages(conversationID int, limit int) ([]BookingMessage, error) {
	db := database.DB

	if limit <= 0 || limit > 500 {
		limit = 100
	}

	rows, err := db.Query(`
		SELECT id, conversation_id, sender_id, message, message_type, file_url, is_read, created_at
		FROM booking_messages
		WHERE conversation_id = $1
		ORDER BY created_at ASC
		LIMIT $2
	`, conversationID, limit)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []BookingMessage
	for rows.Next() {
		var msg BookingMessage
		if err := rows.Scan(
			&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.Message,
			&msg.MessageType, &msg.FileURL, &msg.IsRead, &msg.CreatedAt,
		); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}

// GetUserBookingConversations gets all booking conversations for a user (as traveler or vendor)
func GetUserBookingConversations(userID int) ([]BookingConversationDetail, error) {
	db := database.DB

	rows, err := db.Query(`
		SELECT 
			bc.id,
			bc.booking_id,
			bc.traveler_id,
			bc.vendor_id,
			bc.service_id,
			cs.title as service_title,
			COALESCE(t.name, t.email) as traveler_name,
			COALESCE(v.name, v.email) as vendor_name,
			COALESCE(
				(SELECT message FROM booking_messages 
				 WHERE conversation_id = bc.id 
				 ORDER BY created_at DESC LIMIT 1), 
				''
			) as last_message,
			bc.last_message_at,
			COALESCE(
				(SELECT COUNT(*) FROM booking_messages 
				 WHERE conversation_id = bc.id 
				 AND sender_id != $1 
				 AND is_read = false), 
				0
			) as unread_count,
			csb.status as booking_status,
			bc.created_at
		FROM booking_conversations bc
		LEFT JOIN users t ON t.id = bc.traveler_id
		LEFT JOIN users v ON v.id = bc.vendor_id
		LEFT JOIN cultural_services cs ON cs.id = bc.service_id
		LEFT JOIN cultural_service_bookings csb ON csb.id = bc.booking_id
		WHERE bc.traveler_id = $1 OR bc.vendor_id = $1
		ORDER BY bc.last_message_at DESC
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conversations []BookingConversationDetail
	for rows.Next() {
		var conv BookingConversationDetail
		if err := rows.Scan(
			&conv.ID, &conv.BookingID, &conv.TravelerID, &conv.VendorID,
			&conv.ServiceID, &conv.ServiceTitle, &conv.TravelerName, &conv.VendorName,
			&conv.LastMessage, &conv.LastMessageAt, &conv.UnreadCount,
			&conv.BookingStatus, &conv.CreatedAt,
		); err != nil {
			return nil, err
		}
		conversations = append(conversations, conv)
	}

	return conversations, nil
}

// MarkBookingMessagesAsRead marks all unread messages in a conversation as read for a user
func MarkBookingMessagesAsRead(conversationID, userID int) error {
	db := database.DB
	_, err := db.Exec(`
		UPDATE booking_messages
		SET is_read = true
		WHERE conversation_id = $1 
		AND sender_id != $2 
		AND is_read = false
	`, conversationID, userID)
	return err
}

// GetUnreadBookingMessageCount gets total unread booking messages for a user
func GetUnreadBookingMessageCount(userID int) (int, error) {
	db := database.DB
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*)
		FROM booking_messages bm
		JOIN booking_conversations bc ON bc.id = bm.conversation_id
		WHERE (bc.traveler_id = $1 OR bc.vendor_id = $1)
		AND bm.sender_id != $1
		AND bm.is_read = false
	`, userID).Scan(&count)
	return count, err
}
