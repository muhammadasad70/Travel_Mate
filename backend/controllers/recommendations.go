package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
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
}

type MistralResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type RecommendedItinerary struct {
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

	// Pass empty slice - no saved itineraries needed
	prompt := buildRecommendationPrompt(input, analysis, []models.ItinerarySummary{})

	recommendations, err := getMistralRecommendations(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "AI service unavailable",
			"details": err.Error(),
		})
		return
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

// ===== Build Prompt =====

func buildRecommendationPrompt(
	input models.UserRecommendationInput,
	analysis models.UserItineraryAnalysis,
	savedItins []models.ItinerarySummary,
) string {
	var sb strings.Builder

	sb.WriteString("You are an expert travel advisor for TravelMate, a Pakistani travel app.\n")
	sb.WriteString("Generate 3 personalized itinerary recommendations based on user preferences.\n\n")

	sb.WriteString("=== USER PREFERENCES ===\n")
	sb.WriteString(fmt.Sprintf("🎯 Interested in: %s\n", strings.Join(input.PreferredCities, ", ")))
	sb.WriteString(fmt.Sprintf("💰 Budget: %s\n", input.PreferredBudget))
	sb.WriteString(fmt.Sprintf("✈️ Travel style: %s\n", input.PreferredStyle))
	if input.TripDuration != "" {
		sb.WriteString(fmt.Sprintf("⏱️ Duration: %s\n", input.TripDuration))
	}
	if len(input.Interests) > 0 {
		sb.WriteString(fmt.Sprintf("❤️ Interests: %s\n", strings.Join(input.Interests, ", ")))
	}
	sb.WriteString("\n")

	if analysis.TotalItineraries > 0 {
		sb.WriteString("=== USER'S TRAVEL HISTORY ===\n")
		sb.WriteString(fmt.Sprintf("📊 Total trips planned: %d\n", analysis.TotalItineraries))

		if len(analysis.CitiesVisited) > 0 {
			sb.WriteString("Cities previously visited: ")
			count := 0
			for city := range analysis.CitiesVisited {
				if count > 0 {
					sb.WriteString(", ")
				}
				sb.WriteString(city)
				count++
				if count >= 5 {
					break
				}
			}
			sb.WriteString("\n")
		}

		if len(analysis.RecentTrips) > 0 {
			sb.WriteString("\nRecent trips:\n")
			for i, trip := range analysis.RecentTrips {
				if i >= 3 {
					break
				}
				sb.WriteString(fmt.Sprintf("• %s - %s (%s, %d days)\n",
					trip.Title, trip.City, trip.Style, trip.DayCount))
			}
		}
		sb.WriteString("\n")
	}

	if len(savedItins) > 0 {
		sb.WriteString("=== ITINERARIES USER SAVED ===\n")
		for _, it := range savedItins {
			sb.WriteString(fmt.Sprintf("• %s - %s (%s)\n", it.Title, it.City, it.Style))
		}
		sb.WriteString("\n")
	}

	sb.WriteString("=== TASK ===\n")
	sb.WriteString("Generate 3 NEW itinerary recommendations that:\n")
	sb.WriteString("1. Focus on the cities user requested\n")
	sb.WriteString("2. Match their budget and travel style exactly\n")
	sb.WriteString("3. Offer fresh experiences (avoid repeating past trips)\n")
	sb.WriteString("4. Are realistic and actionable for Pakistan travelers\n")
	sb.WriteString("5. Include specific, unique highlights\n\n")

	sb.WriteString("Available cities: Abbottabad, Galiyat, Bagh, Chitral, Dir, Kumrat, Gilgit, ")
	sb.WriteString("Haveli, Hunza Valley, Islamabad, Karachi, Kotli, Lahore, Multan, Muzaffarabad, ")
	sb.WriteString("Nagar Valley, Nagarparkar, Naran & Kaghan, Neelum Valley, Rawalakot, Skardu, ")
	sb.WriteString("Swat Valley, Murree\n\n")

	sb.WriteString("RESPOND WITH VALID JSON ONLY (no markdown, no preamble):\n")
	sb.WriteString(`[
  {
    "title": "Compelling trip title",
    "description": "Engaging 2-3 sentence description highlighting unique experiences",
    "city": "City name from available list",
    "budget": "Budget-friendly|Mid-range|Luxury",
    "style": "Adventure|Cultural|Comfort",
    "duration": "X days" or "X-Y days",
    "highlights": [
      "Specific experience 1",
      "Specific experience 2",
      "Specific experience 3",
      "Specific experience 4"
    ],
    "reasoning": "1-2 sentences explaining why this suits the user",
    "confidence": "high"
  }
]`)

	return sb.String()
}

// ===== Call Mistral API =====

func getMistralRecommendations(prompt string) ([]RecommendedItinerary, error) {
	apiKey := os.Getenv("MISTRAL_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
	}

	reqBody := MistralRequest{
		Model:       "mistral-small-latest",
		Temperature: 0.7,
		MaxTokens:   2500,
		Messages: []MistralMessage{
			{Role: "user", Content: prompt},
		},
	}

	jsonData, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "https://api.mistral.ai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	client := &http.Client{}
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

	return recommendations, nil
}

// ===== Save AI Itinerary =====

func SaveAIItinerary(c *gin.Context) {
	userId := c.GetInt("user_id")

	var rec RecommendedItinerary
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Convert to JSON
	highlights, _ := json.Marshal(rec.Highlights)

	_, err := database.DB.Exec(`
		INSERT INTO saved_ai_itineraries 
		(user_id, title, description, city, budget, style, duration, highlights, reasoning, confidence)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, userId, rec.Title, rec.Description, rec.City, rec.Budget, rec.Style,
		rec.Duration, highlights, rec.Reasoning, rec.Confidence)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save itinerary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Itinerary saved successfully"})
}

// ===== Get Saved AI Itineraries =====

func GetSavedAIItineraries(c *gin.Context) {
	userId := c.GetInt("user_id")

	fmt.Printf("📦 Fetching saved itineraries for user_id=%d\n", userId) // ✅ Add logging

	rows, err := database.DB.Query(`
		SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence, created_at
		FROM saved_ai_itineraries
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userId)

	if err != nil {
		fmt.Printf("❌ Query error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch itineraries"})
		return
	}
	defer rows.Close()

	// ✅ FIX: Create a proper struct with explicit Id field
	type SavedItinerary struct {
		Id          int      `json:"id"` // ✅ This MUST be capitalized and have json tag
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

		// ✅ Scan in the correct order matching SELECT
		err := rows.Scan(
			&itin.Id, // ✅ FIRST - matches SELECT order
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
			fmt.Printf("❌ Scan error: %v\n", err)
			continue
		}

		// Parse highlights JSON
		json.Unmarshal(highlightsJSON, &itin.Highlights)

		// ✅ Log to verify ID is set
		fmt.Printf("✅ Loaded itinerary: id=%d, title=%s\n", itin.Id, itin.Title)

		itineraries = append(itineraries, itin)
	}

	fmt.Printf("📦 Returning %d itineraries\n", len(itineraries))
	c.JSON(http.StatusOK, gin.H{"itineraries": itineraries})
}

// ===== Delete Saved AI Itinerary =====

func DeleteSavedAIItinerary(c *gin.Context) {
	userId := c.GetInt("user_id")
	itinId := c.Param("id")

	// ✅ Add detailed logging
	fmt.Printf("🗑️  DELETE REQUEST:\n")
	fmt.Printf("   User ID: %d\n", userId)
	fmt.Printf("   Itinerary ID: %s\n", itinId)

	// ✅ First check if record exists
	var exists bool
	checkErr := database.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM saved_ai_itineraries WHERE id = $1 AND user_id = $2)
	`, itinId, userId).Scan(&exists)

	if checkErr != nil {
		fmt.Printf("❌ Check error: %v\n", checkErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		fmt.Printf("❌ Record not found: id=%s, user_id=%d\n", itinId, userId)
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	fmt.Printf("✅ Record exists, proceeding with delete...\n")

	// ✅ Now delete
	result, err := database.DB.Exec(`
		DELETE FROM saved_ai_itineraries 
		WHERE id = $1 AND user_id = $2
	`, itinId, userId)

	if err != nil {
		fmt.Printf("❌ Delete error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete", "details": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	fmt.Printf("✅ Rows deleted: %d\n", rowsAffected)

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		return
	}

	fmt.Printf("✅ Successfully deleted itinerary id=%s\n", itinId)
	c.JSON(http.StatusOK, gin.H{"message": "Itinerary deleted successfully"})
}
