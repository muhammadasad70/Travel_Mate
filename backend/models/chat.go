package models

import (
	"database/sql"
	"errors"
	"time"

	"travel_mate/backend/database"
)

// ---------- Chat ----------

type Conversation struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Type      string    `json:"type" gorm:"type:text;not null"` // direct | group
	Title     *string   `json:"title"`                          // groups may keep a title; direct can be nil
	GroupID   *int      `json:"group_id" gorm:"index"`          // link to groups(id) when Type=group
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type ConversationMember struct {
	ConversationID int       `json:"conversation_id" gorm:"primaryKey"`
	UserID         int       `json:"user_id" gorm:"primaryKey"`
	Role           string    `json:"role" gorm:"type:text;not null;default:'member'"` // admin|member
	JoinedAt       time.Time `json:"joined_at" gorm:"autoCreateTime"`
}

type Message struct {
	ID             int       `json:"id" gorm:"primaryKey"`
	ConversationID int       `json:"conversation_id" gorm:"index;not null"`
	SenderID       *int      `json:"sender_id" gorm:"index"` // nullable for system messages
	Content        *string   `json:"content"`
	FileURL        *string   `json:"file_url"`
	MessageType    string    `json:"message_type" gorm:"type:text;not null"` // text|image|file|video|signal|call
	CreatedAt      time.Time `json:"created_at" gorm:"autoCreateTime"`
}

type MessageRead struct {
	MessageID int       `json:"message_id" gorm:"primaryKey"`
	UserID    int       `json:"user_id" gorm:"primaryKey"`
	ReadAt    time.Time `json:"read_at" gorm:"autoCreateTime"`
}

// For websockets only (no DB)
type WSMessage struct {
	Event          string      `json:"event"` // "message","signal_offer","signal_answer","signal_candidate","presence"
	ConversationID int         `json:"conversation_id,omitempty"`
	SenderID       *int        `json:"sender_id,omitempty"`
	Payload        interface{} `json:"payload,omitempty"`
	MessageType    string      `json:"message_type,omitempty"`
	FileURL        string      `json:"file_url,omitempty"`
}

/* =========================
   Conversations
   ========================= */

// EnsureDirectConversationOnFollow ensures a 'direct' conversation exists between two users
// (e.g., when a follow is created/accepted). If absent, it creates one and adds both members.
// Returns the conversation and a flag indicating whether it was created.
func EnsureDirectConversationOnFollow(aUserID, bUserID int) (Conversation, bool, error) {
	// 1) Try to find an existing direct conversation between the two users
	const findQ = `
		SELECT c.id, c.type, c.title, c.group_id, c.created_at
		  FROM conversations c
		  JOIN conversation_members cm1 ON cm1.conversation_id = c.id AND cm1.user_id = $1
		  JOIN conversation_members cm2 ON cm2.conversation_id = c.id AND cm2.user_id = $2
		 WHERE c.type = 'direct'
		 LIMIT 1
	`
	var conv Conversation
	err := database.DB.QueryRow(findQ, aUserID, bUserID).
		Scan(&conv.ID, &conv.Type, &conv.Title, &conv.GroupID, &conv.CreatedAt)
	if err == nil {
		return conv, false, nil // already exists
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return Conversation{}, false, err
	}

	// 2) Create direct conversation and two members in a transaction
	tx, err := database.DB.Begin()
	if err != nil {
		return Conversation{}, false, err
	}
	defer func() { _ = tx.Rollback() }()

	err = tx.QueryRow(`
		INSERT INTO conversations (type, title, group_id, created_at)
		VALUES ('direct', NULL, NULL, NOW())
		RETURNING id, type, title, group_id, created_at
	`).Scan(&conv.ID, &conv.Type, &conv.Title, &conv.GroupID, &conv.CreatedAt)
	if err != nil {
		return Conversation{}, false, err
	}

	// Insert both users as members
	if _, err := tx.Exec(`
		INSERT INTO conversation_members (conversation_id, user_id, role, joined_at)
		VALUES ($1,$2,'member',NOW()), ($1,$3,'member',NOW())
		ON CONFLICT (conversation_id, user_id) DO NOTHING
	`, conv.ID, aUserID, bUserID); err != nil {
		return Conversation{}, false, err
	}

	if err := tx.Commit(); err != nil {
		return Conversation{}, false, err
	}
	return conv, true, nil
}

// EnsureGroupConversation ensures a 'group' conversation exists for a group_id.
// If absent, it creates one with optional title. Returns conversation and created flag.
func EnsureGroupConversation(groupID int, title *string) (Conversation, bool, error) {
	const findQ = `
		SELECT id, type, title, group_id, created_at
		  FROM conversations
		 WHERE type='group' AND group_id=$1
		 LIMIT 1
	`
	var conv Conversation
	err := database.DB.QueryRow(findQ, groupID).
		Scan(&conv.ID, &conv.Type, &conv.Title, &conv.GroupID, &conv.CreatedAt)
	if err == nil {
		return conv, false, nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return Conversation{}, false, err
	}

	err = database.DB.QueryRow(`
		INSERT INTO conversations (type, title, group_id, created_at)
		VALUES ('group', $1, $2, NOW())
		RETURNING id, type, title, group_id, created_at
	`, title, groupID).Scan(&conv.ID, &conv.Type, &conv.Title, &conv.GroupID, &conv.CreatedAt)
	if err != nil {
		return Conversation{}, false, err
	}
	return conv, true, nil
}

// AddUserToGroupConversationOnJoin adds a user to the group's conversation (create if missing).
func AddUserToGroupConversationOnJoin(groupID, userID int, title *string) (Conversation, bool, bool, error) {
	conv, createdConv, err := EnsureGroupConversation(groupID, title)
	if err != nil {
		return Conversation{}, false, false, err
	}
	res, err := database.DB.Exec(`
		INSERT INTO conversation_members (conversation_id, user_id, role, joined_at)
		VALUES ($1,$2,'member',NOW())
		ON CONFLICT (conversation_id, user_id) DO NOTHING
	`, conv.ID, userID)
	if err != nil {
		return Conversation{}, createdConv, false, err
	}
	aff, _ := res.RowsAffected()
	return conv, createdConv, aff > 0, nil
}

// GetConversationsForUser returns conversations (direct/group) for a user.
// excludeGroupChats: if true, excludes direct conversations between users who share a group
func GetConversationsForUser(userID int, excludeGroupChats bool) ([]Conversation, error) {
	var query string
	if excludeGroupChats {
		// Exclude direct conversations where both users are in the same group
		query = `
			SELECT DISTINCT c.id, c.type, c.title, c.group_id, c.created_at
			  FROM conversations c
			  JOIN conversation_members cm ON cm.conversation_id = c.id
			 WHERE cm.user_id = $1
			   AND (
				   -- Include group conversations
				   c.type = 'group'
				   OR
				   -- Include direct conversations where users DON'T share a group
				   (c.type = 'direct' AND NOT EXISTS (
					   SELECT 1
					   FROM conversation_members cm2
					   JOIN conversations c2 ON c2.id = cm2.conversation_id
					   WHERE c2.id = c.id
					     AND cm2.user_id != $1
					     AND EXISTS (
						   SELECT 1
						   FROM group_members gm1
						   JOIN group_members gm2 ON gm2.group_id = gm1.group_id
						   WHERE gm1.user_id = $1
						     AND gm2.user_id = cm2.user_id
						     AND gm1.status = 'active'
						     AND gm2.status = 'active'
					   )
				   ))
			   )
			 ORDER BY c.created_at DESC
		`
	} else {
		query = `
			SELECT c.id, c.type, c.title, c.group_id, c.created_at
			  FROM conversations c
			  JOIN conversation_members cm ON cm.conversation_id = c.id
			 WHERE cm.user_id = $1
			 ORDER BY c.created_at DESC
		`
	}
	
	rows, err := database.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Conversation
	for rows.Next() {
		var c Conversation
		if err := rows.Scan(&c.ID, &c.Type, &c.Title, &c.GroupID, &c.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, nil
}

/* =========================
   Messages
   ========================= */

func GetMessagesByConversation(conversationID int, limit int) ([]Message, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	rows, err := database.DB.Query(`
		SELECT id, conversation_id, sender_id, content, file_url, message_type, created_at
		  FROM messages
		 WHERE conversation_id=$1
		 ORDER BY created_at DESC
		 LIMIT $2
	`, conversationID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []Message
	for rows.Next() {
		var m Message
		if err := rows.Scan(&m.ID, &m.ConversationID, &m.SenderID, &m.Content, &m.FileURL, &m.MessageType, &m.CreatedAt); err != nil {
			return nil, err
		}
		msgs = append(msgs, m)
	}
	return msgs, nil
}

func CreateMessage(conversationID int, senderID *int, content *string, fileURL *string, messageType string) (Message, error) {
	now := time.Now()
	var msg Message
	err := database.DB.QueryRow(`
		INSERT INTO messages (conversation_id, sender_id, content, file_url, message_type, created_at)
		VALUES ($1,$2,$3,$4,$5,$6)
		RETURNING id, conversation_id, sender_id, content, file_url, message_type, created_at
	`, conversationID, senderID, content, fileURL, messageType, now).Scan(
		&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.Content, &msg.FileURL, &msg.MessageType, &msg.CreatedAt,
	)
	if err != nil {
		return Message{}, err
	}
	return msg, nil
}

func MarkMessageRead(messageID, userID int) error {
	_, err := database.DB.Exec(`
		INSERT INTO message_reads (message_id, user_id, read_at)
		VALUES ($1,$2,NOW())
		ON CONFLICT (message_id, user_id) DO NOTHING
	`, messageID, userID)
	return err
}

// GetConversationMembers returns user details for all members of a conversation
func GetConversationMembers(conversationID int) ([]User, error) {
	rows, err := database.DB.Query(`
		SELECT u.id, u.email, u.first_name, u.last_name, u.country_code, 
		       u.phone, u.country, u.role, u.is_profile_complete, u.created_at
		FROM users u
		JOIN conversation_members cm ON cm.user_id = u.id
		WHERE cm.conversation_id = $1
	`, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(
			&u.Id, &u.Email, &u.FirstName, &u.LastName, &u.CountryCode,
			&u.Phone, &u.Country, &u.Role, &u.IsProfileComplete, &u.CreatedAt,
		); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// ConversationWithMembers includes member details
type ConversationWithMembers struct {
	ID        int       `json:"id"`
	Type      string    `json:"type"`
	Title     *string   `json:"title"`
	GroupID   *int      `json:"group_id"`
	CreatedAt time.Time `json:"created_at"`
	Members   []User    `json:"members"`
}

// GetConversationsForUserWithMembers returns conversations with member details
func GetConversationsForUserWithMembers(userID int) ([]ConversationWithMembers, error) {
	rows, err := database.DB.Query(`
		SELECT c.id, c.type, c.title, c.group_id, c.created_at
		  FROM conversations c
		  JOIN conversation_members cm ON cm.conversation_id = c.id
		 WHERE cm.user_id = $1
		 ORDER BY c.created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []ConversationWithMembers
	for rows.Next() {
		var c ConversationWithMembers
		if err := rows.Scan(&c.ID, &c.Type, &c.Title, &c.GroupID, &c.CreatedAt); err != nil {
			return nil, err
		}

		// Get members for this conversation
		members, err := GetConversationMembers(c.ID)
		if err == nil {
			c.Members = members
		}

		out = append(out, c)
	}
	return out, nil
}

// MessageWithSender includes sender details
type MessageWithSender struct {
	ID             int       `json:"id"`
	ConversationID int       `json:"conversation_id"`
	SenderID       *int      `json:"sender_id"`
	Content        *string   `json:"content"`
	FileURL        *string   `json:"file_url"`
	MessageType    string    `json:"message_type"`
	CreatedAt      time.Time `json:"created_at"`
	Sender         *User     `json:"sender,omitempty"`
}

// GetMessagesByConversationWithSender returns messages with sender info
func GetMessagesByConversationWithSender(conversationID int, limit int) ([]MessageWithSender, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	rows, err := database.DB.Query(`
		SELECT 
			m.id, m.conversation_id, m.sender_id, m.content, m.file_url, 
			m.message_type, m.created_at,
			u.id, COALESCE(u.first_name,''), COALESCE(u.last_name,''),
			COALESCE(u.email,''), u.role
		FROM messages m
		LEFT JOIN users u ON u.id = m.sender_id
		WHERE m.conversation_id=$1
		ORDER BY m.created_at DESC
		LIMIT $2
	`, conversationID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []MessageWithSender
	for rows.Next() {
		var m MessageWithSender
		var senderID sql.NullInt64
		var firstName, lastName, email, role sql.NullString

		if err := rows.Scan(
			&m.ID, &m.ConversationID, &senderID, &m.Content, &m.FileURL,
			&m.MessageType, &m.CreatedAt,
			&senderID, &firstName, &lastName, &email, &role,
		); err != nil {
			return nil, err
		}

		if senderID.Valid {
			sid := int(senderID.Int64)
			m.SenderID = &sid
			m.Sender = &User{
				Id:        sid,
				FirstName: firstName.String,
				LastName:  lastName.String,
				Email:     email.String,
				Role:      role.String,
			}
		}

		msgs = append(msgs, m)
	}
	return msgs, nil
}
