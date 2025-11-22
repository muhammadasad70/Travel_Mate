// package controllers

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"os"
// 	"strings"
// 	"time"
// 	"travel_mate/backend/database"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// )

// // ===== Mistral AI Integration =====

// type MistralMessage struct {
// 	Role    string `json:"role"`
// 	Content string `json:"content"`
// }

// type MistralRequest struct {
// 	Model       string           `json:"model"`
// 	Messages    []MistralMessage `json:"messages"`
// 	Temperature float64          `json:"temperature"`
// 	MaxTokens   int              `json:"max_tokens"`
// }

// type MistralResponse struct {
// 	Choices []struct {
// 		Message struct {
// 			Content string `json:"content"`
// 		} `json:"message"`
// 	} `json:"choices"`
// }

// type RecommendedItinerary struct {
// 	Title       string   `json:"title"`
// 	Description string   `json:"description"`
// 	City        string   `json:"city"`
// 	Budget      string   `json:"budget"`
// 	Style       string   `json:"style"`
// 	Duration    string   `json:"duration"`
// 	Highlights  []string `json:"highlights"`
// 	Reasoning   string   `json:"reasoning"`
// 	Confidence  string   `json:"confidence"`
// }

// // ===== Generate Recommendations =====

// func GenerateRecommendations(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	var input models.UserRecommendationInput
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	if len(input.PreferredCities) == 0 || input.PreferredBudget == "" || input.PreferredStyle == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Please provide preferred_cities, preferred_budget, and preferred_style",
// 		})
// 		return
// 	}

// 	analysis, err := models.GetUserItineraryAnalysis(userId)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
// 		return
// 	}

// 	// Pass empty slice - no saved itineraries needed
// 	prompt := buildRecommendationPrompt(input, analysis, []models.ItinerarySummary{})

// 	recommendations, err := getMistralRecommendations(prompt)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error":   "AI service unavailable",
// 			"details": err.Error(),
// 		})
// 		return
// 	}

// 	basedOn := gin.H{
// 		"user_preferences":  input,
// 		"total_itineraries": analysis.TotalItineraries,
// 		"cities_visited":    analysis.CitiesVisited,
// 	}
// 	models.SaveAIRecommendations(userId, recommendations, basedOn, 48)

// 	c.JSON(http.StatusOK, gin.H{
// 		"recommendations": recommendations,
// 		"based_on":        basedOn,
// 		"cached":          false,
// 	})
// }

// // ===== Get User Analysis =====

// func GetUserAnalysis(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	analysis, err := models.GetUserItineraryAnalysis(userId)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analysis"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"analysis": analysis,
// 	})
// }

// // ===== Get Cached Recommendations =====

// func GetCachedRecommendations(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	cached, basedOn, found, err := models.GetCachedAIRecommendations(userId)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cache"})
// 		return
// 	}

// 	if !found {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "No cached recommendations. Generate new ones."})
// 		return
// 	}

// 	var recs []RecommendedItinerary
// 	json.Unmarshal(cached, &recs)

// 	var basedOnData interface{}
// 	json.Unmarshal(basedOn, &basedOnData)

// 	c.JSON(http.StatusOK, gin.H{
// 		"recommendations": recs,
// 		"based_on":        basedOnData,
// 		"cached":          true,
// 	})
// }

// // ===== Build Prompt =====
// func buildRecommendationPrompt(
// 	input models.UserRecommendationInput,
// 	analysis models.UserItineraryAnalysis,
// 	savedItins []models.ItinerarySummary,
// ) string {
// 	var sb strings.Builder

// 	sb.WriteString("You are an expert travel advisor for TravelMate, a Pakistani travel app.\n")
// 	sb.WriteString("Generate 3 personalized itinerary recommendations based on user preferences.\n\n")

// 	sb.WriteString("=== USER PREFERENCES ===\n")
// 	sb.WriteString(fmt.Sprintf("🎯 Interested in: %s\n", strings.Join(input.PreferredCities, ", ")))
// 	sb.WriteString(fmt.Sprintf("💰 Budget: %s\n", input.PreferredBudget))
// 	sb.WriteString(fmt.Sprintf("✈️ Travel style: %s\n", input.PreferredStyle))
// 	if input.TripDuration != "" {
// 		sb.WriteString(fmt.Sprintf("⏱️ Duration: %s\n", input.TripDuration))
// 	}
// 	if len(input.Interests) > 0 {
// 		sb.WriteString(fmt.Sprintf("❤️ Interests: %s\n", strings.Join(input.Interests, ", ")))
// 	}
// 	sb.WriteString("\n")

// 	if analysis.TotalItineraries > 0 {
// 		sb.WriteString("=== USER'S TRAVEL HISTORY ===\n")
// 		sb.WriteString(fmt.Sprintf("📊 Total trips planned: %d\n", analysis.TotalItineraries))

// 		if len(analysis.CitiesVisited) > 0 {
// 			sb.WriteString("Cities previously visited: ")
// 			count := 0
// 			for city := range analysis.CitiesVisited {
// 				if count > 0 {
// 					sb.WriteString(", ")
// 				}
// 				sb.WriteString(city)
// 				count++
// 				if count >= 5 {
// 					break
// 				}
// 			}
// 			sb.WriteString("\n")
// 		}

// 		if len(analysis.RecentTrips) > 0 {
// 			sb.WriteString("\nRecent trips:\n")
// 			for i, trip := range analysis.RecentTrips {
// 				if i >= 3 {
// 					break
// 				}
// 				sb.WriteString(fmt.Sprintf("• %s - %s (%s, %d days)\n",
// 					trip.Title, trip.City, trip.Style, trip.DayCount))
// 			}
// 		}
// 		sb.WriteString("\n")
// 	}

// 	if len(savedItins) > 0 {
// 		sb.WriteString("=== ITINERARIES USER SAVED ===\n")
// 		for _, it := range savedItins {
// 			sb.WriteString(fmt.Sprintf("• %s - %s (%s)\n", it.Title, it.City, it.Style))
// 		}
// 		sb.WriteString("\n")
// 	}

// 	// ✅ FIXED: Enforce single city + no duplicates
// 	selectedCity := input.PreferredCities[0]

// 	sb.WriteString("=== TASK ===\n")
// 	sb.WriteString("Generate 3 COMPLETELY DIFFERENT itinerary recommendations for the SAME destination.\n\n")

// 	sb.WriteString("⚠️ CRITICAL RULES:\n")
// 	sb.WriteString(fmt.Sprintf("1. ALL 3 recommendations MUST be for: %s ONLY\n", selectedCity))
// 	sb.WriteString("2. DO NOT suggest other cities - only activities within the selected city\n\n")

// 	sb.WriteString("3. ZERO DUPLICATION RULE - Each recommendation must have UNIQUE activities:\n")
// 	sb.WriteString("   ❌ WRONG: All 3 recommendations include 'Faisal Mosque'\n")
// 	sb.WriteString("   ✅ RIGHT: Recommendation 1 has Faisal Mosque, others have DIFFERENT places\n")
// 	sb.WriteString("   - If Rec 1 suggests an activity, Rec 2 & 3 CANNOT suggest it\n")
// 	sb.WriteString("   - If Rec 2 suggests an activity, Rec 3 CANNOT suggest it\n")
// 	sb.WriteString("   - Each of the 3 itineraries must be COMPLETELY UNIQUE\n\n")

// 	sb.WriteString("4. Create 3 DISTINCT themed experiences:\n")
// 	sb.WriteString("   Theme 1 (Recommendation 1): Cultural & Religious sites\n")
// 	sb.WriteString("   Theme 2 (Recommendation 2): Nature & Adventure activities\n")
// 	sb.WriteString("   Theme 3 (Recommendation 3): Food, Shopping & Local Life\n")
// 	sb.WriteString("   ⚠️ IMPORTANT: DO NOT use the same locations across themes!\n\n")

// 	sb.WriteString("5. Each recommendation should have 4-6 unique daily activities\n")
// 	sb.WriteString("6. Match budget and travel style exactly\n")
// 	sb.WriteString("7. All experiences MUST be realistic and actually available in the city\n\n")

// 	sb.WriteString("DIVERSITY CHECK BEFORE RESPONDING:\n")
// 	sb.WriteString("Before you output the JSON, verify:\n")
// 	sb.WriteString("- Count unique activities across all 3 recommendations\n")
// 	sb.WriteString("- If ANY activity appears twice, REPLACE the duplicate with something different\n")
// 	sb.WriteString("- Aim for 12-18 TOTALLY DIFFERENT activities across the 3 recommendations\n\n")

// 	sb.WriteString("Available cities: Abbottabad, Galiyat, Bagh, Chitral, Dir, Kumrat, Gilgit, ")
// 	sb.WriteString("Haveli, Hunza Valley, Islamabad, Karachi, Kotli, Lahore, Multan, Muzaffarabad, ")
// 	sb.WriteString("Nagar Valley, Nagarparkar, Naran & Kaghan, Neelum Valley, Rawalakot, Skardu, ")
// 	sb.WriteString("Swat Valley, Murree\n\n")

// 	sb.WriteString("RESPOND WITH VALID JSON ONLY (no markdown, no preamble):\n")
// 	sb.WriteString(fmt.Sprintf(`[
//   {
//     "title": "%s Cultural & Heritage Discovery",
//     "description": "Immerse yourself in %s's rich cultural heritage with visits to iconic landmarks and museums",
//     "city": "%s",
//     "budget": "%s",
//     "style": "%s",
//     "duration": "%s",
//     "highlights": [
//       "Day 1: Visit unique cultural landmark 1",
//       "Day 2: Explore heritage site 2",
//       "Day 3: Discover historical place 3",
//       "Day 4: Experience traditional activity 4"
//     ],
//     "reasoning": "Perfect for cultural exploration matching your interests",
//     "confidence": "high"
//   },
//   {
//     "title": "%s Nature & Adventure Escape",
//     "description": "Experience %s's natural beauty with completely different activities from recommendation 1",
//     "city": "%s",
//     "budget": "%s",
//     "style": "%s",
//     "duration": "%s",
//     "highlights": [
//       "Day 1: Different outdoor activity 1 (NOT from recommendation 1)",
//       "Day 2: Different nature experience 2 (NOT from recommendation 1)",
//       "Day 3: Different adventure spot 3 (NOT from recommendation 1)",
//       "Day 4: Different scenic location 4 (NOT from recommendation 1)"
//     ],
//     "reasoning": "Ideal for adventure seekers wanting unique outdoor experiences",
//     "confidence": "high"
//   },
//   {
//     "title": "%s Culinary & Local Life Journey",
//     "description": "Taste authentic cuisine with activities completely different from recommendations 1 and 2",
//     "city": "%s",
//     "budget": "%s",
//     "style": "%s",
//     "duration": "%s",
//     "highlights": [
//       "Day 1: Different food/market experience 1 (NOT from rec 1 or 2)",
//       "Day 2: Different dining/shopping spot 2 (NOT from rec 1 or 2)",
//       "Day 3: Different local attraction 3 (NOT from rec 1 or 2)",
//       "Day 4: Different cultural experience 4 (NOT from rec 1 or 2)"
//     ],
//     "reasoning": "Perfect for food lovers wanting authentic local experiences",
//     "confidence": "high"
//   }
// ]`,
// 		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
// 		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
// 		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
// 	))

// 	return sb.String()
// }

// // ===== Call Mistral API =====

// func getMistralRecommendations(prompt string) ([]RecommendedItinerary, error) {
// 	apiKey := os.Getenv("MISTRAL_API_KEY")
// 	if apiKey == "" {
// 		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
// 	}

// 	reqBody := MistralRequest{
// 		Model:       "mistral-small-latest",
// 		Temperature: 0.7,
// 		MaxTokens:   2500,
// 		Messages: []MistralMessage{
// 			{Role: "user", Content: prompt},
// 		},
// 	}

// 	jsonData, _ := json.Marshal(reqBody)

// 	req, err := http.NewRequest("POST", "https://api.mistral.ai/v1/chat/completions", bytes.NewBuffer(jsonData))
// 	if err != nil {
// 		return nil, err
// 	}

// 	req.Header.Set("Content-Type", "application/json")
// 	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

// 	client := &http.Client{}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		return nil, fmt.Errorf("network error: %v", err)
// 	}
// 	defer resp.Body.Close()

// 	body, _ := io.ReadAll(resp.Body)

// 	if resp.StatusCode != 200 {
// 		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
// 	}

// 	var mistralResp MistralResponse
// 	if err := json.Unmarshal(body, &mistralResp); err != nil {
// 		return nil, fmt.Errorf("failed to parse API response: %v", err)
// 	}

// 	if len(mistralResp.Choices) == 0 {
// 		return nil, fmt.Errorf("no response from AI")
// 	}

// 	content := mistralResp.Choices[0].Message.Content

// 	content = strings.TrimSpace(content)
// 	content = strings.TrimPrefix(content, "```json")
// 	content = strings.TrimPrefix(content, "```")
// 	content = strings.TrimSuffix(content, "```")
// 	content = strings.TrimSpace(content)

// 	start := strings.Index(content, "[")
// 	end := strings.LastIndex(content, "]")
// 	if start == -1 || end == -1 {
// 		return nil, fmt.Errorf("no JSON array in response")
// 	}

// 	jsonStr := content[start : end+1]

// 	var recommendations []RecommendedItinerary
// 	if err := json.Unmarshal([]byte(jsonStr), &recommendations); err != nil {
// 		return nil, fmt.Errorf("failed to parse recommendations: %v", err)
// 	}

// 	return recommendations, nil
// }

// // ===== Save AI Itinerary =====

// func SaveAIItinerary(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	var rec RecommendedItinerary
// 	if err := c.ShouldBindJSON(&rec); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	// Convert to JSON
// 	highlights, _ := json.Marshal(rec.Highlights)

// 	_, err := database.DB.Exec(`
// 		INSERT INTO saved_ai_itineraries
// 		(user_id, title, description, city, budget, style, duration, highlights, reasoning, confidence)
// 		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
// 	`, userId, rec.Title, rec.Description, rec.City, rec.Budget, rec.Style,
// 		rec.Duration, highlights, rec.Reasoning, rec.Confidence)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save itinerary"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Itinerary saved successfully"})
// }

// // ===== Get Saved AI Itineraries =====

// func GetSavedAIItineraries(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	fmt.Printf("📦 Fetching saved itineraries for user_id=%d\n", userId) // ✅ Add logging

// 	rows, err := database.DB.Query(`
// 		SELECT id, title, description, city, budget, style, duration, highlights, reasoning, confidence, created_at
// 		FROM saved_ai_itineraries
// 		WHERE user_id = $1
// 		ORDER BY created_at DESC
// 	`, userId)

// 	if err != nil {
// 		fmt.Printf("❌ Query error: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch itineraries"})
// 		return
// 	}
// 	defer rows.Close()

// 	// ✅ FIX: Create a proper struct with explicit Id field
// 	type SavedItinerary struct {
// 		Id          int      `json:"id"` // ✅ This MUST be capitalized and have json tag
// 		Title       string   `json:"title"`
// 		Description string   `json:"description"`
// 		City        string   `json:"city"`
// 		Budget      string   `json:"budget"`
// 		Style       string   `json:"style"`
// 		Duration    string   `json:"duration"`
// 		Highlights  []string `json:"highlights"`
// 		Reasoning   string   `json:"reasoning"`
// 		Confidence  string   `json:"confidence"`
// 	}

// 	var itineraries []SavedItinerary
// 	for rows.Next() {
// 		var itin SavedItinerary
// 		var highlightsJSON []byte
// 		var createdAt time.Time

// 		// ✅ Scan in the correct order matching SELECT
// 		err := rows.Scan(
// 			&itin.Id, // ✅ FIRST - matches SELECT order
// 			&itin.Title,
// 			&itin.Description,
// 			&itin.City,
// 			&itin.Budget,
// 			&itin.Style,
// 			&itin.Duration,
// 			&highlightsJSON,
// 			&itin.Reasoning,
// 			&itin.Confidence,
// 			&createdAt,
// 		)

// 		if err != nil {
// 			fmt.Printf("❌ Scan error: %v\n", err)
// 			continue
// 		}

// 		// Parse highlights JSON
// 		json.Unmarshal(highlightsJSON, &itin.Highlights)

// 		// ✅ Log to verify ID is set
// 		fmt.Printf("✅ Loaded itinerary: id=%d, title=%s\n", itin.Id, itin.Title)

// 		itineraries = append(itineraries, itin)
// 	}

// 	fmt.Printf("📦 Returning %d itineraries\n", len(itineraries))
// 	c.JSON(http.StatusOK, gin.H{"itineraries": itineraries})
// }

// // ===== Delete Saved AI Itinerary =====

// func DeleteSavedAIItinerary(c *gin.Context) {
// 	userId := c.GetInt("user_id")
// 	itinId := c.Param("id")

// 	// ✅ Add detailed logging
// 	fmt.Printf("🗑️  DELETE REQUEST:\n")
// 	fmt.Printf("   User ID: %d\n", userId)
// 	fmt.Printf("   Itinerary ID: %s\n", itinId)

// 	// ✅ First check if record exists
// 	var exists bool
// 	checkErr := database.DB.QueryRow(`
// 		SELECT EXISTS(SELECT 1 FROM saved_ai_itineraries WHERE id = $1 AND user_id = $2)
// 	`, itinId, userId).Scan(&exists)

// 	if checkErr != nil {
// 		fmt.Printf("❌ Check error: %v\n", checkErr)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
// 		return
// 	}

// 	if !exists {
// 		fmt.Printf("❌ Record not found: id=%s, user_id=%d\n", itinId, userId)
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
// 		return
// 	}

// 	fmt.Printf("✅ Record exists, proceeding with delete...\n")

// 	// ✅ Now delete
// 	result, err := database.DB.Exec(`
// 		DELETE FROM saved_ai_itineraries
// 		WHERE id = $1 AND user_id = $2
// 	`, itinId, userId)

// 	if err != nil {
// 		fmt.Printf("❌ Delete error: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete", "details": err.Error()})
// 		return
// 	}

// 	rowsAffected, _ := result.RowsAffected()
// 	fmt.Printf("✅ Rows deleted: %d\n", rowsAffected)

// 	if rowsAffected == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
// 		return
// 	}

// 	fmt.Printf("✅ Successfully deleted itinerary id=%s\n", itinId)
// 	c.JSON(http.StatusOK, gin.H{"message": "Itinerary deleted successfully"})
// }

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

	// ✅ VALIDATION: Filter wrong cities and check duplicates
	selectedCity := input.PreferredCities[0]
	validRecommendations := []RecommendedItinerary{}
	invalidCount := 0

	for _, rec := range recommendations {
		if rec.City == selectedCity {
			validRecommendations = append(validRecommendations, rec)
		} else {
			invalidCount++
			fmt.Printf("⚠️ WARNING: AI generated wrong city: '%s' (expected: '%s'). Filtering out.\n", rec.City, selectedCity)
		}
	}

	if len(validRecommendations) == 0 {
		fmt.Printf("❌ ERROR: AI generated 0 valid recommendations for %s\n", selectedCity)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("AI failed to generate recommendations for %s. Please try again.", selectedCity),
		})
		return
	}

	if invalidCount > 0 {
		fmt.Printf("⚠️ Filtered out %d invalid recommendations. Returning %d valid ones.\n", invalidCount, len(validRecommendations))
	}

	// Check for duplicate activities
	activityMap := make(map[string][]int)
	for i, rec := range validRecommendations {
		for _, highlight := range rec.Highlights {
			normalized := strings.ToLower(highlight)
			normalized = strings.TrimPrefix(normalized, "day 1:")
			normalized = strings.TrimPrefix(normalized, "day 2:")
			normalized = strings.TrimPrefix(normalized, "day 3:")
			normalized = strings.TrimPrefix(normalized, "day 4:")
			normalized = strings.TrimPrefix(normalized, "day 5:")
			normalized = strings.TrimSpace(normalized)
			activityMap[normalized] = append(activityMap[normalized], i+1)
		}
	}

	duplicateCount := 0
	for activity, recIndices := range activityMap {
		if len(recIndices) > 1 {
			duplicateCount++
			fmt.Printf("⚠️ DUPLICATE ACTIVITY: '%s' appears in recommendations: %v\n", activity, recIndices)
		}
	}

	if duplicateCount > 0 {
		fmt.Printf("⚠️ WARNING: Found %d duplicate activities across recommendations\n", duplicateCount)
	}

	recommendations = validRecommendations
	// ✅ END OF VALIDATION BLOCK

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

	if len(savedItins) > 0 {
		sb.WriteString("=== ITINERARIES USER SAVED ===\n")
		for _, it := range savedItins {
			sb.WriteString(fmt.Sprintf("• %s - %s (%s)\n", it.Title, it.City, it.Style))
		}
		sb.WriteString("\n")
	}

	// ✅ FIXED: Enforce single city + no duplicates
	selectedCity := input.PreferredCities[0]

	sb.WriteString("=== TASK ===\n")
	sb.WriteString("Generate 3 COMPLETELY DIFFERENT itinerary recommendations for the SAME destination.\n\n")

	sb.WriteString("⚠️ CRITICAL RULES:\n")
	sb.WriteString(fmt.Sprintf("1. ALL 3 recommendations MUST be for: %s ONLY\n", selectedCity))
	sb.WriteString("2. DO NOT suggest other cities - only activities within the selected city\n\n")

	sb.WriteString("3. ZERO DUPLICATION RULE - Each recommendation must have UNIQUE activities:\n")
	sb.WriteString("   ❌ WRONG: All 3 recommendations include 'Faisal Mosque'\n")
	sb.WriteString("   ✅ RIGHT: Recommendation 1 has Faisal Mosque, others have DIFFERENT places\n")
	sb.WriteString("   - If Rec 1 suggests an activity, Rec 2 & 3 CANNOT suggest it\n")
	sb.WriteString("   - If Rec 2 suggests an activity, Rec 3 CANNOT suggest it\n")
	sb.WriteString("   - Each of the 3 itineraries must be COMPLETELY UNIQUE\n\n")

	sb.WriteString("4. Create 3 DISTINCT themed experiences:\n")
	sb.WriteString("   Theme 1 (Recommendation 1): Cultural & Religious sites\n")
	sb.WriteString("   Theme 2 (Recommendation 2): Nature & Adventure activities\n")
	sb.WriteString("   Theme 3 (Recommendation 3): Food, Shopping & Local Life\n")
	sb.WriteString("   ⚠️ IMPORTANT: DO NOT use the same locations across themes!\n\n")

	sb.WriteString("5. Each recommendation should have 4-6 unique daily activities\n")
	sb.WriteString("6. Match budget and travel style exactly\n")
	sb.WriteString("7. All experiences MUST be realistic and actually available in the city\n\n")

	sb.WriteString("DIVERSITY CHECK BEFORE RESPONDING:\n")
	sb.WriteString("Before you output the JSON, verify:\n")
	sb.WriteString("- Count unique activities across all 3 recommendations\n")
	sb.WriteString("- If ANY activity appears twice, REPLACE the duplicate with something different\n")
	sb.WriteString("- Aim for 12-18 TOTALLY DIFFERENT activities across the 3 recommendations\n\n")

	sb.WriteString("Available cities: Abbottabad, Galiyat, Bagh, Chitral, Dir, Kumrat, Gilgit, ")
	sb.WriteString("Haveli, Hunza Valley, Islamabad, Karachi, Kotli, Lahore, Multan, Muzaffarabad, ")
	sb.WriteString("Nagar Valley, Nagarparkar, Naran & Kaghan, Neelum Valley, Rawalakot, Skardu, ")
	sb.WriteString("Swat Valley, Murree\n\n")

	sb.WriteString("RESPOND WITH VALID JSON ONLY (no markdown, no preamble):\n")
	sb.WriteString(fmt.Sprintf(`[
  {
    "title": "%s Cultural & Heritage Discovery",
    "description": "Immerse yourself in %s's rich cultural heritage with visits to iconic landmarks and museums",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "highlights": [
      "Day 1: Visit unique cultural landmark 1",
      "Day 2: Explore heritage site 2",
      "Day 3: Discover historical place 3",
      "Day 4: Experience traditional activity 4"
    ],
    "reasoning": "Perfect for cultural exploration matching your interests",
    "confidence": "high"
  },
  {
    "title": "%s Nature & Adventure Escape",
    "description": "Experience %s's natural beauty with completely different activities from recommendation 1",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "highlights": [
      "Day 1: Different outdoor activity 1 (NOT from recommendation 1)",
      "Day 2: Different nature experience 2 (NOT from recommendation 1)",
      "Day 3: Different adventure spot 3 (NOT from recommendation 1)",
      "Day 4: Different scenic location 4 (NOT from recommendation 1)"
    ],
    "reasoning": "Ideal for adventure seekers wanting unique outdoor experiences",
    "confidence": "high"
  },
  {
    "title": "%s Culinary & Local Life Journey",
    "description": "Taste authentic cuisine with activities completely different from recommendations 1 and 2",
    "city": "%s",
    "budget": "%s",
    "style": "%s",
    "duration": "%s",
    "highlights": [
      "Day 1: Different food/market experience 1 (NOT from rec 1 or 2)",
      "Day 2: Different dining/shopping spot 2 (NOT from rec 1 or 2)",
      "Day 3: Different local attraction 3 (NOT from rec 1 or 2)",
      "Day 4: Different cultural experience 4 (NOT from rec 1 or 2)"
    ],
    "reasoning": "Perfect for food lovers wanting authentic local experiences",
    "confidence": "high"
  }
]`,
		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
		selectedCity, selectedCity, selectedCity, input.PreferredBudget, input.PreferredStyle, input.TripDuration,
	))

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

	fmt.Printf("📦 Fetching saved itineraries for user_id=%d\n", userId)

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
		fmt.Printf("✅ Loaded itinerary: id=%d, title=%s\n", itin.Id, itin.Title)
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

	fmt.Printf("🗑️  DELETE REQUEST:\n")
	fmt.Printf("   User ID: %d\n", userId)
	fmt.Printf("   Itinerary ID: %s\n", itinId)

	var exists bool
	checkErr := database.DB.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM saved_ai_itineraries WHERE id = $1 AND user_id = $2)
	`, itinId, userId).Scan(&exists)

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
