// package controllers

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"travel_mate/backend/models"
// 	"travel_mate/backend/services"

// 	"github.com/gin-gonic/gin"
// )

// // ==========================================
// // GENERATE WEATHER-AWARE RECOMMENDATIONS
// // ==========================================

// // POST /recommendations/generate-weather-aware
// func GenerateWeatherAwareRecommendations(c *gin.Context) {
// 	userId := c.GetInt("user_id")

// 	var input models.UserRecommendationInput
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	// Validation
// 	if len(input.PreferredCities) == 0 || input.PreferredBudget == "" || input.PreferredStyle == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Please provide preferred_cities, preferred_budget, and preferred_style",
// 		})
// 		return
// 	}

// 	city := input.PreferredCities[0]
// 	log.Printf("🌍 Starting weather-aware generation for %s", city)

// 	// ==========================================
// 	// STEP 1: GENERATE BASE RECOMMENDATIONS
// 	// (YOUR EXISTING SYSTEM)
// 	// ==========================================

// 	log.Printf("📍 Step 1/3: Generating base recommendations...")

// 	analysis, err := models.GetUserItineraryAnalysis(userId)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
// 		return
// 	}

// 	// TODO: Replace these with your actual functions
// 	// Copy your existing buildRecommendationPrompt and getMistralRecommendations here
// 	basePrompt := buildBaseRecommendationPrompt(input, analysis, []models.ItinerarySummary{})
// 	baseRecommendations, err := getMistralBaseRecommendations(basePrompt)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error":   "Failed to generate base recommendations",
// 			"details": err.Error(),
// 		})
// 		return
// 	}

// 	log.Printf("✅ Step 1 complete: Generated %d base recommendations", len(baseRecommendations))

// 	// ==========================================
// 	// STEP 2: FETCH WEATHER FORECAST
// 	// ==========================================

// 	log.Printf("🌤️ Step 2/3: Fetching weather forecast for %s...", city)

// 	forecast, err := services.GetWeatherForecast(city)
// 	if err != nil {
// 		// Weather fetch failed - return base recommendations
// 		log.Printf("⚠️ Weather fetch failed: %v", err)
// 		c.JSON(http.StatusOK, gin.H{
// 			"recommendations": baseRecommendations,
// 			"weather_adapted": false,
// 			"message":         "Weather data unavailable. Showing standard recommendations.",
// 		})
// 		return
// 	}

// 	log.Printf("✅ Step 2 complete: Got %d-day forecast", len(forecast.Forecasts))

// 	// ==========================================
// 	// STEP 3: ADAPT FOR WEATHER
// 	// (NEW MISTRAL CALLS)
// 	// ==========================================

// 	log.Printf("🤖 Step 3/3: Adapting recommendations for weather...")

// 	adaptedRecommendations := []map[string]interface{}{}

// 	for i, baseRec := range baseRecommendations {
// 		log.Printf("   Adapting recommendation %d/%d: %s", i+1, len(baseRecommendations), baseRec.Title)

// 		// Convert to map
// 		baseMap := map[string]interface{}{
// 			"title":       baseRec.Title,
// 			"city":        baseRec.City,
// 			"budget":      baseRec.Budget,
// 			"style":       baseRec.Style,
// 			"duration":    baseRec.Duration,
// 			"description": baseRec.Description,
// 			"highlights":  baseRec.Highlights,
// 			"reasoning":   baseRec.Reasoning,
// 		}

// 		// Call weather adapter (SECOND MISTRAL CALL)
// 		adapted, err := services.AdaptItineraryForWeather(baseMap, forecast)

// 		if err != nil {
// 			// If adaptation fails, use base recommendation
// 			log.Printf("   ⚠️ Adaptation failed: %v", err)
// 			adaptedRecommendations = append(adaptedRecommendations, map[string]interface{}{
// 				"title":            baseRec.Title,
// 				"description":      baseRec.Description,
// 				"city":             baseRec.City,
// 				"budget":           baseRec.Budget,
// 				"style":            baseRec.Style,
// 				"duration":         baseRec.Duration,
// 				"highlights":       baseRec.Highlights,
// 				"reasoning":        baseRec.Reasoning,
// 				"confidence":       baseRec.Confidence,
// 				"weather_adapted":  false,
// 				"adaptation_error": "Weather adaptation unavailable",
// 			})
// 			continue
// 		}

// 		// Combine base + adapted data
// 		weatherAwareRec := map[string]interface{}{
// 			"id":                  fmt.Sprintf("weather_%d", i+1),
// 			"original_title":      baseRec.Title,
// 			"title":               adapted.AdaptedTitle,
// 			"description":         adapted.Description,
// 			"city":                baseRec.City,
// 			"budget":              baseRec.Budget,
// 			"style":               baseRec.Style,
// 			"duration":            baseRec.Duration,
// 			"original_highlights": baseRec.Highlights,
// 			"highlights":          adapted.AdaptedHighlights,
// 			"weather_reasoning":   adapted.WeatherReasoning,
// 			"day_wise_weather":    adapted.DayWiseWeather,
// 			"reasoning":           baseRec.Reasoning,
// 			"confidence":          baseRec.Confidence,
// 			"weather_adapted":     true,
// 		}

// 		adaptedRecommendations = append(adaptedRecommendations, weatherAwareRec)
// 		log.Printf("   ✅ Recommendation %d adapted successfully", i+1)
// 	}

// 	log.Printf("✅ Step 3 complete: All recommendations weather-adapted!")

// 	// Return final response
// 	c.JSON(http.StatusOK, gin.H{
// 		"recommendations":  adaptedRecommendations,
// 		"weather_forecast": forecast,
// 		"weather_adapted":  true,
// 		"total_api_calls":  1 + len(baseRecommendations), // 1 base + N adaptations
// 		"message":          fmt.Sprintf("Generated %d weather-smart recommendations", len(adaptedRecommendations)),
// 	})
// }

// // ==========================================
// // HELPER FUNCTIONS (COPY YOUR EXISTING CODE)
// // ==========================================

// // TODO: Copy your existing buildRecommendationPrompt function here
// func buildBaseRecommendationPrompt(
// 	input models.UserRecommendationInput,
// 	analysis models.UserItineraryAnalysis,
// 	savedItins []models.ItinerarySummary,
// ) string {
// 	// PASTE YOUR EXISTING FUNCTION BODY HERE
// 	// This should be EXACTLY your current prompt builder
// 	return "your existing prompt..."
// }

// // TODO: Copy your existing getMistralRecommendations function here
// func getMistralBaseRecommendations(prompt string) ([]models.RecommendedItinerary, error) {
// 	// PASTE YOUR EXISTING FUNCTION BODY HERE
// 	// This should be EXACTLY your current Mistral API call
// 	return []models.RecommendedItinerary{}, nil
// }

package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"travel_mate/backend/models"
	"travel_mate/backend/services"

	"github.com/gin-gonic/gin"
)

// ==========================================
// GENERATE WEATHER-AWARE RECOMMENDATIONS
// ==========================================

// POST /recommendations/generate-weather-aware
func GenerateWeatherAwareRecommendations(c *gin.Context) {
	userId := c.GetInt("user_id")

	var input models.UserRecommendationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Validation
	if len(input.PreferredCities) == 0 || input.PreferredBudget == "" || input.PreferredStyle == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Please provide preferred_cities, preferred_budget, and preferred_style",
		})
		return
	}

	city := input.PreferredCities[0]
	log.Printf("🌍 Starting weather-aware generation for %s", city)

	// ==========================================
	// STEP 1: GENERATE BASE RECOMMENDATIONS
	// ==========================================

	log.Printf("📍 Step 1/3: Generating base recommendations...")

	analysis, err := models.GetUserItineraryAnalysis(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
		return
	}

	basePrompt := buildBaseRecommendationPrompt(input, analysis, []models.ItinerarySummary{})
	baseRecommendations, err := getMistralBaseRecommendations(basePrompt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to generate base recommendations",
			"details": err.Error(),
		})
		return
	}

	log.Printf("✅ Step 1 complete: Generated %d base recommendations", len(baseRecommendations))

	// ==========================================
	// STEP 2: FETCH WEATHER FORECAST
	// ==========================================

	log.Printf("🌤️ Step 2/3: Fetching weather forecast for %s...", city)

	forecast, err := services.GetWeatherForecast(city)
	if err != nil {
		log.Printf("⚠️ Weather fetch failed: %v", err)
		c.JSON(http.StatusOK, gin.H{
			"recommendations": baseRecommendations,
			"weather_adapted": false,
			"message":         "Weather data unavailable. Showing standard recommendations.",
		})
		return
	}

	log.Printf("✅ Step 2 complete: Got %d-day forecast", len(forecast.Forecasts))

	// ==========================================
	// STEP 3: ADAPT FOR WEATHER
	// ==========================================

	log.Printf("🤖 Step 3/3: Adapting recommendations for weather...")

	adaptedRecommendations := []map[string]interface{}{}

	for i, baseRec := range baseRecommendations {
		log.Printf("   Adapting recommendation %d/%d: %s", i+1, len(baseRecommendations), baseRec.Title)

		baseMap := map[string]interface{}{
			"title":       baseRec.Title,
			"city":        baseRec.City,
			"budget":      baseRec.Budget,
			"style":       baseRec.Style,
			"duration":    baseRec.Duration,
			"description": baseRec.Description,
			"highlights":  baseRec.Highlights,
			"reasoning":   baseRec.Reasoning,
		}

		adapted, err := services.AdaptItineraryForWeather(baseMap, forecast)

		if err != nil {
			log.Printf("   ⚠️ Adaptation failed: %v", err)
			adaptedRecommendations = append(adaptedRecommendations, map[string]interface{}{
				"title":            baseRec.Title,
				"description":      baseRec.Description,
				"city":             baseRec.City,
				"budget":           baseRec.Budget,
				"style":            baseRec.Style,
				"duration":         baseRec.Duration,
				"highlights":       baseRec.Highlights,
				"reasoning":        baseRec.Reasoning,
				"confidence":       baseRec.Confidence,
				"weather_adapted":  false,
				"adaptation_error": "Weather adaptation unavailable",
			})
			continue
		}

		weatherAwareRec := map[string]interface{}{
			"id":                  fmt.Sprintf("weather_%d", i+1),
			"original_title":      baseRec.Title,
			"title":               adapted.AdaptedTitle,
			"description":         adapted.Description,
			"city":                baseRec.City,
			"budget":              baseRec.Budget,
			"style":               baseRec.Style,
			"duration":            baseRec.Duration,
			"original_highlights": baseRec.Highlights,
			"highlights":          adapted.AdaptedHighlights,
			"weather_reasoning":   adapted.WeatherReasoning,
			"day_wise_weather":    adapted.DayWiseWeather,
			"reasoning":           baseRec.Reasoning,
			"confidence":          baseRec.Confidence,
			"weather_adapted":     true,
		}

		adaptedRecommendations = append(adaptedRecommendations, weatherAwareRec)
		log.Printf("   ✅ Recommendation %d adapted successfully", i+1)
	}

	log.Printf("✅ Step 3 complete: All recommendations weather-adapted!")

	c.JSON(http.StatusOK, gin.H{
		"recommendations":  adaptedRecommendations,
		"weather_forecast": forecast,
		"weather_adapted":  true,
		"total_api_calls":  1 + len(baseRecommendations),
		"message":          fmt.Sprintf("Generated %d weather-smart recommendations", len(adaptedRecommendations)),
	})
}

// ==========================================
// ✅ COPIED FROM YOUR EXISTING recommendations.go
// ==========================================

// Build recommendation prompt (copied from your existing code)
func buildBaseRecommendationPrompt(
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

// Call Mistral API (copied from your existing code)
func getMistralBaseRecommendations(prompt string) ([]RecommendedItinerary, error) {
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
