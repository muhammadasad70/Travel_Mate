package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

// ==========================================
// DATA STRUCTURE
// ==========================================

type WeatherAdaptedItinerary struct {
	OriginalTitle     string                   `json:"original_title"`
	AdaptedTitle      string                   `json:"adapted_title"`
	City              string                   `json:"city"`
	Budget            string                   `json:"budget"`
	Style             string                   `json:"style"`
	Duration          string                   `json:"duration"`
	Description       string                   `json:"description"`
	AdaptedHighlights []string                 `json:"adapted_highlights"`
	WeatherReasoning  string                   `json:"weather_reasoning"`
	DayWiseWeather    []map[string]interface{} `json:"day_wise_weather"`
}

// ==========================================
// MAIN FUNCTION: ADAPT ITINERARY FOR WEATHER
// ==========================================

// AdaptItineraryForWeather takes a base itinerary and weather forecast
// and calls Mistral AI to rearrange activities based on weather
func AdaptItineraryForWeather(baseItinerary map[string]interface{}, forecast *WeatherForecast) (*WeatherAdaptedItinerary, error) {

	// Get Mistral API key
	apiKey := os.Getenv("MISTRAL_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("MISTRAL_API_KEY not configured")
	}

	// Build weather adaptation prompt
	prompt := buildWeatherAdaptationPrompt(baseItinerary, forecast)

	// ==========================================
	// CALL MISTRAL API (SECOND CALL)
	// ==========================================

	reqBody := map[string]interface{}{
		"model":       "mistral-small-latest",
		"temperature": 0.7,
		"max_tokens":  2000,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
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
		return nil, fmt.Errorf("weather adapter API request failed: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Mistral API error (%d): %s", resp.StatusCode, string(body))
	}

	// Parse Mistral response
	var mistralResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &mistralResp); err != nil {
		return nil, err
	}

	if len(mistralResp.Choices) == 0 {
		return nil, fmt.Errorf("no response from Mistral weather adapter")
	}

	content := mistralResp.Choices[0].Message.Content

	// ==========================================
	// CLEAN UP RESPONSE (Remove markdown)
	// ==========================================

	content = strings.TrimSpace(content)
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")
	content = strings.TrimSpace(content)

	// Extract JSON from response
	start := strings.Index(content, "{")
	end := strings.LastIndex(content, "}")
	if start != -1 && end != -1 && end > start {
		content = content[start : end+1]
	}

	// Parse adapted itinerary
	var adapted WeatherAdaptedItinerary
	if err := json.Unmarshal([]byte(content), &adapted); err != nil {
		return nil, fmt.Errorf("failed to parse weather adaptation: %v\nContent: %s", err, content)
	}

	return &adapted, nil
}

// ==========================================
// BUILD WEATHER ADAPTATION PROMPT
// ==========================================

func buildWeatherAdaptationPrompt(baseItinerary map[string]interface{}, forecast *WeatherForecast) string {
	var sb strings.Builder

	sb.WriteString("You are a weather-aware travel planner for Pakistan.\n")
	sb.WriteString("Your task: Adapt an existing itinerary based on weather forecast.\n\n")

	// ==========================================
	// SECTION 1: ORIGINAL ITINERARY
	// ==========================================

	sb.WriteString("=== ORIGINAL ITINERARY ===\n")
	sb.WriteString(fmt.Sprintf("Title: %v\n", baseItinerary["title"]))
	sb.WriteString(fmt.Sprintf("City: %v\n", baseItinerary["city"]))
	sb.WriteString(fmt.Sprintf("Budget: %v\n", baseItinerary["budget"]))
	sb.WriteString(fmt.Sprintf("Style: %v\n", baseItinerary["style"]))
	sb.WriteString(fmt.Sprintf("Duration: %v\n", baseItinerary["duration"]))
	sb.WriteString(fmt.Sprintf("Description: %v\n", baseItinerary["description"]))
	sb.WriteString("\nOriginal Highlights:\n")

	if highlights, ok := baseItinerary["highlights"].([]interface{}); ok {
		for i, h := range highlights {
			sb.WriteString(fmt.Sprintf("%d. %v\n", i+1, h))
		}
	}
	sb.WriteString("\n")

	// ==========================================
	// SECTION 2: WEATHER FORECAST
	// ==========================================

	sb.WriteString("=== WEATHER FORECAST ===\n")
	sb.WriteString(fmt.Sprintf("Location: %s\n\n", forecast.City))

	// Track weather patterns
	rainyDays := []int{}
	snowyDays := []int{}
	hotDays := []int{}
	coldDays := []int{}
	goodDays := []int{}

	for i, day := range forecast.Forecasts {
		if i >= 7 { // Limit to 7 days
			break
		}

		sb.WriteString(fmt.Sprintf("Day %d (%s): %s, %.0f-%.0f°C - %s\n",
			i+1, day.Date, day.Condition, day.TempMin, day.TempMax, day.Description))

		// Categorize days
		if day.Condition == "Rain" || day.Condition == "Drizzle" || day.Condition == "Thunderstorm" {
			rainyDays = append(rainyDays, i+1)
		} else if day.Condition == "Snow" {
			snowyDays = append(snowyDays, i+1)
		} else if day.TempMax > 35 {
			hotDays = append(hotDays, i+1)
		} else if day.TempMax < 10 {
			coldDays = append(coldDays, i+1)
		} else {
			goodDays = append(goodDays, i+1)
		}
	}
	sb.WriteString("\n")

	// ==========================================
	// SECTION 3: WEATHER ANALYSIS
	// ==========================================

	sb.WriteString("=== WEATHER PATTERNS ===\n")
	if len(rainyDays) > 0 {
		sb.WriteString(fmt.Sprintf("🌧️ Rainy days: %v - Schedule INDOOR activities\n", rainyDays))
	}
	if len(snowyDays) > 0 {
		sb.WriteString(fmt.Sprintf("❄️ Snowy days: %v - Indoor/covered activities recommended\n", snowyDays))
	}
	if len(hotDays) > 0 {
		sb.WriteString(fmt.Sprintf("🌡️ Hot days: %v - Early morning/evening outdoor only\n", hotDays))
	}
	if len(coldDays) > 0 {
		sb.WriteString(fmt.Sprintf("🧥 Cold days: %v - Warm clothing, prefer indoor\n", coldDays))
	}
	if len(goodDays) > 0 {
		sb.WriteString(fmt.Sprintf("☀️ Good weather days: %v - Perfect for outdoor\n", goodDays))
	}
	sb.WriteString("\n")

	// ==========================================
	// SECTION 4: ADAPTATION RULES
	// ==========================================

	sb.WriteString("=== ADAPTATION RULES ===\n\n")

	sb.WriteString("FOR RAINY/SNOWY DAYS, suggest INDOOR activities:\n")
	sb.WriteString("✓ Museums (Lok Virsa, Lahore Museum, Hunza Museum)\n")
	sb.WriteString("✓ Forts with covered areas (Baltit Fort, Lahore Fort, Altit Fort)\n")
	sb.WriteString("✓ Shopping malls and covered bazaars\n")
	sb.WriteString("✓ Traditional cafes and restaurants\n")
	sb.WriteString("✓ Cultural centers and galleries\n\n")

	sb.WriteString("FOR GOOD WEATHER DAYS, suggest OUTDOOR activities:\n")
	sb.WriteString("✓ Hiking and trekking\n")
	sb.WriteString("✓ Lakes and viewpoints (Attabad Lake, Saif-ul-Malook)\n")
	sb.WriteString("✓ Gardens and parks\n")
	sb.WriteString("✓ Outdoor sightseeing\n")
	sb.WriteString("✓ Photography tours\n\n")

	sb.WriteString("FOR HOT DAYS (>35°C):\n")
	sb.WriteString("✓ Early morning (6-10 AM) outdoor activities\n")
	sb.WriteString("✓ Midday (11 AM-4 PM) indoor/water activities\n")
	sb.WriteString("✓ Evening (5-8 PM) outdoor activities\n\n")

	sb.WriteString("KEEP UNCHANGED:\n")
	sb.WriteString("✓ Overall destination and theme\n")
	sb.WriteString("✓ Budget level\n")
	sb.WriteString("✓ Travel style\n")
	sb.WriteString("✓ Trip duration\n\n")

	// ==========================================
	// SECTION 5: OUTPUT FORMAT
	// ==========================================

	sb.WriteString("=== OUTPUT FORMAT ===\n")
	sb.WriteString("Respond with VALID JSON ONLY (no markdown, no preamble):\n\n")
	sb.WriteString(`{
  "original_title": "Copy original title",
  "adapted_title": "Weather-Smart [original title]",
  "city": "City name",
  "budget": "Budget tier",
  "style": "Travel style",
  "duration": "X days",
  "description": "Brief description mentioning weather adaptation",
  "adapted_highlights": [
    "Day 1 (Clear, 25°C): Outdoor activity - Specific location (Perfect weather)",
    "Day 2 (Rain, 20°C): Indoor activity - Museum/Fort name (Stay dry)",
    "Day 3 (Clear, 27°C): Another outdoor - Specific place (Great conditions)"
  ],
  "weather_reasoning": "Explain how you rearranged activities based on forecast",
  "day_wise_weather": [
    {"day": 1, "condition": "Clear", "activity_type": "outdoor"},
    {"day": 2, "condition": "Rain", "activity_type": "indoor"},
    {"day": 3, "condition": "Clear", "activity_type": "outdoor"}
  ]
}`)

	return sb.String()
}
