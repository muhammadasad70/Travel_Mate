// package controllers

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"net/url"
// 	"os"
// 	"time"

// 	"github.com/gin-gonic/gin"
// )

// // PredicthqEvent represents an event from Predicthq API
// type PredicthqEvent struct {
// 	ID          string    `json:"id"`
// 	Title       string    `json:"title"`
// 	Description string    `json:"description"`
// 	Category    string    `json:"category"`
// 	Start       time.Time `json:"start"`
// 	End         time.Time `json:"end"`
// 	Location    []float64 `json:"location"` // [lng, lat]
// 	Labels      []string  `json:"labels"`
// 	Country     string    `json:"country"`
// 	Entities    []struct {
// 		EntityID         string `json:"entity_id"`
// 		Name             string `json:"name"`
// 		Type             string `json:"type"`
// 		FormattedAddress string `json:"formatted_address"`
// 	} `json:"entities"`
// 	Rank            int      `json:"rank"`
// 	PHQAttendance   int      `json:"phq_attendance"`
// 	AlternateTitles []string `json:"alternate_titles"`
// 	Geo             struct {
// 		Address struct {
// 			Locality         string `json:"locality"`
// 			Region           string `json:"region"`
// 			PostCode         string `json:"postcode"`
// 			CountryCode      string `json:"country_code"`
// 			FormattedAddress string `json:"formatted_address"`
// 		} `json:"address"`
// 	} `json:"geo"`
// }

// type PredicthqResponse struct {
// 	Count   int              `json:"count"`
// 	Results []PredicthqEvent `json:"results"`
// }

// // GetLiveEvents fetches events from Predicthq API
// func GetLiveEvents(c *gin.Context) {
// 	apiKey := os.Getenv("PREDICTHQ_API_KEY")
// 	if apiKey == "" {
// 		c.JSON(http.StatusServiceUnavailable, gin.H{
// 			"error":   "Live events service not configured",
// 			"message": "PREDICTHQ_API_KEY environment variable not set",
// 		})
// 		return
// 	}

// 	// Parse query parameters
// 	city := c.Query("city")
// 	category := c.Query("category")
// 	dateFrom := c.Query("date_from")
// 	dateTo := c.Query("date_to")
// 	search := c.Query("q")

// 	// Build Predicthq API URL
// 	baseURL := "https://api.predicthq.com/v1/events/"
// 	params := url.Values{}

// 	// Location mapping for Pakistani cities
// 	cityCoords := getCityCoordinates()

// 	// Set location
// 	params.Add("country", "PK")
// 	if city != "" && city != "All" {
// 		if coords, ok := cityCoords[city]; ok {
// 			params.Add("location_around.origin", coords)
// 			params.Add("location_around.offset", "50km")
// 			params.Add("location_around.scale", "10km")
// 		} else {
// 			// Default to Pakistan if city not found
// 			params.Add("country", "PK")
// 		}
// 	} else {
// 		// Show all Pakistan events
// 		params.Add("country", "PK")
// 	}

// 	// Date range
// 	if dateFrom != "" {
// 		params.Add("active.gte", dateFrom)
// 	} else {
// 		// Default to today onwards
// 		params.Add("active.gte", time.Now().Format("2006-01-02"))
// 	}

// 	if dateTo != "" {
// 		params.Add("active.lte", dateTo)
// 	}

// 	// Search query
// 	if search != "" {
// 		params.Add("q", search)
// 	}

// 	// Category mapping
// 	if category != "" && category != "All" {
// 		predicthqCategory := mapCategoryToPredicthq(category)
// 		if predicthqCategory != "" {
// 			params.Add("category", predicthqCategory)
// 		}
// 	}

// 	// Pagination and sorting
// 	params.Add("limit", "50")
// 	params.Add("sort", "rank")

// 	// Make API request
// 	fullURL := baseURL + "?" + params.Encode()
// 	fmt.Printf("🌐 Predicthq API Request: %s\n", fullURL)

// 	req, err := http.NewRequest("GET", fullURL, nil)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
// 		return
// 	}

// 	req.Header.Set("Authorization", "Bearer "+apiKey)
// 	req.Header.Set("Accept", "application/json")

// 	client := &http.Client{Timeout: 15 * time.Second}
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		fmt.Printf("❌ Predicthq API Error: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error":   "Failed to connect to Predicthq API",
// 			"details": err.Error(),
// 		})
// 		return
// 	}
// 	defer resp.Body.Close()

// 	body, _ := io.ReadAll(resp.Body)

// 	if resp.StatusCode != 200 {
// 		fmt.Printf("❌ Predicthq API Status %d: %s\n", resp.StatusCode, string(body))
// 		c.JSON(resp.StatusCode, gin.H{
// 			"error":   "Predicthq API error",
// 			"status":  resp.StatusCode,
// 			"details": string(body),
// 		})
// 		return
// 	}

// 	// Parse response
// 	var predicthqResp PredicthqResponse
// 	if err := json.Unmarshal(body, &predicthqResp); err != nil {
// 		fmt.Printf("❌ Failed to parse response: %v\n", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"error":   "Failed to parse API response",
// 			"details": err.Error(),
// 		})
// 		return
// 	}

// 	fmt.Printf("✅ Predicthq returned %d events (total: %d)\n", len(predicthqResp.Results), predicthqResp.Count)

// 	// Transform to your Event format
// 	events := []map[string]interface{}{}
// 	for _, pe := range predicthqResp.Results {
// 		event := map[string]interface{}{
// 			"id":          pe.ID,
// 			"source":      "predicthq",
// 			"external_id": pe.ID,
// 			"title":       pe.Title,
// 			"category":    formatCategory(pe.Category),
// 			"start":       pe.Start,
// 			"end":         pe.End,
// 			"url":         fmt.Sprintf("https://www.predicthq.com/events/%s", pe.ID),
// 		}

// 		// Description
// 		if pe.Description != "" {
// 			event["description"] = pe.Description
// 		}

// 		// Location data
// 		if len(pe.Location) >= 2 {
// 			event["lat"] = pe.Location[1]
// 			event["lng"] = pe.Location[0]
// 		}

// 		// Extract venue from entities
// 		for _, entity := range pe.Entities {
// 			if entity.Type == "venue" {
// 				event["venue_name"] = entity.Name
// 				if entity.FormattedAddress != "" {
// 					event["venue_address"] = entity.FormattedAddress
// 				}
// 			}
// 		}

// 		// Set city from geo data or query
// 		if pe.Geo.Address.Locality != "" {
// 			event["city"] = pe.Geo.Address.Locality
// 		} else if city != "" && city != "All" {
// 			event["city"] = city
// 		}

// 		// Attendance as "price" info
// 		if pe.PHQAttendance > 0 {
// 			event["price"] = fmt.Sprintf("Expected attendance: %d", pe.PHQAttendance)
// 		} else {
// 			event["price"] = "Check event page"
// 		}

// 		// Image placeholder (Predicthq doesn't provide images)
// 		event["image_url"] = nil

// 		events = append(events, event)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"items":  events,
// 		"total":  predicthqResp.Count,
// 		"source": "predicthq",
// 		"live":   true,
// 	})
// }

// // Helper: Get city coordinates
// func getCityCoordinates() map[string]string {
// 	return map[string]string{
// 		"Islamabad":    "33.6844,73.0479",
// 		"Karachi":      "24.8607,67.0011",
// 		"Lahore":       "31.5204,74.3587",
// 		"Multan":       "30.1575,71.5249",
// 		"Hunza Valley": "36.3167,74.6500",
// 		"Swat Valley":  "35.2227,72.4258",
// 		"Murree":       "33.9070,73.3943",
// 		"Muzaffarabad": "34.3700,73.4711",
// 		"Faisalabad":   "31.4504,73.1350",
// 		"Rawalpindi":   "33.5651,73.0169",
// 		"Peshawar":     "34.0151,71.5249",
// 		"Quetta":       "30.1798,66.9750",
// 		"Sialkot":      "32.4945,74.5229",
// 		"Gujranwala":   "32.1617,74.1883",
// 		"Skardu":       "35.2977,75.6339",
// 		"Gilgit":       "35.9208,74.3144",
// 	}
// }

// // Helper: Map your categories to Predicthq categories
// func mapCategoryToPredicthq(category string) string {
// 	mapping := map[string]string{
// 		"Music":         "concerts",
// 		"Sports":        "sports",
// 		"Festival":      "festivals",
// 		"Conference":    "conferences",
// 		"Community":     "community",
// 		"Arts":          "performing-arts",
// 		"Food":          "festivals",
// 		"Technology":    "conferences",
// 		"Cultural":      "festivals",
// 		"Entertainment": "concerts",
// 		"Exhibition":    "expos",
// 	}

// 	if mapped, ok := mapping[category]; ok {
// 		return mapped
// 	}
// 	return ""
// }

// // Helper: Format category for display
// func formatCategory(category string) string {
// 	formatted := map[string]string{
// 		"concerts":        "Music",
// 		"sports":          "Sports",
// 		"festivals":       "Festival",
// 		"conferences":     "Conference",
// 		"community":       "Community",
// 		"performing-arts": "Arts",
// 		"expos":           "Exhibition",
// 		"public-holidays": "Holiday",
// 	}

// 	if f, ok := formatted[category]; ok {
// 		return f
// 	}

// 	// Capitalize first letter
// 	if len(category) > 0 {
// 		return string(category[0]-32) + category[1:]
// 	}
// 	return category
// }

package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// PredicthqEvent represents an event from Predicthq API
type PredicthqEvent struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Start       time.Time `json:"start"`
	End         time.Time `json:"end"`
	Location    []float64 `json:"location"` // [lng, lat]
	Labels      []string  `json:"labels"`
	Country     string    `json:"country"`
	Entities    []struct {
		EntityID         string `json:"entity_id"`
		Name             string `json:"name"`
		Type             string `json:"type"`
		FormattedAddress string `json:"formatted_address"`
	} `json:"entities"`
	Rank            int      `json:"rank"`
	PHQAttendance   int      `json:"phq_attendance"`
	AlternateTitles []string `json:"alternate_titles"`
	Geo             struct {
		Address struct {
			Locality         string `json:"locality"`
			Region           string `json:"region"`
			PostCode         string `json:"postcode"`
			CountryCode      string `json:"country_code"`
			FormattedAddress string `json:"formatted_address"`
		} `json:"address"`
	} `json:"geo"`
}

type PredicthqResponse struct {
	Count   int              `json:"count"`
	Results []PredicthqEvent `json:"results"`
}

// GetLiveEvents fetches events from Predicthq API
func GetLiveEvents(c *gin.Context) {
	apiKey := os.Getenv("PREDICTHQ_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":   "Live events service not configured",
			"message": "PREDICTHQ_API_KEY environment variable not set",
		})
		return
	}

	// Parse query parameters
	city := c.Query("city")
	category := c.Query("category")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")
	search := c.Query("q")

	// Build Predicthq API URL
	baseURL := "https://api.predicthq.com/v1/events/"
	params := url.Values{}

	// ✅ ALWAYS filter by Pakistan first
	params.Add("country", "PK")

	// Location mapping for Pakistani cities
	cityCoords := getCityCoordinates()

	// Add city-specific location filtering if provided
	if city != "" && city != "All" {
		if coords, ok := cityCoords[city]; ok {
			params.Add("location_around.origin", coords)
			params.Add("location_around.offset", "50km")
			// ✅ Removed location_around.scale to get more local results
		}
	}

	// Date range
	if dateFrom != "" {
		params.Add("active.gte", dateFrom)
	} else {
		// Default to today onwards
		params.Add("active.gte", time.Now().Format("2006-01-02"))
	}

	if dateTo != "" {
		params.Add("active.lte", dateTo)
	}

	// Search query
	if search != "" {
		params.Add("q", search)
	}

	// Category mapping
	if category != "" && category != "All" {
		predicthqCategory := mapCategoryToPredicthq(category)
		if predicthqCategory != "" {
			params.Add("category", predicthqCategory)
		}
	}

	// Pagination and sorting
	params.Add("limit", "50")
	params.Add("sort", "start") // ✅ Sort by start date instead of rank

	// Make API request
	fullURL := baseURL + "?" + params.Encode()
	fmt.Printf("🌐 Predicthq API Request: %s\n", fullURL)

	req, err := http.NewRequest("GET", fullURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("❌ Predicthq API Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to connect to Predicthq API",
			"details": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		fmt.Printf("❌ Predicthq API Status %d: %s\n", resp.StatusCode, string(body))
		c.JSON(resp.StatusCode, gin.H{
			"error":   "Predicthq API error",
			"status":  resp.StatusCode,
			"details": string(body),
		})
		return
	}

	// Parse response
	var predicthqResp PredicthqResponse
	if err := json.Unmarshal(body, &predicthqResp); err != nil {
		fmt.Printf("❌ Failed to parse response: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse API response",
			"details": err.Error(),
		})
		return
	}

	fmt.Printf("✅ Predicthq returned %d events (total: %d)\n", len(predicthqResp.Results), predicthqResp.Count)

	// Transform to your Event format
	events := []map[string]interface{}{}
	for _, pe := range predicthqResp.Results {
		// ✅ Skip events not in Pakistan
		if pe.Country != "PK" && pe.Geo.Address.CountryCode != "PK" {
			continue
		}

		event := map[string]interface{}{
			"id":          pe.ID,
			"source":      "predicthq",
			"external_id": pe.ID,
			"title":       pe.Title,
			"category":    formatCategory(pe.Category),
			"start":       pe.Start,
			"end":         pe.End,
			"url":         fmt.Sprintf("https://www.predicthq.com/events/%s", pe.ID),
		}

		// Description
		if pe.Description != "" {
			event["description"] = pe.Description
		}

		// Location data
		if len(pe.Location) >= 2 {
			event["lat"] = pe.Location[1]
			event["lng"] = pe.Location[0]
		}

		// Extract venue from entities
		for _, entity := range pe.Entities {
			if entity.Type == "venue" {
				event["venue_name"] = entity.Name
				if entity.FormattedAddress != "" {
					event["venue_address"] = entity.FormattedAddress
				}
			}
		}

		// Set city from geo data or query
		eventCity := ""
		if pe.Geo.Address.Locality != "" {
			eventCity = pe.Geo.Address.Locality
			event["city"] = eventCity
		} else if city != "" && city != "All" {
			eventCity = city
			event["city"] = city
		} else {
			// Default city based on region
			if pe.Geo.Address.Region != "" {
				eventCity = pe.Geo.Address.Region
				event["city"] = pe.Geo.Address.Region
			} else {
				eventCity = "Pakistan"
				event["city"] = "Pakistan"
			}
		}

		// ✅ Filter by city name if specified (post-processing filter)
		if city != "" && city != "All" {
			// Check if event city matches requested city (case-insensitive)
			if !strings.EqualFold(eventCity, city) && eventCity != "Pakistan" {
				// Skip events from other cities
				continue
			}
		}

		// Attendance as "price" info
		if pe.PHQAttendance > 0 {
			event["price"] = fmt.Sprintf("Expected attendance: %d", pe.PHQAttendance)
		} else {
			event["price"] = "Check event page"
		}

		// Image placeholder (Predicthq doesn't provide images)
		event["image_url"] = nil

		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"items":  events,
		"total":  len(events), // ✅ Use filtered count, not API total
		"source": "predicthq",
		"live":   true,
	})
}

// Helper: Get city coordinates
func getCityCoordinates() map[string]string {
	return map[string]string{
		"Islamabad":    "33.6844,73.0479",
		"Karachi":      "24.8607,67.0011",
		"Lahore":       "31.5204,74.3587",
		"Multan":       "30.1575,71.5249",
		"Hunza Valley": "36.3167,74.6500",
		"Swat Valley":  "35.2227,72.4258",
		"Murree":       "33.9070,73.3943",
		"Muzaffarabad": "34.3700,73.4711",
		"Faisalabad":   "31.4504,73.1350",
		"Rawalpindi":   "33.5651,73.0169",
		"Peshawar":     "34.0151,71.5249",
		"Quetta":       "30.1798,66.9750",
		"Sialkot":      "32.4945,74.5229",
		"Gujranwala":   "32.1617,74.1883",
		"Skardu":       "35.2977,75.6339",
		"Gilgit":       "35.9208,74.3144",
		"Abbottabad":   "34.1495,73.2100",
		"Naran":        "34.9000,73.6500",
		"Chitral":      "35.8513,71.7865",
		"Dir":          "35.2000,71.8784",
		"Kumrat":       "35.5851,72.0993",
		"Haveli":       "33.8333,73.7333",
		"Nagar Valley": "36.1833,74.6833",
		"Nagarparkar":  "24.3592,71.7413",
		"Rawalakot":    "33.8576,73.7598",
		"Bagh":         "33.9800,73.7700",
		"Kotli":        "33.5181,73.9021",
		"Galiyat":      "34.0700,73.3900",
	}
}

// Helper: Map your categories to Predicthq categories
func mapCategoryToPredicthq(category string) string {
	mapping := map[string]string{
		"Music":         "concerts",
		"Sports":        "sports",
		"Festival":      "festivals",
		"Conference":    "conferences",
		"Community":     "community",
		"Arts":          "performing-arts",
		"Food":          "festivals",
		"Technology":    "conferences",
		"Cultural":      "festivals",
		"Entertainment": "concerts",
		"Exhibition":    "expos",
	}

	if mapped, ok := mapping[category]; ok {
		return mapped
	}
	return ""
}

// Helper: Format category for display
func formatCategory(category string) string {
	formatted := map[string]string{
		"concerts":        "Music",
		"sports":          "Sports",
		"festivals":       "Festival",
		"conferences":     "Conference",
		"community":       "Community",
		"performing-arts": "Arts",
		"expos":           "Exhibition",
		"public-holidays": "Holiday",
		"school-holidays": "School Holiday",
	}

	if f, ok := formatted[category]; ok {
		return f
	}

	// Capitalize first letter if single word
	if len(category) > 0 && category[0] >= 'a' && category[0] <= 'z' {
		return string(category[0]-32) + category[1:]
	}
	return category
}
