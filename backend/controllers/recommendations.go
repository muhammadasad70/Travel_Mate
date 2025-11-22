package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// ===== Mistral AI Integration =====

type MistralMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type MistralRequest struct {
	Model       string           `json:"model"`
	Messages    []MistralMessage `json:"messages"`
	Temperature float64          `json:"temperature"`
	MaxTokens   int              `json:"max_tokens"`
	RandomSeed  int64            `json:"random_seed,omitempty"` // ✅ NEW: Force unique responses
}

type MistralResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type DayPlan struct {
	DayNumber  int    `json:"day_number"`
	Place      string `json:"place"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
	Activities string `json:"activities"`
}

type RecommendedItinerary struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	City        string    `json:"city"`
	Budget      string    `json:"budget"`
	Style       string    `json:"style"`
	Duration    string    `json:"duration"`
	Days        []DayPlan `json:"days"`
	Highlights  []string  `json:"highlights"`
	Reasoning   string    `json:"reasoning"`
	Confidence  string    `json:"confidence"`
}

// ===== Generate Recommendations =====

func GenerateRecommendations(c *gin.Context) {
	userId := c.GetInt("user_id")

	var input models.UserRecommendationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if len(input.PreferredCities) == 0 || input.PreferredBudget == "" || input.PreferredStyle == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Please provide preferred_cities, preferred_budget, and preferred_style",
		})
		return
	}

	analysis, err := models.GetUserItineraryAnalysis(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
		return
	}

	requestedCity := input.PreferredCities[0]
	prompt := buildRecommendationPrompt(input, analysis, []models.ItinerarySummary{})

	// ✅ Retry up to 10 times until we get 3 valid recommendations
	var recommendations []RecommendedItinerary
	maxRetries := 10

	for attempt := 1; attempt <= maxRetries; attempt++ {
		fmt.Printf("🔄 Attempt %d/%d: Generating recommendations for %s\n", attempt, maxRetries, requestedCity)

		recs, err := getMistralRecommendations(prompt, requestedCity, attempt)
		if err != nil {
			fmt.Printf("❌ Attempt %d failed: %v\n", attempt, err)

			if attempt == maxRetries {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "AI service failed to generate correct recommendations",
					"details": fmt.Sprintf("After %d attempts, AI kept suggesting wrong cities. Please try again.", maxRetries),
				})
				return
			}

			time.Sleep(time.Millisecond * 800)
			continue
		}

		// Success!
		recommendations = recs
		fmt.Printf("✅ Success on attempt %d: Got %d valid recommendations for %s\n", attempt, len(recs), requestedCity)
		break
	}

	basedOn := gin.H{
		"user_preferences":  input,
		"total_itineraries": analysis.TotalItineraries,
		"cities_visited":    analysis.CitiesVisited,
	}
	models.SaveAIRecommendations(userId, recommendations, basedOn, 48)

	c.JSON(http.StatusOK, gin.H{
		"recommendations": recommendations,
		"based_on":        basedOn,
		"cached":          false,
	})
}

// ===== Get User Analysis =====

func GetUserAnalysis(c *gin.Context) {
	userId := c.GetInt("user_id")

	analysis, err := models.GetUserItineraryAnalysis(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"analysis": analysis,
	})
}

// ===== Get Cached Recommendations =====

func GetCachedRecommendations(c *gin.Context) {
	userId := c.GetInt("user_id")

	cached, basedOn, found, err := models.GetCachedAIRecommendations(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cache"})
		return
	}

	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "No cached recommendations. Generate new ones."})
		return
	}

	var recs []RecommendedItinerary
	json.Unmarshal(cached, &recs)

	var basedOnData interface{}
	json.Unmarshal(basedOn, &basedOnData)

	c.JSON(http.StatusOK, gin.H{
		"recommendations": recs,
		"based_on":        basedOnData,
		"cached":          true,
	})
}

// ===== Build Prompt (SIMPLIFIED) =====

func buildRecommendationPrompt(
	input models.UserRecommendationInput,
	analysis models.UserItineraryAnalysis,
	savedItins []models.ItinerarySummary,
) string {
	var sb strings.Builder

	city := input.PreferredCities[0]

	sb.WriteString(fmt.Sprintf(`🎯 TARGET CITY: %s
⚠️ YOU CAN ONLY SUGGEST PLACES IN %s - NO OTHER CITIES ALLOWED

STRICT RULES:
✅ ALL 3 itineraries must have "city": "%s" (exact match)
✅ ALL places/activities must be located in %s
✅ Create 3 different themes: Heritage, Nature, Food/Culture
❌ FORBIDDEN: Murree, Galiyat, Neelum, Chitral, Lahore, Hunza, or ANY other city
❌ FORBIDDEN: Combined cities (no commas, &, "and", "to")
❌ FORBIDDEN: Day trips outside %s

USER REQUIREMENTS:
- City: %s
- Budget: %s
- Travel Style: %s
- Duration: %s
`, city, city, city, city, city, city, input.PreferredBudget, input.PreferredStyle, input.TripDuration))

	if analysis.TotalItineraries > 0 && len(analysis.RecentTrips) > 0 {
		sb.WriteString("\nPrevious trips (avoid repetition):\n")
		for i, trip := range analysis.RecentTrips {
			if i >= 2 {
				break
			}
			sb.WriteString(fmt.Sprintf("- %s (%s)\n", trip.City, trip.Style))
		}
		sb.WriteString("\n")
	}

	sb.WriteString(fmt.Sprintf(`
RESPOND WITH VALID JSON ARRAY ONLY (no markdown, no explanation):

[
  {
    "title": "Heritage & History of %s",
    "description": "Explore historical landmarks and museums",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "days": [
      {
        "day_number": 1,
        "place": "Historic site in %s",
        "start_time": "09:00",
        "end_time": "18:00",
        "activities": "Detailed activities in %s"
      }
    ],
    "highlights": [
      "Monument in %s",
      "Museum in %s",
      "Heritage site in %s",
      "Cultural landmark in %s"
    ],
    "reasoning": "Matches user preferences",
    "confidence": "high"
  },
  {
    "title": "Nature & Parks of %s",
    "description": "Experience natural beauty and outdoor activities",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "days": [
      {
        "day_number": 1,
        "place": "Park or nature spot in %s",
        "start_time": "08:00",
        "end_time": "17:00",
        "activities": "Outdoor activities in %s"
      }
    ],
    "highlights": [
      "Park in %s",
      "Nature trail in %s",
      "Scenic spot in %s",
      "Green space in %s"
    ],
    "reasoning": "Matches user preferences",
    "confidence": "high"
  },
  {
    "title": "Food & Culture of %s",
    "description": "Discover culinary delights and local culture",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "days": [
      {
        "day_number": 1,
        "place": "Food area in %s",
        "start_time": "10:00",
        "end_time": "20:00",
        "activities": "Food and cultural experiences in %s"
      }
    ],
    "highlights": [
      "Restaurant in %s",
      "Market in %s",
      "Cafe in %s",
      "Cultural venue in %s"
    ],
    "reasoning": "Matches user preferences",
    "confidence": "high"
  }
]

🚨 FINAL CHECK: Every "city" field MUST be "%s" - No exceptions!
`, city, city, input.PreferredBudget, input.PreferredStyle, input.TripDuration, city, city,
		city, city, city, city,
		city, city, input.PreferredBudget, input.PreferredStyle, input.TripDuration, city, city,
		city, city, city, city,
		city, city, input.PreferredBudget, input.PreferredStyle, input.TripDuration, city, city,
		city, city, city, city, city))

	return sb.String()
}

// ===== Call Mistral API with Cache-Busting =====

func getMistralRecommendations(prompt string, requestedCity string, attempt int) ([]RecommendedItinerary, error) {
	apiKey := os.Getenv("MISTRAL_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
	}

	// ✅ STRICT system message
	systemPrompt := fmt.Sprintf(`You are a travel advisor with ABSOLUTE RESTRICTIONS:

🚫 FORBIDDEN CITIES: You CANNOT mention Murree, Galiyat, Neelum Valley, Chitral, Lahore, Hunza, Karachi, or ANY city except %s
🚫 FORBIDDEN: Day trips to other cities
🚫 FORBIDDEN: Combined cities (no commas, &, "and", "to" in city field)
🚫 FORBIDDEN: Suggesting places outside %s

✅ REQUIRED: ALL 3 itineraries must have "city": "%s" (EXACT MATCH)
✅ REQUIRED: ALL places/activities must be within %s city limits
✅ REQUIRED: Return ONLY valid JSON array, no markdown

If you suggest any city other than %s, your response will be REJECTED.`,
		requestedCity, requestedCity, requestedCity, requestedCity, requestedCity)

	reqBody := MistralRequest{
		Model:       "mistral-small-latest",
		Temperature: 0.0, // ✅ Zero temperature for consistency
		MaxTokens:   4000,
		RandomSeed:  time.Now().UnixNano() + int64(attempt), // ✅ Unique seed per attempt to avoid cache
		Messages: []MistralMessage{
			{
				Role:    "system",
				Content: systemPrompt,
			},
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "https://api.mistral.ai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("network error: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
	}

	var mistralResp MistralResponse
	if err := json.Unmarshal(body, &mistralResp); err != nil {
		return nil, fmt.Errorf("failed to parse API response: %v", err)
	}

	if len(mistralResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}

	content := mistralResp.Choices[0].Message.Content

	// Clean response
	content = strings.TrimSpace(content)
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")
	content = strings.TrimSpace(content)

	start := strings.Index(content, "[")
	end := strings.LastIndex(content, "]")
	if start == -1 || end == -1 {
		return nil, fmt.Errorf("no JSON array in response")
	}

	jsonStr := content[start : end+1]

	var recommendations []RecommendedItinerary
	if err := json.Unmarshal([]byte(jsonStr), &recommendations); err != nil {
		return nil, fmt.Errorf("failed to parse recommendations: %v", err)
	}

	// ✅ STRICT VALIDATION
	if len(recommendations) != 3 {
		return nil, fmt.Errorf("expected 3 recommendations, got %d", len(recommendations))
	}

	validRecs := []RecommendedItinerary{}
	violations := []string{}
	requestedCityLower := strings.ToLower(strings.TrimSpace(requestedCity))

	// List of forbidden cities
	forbiddenCities := []string{"murree", "galiyat", "neelum", "chitral", "lahore", "karachi", "hunza", "naran", "skardu", "swat"}

	for i, rec := range recommendations {
		recCity := strings.TrimSpace(rec.City)
		recCityLower := strings.ToLower(recCity)

		// ✅ Check 1: No combined cities
		if strings.Contains(recCity, ",") || strings.Contains(recCity, "&") ||
			strings.Contains(recCity, " to ") || strings.Contains(recCity, " and ") {
			violations = append(violations, fmt.Sprintf("Rec %d: Combined cities '%s'", i+1, recCity))
			continue
		}

		// ✅ Check 2: Must match requested city exactly
		if recCityLower != requestedCityLower {
			violations = append(violations, fmt.Sprintf("Rec %d: Wrong city '%s' (expected '%s')", i+1, recCity, requestedCity))
			continue
		}

		// ✅ Check 3: No forbidden cities in title, description, or activities
		fullText := strings.ToLower(rec.Title + " " + rec.Description)
		for _, day := range rec.Days {
			fullText += " " + strings.ToLower(day.Place+" "+day.Activities)
		}
		for _, highlight := range rec.Highlights {
			fullText += " " + strings.ToLower(highlight)
		}

		foundForbidden := false
		for _, forbidden := range forbiddenCities {
			if forbidden != recCityLower && strings.Contains(fullText, forbidden) {
				violations = append(violations, fmt.Sprintf("Rec %d: Mentions forbidden city '%s'", i+1, forbidden))
				foundForbidden = true
				break
			}
		}

		if !foundForbidden {
			validRecs = append(validRecs, rec)
		}
	}

	// ✅ Must have ALL 3 valid
	if len(validRecs) != 3 {
		return nil, fmt.Errorf("validation failed: %s | Required: 3 itineraries for '%s', got %d valid",
			strings.Join(violations, "; "), requestedCity, len(validRecs))
	}

	fmt.Printf("✅ All 3 recommendations validated for %s\n", requestedCity)
	return validRecs, nil
}

// ===== Save AI Itinerary WITH DAYS =====

func SaveAIItinerary(c *gin.Context) {
	userId := c.GetInt("user_id")

	var rec RecommendedItinerary
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer tx.Rollback()

	highlights, _ := json.Marshal(rec.Highlights)

	var itinId int64
	err = tx.QueryRow(`
		INSERT INTO saved_ai_itineraries 
		(user_id, title, description, city, budget, style, duration, highlights, reasoning, confidence)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
	`, userId, rec.Title, rec.Description, rec.City, rec.Budget, rec.Style,
		rec.Duration, highlights, rec.Reasoning, rec.Confidence).Scan(&itinId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save itinerary"})
		return
	}

	if len(rec.Days) > 0 {
		for _, day := range rec.Days {
			_, err := tx.Exec(`
				INSERT INTO saved_ai_itinerary_days
				(itinerary_id, day_number, place, start_time, end_time, activities)
				VALUES ($1, $2, $3, $4, $5, $6)
			`, itinId, day.DayNumber, day.Place, day.StartTime, day.EndTime, day.Activities)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save day details"})
				return
			}
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Itinerary saved successfully", "id": itinId})
}

// ===== Get Saved AI Itineraries =====

func GetSavedAIItineraries(c *gin.Context) {
	userId := c.GetInt("user_id")

	rows, err := database.DB.Query(`
		SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence, created_at
		FROM saved_ai_itineraries
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch itineraries"})
		return
	}
	defer rows.Close()

	type SavedItinerary struct {
		Id          int      `json:"id"`
		Title       string   `json:"title"`
		Description string   `json:"description"`
		City        string   `json:"city"`
		Budget      string   `json:"budget"`
		Style       string   `json:"style"`
		Duration    string   `json:"duration"`
		Highlights  []string `json:"highlights"`
		Reasoning   string   `json:"reasoning"`
		Confidence  string   `json:"confidence"`
	}

	var itineraries []SavedItinerary
	for rows.Next() {
		var itin SavedItinerary
		var highlightsJSON []byte
		var createdAt time.Time

		err := rows.Scan(
			&itin.Id,
			&itin.Title,
			&itin.Description,
			&itin.City,
			&itin.Budget,
			&itin.Style,
			&itin.Duration,
			&highlightsJSON,
			&itin.Reasoning,
			&itin.Confidence,
			&createdAt,
		)

		if err != nil {
			continue
		}

		json.Unmarshal(highlightsJSON, &itin.Highlights)
		itineraries = append(itineraries, itin)
	}

	c.JSON(http.StatusOK, gin.H{"itineraries": itineraries})
}

// ===== Get Single AI Itinerary WITH DAYS =====

func GetAIItineraryDetail(c *gin.Context) {
	userId := c.GetInt("user_id")
	itinIdStr := c.Param("id")
	itinId, err := strconv.ParseInt(itinIdStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var itin struct {
		Id          int       `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		City        string    `json:"city"`
		Budget      string    `json:"budget"`
		Style       string    `json:"style"`
		Duration    string    `json:"duration"`
		Highlights  []string  `json:"highlights"`
		Reasoning   string    `json:"reasoning"`
		Confidence  string    `json:"confidence"`
		Days        []DayPlan `json:"days"`
	}

	var highlightsJSON []byte
	err = database.DB.QueryRow(`
		SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence
		FROM saved_ai_itineraries
		WHERE id = $1 AND user_id = $2
	`, itinId, userId).Scan(
		&itin.Id,
		&itin.Title,
		&itin.Description,
		&itin.City,
		&itin.Budget,
		&itin.Style,
		&itin.Duration,
		&highlightsJSON,
		&itin.Reasoning,
		&itin.Confidence,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	json.Unmarshal(highlightsJSON, &itin.Highlights)

	rows, err := database.DB.Query(`
		SELECT day_number, place, start_time, end_time, activities
		FROM saved_ai_itinerary_days
		WHERE itinerary_id = $1
		ORDER BY day_number ASC
	`, itinId)

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var day DayPlan
			rows.Scan(&day.DayNumber, &day.Place, &day.StartTime, &day.EndTime, &day.Activities)
			itin.Days = append(itin.Days, day)
		}
	}

	c.JSON(http.StatusOK, itin)
}

// ===== Delete Saved AI Itinerary =====

func DeleteSavedAIItinerary(c *gin.Context) {
	userId := c.GetInt("user_id")
	itinId := c.Param("id")

	result, err := database.DB.Exec(`
		DELETE FROM saved_ai_itineraries 
		WHERE id = $1 AND user_id = $2
	`, itinId, userId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Itinerary deleted successfully"})
}
