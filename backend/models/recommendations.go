// package models

// import (
// 	"database/sql"
// 	"encoding/json"
// 	"errors"
// 	"time"

// 	"travel_mate/backend/database"
// )

// // User's preference input from the form
// type UserRecommendationInput struct {
// 	PreferredCities []string `json:"preferred_cities"` // User selects cities
// 	PreferredBudget string   `json:"preferred_budget"` // Budget-friendly, Mid-range, Luxury
// 	PreferredStyle  string   `json:"preferred_style"`  // Adventure, Cultural, Comfort
// 	TripDuration    string   `json:"trip_duration"`    // "3-5 days", "5-7 days", etc.
// 	Interests       []string `json:"interests"`        // Optional: ["hiking", "food", etc.]
// }

// // Analysis of user's created itineraries
// type UserItineraryAnalysis struct {
// 	TotalItineraries int                `json:"total_itineraries"`
// 	CitiesVisited    map[string]int     `json:"cities_visited"`   // city -> count
// 	BudgetBreakdown  map[string]int     `json:"budget_breakdown"` // budget -> count
// 	StyleBreakdown   map[string]int     `json:"style_breakdown"`  // style -> count
// 	RecentTrips      []ItinerarySummary `json:"recent_trips"`
// }

// type ItinerarySummary struct {
// 	Id          int    `json:"id"`
// 	Title       string `json:"title"`
// 	City        string `json:"city"`
// 	Budget      string `json:"budget"`
// 	Style       string `json:"style"`
// 	DayCount    int    `json:"day_count"`
// 	Description string `json:"description"`
// }

// // ===== Analyze User's Created Itineraries =====

// func GetUserItineraryAnalysis(userId int) (UserItineraryAnalysis, error) {
// 	var analysis UserItineraryAnalysis
// 	analysis.CitiesVisited = make(map[string]int)
// 	analysis.BudgetBreakdown = make(map[string]int)
// 	analysis.StyleBreakdown = make(map[string]int)

// 	// Get all user's itineraries
// 	rows, err := database.DB.Query(`
// 		SELECT id, title, city, COALESCE(budget,''), COALESCE(style,''), description
// 		FROM itineraries
// 		WHERE user_id=$1
// 		ORDER BY created_at DESC
// 	`, userId)
// 	if err != nil {
// 		return analysis, err
// 	}
// 	defer rows.Close()

// 	recentTrips := []ItinerarySummary{}
// 	totalCount := 0

// 	for rows.Next() {
// 		var it ItinerarySummary
// 		rows.Scan(&it.Id, &it.Title, &it.City, &it.Budget, &it.Style, &it.Description)

// 		// Count days
// 		database.DB.QueryRow(`SELECT COUNT(*) FROM itinerary_days WHERE itinerary_id=$1`, it.Id).Scan(&it.DayCount)

// 		// Add to recent trips (limit 5)
// 		if len(recentTrips) < 5 {
// 			recentTrips = append(recentTrips, it)
// 		}

// 		// Update statistics
// 		analysis.CitiesVisited[it.City]++
// 		if it.Budget != "" {
// 			analysis.BudgetBreakdown[it.Budget]++
// 		}
// 		if it.Style != "" {
// 			analysis.StyleBreakdown[it.Style]++
// 		}
// 		totalCount++
// 	}

// 	analysis.TotalItineraries = totalCount
// 	analysis.RecentTrips = recentTrips

// 	return analysis, nil
// }

// // ===== Cache AI Recommendations =====

// type CachedRecommendation struct {
// 	Id              int             `json:"id"`
// 	UserId          int             `json:"user_id"`
// 	Recommendations json.RawMessage `json:"recommendations"`
// 	BasedOnData     json.RawMessage `json:"based_on_data"`
// 	CreatedAt       time.Time       `json:"created_at"`
// 	ExpiresAt       time.Time       `json:"expires_at"`
// }

// func SaveAIRecommendations(userId int, recommendations, basedOn interface{}, ttlHours int) error {
// 	recsJSON, _ := json.Marshal(recommendations)
// 	basedJSON, _ := json.Marshal(basedOn)
// 	expiresAt := time.Now().Add(time.Duration(ttlHours) * time.Hour)

// 	_, err := database.DB.Exec(`
// 		INSERT INTO ai_recommendations (user_id, recommendations, based_on_data, expires_at)
// 		VALUES ($1, $2, $3, $4)
// 	`, userId, recsJSON, basedJSON, expiresAt)
// 	return err
// }

// func GetCachedAIRecommendations(userId int) (json.RawMessage, json.RawMessage, bool, error) {
// 	var recs, basedOn json.RawMessage
// 	var expiresAt time.Time

// 	err := database.DB.QueryRow(`
// 		SELECT recommendations, based_on_data, expires_at
// 		FROM ai_recommendations
// 		WHERE user_id=$1
// 		ORDER BY created_at DESC
// 		LIMIT 1
// 	`, userId).Scan(&recs, &basedOn, &expiresAt)

// 	if err != nil {
// 		if errors.Is(err, sql.ErrNoRows) {
// 			return nil, nil, false, nil
// 		}
// 		return nil, nil, false, err
// 	}

// 	// Check if expired
// 	if time.Now().After(expiresAt) {
// 		return nil, nil, false, nil
// 	}

// 	return recs, basedOn, true, nil
// }

// func ClearUserRecommendations(userId int) error {
// 	_, err := database.DB.Exec(`DELETE FROM ai_recommendations WHERE user_id=$1`, userId)
// 	return err
// }

package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"travel_mate/backend/database"
)

// ==========================================
// ✅ NEW: Weather Preferences (FE-2 & FE-3)
// ==========================================
type WeatherPreferences struct {
	IndoorOnly          bool   `json:"indoor_only"`
	AvoidRain           bool   `json:"avoid_rain"`
	AvoidHighWind       bool   `json:"avoid_high_wind"`      // ✅ FE-2
	PreferredConditions string `json:"preferred_conditions"` // ✅ FE-3: "any", "clear", "cloudy", "cool"
}

// User's preference input from the form
type UserRecommendationInput struct {
	PreferredCities    []string            `json:"preferred_cities"`    // User selects cities
	PreferredBudget    string              `json:"preferred_budget"`    // Budget-friendly, Mid-range, Luxury
	PreferredStyle     string              `json:"preferred_style"`     // Adventure, Cultural, Comfort
	TripDuration       string              `json:"trip_duration"`       // "3-5 days", "5 days", etc.
	Interests          []string            `json:"interests"`           // Optional: ["hiking", "food", etc.]
	WeatherPreferences *WeatherPreferences `json:"weather_preferences"` // ✅ NEW
}

// Analysis of user's created itineraries
type UserItineraryAnalysis struct {
	TotalItineraries int                `json:"total_itineraries"`
	CitiesVisited    map[string]int     `json:"cities_visited"`   // city -> count
	BudgetBreakdown  map[string]int     `json:"budget_breakdown"` // budget -> count
	StyleBreakdown   map[string]int     `json:"style_breakdown"`  // style -> count
	RecentTrips      []ItinerarySummary `json:"recent_trips"`
}

type ItinerarySummary struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	City        string `json:"city"`
	Budget      string `json:"budget"`
	Style       string `json:"style"`
	DayCount    int    `json:"day_count"`
	Description string `json:"description"`
}

// ===== Analyze User's Created Itineraries =====

func GetUserItineraryAnalysis(userId int) (UserItineraryAnalysis, error) {
	var analysis UserItineraryAnalysis
	analysis.CitiesVisited = make(map[string]int)
	analysis.BudgetBreakdown = make(map[string]int)
	analysis.StyleBreakdown = make(map[string]int)

	// Get all user's itineraries
	rows, err := database.DB.Query(`
		SELECT id, title, city, COALESCE(budget,''), COALESCE(style,''), description
		FROM itineraries 
		WHERE user_id=$1 
		ORDER BY created_at DESC
	`, userId)
	if err != nil {
		return analysis, err
	}
	defer rows.Close()

	recentTrips := []ItinerarySummary{}
	totalCount := 0

	for rows.Next() {
		var it ItinerarySummary
		rows.Scan(&it.Id, &it.Title, &it.City, &it.Budget, &it.Style, &it.Description)

		// Count days
		database.DB.QueryRow(`SELECT COUNT(*) FROM itinerary_days WHERE itinerary_id=$1`, it.Id).Scan(&it.DayCount)

		// Add to recent trips (limit 5)
		if len(recentTrips) < 5 {
			recentTrips = append(recentTrips, it)
		}

		// Update statistics
		analysis.CitiesVisited[it.City]++
		if it.Budget != "" {
			analysis.BudgetBreakdown[it.Budget]++
		}
		if it.Style != "" {
			analysis.StyleBreakdown[it.Style]++
		}
		totalCount++
	}

	analysis.TotalItineraries = totalCount
	analysis.RecentTrips = recentTrips

	return analysis, nil
}

// ===== Cache AI Recommendations =====

type CachedRecommendation struct {
	Id              int             `json:"id"`
	UserId          int             `json:"user_id"`
	Recommendations json.RawMessage `json:"recommendations"`
	BasedOnData     json.RawMessage `json:"based_on_data"`
	CreatedAt       time.Time       `json:"created_at"`
	ExpiresAt       time.Time       `json:"expires_at"`
}

func SaveAIRecommendations(userId int, recommendations, basedOn interface{}, ttlHours int) error {
	recsJSON, _ := json.Marshal(recommendations)
	basedJSON, _ := json.Marshal(basedOn)
	expiresAt := time.Now().Add(time.Duration(ttlHours) * time.Hour)

	_, err := database.DB.Exec(`
		INSERT INTO ai_recommendations (user_id, recommendations, based_on_data, expires_at)
		VALUES ($1, $2, $3, $4)
	`, userId, recsJSON, basedJSON, expiresAt)
	return err
}

func GetCachedAIRecommendations(userId int) (json.RawMessage, json.RawMessage, bool, error) {
	var recs, basedOn json.RawMessage
	var expiresAt time.Time

	err := database.DB.QueryRow(`
		SELECT recommendations, based_on_data, expires_at
		FROM ai_recommendations
		WHERE user_id=$1
		ORDER BY created_at DESC
		LIMIT 1
	`, userId).Scan(&recs, &basedOn, &expiresAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, false, nil
		}
		return nil, nil, false, err
	}

	// Check if expired
	if time.Now().After(expiresAt) {
		return nil, nil, false, nil
	}

	return recs, basedOn, true, nil
}

func ClearUserRecommendations(userId int) error {
	_, err := database.DB.Exec(`DELETE FROM ai_recommendations WHERE user_id=$1`, userId)
	return err
}
