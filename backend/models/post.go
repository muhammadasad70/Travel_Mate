package models

import (
	"database/sql"
	"errors"
	"time"
	"travel_mate/backend/database"
)

// ---------- Social graph ----------
type Follow struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	FollowerID  int       `json:"follower_id" gorm:"index;not null"`
	FollowingID int       `json:"following_id" gorm:"index;not null"`
	Status      string    `json:"status" gorm:"type:text;not null;default:'pending'"` // pending|accepted|blocked
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// ---------- Feed / posts ----------
type Post struct {
	ID         int       `json:"id" gorm:"primaryKey"`
	UserID     int       `json:"user_id" gorm:"index;not null"`
	ContentID  int       `json:"content_id" gorm:"index;not null"`                      // points to itinerary/event/service/skill (app-level meaning)
	Visibility string    `json:"visibility" gorm:"type:text;not null;default:'public'"` // public|friends|private
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time `json:"updated_at" gorm:"autoUpdateTime"`

	User User `json:"user" gorm:"foreignKey:UserID"`
}

// ---------- Comments & Likes ----------
type Comment struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	PostID    int       `json:"post_id" gorm:"index;not null"`
	UserID    int       `json:"user_id" gorm:"index;not null"`
	Text      string    `json:"text" gorm:"type:text;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	User User `json:"user" gorm:"foreignKey:UserID"`
}

type Like struct {
	ID     int `json:"id" gorm:"primaryKey"`
	UserID int `json:"user_id" gorm:"index;not null"`
	PostID int `json:"post_id" gorm:"index;not null"`

	User User `json:"user" gorm:"foreignKey:UserID"`
	Post Post `json:"post" gorm:"foreignKey:PostID"`
}

// ---------- Saves (polymorphic) ----------
type Saved struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	UserID      int       `json:"user_id" gorm:"index;not null"`
	ContentType string    `json:"content_type" gorm:"type:text;not null"` // itinerary|event|service|skill|post
	ContentID   int       `json:"content_id" gorm:"index;not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}

/* =========================
   Posts (content_id only)
   ========================= */

func CreatePost(userID, contentID int, visibility string) (Post, error) {
	now := time.Now()
	if visibility == "" {
		visibility = "public"
	}

	var id int
	err := database.DB.QueryRow(`
		INSERT INTO posts (user_id, content_id, visibility, created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5)
		RETURNING id
	`, userID, contentID, visibility, now, now).Scan(&id)
	if err != nil {
		return Post{}, err
	}

	return Post{
		ID:         id,
		UserID:     userID,
		ContentID:  contentID,
		Visibility: visibility,
		CreatedAt:  now,
		UpdatedAt:  now,
	}, nil
}

func GetAllPosts() ([]Post, error) {
	rows, err := database.DB.Query(`
		SELECT 
			p.id, p.user_id, p.content_id, p.visibility, p.created_at, p.updated_at,
		    u.id, COALESCE(u.first_name,''), COALESCE(u.last_name,'')
		FROM posts p
		JOIN users u ON u.id = p.user_id
		ORDER BY p.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Post
	for rows.Next() {
		var p Post
		var u User
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.ContentID, &p.Visibility, &p.CreatedAt, &p.UpdatedAt,
			&u.Id, &u.FirstName, &u.LastName,
		); err != nil {
			return nil, err
		}
		p.User = u
		out = append(out, p)
	}
	return out, nil
}

func GetUsersPosts(userID int) ([]Post, error) {
	rows, err := database.DB.Query(`
		SELECT id, user_id, content_id, visibility, created_at, updated_at
		FROM posts
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Post
	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.ContentID, &p.Visibility, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, nil
}

func DeletePost(postID int) error {
	res, err := database.DB.Exec(`DELETE FROM posts WHERE id = $1`, postID)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}

/* =========================
   Likes
   ========================= */

func LikePost(userID, postID int) error {
	var n int
	if err := database.DB.QueryRow(
		`SELECT COUNT(1) FROM likes WHERE user_id=$1 AND post_id=$2`, userID, postID,
	).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		// treat as already exists (up to controller to map to 400)
		return sql.ErrNoRows // sentinel; controller maps to "already liked"
	}
	_, err := database.DB.Exec(`INSERT INTO likes (user_id, post_id) VALUES ($1,$2)`, userID, postID)
	return err
}

func UnlikePost(userID, postID int) (bool, error) {
	res, err := database.DB.Exec(`DELETE FROM likes WHERE user_id=$1 AND post_id=$2`, userID, postID)
	if err != nil {
		return false, err
	}
	aff, _ := res.RowsAffected()
	return aff > 0, nil
}

/* =========================
   Comments
   ========================= */

func AddComment(postID, userID int, text string) (Comment, error) {
	created := time.Now()
	var id int
	if err := database.DB.QueryRow(`
		INSERT INTO comments (post_id, user_id, text, created_at)
		VALUES ($1,$2,$3,$4) RETURNING id
	`, postID, userID, text, created).Scan(&id); err != nil {
		return Comment{}, err
	}
	return Comment{
		ID:        id,
		PostID:    postID,
		UserID:    userID,
		Text:      text,
		CreatedAt: created,
	}, nil
}

func GetCommentsByPost(postID int) ([]Comment, error) {
	rows, err := database.DB.Query(`
		SELECT 
			c.id, c.post_id, c.user_id, c.text, c.created_at,
			u.id, COALESCE(u.first_name,''), COALESCE(u.last_name,'')
		FROM comments c
		JOIN users u ON u.id = c.user_id
		WHERE c.post_id = $1
		ORDER BY c.created_at DESC
	`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Comment
	for rows.Next() {
		var cmt Comment
		var u User
		if err := rows.Scan(
			&cmt.ID, &cmt.PostID, &cmt.UserID, &cmt.Text, &cmt.CreatedAt,
			&u.Id, &u.FirstName, &u.LastName,
		); err != nil {
			return nil, err
		}
		cmt.User = u
		out = append(out, cmt)
	}
	return out, nil
}

func DeleteComment(commentID int) error {
	res, err := database.DB.Exec(`DELETE FROM comments WHERE id = $1`, commentID)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}

/* =========================
   Saves (polymorphic)
   ========================= */

func SaveItem(userID int, contentType string, contentID int) (int, error) {
	var n int
	if err := database.DB.QueryRow(`
		SELECT COUNT(1) FROM saves WHERE user_id=$1 AND content_type=$2 AND content_id=$3
	`, userID, contentType, contentID).Scan(&n); err != nil {
		return 0, err
	}
	if n > 0 {
		return 0, sql.ErrNoRows // sentinel; controller maps to "already saved"
	}

	var id int
	if err := database.DB.QueryRow(`
		INSERT INTO saves (user_id, content_type, content_id)
		VALUES ($1,$2,$3) RETURNING id
	`, userID, contentType, contentID).Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func UnsaveItem(userID int, contentType string, contentID int) (bool, error) {
	res, err := database.DB.Exec(`
		DELETE FROM saves WHERE user_id=$1 AND content_type=$2 AND content_id=$3
	`, userID, contentType, contentID)
	if err != nil {
		return false, err
	}
	aff, _ := res.RowsAffected()
	return aff > 0, nil
}

// Returns saved posts (content_type='post') with owner first/last name.
func GetSavedPosts(userID int) ([]map[string]interface{}, error) {
	rows, err := database.DB.Query(`
		SELECT 
			p.id, p.user_id, p.content_id, p.visibility, p.created_at, p.updated_at,
		    u.first_name, u.last_name, s.created_at AS saved_at
		FROM saves s
		JOIN posts p ON s.content_type='post' AND s.content_id = p.id
		JOIN users u ON u.id = p.user_id
		WHERE s.user_id = $1
		ORDER BY s.created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []map[string]interface{}
	for rows.Next() {
		var (
			postID, postUserID, contentID int
			visibility                    string
			firstName, lastName           string
			createdAt, updatedAt, savedAt time.Time
		)
		if err := rows.Scan(
			&postID, &postUserID, &contentID, &visibility, &createdAt, &updatedAt,
			&firstName, &lastName, &savedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, map[string]interface{}{
			"id":         postID,
			"user_id":    postUserID,
			"first_name": firstName,
			"last_name":  lastName,
			"content_id": contentID,
			"visibility": visibility,
			"created_at": createdAt,
			"updated_at": updatedAt,
			"saved_at":   savedAt,
		})
	}
	return out, nil
}

// CreateFollow inserts a follow row. Returns new id.
// If status is empty, it defaults to "pending".
func CreateFollow(followerID, followingID int, status string) (int, error) {
	if status == "" {
		status = "pending"
	}
	var id int
	err := database.DB.QueryRow(`
		INSERT INTO follows (follower_id, following_id, status)
		VALUES ($1,$2,$3)
		ON CONFLICT (follower_id, following_id) DO NOTHING
		RETURNING id
	`, followerID, followingID, status).Scan(&id)
	if err != nil {
		// When ON CONFLICT DO NOTHING triggers, Scan hits sql.ErrNoRows
		if errors.Is(err, sql.ErrNoRows) {
			return 0, nil
		}
		return 0, err
	}
	return id, nil
}

// DeleteFollow removes a follow relationship.
func DeleteFollow(followerID, followingID int) error {
	_, err := database.DB.Exec(`
		DELETE FROM follows
		WHERE follower_id=$1 AND following_id=$2
	`, followerID, followingID)
	return err
}

// ApproveFollow sets status from 'pending' to 'accepted'. Returns true if changed.
func ApproveFollow(followerID, followingID int) (bool, error) {
	res, err := database.DB.Exec(`
		UPDATE follows
		   SET status='accepted'
		 WHERE follower_id=$1 AND following_id=$2 AND status='pending'
	`, followerID, followingID)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

// RejectFollow deletes a pending follow request. Returns true if deleted.
func RejectFollow(followerID, followingID int) (bool, error) {
	res, err := database.DB.Exec(`
		DELETE FROM follows
		 WHERE follower_id=$1 AND following_id=$2 AND status='pending'
	`, followerID, followingID)
	if err != nil {
		return false, err
	}
	n, _ := res.RowsAffected()
	return n > 0, nil
}

// CountFollowers returns number of accepted followers for a user.
func CountFollowers(userID int) (int, error) {
	var cnt int
	err := database.DB.QueryRow(`
		SELECT COUNT(*) FROM follows
		 WHERE following_id=$1 AND status='accepted'
	`, userID).Scan(&cnt)
	return cnt, err
}

// CountFollowing returns number of accepted followings for a user.
func CountFollowing(userID int) (int, error) {
	var cnt int
	err := database.DB.QueryRow(`
		SELECT COUNT(*) FROM follows
		 WHERE follower_id=$1 AND status='accepted'
	`, userID).Scan(&cnt)
	return cnt, err
}
