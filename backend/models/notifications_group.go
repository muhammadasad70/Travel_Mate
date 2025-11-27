// models/notifications_group.go
package models

import (
	"fmt"
	"travel_mate/backend/database"
)

// GetGroupNotifications returns notifications for a specific group
func GetGroupNotifications(userID int64, groupID int, limit int, onlyUnread bool) ([]Notification, error) {
	relatedType := "group"
	q := `
		SELECT id, user_id, type, title, message, related_id, related_type, is_read, created_at
		FROM notifications
		WHERE user_id = $1
		  AND related_type = $2
		  AND related_id = $3`

	args := []interface{}{userID, relatedType, int64(groupID)}

	if onlyUnread {
		q += " AND is_read = FALSE"
	}

	q += " ORDER BY created_at DESC"

	if limit > 0 {
		paramIndex := len(args) + 1
		q += fmt.Sprintf(" LIMIT $%d", paramIndex)
		args = append(args, limit)
	}

	rows, err := database.DB.Query(q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification
	for rows.Next() {
		var n Notification
		if err := rows.Scan(
			&n.ID, &n.UserID, &n.Type, &n.Title, &n.Message,
			&n.RelatedID, &n.RelatedType, &n.IsRead, &n.CreatedAt,
		); err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}

	return notifications, nil
}

// GetUnreadGroupNotificationCount returns unread notification count for a specific group
func GetUnreadGroupNotificationCount(userID int64, groupID int) (int, error) {
	var count int
	relatedType := "group"
	err := database.DB.QueryRow(
		`SELECT COUNT(*) FROM notifications 
		 WHERE user_id = $1 
		   AND is_read = FALSE 
		   AND related_type = $2 
		   AND related_id = $3`,
		userID, relatedType, int64(groupID),
	).Scan(&count)
	return count, err
}







