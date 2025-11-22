package models

import (
	"database/sql"
	"travel_mate/backend/database"
)

// GetGroupConversations returns all conversations for users in a specific group
// This includes both direct conversations between group members and the group conversation itself
func GetGroupConversations(groupID, userID int) ([]Conversation, error) {
	query := `
		SELECT DISTINCT c.id, c.type, c.title, c.group_id, c.created_at
		  FROM conversations c
		  JOIN conversation_members cm ON cm.conversation_id = c.id
		 WHERE cm.user_id = $2
		   AND (
			   -- Include the group conversation itself
			   (c.type = 'group' AND c.group_id = $1)
			   OR
			   -- Include direct conversations between group members
			   (c.type = 'direct' AND EXISTS (
				   SELECT 1
				   FROM conversation_members cm2
				   JOIN group_members gm ON gm.user_id = cm2.user_id
				   WHERE cm2.conversation_id = c.id
				     AND cm2.user_id != $2
				     AND gm.group_id = $1
				     AND gm.status = 'active'
			   ))
		   )
		 ORDER BY c.created_at DESC
	`
	
	rows, err := database.DB.Query(query, groupID, userID)
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

// GetGroupChatUnreadCount returns total unread message count for all group conversations
func GetGroupChatUnreadCount(groupID, userID int) (int, error) {
	var count int
	err := database.DB.QueryRow(`
		SELECT COALESCE(COUNT(*), 0)
		FROM messages m
		JOIN conversations c ON c.id = m.conversation_id
		JOIN conversation_members cm ON cm.conversation_id = c.id
		WHERE cm.user_id = $2
		  AND (
			  (c.type = 'group' AND c.group_id = $1)
			  OR
			  (c.type = 'direct' AND EXISTS (
				  SELECT 1
				  FROM conversation_members cm2
				  JOIN group_members gm ON gm.user_id = cm2.user_id
				  WHERE cm2.conversation_id = c.id
					AND cm2.user_id != $2
					AND gm.group_id = $1
					AND gm.status = 'active'
			  ))
		  )
		  AND m.sender_id != $2
		  AND NOT EXISTS (
			  SELECT 1
			  FROM message_reads mr
			  WHERE mr.message_id = m.id
				AND mr.user_id = $2
		  )
	`, groupID, userID).Scan(&count)
	
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return count, err
}

