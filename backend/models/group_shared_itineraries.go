package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"travel_mate/backend/database"
)

// GroupSharedItinerary represents a shared itinerary in a group
type GroupSharedItinerary struct {
	ID              int           `json:"id"`
	GroupID         int           `json:"group_id"`
	SharedByUserID  int           `json:"shared_by_user_id"`
	ItineraryType   string        `json:"itinerary_type"` // 'user_created' or 'ai_created'
	ItineraryID     int64         `json:"itinerary_id"`
	Title           string        `json:"title"`
	Description     *string       `json:"description"`
	City            *string       `json:"city"`
	Budget          *string       `json:"budget"`
	Style           *string       `json:"style"`
	Duration        *string       `json:"duration"`
	StartDate       *time.Time    `json:"start_date"`
	EndDate         *time.Time    `json:"end_date"`
	CoverURL        *string       `json:"cover_url"`
	Highlights      []string      `json:"highlights"`
	Reasoning       *string       `json:"reasoning"`
	Confidence      *string       `json:"confidence"`
	SharedByName    string        `json:"shared_by_name"`
	Days            []ItineraryDay `json:"days,omitempty"` // Daily plans for user_created itineraries
	CreatedAt       time.Time     `json:"created_at"`
}

// ShareItineraryToGroup shares an itinerary (user-created or AI-created) to a group
func ShareItineraryToGroup(groupID, sharedByUserID int, itineraryType string, itineraryID int64, itineraryData map[string]interface{}) (int, error) {
	var id int
	
	// Extract fields from itineraryData with proper nil handling
	title, _ := itineraryData["title"].(string)
	
	// Helper to safely extract *string from map
	getStringPtr := func(key string) *string {
		if val, ok := itineraryData[key]; ok {
			if ptr, ok := val.(*string); ok {
				return ptr
			}
			if str, ok := val.(string); ok {
				if str == "" {
					return nil
				}
				return &str
			}
		}
		return nil
	}
	
	description := getStringPtr("description")
	city := getStringPtr("city")
	budget := getStringPtr("budget")
	style := getStringPtr("style")
	duration := getStringPtr("duration")
	coverURL := getStringPtr("cover_url")
	reasoning := getStringPtr("reasoning")
	confidence := getStringPtr("confidence")
	var startDate, endDate *time.Time
	if sd, ok := itineraryData["start_date"].(time.Time); ok {
		startDate = &sd
	} else if sdStr, ok := itineraryData["start_date"].(string); ok && sdStr != "" {
		if t, err := time.Parse("2006-01-02", sdStr); err == nil {
			startDate = &t
		}
	}
	if ed, ok := itineraryData["end_date"].(time.Time); ok {
		endDate = &ed
	} else if edStr, ok := itineraryData["end_date"].(string); ok && edStr != "" {
		if t, err := time.Parse("2006-01-02", edStr); err == nil {
			endDate = &t
		}
	}
	// Handle highlights - must be nil or valid JSON bytes for JSONB column
	// Use interface{} to allow nil or []byte, which PostgreSQL JSONB accepts
	var highlights interface{} = nil
	if h, ok := itineraryData["highlights"].([]string); ok && len(h) > 0 {
		if highlightsJSON, err := json.Marshal(h); err == nil && len(highlightsJSON) > 0 {
			highlights = highlightsJSON
		}
	} else if h, ok := itineraryData["highlights"].([]interface{}); ok && len(h) > 0 {
		strs := make([]string, 0, len(h))
		for _, v := range h {
			if s, ok := v.(string); ok {
				strs = append(strs, s)
			}
		}
		if len(strs) > 0 {
			if highlightsJSON, err := json.Marshal(strs); err == nil && len(highlightsJSON) > 0 {
				highlights = highlightsJSON
			}
		}
	}
	// No highlights or empty - highlights is nil (NULL in database)

	query := `
		INSERT INTO group_shared_itineraries (
			group_id, shared_by_user_id, itinerary_type, itinerary_id,
			title, description, city, budget, style, duration,
			start_date, end_date, cover_url, highlights, reasoning, confidence
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING id
	`
	
	log.Printf("[ShareItineraryToGroup] Inserting shared itinerary: groupID=%d, userID=%d, type=%s, itineraryID=%d", groupID, sharedByUserID, itineraryType, itineraryID)
	log.Printf("[ShareItineraryToGroup] Title=%s, city=%v, budget=%v, style=%v", title, city, budget, style)
	log.Printf("[ShareItineraryToGroup] Highlights: %v (type: %T, is nil: %v)", highlights, highlights, highlights == nil)
	
	err := database.DB.QueryRow(
		query,
		groupID, sharedByUserID, itineraryType, itineraryID,
		title, description, city, budget, style, duration,
		startDate, endDate, coverURL, highlights, reasoning, confidence,
	).Scan(&id)
	
	if err != nil {
		log.Printf("[ShareItineraryToGroup] Database error: %v", err)
		return 0, fmt.Errorf("failed to insert shared itinerary: %w", err)
	}
	
	log.Printf("[ShareItineraryToGroup] Successfully inserted shared itinerary with id=%d", id)
	return id, nil
}

// GetGroupSharedItineraries returns all shared itineraries for a group
func GetGroupSharedItineraries(groupID int) ([]GroupSharedItinerary, error) {
	query := `
		SELECT 
			gsi.id, gsi.group_id, gsi.shared_by_user_id, gsi.itinerary_type,
			gsi.itinerary_id, gsi.title, gsi.description, gsi.city, gsi.budget,
			gsi.style, gsi.duration, gsi.start_date, gsi.end_date, gsi.cover_url,
			gsi.highlights, gsi.reasoning, gsi.confidence, gsi.created_at,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as shared_by_name
		FROM group_shared_itineraries gsi
		LEFT JOIN users u ON u.id = gsi.shared_by_user_id
		WHERE gsi.group_id = $1
		ORDER BY gsi.created_at DESC
	`
	
	rows, err := database.DB.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var itineraries []GroupSharedItinerary
	for rows.Next() {
		var itin GroupSharedItinerary
		var highlightsJSON sql.NullString
		var startDate, endDate sql.NullTime
		
		err := rows.Scan(
			&itin.ID, &itin.GroupID, &itin.SharedByUserID, &itin.ItineraryType,
			&itin.ItineraryID, &itin.Title, &itin.Description, &itin.City, &itin.Budget,
			&itin.Style, &itin.Duration, &startDate, &endDate, &itin.CoverURL,
			&highlightsJSON, &itin.Reasoning, &itin.Confidence, &itin.CreatedAt,
			&itin.SharedByName,
		)
		if err != nil {
			continue
		}

		if startDate.Valid {
			itin.StartDate = &startDate.Time
		}
		if endDate.Valid {
			itin.EndDate = &endDate.Time
		}
		if highlightsJSON.Valid && highlightsJSON.String != "" {
			json.Unmarshal([]byte(highlightsJSON.String), &itin.Highlights)
		}

		// Fetch days for user_created itineraries
		if itin.ItineraryType == "user_created" {
			days, err := GetDaysByItinerary(int(itin.ItineraryID))
			if err == nil {
				itin.Days = days
			}
		}

		itineraries = append(itineraries, itin)
	}

	return itineraries, rows.Err()
}

// UpdateSharedItinerary updates a shared itinerary (any group member can update)
func UpdateSharedItinerary(sharedItineraryID, groupID, userID int, itineraryData map[string]interface{}) error {
	// Verify user is a member of the group
	isMember, _, _, err := IsUserInGroup(groupID, userID)
	if err != nil {
		return fmt.Errorf("failed to verify membership: %w", err)
	}
	if !isMember {
		return errors.New("only group members can update shared itineraries")
	}

	// Verify shared itinerary belongs to the group
	const checkQ = `SELECT group_id FROM group_shared_itineraries WHERE id = $1`
	var actualGroupID int
	if err := database.DB.QueryRow(checkQ, sharedItineraryID).Scan(&actualGroupID); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("shared itinerary not found")
		}
		return err
	}
	if actualGroupID != groupID {
		return errors.New("shared itinerary does not belong to this group")
	}

	// Extract fields from itineraryData
	getStringPtr := func(key string) *string {
		if val, ok := itineraryData[key]; ok {
			if ptr, ok := val.(*string); ok {
				return ptr
			}
			if str, ok := val.(string); ok {
				if str == "" {
					return nil
				}
				return &str
			}
		}
		return nil
	}

	title, _ := itineraryData["title"].(string)
	description := getStringPtr("description")
	city := getStringPtr("city")
	budget := getStringPtr("budget")
	style := getStringPtr("style")
	duration := getStringPtr("duration")
	coverURL := getStringPtr("cover_url")
	reasoning := getStringPtr("reasoning")
	confidence := getStringPtr("confidence")

	var startDate, endDate *time.Time
	if sd, ok := itineraryData["start_date"].(time.Time); ok {
		startDate = &sd
	} else if sdStr, ok := itineraryData["start_date"].(string); ok && sdStr != "" {
		if t, err := time.Parse("2006-01-02", sdStr); err == nil {
			startDate = &t
		}
	}
	if ed, ok := itineraryData["end_date"].(time.Time); ok {
		endDate = &ed
	} else if edStr, ok := itineraryData["end_date"].(string); ok && edStr != "" {
		if t, err := time.Parse("2006-01-02", edStr); err == nil {
			endDate = &t
		}
	}

	var highlights interface{} = nil
	if h, ok := itineraryData["highlights"].([]string); ok && len(h) > 0 {
		if highlightsJSON, err := json.Marshal(h); err == nil && len(highlightsJSON) > 0 {
			highlights = highlightsJSON
		}
	} else if h, ok := itineraryData["highlights"].([]interface{}); ok && len(h) > 0 {
		strs := make([]string, 0, len(h))
		for _, v := range h {
			if s, ok := v.(string); ok {
				strs = append(strs, s)
			}
		}
		if len(strs) > 0 {
			if highlightsJSON, err := json.Marshal(strs); err == nil && len(highlightsJSON) > 0 {
				highlights = highlightsJSON
			}
		}
	}

	const updateQ = `
		UPDATE group_shared_itineraries
		SET title = $1,
		    description = $2,
		    city = $3,
		    budget = $4,
		    style = $5,
		    duration = $6,
		    start_date = $7,
		    end_date = $8,
		    cover_url = $9,
		    highlights = $10,
		    reasoning = $11,
		    confidence = $12
		WHERE id = $13
	`

	_, err = database.DB.Exec(updateQ,
		title, description, city, budget, style, duration,
		startDate, endDate, coverURL, highlights, reasoning, confidence,
		sharedItineraryID)
	return err
}

// GroupSharedItineraryComment represents a comment on a shared itinerary
type GroupSharedItineraryComment struct {
	ID           int       `json:"id"`
	SharedItineraryID int   `json:"shared_itinerary_id"`
	UserID       int       `json:"user_id"`
	Comment      string    `json:"comment"`
	CreatedAt    time.Time `json:"created_at"`
	UserName     string    `json:"user_name"`
	UserEmail    string    `json:"user_email"`
}

// AddSharedItineraryComment adds a comment to a shared itinerary
func AddSharedItineraryComment(sharedItineraryID, userID int, comment string) (int, error) {
	const q = `
		INSERT INTO group_shared_itinerary_comments (shared_itinerary_id, user_id, comment)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	
	var id int
	err := database.DB.QueryRow(q, sharedItineraryID, userID, comment).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to add comment: %w", err)
	}
	return id, nil
}

// ListSharedItineraryComments returns all comments for a shared itinerary
func ListSharedItineraryComments(sharedItineraryID int) ([]GroupSharedItineraryComment, error) {
	const q = `
		SELECT 
			c.id,
			c.shared_itinerary_id,
			c.user_id,
			c.comment,
			c.created_at,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as user_name,
			u.email as user_email
		FROM group_shared_itinerary_comments c
		JOIN users u ON u.id = c.user_id
		WHERE c.shared_itinerary_id = $1
		ORDER BY c.created_at ASC
	`
	
	rows, err := database.DB.Query(q, sharedItineraryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []GroupSharedItineraryComment
	for rows.Next() {
		var c GroupSharedItineraryComment
		if err := rows.Scan(&c.ID, &c.SharedItineraryID, &c.UserID, &c.Comment, &c.CreatedAt, &c.UserName, &c.UserEmail); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	return comments, rows.Err()
}

// DeleteSharedItineraryComment deletes a comment (only comment author can delete)
func DeleteSharedItineraryComment(commentID, userID int) error {
	// Verify ownership
	const checkQ = `SELECT user_id FROM group_shared_itinerary_comments WHERE id = $1`
	var commentUserID int
	if err := database.DB.QueryRow(checkQ, commentID).Scan(&commentUserID); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("comment not found")
		}
		return err
	}
	if commentUserID != userID {
		return errors.New("only the comment author can delete this comment")
	}

	const q = `DELETE FROM group_shared_itinerary_comments WHERE id = $1`
	_, err := database.DB.Exec(q, commentID)
	return err
}

