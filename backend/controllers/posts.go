package controllers

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

/*
=========================

	Create Post
	=========================
*/
func CreatePost(c *gin.Context) {
	var body struct {
		UserID     int    `json:"user_id" binding:"required"`
		ContentID  int    `json:"content_id" binding:"required"`
		Visibility string `json:"visibility" binding:"omitempty,oneof=public friends private"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[CreatePost] bind: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := models.CreatePost(body.UserID, body.ContentID, body.Visibility)
	if err != nil {
		log.Printf("[CreatePost] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create post"})
		return
	}
	c.JSON(http.StatusCreated, post)
}

/*
=========================

	Get All Posts
	=========================
*/
func GetAllPosts(c *gin.Context) {
	posts, err := models.GetAllPosts()
	if err != nil {
		log.Printf("[GetAllPosts] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch posts"})
		return
	}
	log.Println(posts)

	c.JSON(http.StatusOK, posts)
}

/*
=========================

	Get Posts by User
	=========================
*/
func GetUsersPosts(c *gin.Context) {
	idStr := c.Param("id")
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	posts, err := models.GetUsersPosts(userID)
	if err != nil {
		log.Printf("[GetUsersPosts] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

/*
=========================

	Like Post
	=========================
*/
func LikePost(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	if err := models.LikePost(userID, postID); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"error": "already liked"})
			return
		}
		log.Printf("[LikePost] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to like"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "liked"})
}

/*
=========================

	Unlike Post
	=========================
*/
func UnlikePost(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	ok, err := models.UnlikePost(userID, postID)
	if err != nil {
		log.Printf("[UnlikePost] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unlike"})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "like not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "unliked"})
}

/*
=========================

	Add Comment
	=========================
*/
func AddComment(c *gin.Context) {
	var body struct {
		PostID int    `json:"post_id" binding:"required"`
		UserID int    `json:"user_id" binding:"required"`
		Text   string `json:"text" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[AddComment] bind: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := models.AddComment(body.PostID, body.UserID, body.Text)
	if err != nil {
		log.Printf("[AddComment] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add comment"})
		return
	}
	c.JSON(http.StatusCreated, comment)
}

/*
=========================

	Get Comments by Post
	=========================
*/
func GetCommentsByPost(c *gin.Context) {
	pid, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	list, err := models.GetCommentsByPost(pid)
	if err != nil {
		log.Printf("[GetCommentsByPost] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch comments"})
		return
	}
	c.JSON(http.StatusOK, list)
}

/*
=========================

	Delete Post
	=========================
*/
func DeletePost(c *gin.Context) {
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	if err := models.DeletePost(postID); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "post not found"})
			return
		}
		log.Printf("[DeletePost] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete post"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post deleted"})
}

/*
=========================

	Delete Comment
	=========================
*/
func DeleteComment(c *gin.Context) {
	commentID, err := strconv.Atoi(c.Param("commentId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment id"})
		return
	}
	if err := models.DeleteComment(commentID); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "comment not found"})
			return
		}
		log.Printf("[DeleteComment] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete comment"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "comment deleted"})
}

/*
=========================

	Save Item (polymorphic)
	=========================
*/
func SaveItem(c *gin.Context) {
	var body struct {
		UserID      int    `json:"user_id" binding:"required"`
		ContentType string `json:"content_type" binding:"required,oneof=itinerary event service skill post"`
		ContentID   int    `json:"content_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[SaveItem] bind: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := models.SaveItem(body.UserID, body.ContentType, body.ContentID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"error": "already saved"})
			return
		}
		log.Printf("[SaveItem] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

/*
=========================

	Unsave Item (polymorphic)
	=========================
*/
func UnsaveItem(c *gin.Context) {
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	contentType := c.Query("content_type")
	contentID, err := strconv.Atoi(c.Query("content_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid content id"})
		return
	}

	ok, err := models.UnsaveItem(userID, contentType, contentID)
	if err != nil {
		log.Printf("[UnsaveItem] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unsave"})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "saved item not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "unsaved"})
}

/*
=========================

	Get Saved Posts (content_type='post')
	=========================
*/
func GetSavedPosts(c *gin.Context) {
	uid, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	rows, err := models.GetSavedPosts(uid)
	if err != nil {
		log.Printf("[GetSavedPosts] model: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch saved posts"})
		return
	}
	c.JSON(http.StatusOK, rows)
}
