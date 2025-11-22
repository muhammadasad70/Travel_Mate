// package controllers

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"log"
// 	"net/http"
// 	"os"
// 	"strings"
// 	"travel_mate/backend/models"
// 	"travel_mate/backend/services"

// 	"github.com/gin-gonic/gin"
// )

// // ==========================================
// // STRUCTS (only for this file)
// // ==========================================

// type WeatherRecommendedItinerary struct {
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

// type WeatherMistralRequest struct {
// 	Model       string                  `json:"model"`
// 	Temperature float64                 `json:"temperature"`
// 	MaxTokens   int                     `json:"max_tokens"`
// 	Messages    []WeatherMistralMessage `json:"messages"`
// }

// type WeatherMistralMessage struct {
// 	Role    string `json:"role"`
// 	Content string `json:"content"`
// }

// type WeatherMistralResponse struct {
// 	Choices []struct {
// 		Message struct {
// 			Content string `json:"content"`
// 		} `json:"message"`
// 	} `json:"choices"`
// }

// // ==========================================
// // GENERATE WEATHER-AWARE RECOMMENDATIONS
// // ==========================================

// func GenerateWeatherAwareRecommendations(c *gin.Context) {
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

// 	city := input.PreferredCities[0]
// 	log.Printf("🌍 Starting weather-aware generation for %s", city)

// 	// ✅ Log weather preferences
// 	if input.WeatherPreferences != nil {
// 		log.Printf("🌤️  Weather Preferences:")
// 		log.Printf("   - Indoor Only: %v", input.WeatherPreferences.IndoorOnly)
// 		log.Printf("   - Avoid Rain: %v", input.WeatherPreferences.AvoidRain)
// 		log.Printf("   - Avoid High Wind: %v", input.WeatherPreferences.AvoidHighWind)
// 		log.Printf("   - Preferred Conditions: %s", input.WeatherPreferences.PreferredConditions)
// 	}

// 	// STEP 1: Generate base recommendations
// 	log.Printf("📍 Step 1/3: Generating base recommendations...")
// 	analysis, err := models.GetUserItineraryAnalysis(userId)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
// 		return
// 	}

// 	basePrompt := buildWeatherBasePrompt(input, analysis, []models.ItinerarySummary{})
// 	baseRecommendations, err := getWeatherMistralRecommendations(basePrompt)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error":   "Failed to generate base recommendations",
// 			"details": err.Error(),
// 		})
// 		return
// 	}
// 	log.Printf("✅ Step 1 complete: Generated %d base recommendations", len(baseRecommendations))

// 	// STEP 2: Fetch weather
// 	log.Printf("🌤️ Step 2/3: Fetching weather forecast for %s...", city)
// 	forecast, err := services.GetWeatherForecast(city)
// 	if err != nil {
// 		log.Printf("⚠️ Weather fetch failed: %v", err)
// 		c.JSON(http.StatusOK, gin.H{
// 			"recommendations": baseRecommendations,
// 			"weather_adapted": false,
// 			"message":         "Weather data unavailable. Showing standard recommendations.",
// 		})
// 		return
// 	}
// 	log.Printf("✅ Step 2 complete: Got %d-day forecast", len(forecast.Forecasts))

// 	// STEP 3: Adapt for weather
// 	log.Printf("🤖 Step 3/3: Adapting recommendations for weather...")
// 	adaptedRecommendations := []map[string]interface{}{}

// 	for i, baseRec := range baseRecommendations {
// 		log.Printf("   Adapting recommendation %d/%d: %s", i+1, len(baseRecommendations), baseRec.Title)

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

// 		// ✅ Pass weather preferences
// 		adapted, err := services.AdaptItineraryForWeather(baseMap, forecast, input.WeatherPreferences)
// 		if err != nil {
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

// 	c.JSON(http.StatusOK, gin.H{
// 		"recommendations":  adaptedRecommendations,
// 		"weather_forecast": forecast,
// 		"weather_adapted":  true,
// 		"total_api_calls":  1 + len(baseRecommendations),
// 		"message":          fmt.Sprintf("Generated %d weather-smart recommendations", len(adaptedRecommendations)),
// 	})
// }

// // ==========================================
// // HELPER FUNCTIONS
// // ==========================================

// func buildWeatherBasePrompt(
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

// 	sb.WriteString("=== TASK ===\n")
// 	sb.WriteString("Generate 3 NEW itinerary recommendations that:\n")
// 	sb.WriteString("1. Focus on the cities user requested\n")
// 	sb.WriteString("2. Match their budget and travel style exactly\n")
// 	sb.WriteString("3. Offer fresh experiences (avoid repeating past trips)\n")
// 	sb.WriteString("4. Are realistic and actionable for Pakistan travelers\n")
// 	sb.WriteString("5. Include specific, unique highlights\n\n")

// 	sb.WriteString("Available cities: Abbottabad, Galiyat, Bagh, Chitral, Dir, Kumrat, Gilgit, ")
// 	sb.WriteString("Haveli, Hunza Valley, Islamabad, Karachi, Kotli, Lahore, Multan, Muzaffarabad, ")
// 	sb.WriteString("Nagar Valley, Nagarparkar, Naran & Kaghan, Neelum Valley, Rawalakot, Skardu, ")
// 	sb.WriteString("Swat Valley, Murree\n\n")

// 	sb.WriteString("RESPOND WITH VALID JSON ONLY (no markdown, no preamble):\n")
// 	sb.WriteString(`[
//   {
//     "title": "Compelling trip title",
//     "description": "Engaging 2-3 sentence description highlighting unique experiences",
//     "city": "City name from available list",
//     "budget": "Budget-friendly|Mid-range|Luxury",
//     "style": "Adventure|Cultural|Comfort",
//     "duration": "X days" or "X-Y days",
//     "highlights": [
//       "Specific experience 1",
//       "Specific experience 2",
//       "Specific experience 3",
//       "Specific experience 4"
//     ],
//     "reasoning": "1-2 sentences explaining why this suits the user",
//     "confidence": "high"
//   }
// ]`)

// 	return sb.String()
// }

// func getWeatherMistralRecommendations(prompt string) ([]WeatherRecommendedItinerary, error) {
// 	apiKey := os.Getenv("MISTRAL_API_KEY")
// 	if apiKey == "" {
// 		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
// 	}

// 	reqBody := WeatherMistralRequest{
// 		Model:       "mistral-small-latest",
// 		Temperature: 0.7,
// 		MaxTokens:   2500,
// 		Messages: []WeatherMistralMessage{
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

// 	var mistralResp WeatherMistralResponse
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

// 	var recommendations []WeatherRecommendedItinerary
// 	if err := json.Unmarshal([]byte(jsonStr), &recommendations); err != nil {
// 		return nil, fmt.Errorf("failed to parse recommendations: %v", err)
// 	}

// 	return recommendations, nil
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
// STRUCTS (only for this file)
// ==========================================

type WeatherRecommendedItinerary struct {
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

type WeatherMistralRequest struct {
	Model       string                  `json:"model"`
	Temperature float64                 `json:"temperature"`
	MaxTokens   int                     `json:"max_tokens"`
	Messages    []WeatherMistralMessage `json:"messages"`
}

type WeatherMistralMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type WeatherMistralResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// ==========================================
// GENERATE WEATHER-AWARE RECOMMENDATIONS
// ==========================================

func GenerateWeatherAwareRecommendations(c *gin.Context) {
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

	city := input.PreferredCities[0]
	log.Printf("🌍 Starting weather-aware generation for %s", city)

	// ✅ Log weather preferences
	if input.WeatherPreferences != nil {
		log.Printf("🌤️  Weather Preferences:")
		log.Printf("   - Indoor Only: %v", input.WeatherPreferences.IndoorOnly)
		log.Printf("   - Avoid Rain: %v", input.WeatherPreferences.AvoidRain)
		log.Printf("   - Avoid High Wind: %v", input.WeatherPreferences.AvoidHighWind)
		log.Printf("   - Preferred Conditions: %s", input.WeatherPreferences.PreferredConditions)
	}

	// STEP 1: Generate base recommendations
	log.Printf("📍 Step 1/3: Generating base recommendations...")
	analysis, err := models.GetUserItineraryAnalysis(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze itineraries"})
		return
	}

	basePrompt := buildWeatherBasePrompt(input, analysis, []models.ItinerarySummary{})
	baseRecommendations, err := getWeatherMistralRecommendations(basePrompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to generate base recommendations",
			"details": err.Error(),
		})
		return
	}

	// ✅ VALIDATION: Filter wrong cities and check duplicates
	selectedCity := city
	validBaseRecs := []WeatherRecommendedItinerary{}
	invalidCount := 0

	for _, rec := range baseRecommendations {
		if rec.City == selectedCity {
			validBaseRecs = append(validBaseRecs, rec)
		} else {
			invalidCount++
			log.Printf("⚠️ WARNING: AI generated wrong city: '%s' (expected: '%s'). Filtering out.", rec.City, selectedCity)
		}
	}

	if len(validBaseRecs) == 0 {
		log.Printf("❌ ERROR: AI generated 0 valid recommendations for %s", selectedCity)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("AI failed to generate recommendations for %s. Please try again.", selectedCity),
		})
		return
	}

	if invalidCount > 0 {
		log.Printf("⚠️ Filtered out %d invalid recommendations. Proceeding with %d valid ones.", invalidCount, len(validBaseRecs))
	}

	// Check for duplicate activities
	activityMap := make(map[string][]int)
	for i, rec := range validBaseRecs {
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
			log.Printf("⚠️ DUPLICATE ACTIVITY: '%s' appears in recommendations: %v", activity, recIndices)
		}
	}

	if duplicateCount > 0 {
		log.Printf("⚠️ WARNING: Found %d duplicate activities across recommendations", duplicateCount)
	}

	baseRecommendations = validBaseRecs
	// ✅ END OF VALIDATION BLOCK

	log.Printf("✅ Step 1 complete: Generated %d base recommendations", len(baseRecommendations))

	// STEP 2: Fetch weather
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

	// STEP 3: Adapt for weather
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

		// ✅ Pass weather preferences
		adapted, err := services.AdaptItineraryForWeather(baseMap, forecast, input.WeatherPreferences)
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
// HELPER FUNCTIONS
// ==========================================

func buildWeatherBasePrompt(
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

func getWeatherMistralRecommendations(prompt string) ([]WeatherRecommendedItinerary, error) {
	apiKey := os.Getenv("MISTRAL_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
	}

	reqBody := WeatherMistralRequest{
		Model:       "mistral-small-latest",
		Temperature: 0.7,
		MaxTokens:   2500,
		Messages: []WeatherMistralMessage{
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

	var mistralResp WeatherMistralResponse
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

	var recommendations []WeatherRecommendedItinerary
	if err := json.Unmarshal([]byte(jsonStr), &recommendations); err != nil {
		return nil, fmt.Errorf("failed to parse recommendations: %v", err)
	}

	return recommendations, nil
}
