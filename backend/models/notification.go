// models/notification.go
package models

import (
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
		WHERE user_id = $1`

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
		`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
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
