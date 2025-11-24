// // travel_mate/backend/controllers/follows.go
// package controllers

// import (
// 	"bytes"
// 	"database/sql"
// 	"fmt"
// 	"io/ioutil"
// 	"log"
// 	"net/http"
// 	"strconv"

// 	"travel_mate/backend/models"

// 	"travel_mate/backend/database" // if you use database.DB directly, swap to database pkg

// 	"github.com/gin-gonic/gin"
// )

// /*
// POST /followers
// Body: { "follower_id": X, "following_id": Y, "status": "pending|accepted|blocked" (optional) }
// */
// func CreateFollower(c *gin.Context) {
// 	log.Println("[CreateFollower] incoming")

// 	var body struct {
// 		FollowerID  int    `json:"follower_id" binding:"required"`
// 		FollowingID int    `json:"following_id" binding:"required"`
// 		Status      string `json:"status"` // optional; default "pending"
// 	}

// 	// debug: read raw
// 	raw, _ := ioutil.ReadAll(c.Request.Body)
// 	c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(raw))
// 	log.Printf("[CreateFollower] raw body: %s", string(raw))

// 	if err := c.ShouldBindJSON(&body); err != nil {
// 		log.Printf("[CreateFollower] bind err: %v", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
// 		return
// 	}
// 	if body.FollowerID == body.FollowingID {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "you cannot follow yourself"})
// 		return
// 	}

// 	id, err := models.CreateFollow(body.FollowerID, body.FollowingID, body.Status)
// 	if err != nil {
// 		log.Printf("[CreateFollower] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create follower"})
// 		return
// 	}
// 	// id==0 means relationship already existed (ON CONFLICT DO NOTHING)
// 	msg := "Follow created"
// 	if id == 0 {
// 		msg = "Relationship already exists"
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": msg,
// 		"id":      id,
// 		"status": func() string {
// 			if body.Status == "" {
// 				return "pending"
// 			}
// 			return body.Status
// 		}(),
// 	})
// }

// /*
// DELETE /followers/:follower_id/:following_id
// */
// func Unfollow(c *gin.Context) {
// 	followerID, err1 := strconv.Atoi(c.Param("follower_id"))
// 	followingID, err2 := strconv.Atoi(c.Param("following_id"))
// 	if err1 != nil || err2 != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid follower_id or following_id"})
// 		return
// 	}
// 	if err := models.DeleteFollow(followerID, followingID); err != nil {
// 		log.Printf("[Unfollow] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unfollow"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "unfollowed successfully"})
// }

// /*
// POST /follow-requests/approve
// Body: { "follower_id": X, "following_id": Y }
// */
// func ApproveFollowRequest(c *gin.Context) {
// 	var body struct {
// 		FollowerID  int `json:"follower_id" binding:"required"`
// 		FollowingID int `json:"following_id" binding:"required"`
// 	}
// 	if err := c.ShouldBindJSON(&body); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
// 		return
// 	}

// 	changed, err := models.ApproveFollow(body.FollowerID, body.FollowingID)
// 	if err != nil {
// 		log.Printf("[ApproveFollowRequest] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to approve follow"})
// 		return
// 	}
// 	if !changed {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "no pending follow request found"})
// 		return
// 	}

// 	// Ensure/create direct conversation on follow accept
// 	if _, _, chatErr := models.EnsureDirectConversationOnFollow(body.FollowerID, body.FollowingID); chatErr != nil {
// 		log.Printf("[ApproveFollowRequest] follow approved, but chat ensure failed: %v", chatErr)
// 		c.JSON(http.StatusOK, gin.H{
// 			"message": "follow request approved, chat not created",
// 			"status":  "accepted",
// 		})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "follow request approved successfully",
// 		"status":  "accepted",
// 	})
// }

// /*
// POST /follow-requests/reject
// Body: { "follower_id": X, "following_id": Y }
// */
// func RejectFollowRequest(c *gin.Context) {
// 	var body struct {
// 		FollowerID  int `json:"follower_id" binding:"required"`
// 		FollowingID int `json:"following_id" binding:"required"`
// 	}
// 	if err := c.ShouldBindJSON(&body); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
// 		return
// 	}

// 	deleted, err := models.RejectFollow(body.FollowerID, body.FollowingID)
// 	if err != nil {
// 		log.Printf("[RejectFollowRequest] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reject follow request"})
// 		return
// 	}
// 	if !deleted {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "no pending follow request found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "follow request rejected successfully",
// 		"status":  "rejected",
// 	})
// }

// /*
// GET /follow-requests/pending/:user_id
// Returns pending requests for :user_id (the target being followed), including follower basic profile.
// */
// func GetPendingFollowRequests(c *gin.Context) {
// 	userID := c.Param("user_id")

// 	rows, err := database.DB.Query(`
// 		SELECT f.id, f.follower_id, f.following_id, f.status,
// 		       u.first_name, u.last_name, u.email
// 		  FROM follows f
// 		  JOIN users u ON u.id = f.follower_id
// 		 WHERE f.following_id = $1 AND f.status = 'pending'
// 		 ORDER BY f.created_at DESC
// 	`, userID)
// 	if err != nil {
// 		log.Printf("[GetPendingFollowRequests] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get pending requests"})
// 		return
// 	}
// 	defer rows.Close()

// 	type item struct {
// 		ID           int         `json:"id"`
// 		FollowerID   int         `json:"follower_id"`
// 		FollowingID  int         `json:"following_id"`
// 		Status       string      `json:"status"`
// 		FollowerInfo interface{} `json:"follower"`
// 	}
// 	out := []item{}

// 	for rows.Next() {
// 		var (
// 			id, followerID, followingID int
// 			status                      string
// 			firstName, lastName, email  sql.NullString
// 		)
// 		if err := rows.Scan(&id, &followerID, &followingID, &status, &firstName, &lastName, &email); err != nil {
// 			continue
// 		}
// 		out = append(out, item{
// 			ID:          id,
// 			FollowerID:  followerID,
// 			FollowingID: followingID,
// 			Status:      status,
// 			FollowerInfo: gin.H{
// 				"first_name": firstName.String,
// 				"last_name":  lastName.String,
// 				"email":      email.String,
// 			},
// 		})
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"pending_requests": out,
// 		"count":            len(out),
// 	})
// }

// /*
// GET /followers/:user_id
// List users who follow :user_id (accepted only)
// */
// func GetFollowers(c *gin.Context) {
// 	userID := c.Param("user_id")
// 	rows, err := database.DB.Query(`
// 		SELECT f.follower_id, f.following_id, f.status,
// 		       u.first_name, u.last_name, u.email
// 		  FROM follows f
// 		  JOIN users u ON u.id = f.follower_id
// 		 WHERE f.following_id = $1 AND f.status='accepted'
// 		 ORDER BY u.first_name, u.last_name
// 	`, userID)
// 	if err != nil {
// 		log.Printf("[GetFollowers] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get followers"})
// 		return
// 	}
// 	defer rows.Close()

// 	var out []gin.H
// 	for rows.Next() {
// 		var followerID, followingID int
// 		var status string
// 		var firstName, lastName, email sql.NullString
// 		if err := rows.Scan(&followerID, &followingID, &status, &firstName, &lastName, &email); err != nil {
// 			continue
// 		}
// 		out = append(out, gin.H{
// 			"follower_id":  followerID,
// 			"following_id": followingID,
// 			"status":       status,
// 			"first_name":   firstName.String,
// 			"last_name":    lastName.String,
// 			"email":        email.String,
// 		})
// 	}

// 	c.JSON(http.StatusOK, out)
// }

// /*
// GET /followers/:user_id/count
// */
// func GetFollowersCount(c *gin.Context) {
// 	userID, err := strconv.Atoi(c.Param("user_id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
// 		return
// 	}
// 	cnt, err := models.CountFollowers(userID)
// 	if err != nil {
// 		log.Printf("[GetFollowersCount] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get follower count"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"user_id":         userID,
// 		"followers_count": cnt,
// 	})
// }

// /*
// GET /following/:user_id/count
// */
// func GetFollowingCount(c *gin.Context) {
// 	userID, err := strconv.Atoi(c.Param("user_id"))
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
// 		return
// 	}
// 	cnt, err := models.CountFollowing(userID)
// 	if err != nil {
// 		log.Printf("[GetFollowingCount] db err: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get following count"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"user_id":         userID,
// 		"following_count": cnt,
// 	})
// }

// /*
// -------- OPTIONAL: helper to ensure chat on approval (old sample used this name) --------

// 	You already have models.EnsureDirectConversationOnFollow, so the controller calls that.
// 	If you still need the exact name elsewhere, keep this thin wrapper.
// */
// func createDirectChat(user1ID, user2ID int) error {
// 	_, _, err := models.EnsureDirectConversationOnFollow(user1ID, user2ID)
// 	if err != nil {
// 		return fmt.Errorf("ensure direct conversation failed: %w", err)
// 	}
// 	return nil
// }

// travel_mate/backend/controllers/follows.go
package controllers

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

/*
POST /followers
Body: { "follower_id": X, "following_id": Y, "status": "pending|accepted|blocked" (optional) }
*/
func CreateFollower(c *gin.Context) {
	log.Println("[CreateFollower] incoming")

	var body struct {
		FollowerID  int    `json:"follower_id" binding:"required"`
		FollowingID int    `json:"following_id" binding:"required"`
		Status      string `json:"status"` // optional; default "pending"
	}

	// debug: read raw
	raw, _ := ioutil.ReadAll(c.Request.Body)
	c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(raw))
	log.Printf("[CreateFollower] raw body: %s", string(raw))

	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[CreateFollower] bind err: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if body.FollowerID == body.FollowingID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "you cannot follow yourself"})
		return
	}

	id, err := models.CreateFollow(body.FollowerID, body.FollowingID, body.Status)
	if err != nil {
		log.Printf("[CreateFollower] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create follower"})
		return
	}
	// id==0 means relationship already existed (ON CONFLICT DO NOTHING)
	msg := "Follow created"
	if id == 0 {
		msg = "Relationship already exists"
	}
	c.JSON(http.StatusOK, gin.H{
		"message": msg,
		"id":      id,
		"status": func() string {
			if body.Status == "" {
				return "pending"
			}
			return body.Status
		}(),
	})
}

/*
DELETE /followers/:follower_id/:following_id
*/
func Unfollow(c *gin.Context) {
	followerID, err1 := strconv.Atoi(c.Param("follower_id"))
	followingID, err2 := strconv.Atoi(c.Param("following_id"))
	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid follower_id or following_id"})
		return
	}
	if err := models.DeleteFollow(followerID, followingID); err != nil {
		log.Printf("[Unfollow] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unfollow"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "unfollowed successfully"})
}

/*
POST /follow-requests/approve
Body: { "follower_id": X, "following_id": Y }
*/
func ApproveFollowRequest(c *gin.Context) {
	var body struct {
		FollowerID  int `json:"follower_id" binding:"required"`
		FollowingID int `json:"following_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	changed, err := models.ApproveFollow(body.FollowerID, body.FollowingID)
	if err != nil {
		log.Printf("[ApproveFollowRequest] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to approve follow"})
		return
	}
	if !changed {
		c.JSON(http.StatusNotFound, gin.H{"error": "no pending follow request found"})
		return
	}

	// Ensure/create direct conversation on follow accept
	if _, _, chatErr := models.EnsureDirectConversationOnFollow(body.FollowerID, body.FollowingID); chatErr != nil {
		log.Printf("[ApproveFollowRequest] follow approved, but chat ensure failed: %v", chatErr)
		c.JSON(http.StatusOK, gin.H{
			"message": "follow request approved, chat not created",
			"status":  "accepted",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "follow request approved successfully",
		"status":  "accepted",
	})
}

/*
POST /follow-requests/reject
Body: { "follower_id": X, "following_id": Y }
*/
func RejectFollowRequest(c *gin.Context) {
	var body struct {
		FollowerID  int `json:"follower_id" binding:"required"`
		FollowingID int `json:"following_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	deleted, err := models.RejectFollow(body.FollowerID, body.FollowingID)
	if err != nil {
		log.Printf("[RejectFollowRequest] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reject follow request"})
		return
	}
	if !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "no pending follow request found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "follow request rejected successfully",
		"status":  "rejected",
	})
}

/*
GET /follow-requests/pending/:user_id
Returns pending requests for :user_id (the target being followed), including follower basic profile.
*/
func GetPendingFollowRequests(c *gin.Context) {
	userID := c.Param("user_id")

	rows, err := database.DB.Query(`
		SELECT f.id, f.follower_id, f.following_id, f.status,
		       COALESCE(u.first_name, ''), COALESCE(u.last_name, ''), COALESCE(u.email, '')
		  FROM follows f
		  JOIN users u ON u.id = f.follower_id
		 WHERE f.following_id = $1 AND f.status = 'pending'
		 ORDER BY f.created_at DESC
	`, userID)
	if err != nil {
		log.Printf("[GetPendingFollowRequests] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get pending requests"})
		return
	}
	defer rows.Close()

	type item struct {
		ID           int         `json:"id"`
		FollowerID   int         `json:"follower_id"`
		FollowingID  int         `json:"following_id"`
		Status       string      `json:"status"`
		FollowerInfo interface{} `json:"follower"`
	}
	out := []item{}

	for rows.Next() {
		var (
			id, followerID, followingID int
			status                      string
			firstName, lastName, email  string
		)
		if err := rows.Scan(&id, &followerID, &followingID, &status, &firstName, &lastName, &email); err != nil {
			log.Printf("[GetPendingFollowRequests] scan error: %v", err)
			continue
		}

		// Build full_name by combining first and last name
		fullName := strings.TrimSpace(firstName + " " + lastName)
		if fullName == "" {
			fullName = email // Fallback to email if no name
		}

		// Generate avatar URL with proper name
		avatarURL := fmt.Sprintf("https://ui-avatars.com/api/?name=%s&background=0F70F0&color=fff",
			url.QueryEscape(fullName))

		// Extract username from email (part before @)
		username := email
		if atIndex := strings.Index(email, "@"); atIndex > 0 {
			username = email[:atIndex]
		}

		out = append(out, item{
			ID:          id,
			FollowerID:  followerID,
			FollowingID: followingID,
			Status:      status,
			FollowerInfo: gin.H{
				"first_name": firstName,
				"last_name":  lastName,
				"full_name":  fullName,
				"email":      email,
				"image_url":  avatarURL,
				"username":   username,
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"pending_requests": out,
		"count":            len(out),
	})
}

/*
GET /followers/:user_id
List users who follow :user_id (accepted only)
*/
func GetFollowers(c *gin.Context) {
	userID := c.Param("user_id")
	rows, err := database.DB.Query(`
		SELECT f.follower_id, f.following_id, f.status,
		       COALESCE(u.first_name, ''), COALESCE(u.last_name, ''), COALESCE(u.email, '')
		  FROM follows f
		  JOIN users u ON u.id = f.follower_id
		 WHERE f.following_id = $1 AND f.status='accepted'
		 ORDER BY u.first_name, u.last_name
	`, userID)
	if err != nil {
		log.Printf("[GetFollowers] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get followers"})
		return
	}
	defer rows.Close()

	var out []gin.H
	for rows.Next() {
		var followerID, followingID int
		var status string
		var firstName, lastName, email string
		if err := rows.Scan(&followerID, &followingID, &status, &firstName, &lastName, &email); err != nil {
			continue
		}

		fullName := strings.TrimSpace(firstName + " " + lastName)
		if fullName == "" {
			fullName = email
		}

		out = append(out, gin.H{
			"follower_id":  followerID,
			"following_id": followingID,
			"status":       status,
			"first_name":   firstName,
			"last_name":    lastName,
			"full_name":    fullName,
			"email":        email,
		})
	}

	c.JSON(http.StatusOK, out)
}

/*
GET /followers/:user_id/count
*/
func GetFollowersCount(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	cnt, err := models.CountFollowers(userID)
	if err != nil {
		log.Printf("[GetFollowersCount] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get follower count"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user_id":         userID,
		"followers_count": cnt,
	})
}

/*
GET /following/:user_id/count
*/
func GetFollowingCount(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	cnt, err := models.CountFollowing(userID)
	if err != nil {
		log.Printf("[GetFollowingCount] db err: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get following count"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user_id":         userID,
		"following_count": cnt,
	})
}

/*
Helper to ensure chat on approval
*/
func createDirectChat(user1ID, user2ID int) error {
	_, _, err := models.EnsureDirectConversationOnFollow(user1ID, user2ID)
	if err != nil {
		return fmt.Errorf("ensure direct conversation failed: %w", err)
	}
	return nil
}
