// models/notification.go
package models

import (
	"log"
	"time"

	"travel_mate/backend/database"
)

type Notification struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Message     string    `json:"message"`
	RelatedID   *int64    `json:"related_id,omitempty"`
	RelatedType *string   `json:"related_type,omitempty"`
	IsRead      bool      `json:"is_read"`
	CreatedAt   time.Time `json:"created_at"`
}

func CreateNotification(n *Notification) error {
	const q = `
		INSERT INTO notifications (user_id, type, title, message, related_id, related_type, is_read)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at`

	return database.DB.QueryRow(q,
		n.UserID, n.Type, n.Title, n.Message, n.RelatedID, n.RelatedType, n.IsRead,
	).Scan(&n.ID, &n.CreatedAt)
}

func GetUserNotifications(userID int64, limit int, onlyUnread bool) ([]Notification, error) {
	q := `
		SELECT id, user_id, type, title, message, related_id, related_type, is_read, created_at
		FROM notifications
		WHERE user_id = $1 AND (related_type IS NULL OR related_type != 'group')`

	args := []interface{}{userID}

	if onlyUnread {
		q += " AND is_read = FALSE"
	}

	q += " ORDER BY created_at DESC"

	if limit > 0 {
		q += " LIMIT $2"
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

func GetUnreadNotificationCount(userID int64) (int, error) {
	var count int
	err := database.DB.QueryRow(
		`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE AND (related_type IS NULL OR related_type != 'group')`,
		userID,
	).Scan(&count)
	return count, err
}

func MarkNotificationAsRead(userID, notificationID int64) error {
	res, err := database.DB.Exec(
		`UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
		notificationID, userID,
	)
	if err != nil {
		return err
	}

	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}

func MarkAllNotificationsAsRead(userID int64) error {
	_, err := database.DB.Exec(
		`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
		userID,
	)
	return err
}

func DeleteNotification(userID, notificationID int64) error {
	res, err := database.DB.Exec(
		`DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
		notificationID, userID,
	)
	if err != nil {
		return err
	}

	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}

// NotifyGroupMembers creates a notification for all members of a group (except the actor)
func NotifyGroupMembers(groupID int, actorUserID int, notificationType, title, message string) error {
	// Get all group members
	const getMembers = `SELECT user_id FROM group_members WHERE group_id = $1 AND status = 'active'`
	rows, err := database.DB.Query(getMembers, groupID)
	if err != nil {
		return err
	}
	defer rows.Close()

	var memberIDs []int64
	for rows.Next() {
		var userID int64
		if err := rows.Scan(&userID); err != nil {
			continue
		}
		// Don't notify the actor
		if int64(actorUserID) != userID {
			memberIDs = append(memberIDs, userID)
		}
	}

	if err := rows.Err(); err != nil {
		return err
	}

	// Create notifications for all members
	groupID64 := int64(groupID)
	relatedType := "group"
	log.Printf("[NotifyGroupMembers] Creating notifications for group %d, actor %d, type %s, %d members to notify", 
		groupID, actorUserID, notificationType, len(memberIDs))
	
	var successCount, errorCount int
	for _, memberID := range memberIDs {
		notification := Notification{
			UserID:      memberID,
			Type:        notificationType,
			Title:       title,
			Message:     message,
			RelatedID:   &groupID64,
			RelatedType: &relatedType,
			IsRead:      false,
		}
		// Don't fail if one notification fails
		if err := CreateNotification(&notification); err != nil {
			log.Printf("[NotifyGroupMembers] Failed to create notification for user %d: %v", memberID, err)
			errorCount++
			continue
		}
		successCount++
		log.Printf("[NotifyGroupMembers] Created notification for user %d (ID: %d)", memberID, notification.ID)
	}
	
	log.Printf("[NotifyGroupMembers] Completed: %d succeeded, %d failed", successCount, errorCount)
	return nil
}