package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// POST /groups/:group_id/itineraries/share
// Share an itinerary (user-created or AI-created) to a group
func ShareItineraryToGroup(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body struct {
		ItineraryType string `json:"itinerary_type" binding:"required"` // 'user_created' or 'ai_created'
		ItineraryID   int64  `json:"itinerary_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.ItineraryType != "user_created" && body.ItineraryType != "ai_created" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "itinerary_type must be 'user_created' or 'ai_created'"})
		return
	}

	// Verify user is a member of the group
	isMember, _, _, err := models.IsUserInGroup(groupID, userID)
	if err != nil {
		log.Printf("[ShareItineraryToGroup] Error checking membership: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify membership"})
		return
	}
	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "only group members can share itineraries"})
		return
	}

	// Helper function to convert string to *string
	stringPtr := func(s string) *string {
		if s == "" {
			return nil
		}
		return &s
	}

	// Fetch itinerary data from database and verify ownership
	var itineraryData map[string]interface{}
	if body.ItineraryType == "user_created" {
		itin, err := models.GetItineraryByIDForUser(userID, int(body.ItineraryID))
		if err != nil {
			if err == models.ErrNotFound || err.Error() == "not found" {
				c.JSON(http.StatusNotFound, gin.H{"error": "itinerary not found"})
				return
			}
			log.Printf("[ShareItineraryToGroup] Error fetching itinerary: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch itinerary"})
			return
		}
		itineraryData = map[string]interface{}{
			"title":       itin.Title,
			"description": stringPtr(itin.Description),
			"city":        stringPtr(itin.City),
			"budget":      stringPtr(itin.Budget),
			"style":       stringPtr(itin.Style),
			"start_date":  itin.StartDate,
			"end_date":    itin.EndDate,
			"cover_url":   stringPtr(itin.CoverURL),
		}
	} else if body.ItineraryType == "ai_created" {
		var title, city string
		var description, budget, style, duration, reasoning, confidence sql.NullString
		var highlightsJSON []byte
		var createdAt time.Time

		err := database.DB.QueryRow(`
			SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence, created_at
			FROM saved_ai_itineraries
			WHERE id = $1 AND user_id = $2
		`, body.ItineraryID, userID).Scan(&body.ItineraryID, &title, &description, &city, &budget, &style, &duration, &highlightsJSON, &reasoning, &confidence, &createdAt)

		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "itinerary not found"})
				return
			}
			log.Printf("[ShareItineraryToGroup] Error fetching AI itinerary: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch itinerary"})
			return
		}

		var highlights []string
		if len(highlightsJSON) > 0 {
			json.Unmarshal(highlightsJSON, &highlights)
		}

		itineraryData = map[string]interface{}{
			"title":       title,
			"description": stringPtr(description.String),
			"city":        stringPtr(city),
			"budget":      stringPtr(budget.String),
			"style":       stringPtr(style.String),
			"duration":    stringPtr(duration.String),
			"highlights":  highlights,
			"reasoning":   stringPtr(reasoning.String),
			"confidence":  stringPtr(confidence.String),
		}
	}

	// Share the itinerary
	sharedID, err := models.ShareItineraryToGroup(groupID, userID, body.ItineraryType, body.ItineraryID, itineraryData)
	if err != nil {
		log.Printf("[ShareItineraryToGroup] Error sharing itinerary: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to share itinerary"})
		return
	}

	// Notify group members
	go func() {
		var userName string
		err := database.DB.QueryRow(`
			SELECT COALESCE(name, first_name || ' ' || last_name, email, 'A member')
			FROM users WHERE id = $1
		`, userID).Scan(&userName)
		if err != nil {
			log.Printf("[ShareItineraryToGroup] Failed to get user name: %v", err)
			return
		}

		title, _ := itineraryData["title"].(string)
		if title == "" {
			title = "an itinerary"
		}

		if err := models.NotifyGroupMembers(
			groupID,
			userID,
			"group_itinerary_shared",
			"Itinerary Shared",
			userName+" shared "+title+" with the group",
		); err != nil {
			log.Printf("[ShareItineraryToGroup] Failed to notify group members: %v", err)
		}
	}()

	c.JSON(http.StatusCreated, gin.H{
		"id":            sharedID,
		"message":       "itinerary shared successfully",
		"itinerary_id":  body.ItineraryID,
		"itinerary_type": body.ItineraryType,
	})
}

// GET /groups/:group_id/itineraries
// Get all shared itineraries for a group
func GetGroupSharedItineraries(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Verify user is a member of the group
	isMember, _, _, err := models.IsUserInGroup(groupID, userID)
	if err != nil {
		log.Printf("[GetGroupSharedItineraries] Error checking membership: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify membership"})
		return
	}
	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "only group members can view shared itineraries"})
		return
	}

	itineraries, err := models.GetGroupSharedItineraries(groupID)
	if err != nil {
		log.Printf("[GetGroupSharedItineraries] Error fetching shared itineraries: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch shared itineraries"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"itineraries": itineraries})
}

// GET /itineraries/for-sharing
// Get user's itineraries (both user-created and AI-created) for sharing
func GetUserItinerariesForSharing(c *gin.Context) {
	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Get user-created itineraries
	userItineraries, err := models.GetItinerariesByUser(userID)
	if err != nil {
		log.Printf("[GetUserItinerariesForSharing] Error fetching user itineraries: %v", err)
		userItineraries = []models.Itinerary{}
	}

	// Get AI-created saved itineraries
	rows, err := database.DB.Query(`
		SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence, created_at
		FROM saved_ai_itineraries
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userID)
	
	aiItineraries := []map[string]interface{}{}
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var id int
			var title, city string
			var description, budget, style, duration, reasoning, confidence sql.NullString
			var highlightsJSON []byte
			var createdAt time.Time

			err := rows.Scan(&id, &title, &description, &city, &budget, &style, &duration, &highlightsJSON, &reasoning, &confidence, &createdAt)
			if err != nil {
				continue
			}

			var highlights []string
			if len(highlightsJSON) > 0 {
				json.Unmarshal(highlightsJSON, &highlights)
			}

			aiItin := map[string]interface{}{
				"id":          id,
				"title":       title,
				"description": description.String,
				"city":        city,
				"budget":      budget.String,
				"style":       style.String,
				"duration":    duration.String,
				"highlights":  highlights,
				"reasoning":   reasoning.String,
				"confidence":  confidence.String,
				"created_at":  createdAt,
			}
			aiItineraries = append(aiItineraries, aiItin)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"user_created": userItineraries,
		"ai_created":   aiItineraries,
	})
}

// PUT /groups/:group_id/itineraries/:shared_itinerary_id
// Update a shared itinerary (any group member can update)
func UpdateSharedItinerary(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	sharedItineraryID, err := strconv.Atoi(c.Param("shared_itinerary_id"))
	if err != nil || sharedItineraryID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid shared_itinerary_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body map[string]interface{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert string fields to proper types
	itineraryData := make(map[string]interface{})
	for k, v := range body {
		itineraryData[k] = v
	}

	err = models.UpdateSharedItinerary(sharedItineraryID, groupID, userID, itineraryData)
	if err != nil {
		if err.Error() == "only group members can update shared itineraries" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "shared itinerary not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		log.Printf("[UpdateSharedItinerary] Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update shared itinerary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "shared itinerary updated successfully"})
}

// POST /groups/:group_id/itineraries/:shared_itinerary_id/comments
// Add a comment to a shared itinerary
func AddSharedItineraryComment(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	sharedItineraryID, err := strconv.Atoi(c.Param("shared_itinerary_id"))
	if err != nil || sharedItineraryID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid shared_itinerary_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Verify user is a member of the group
	isMember, _, _, err := models.IsUserInGroup(groupID, userID)
	if err != nil {
		log.Printf("[AddSharedItineraryComment] Error checking membership: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify membership"})
		return
	}
	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "only group members can comment on shared itineraries"})
		return
	}

	// Verify shared itinerary belongs to the group
	var actualGroupID int
	err = database.DB.QueryRow(`SELECT group_id FROM group_shared_itineraries WHERE id = $1`, sharedItineraryID).Scan(&actualGroupID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "shared itinerary not found"})
			return
		}
		log.Printf("[AddSharedItineraryComment] Error checking shared itinerary: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify shared itinerary"})
		return
	}
	if actualGroupID != groupID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shared itinerary does not belong to this group"})
		return
	}

	var req struct {
		Comment string `json:"comment" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.Comment) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "comment cannot be empty"})
		return
	}

	commentID, err := models.AddSharedItineraryComment(sharedItineraryID, userID, req.Comment)
	if err != nil {
		log.Printf("[AddSharedItineraryComment] Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": commentID, "message": "comment added successfully"})
}

// GET /groups/:group_id/itineraries/:shared_itinerary_id/comments
// List comments for a shared itinerary
func ListSharedItineraryComments(c *gin.Context) {
	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	sharedItineraryID, err := strconv.Atoi(c.Param("shared_itinerary_id"))
	if err != nil || sharedItineraryID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid shared_itinerary_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Verify user is a member of the group
	isMember, _, _, err := models.IsUserInGroup(groupID, userID)
	if err != nil {
		log.Printf("[ListSharedItineraryComments] Error checking membership: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify membership"})
		return
	}
	if !isMember {
		c.JSON(http.StatusForbidden, gin.H{"error": "only group members can view comments"})
		return
	}

	// Verify shared itinerary belongs to the group
	var actualGroupID int
	err = database.DB.QueryRow(`SELECT group_id FROM group_shared_itineraries WHERE id = $1`, sharedItineraryID).Scan(&actualGroupID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "shared itinerary not found"})
			return
		}
		log.Printf("[ListSharedItineraryComments] Error checking shared itinerary: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify shared itinerary"})
		return
	}
	if actualGroupID != groupID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shared itinerary does not belong to this group"})
		return
	}

	comments, err := models.ListSharedItineraryComments(sharedItineraryID)
	if err != nil {
		log.Printf("[ListSharedItineraryComments] Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// DELETE /groups/:group_id/itineraries/:shared_itinerary_id/comments/:comment_id
// Delete a comment (only comment author can delete)
func DeleteSharedItineraryComment(c *gin.Context) {
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil || commentID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment_id"})
		return
	}

	userID := c.GetInt("user_id")
	if userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err = models.DeleteSharedItineraryComment(commentID, userID)
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if strings.Contains(err.Error(), "only the comment author") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		log.Printf("[DeleteSharedItineraryComment] Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "comment deleted successfully"})
}

