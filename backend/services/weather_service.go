// package services

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"net/http"
// 	"os"
// 	"time"
// )

// // ==========================================
// // DATA STRUCTURES
// // ==========================================

// type WeatherData struct {
// 	City        string    `json:"city"`
// 	Temperature float64   `json:"temperature"`
// 	Condition   string    `json:"condition"`   // "Clear", "Rain", "Snow"
// 	Description string    `json:"description"` // "light rain"
// 	Humidity    int       `json:"humidity"`
// 	WindSpeed   float64   `json:"wind_speed"`
// 	Icon        string    `json:"icon"` // "01d" for sunny
// 	FetchedAt   time.Time `json:"fetched_at"`
// 	IsOutdoorOK bool      `json:"is_outdoor_ok"`
// }

// type WeatherForecast struct {
// 	City      string          `json:"city"`
// 	Forecasts []DailyForecast `json:"forecasts"`
// }

// type DailyForecast struct {
// 	Date        string  `json:"date"`        // "2025-01-15"
// 	TempMin     float64 `json:"temp_min"`    // Minimum temperature
// 	TempMax     float64 `json:"temp_max"`    // Maximum temperature
// 	Condition   string  `json:"condition"`   // "Clear", "Rain", "Snow"
// 	Description string  `json:"description"` // "light rain"
// 	Icon        string  `json:"icon"`        // "10d" for rain
// }

// // ==========================================
// // MAIN FUNCTION: GET WEATHER FORECAST
// // ==========================================

// // GetWeatherForecast fetches 5-7 day forecast from OpenWeather API
// func GetWeatherForecast(city string) (*WeatherForecast, error) {
// 	// Get API key from environment
// 	apiKey := os.Getenv("OPENWEATHER_API_KEY")
// 	if apiKey == "" {
// 		return nil, fmt.Errorf("OPENWEATHER_API_KEY not configured in .env file")
// 	}

// 	// Build API URL
// 	// cnt=40 means 40 data points (5 days × 8 intervals per day)
// 	// units=metric for Celsius
// 	// ,PK ensures we search in Pakistan
// 	url := fmt.Sprintf(
// 		"https://api.openweathermap.org/data/2.5/forecast?q=%s,PK&appid=%s&units=metric&cnt=40",
// 		city, apiKey,
// 	)

// 	// Make HTTP request
// 	resp, err := http.Get(url)
// 	if err != nil {
// 		return nil, fmt.Errorf("weather API request failed: %v", err)
// 	}
// 	defer resp.Body.Close()

// 	// Check status code
// 	if resp.StatusCode != 200 {
// 		body, _ := io.ReadAll(resp.Body)
// 		return nil, fmt.Errorf("weather API error (%d): %s", resp.StatusCode, string(body))
// 	}

// 	// Parse API response
// 	var apiResp struct {
// 		City struct {
// 			Name string `json:"name"`
// 		} `json:"city"`
// 		List []struct {
// 			Dt   int64 `json:"dt"` // Unix timestamp
// 			Main struct {
// 				TempMin float64 `json:"temp_min"`
// 				TempMax float64 `json:"temp_max"`
// 			} `json:"main"`
// 			Weather []struct {
// 				Main        string `json:"main"`        // "Clear", "Rain"
// 				Description string `json:"description"` // "light rain"
// 				Icon        string `json:"icon"`        // "10d"
// 			} `json:"weather"`
// 		} `json:"list"`
// 	}

// 	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
// 		return nil, fmt.Errorf("failed to parse weather API response: %v", err)
// 	}

// 	// ==========================================
// 	// GROUP BY DAY (API returns 3-hour intervals)
// 	// ==========================================

// 	// We'll aggregate 3-hour data into daily summaries
// 	dailyMap := make(map[string]*DailyForecast)

// 	for _, item := range apiResp.List {
// 		// Convert Unix timestamp to date string
// 		date := time.Unix(item.Dt, 0).Format("2006-01-02")

// 		if _, exists := dailyMap[date]; !exists {
// 			// First entry for this day
// 			dailyMap[date] = &DailyForecast{
// 				Date:    date,
// 				TempMin: item.Main.TempMin,
// 				TempMax: item.Main.TempMax,
// 			}
// 			if len(item.Weather) > 0 {
// 				dailyMap[date].Condition = item.Weather[0].Main
// 				dailyMap[date].Description = item.Weather[0].Description
// 				dailyMap[date].Icon = item.Weather[0].Icon
// 			}
// 		} else {
// 			// Update min/max for this day
// 			if item.Main.TempMin < dailyMap[date].TempMin {
// 				dailyMap[date].TempMin = item.Main.TempMin
// 			}
// 			if item.Main.TempMax > dailyMap[date].TempMax {
// 				dailyMap[date].TempMax = item.Main.TempMax
// 			}
// 		}
// 	}

// 	// Convert map to slice
// 	var forecasts []DailyForecast
// 	for _, forecast := range dailyMap {
// 		forecasts = append(forecasts, *forecast)
// 	}

// 	return &WeatherForecast{
// 		City:      apiResp.City.Name,
// 		Forecasts: forecasts,
// 	}, nil
// }

// // ==========================================
// // HELPER FUNCTION: GET CURRENT WEATHER
// // ==========================================

// // GetCurrentWeather fetches current weather (not used in recommendations, but useful)
// func GetCurrentWeather(city string) (*WeatherData, error) {
// 	apiKey := os.Getenv("OPENWEATHER_API_KEY")
// 	if apiKey == "" {
// 		return nil, fmt.Errorf("OPENWEATHER_API_KEY not configured")
// 	}

// 	url := fmt.Sprintf(
// 		"https://api.openweathermap.org/data/2.5/weather?q=%s,PK&appid=%s&units=metric",
// 		city, apiKey,
// 	)

// 	resp, err := http.Get(url)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resp.Body.Close()

// 	if resp.StatusCode != 200 {
// 		body, _ := io.ReadAll(resp.Body)
// 		return nil, fmt.Errorf("API error (%d): %s", resp.StatusCode, string(body))
// 	}

// 	var apiResp struct {
// 		Main struct {
// 			Temp     float64 `json:"temp"`
// 			Humidity int     `json:"humidity"`
// 		} `json:"main"`
// 		Weather []struct {
// 			Main        string `json:"main"`
// 			Description string `json:"description"`
// 			Icon        string `json:"icon"`
// 		} `json:"weather"`
// 		Wind struct {
// 			Speed float64 `json:"speed"`
// 		} `json:"wind"`
// 		Name string `json:"name"`
// 	}

// 	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
// 		return nil, err
// 	}

// 	weather := &WeatherData{
// 		City:        apiResp.Name,
// 		Temperature: apiResp.Main.Temp,
// 		Humidity:    apiResp.Main.Humidity,
// 		WindSpeed:   apiResp.Wind.Speed,
// 		FetchedAt:   time.Now(),
// 	}

// 	if len(apiResp.Weather) > 0 {
// 		weather.Condition = apiResp.Weather[0].Main
// 		weather.Description = apiResp.Weather[0].Description
// 		weather.Icon = apiResp.Weather[0].Icon
// 	}

// 	weather.IsOutdoorOK = isOutdoorFriendly(weather.Condition, weather.Temperature)

// 	return weather, nil
// }

// // ==========================================
// // HELPER: CHECK IF WEATHER IS OUTDOOR-FRIENDLY
// // ==========================================

// func isOutdoorFriendly(condition string, temp float64) bool {
// 	// Bad weather conditions
// 	badConditions := []string{"Rain", "Drizzle", "Thunderstorm", "Snow", "Mist", "Fog"}
// 	for _, bad := range badConditions {
// 		if condition == bad {
// 			return false
// 		}
// 	}

// 	// Too hot (>40°C) or too cold (<5°C)
// 	if temp > 40 || temp < 5 {
// 		return false
// 	}

// 	return true
// }

package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// ==========================================
// CITY NAME MAPPING FOR OPENWEATHER API
// ==========================================
// Maps travel destination names to OpenWeather-valid city names
func mapCityName(city string) string {
	cityMap := map[string]string{
		// Northern Areas - Gilgit-Baltistan
		"Hunza Valley": "Gilgit",
		"Nagar Valley": "Gilgit",
		"Skardu":       "Skardu",
		"Gilgit":       "Gilgit",

		// Valleys - Map to nearest town
		"Naran & Kaghan": "Naran",
		"Swat Valley":    "Mingora",
		"Neelum Valley":  "Muzaffarabad",
		"Kumrat":         "Dir",

		// Hill Stations
		"Galiyat":    "Murree",
		"Murree":     "Murree",
		"Abbottabad": "Abbottabad",

		// Kashmir (AJK)
		"Bagh":         "Bagh",
		"Haveli":       "Haveli",
		"Kotli":        "Kotli",
		"Rawalakot":    "Rawalakot",
		"Muzaffarabad": "Muzaffarabad",

		// Northern Pakistan
		"Chitral": "Chitral",
		"Dir":     "Dir",

		// Major Cities
		"Islamabad": "Islamabad",
		"Karachi":   "Karachi",
		"Lahore":    "Lahore",
		"Multan":    "Multan",

		// Thar Desert
		"Nagarparkar": "Mithi",
	}

	if mappedCity, exists := cityMap[city]; exists {
		log.Printf("🗺️  Mapped '%s' → '%s' for weather API", city, mappedCity)
		return mappedCity
	}

	log.Printf("🗺️  Using original city name: '%s'", city)
	return city
}

// ==========================================
// DATA STRUCTURES
// ==========================================

type WeatherData struct {
	City        string    `json:"city"`
	Temperature float64   `json:"temperature"`
	Condition   string    `json:"condition"`
	Description string    `json:"description"`
	Humidity    int       `json:"humidity"`
	WindSpeed   float64   `json:"wind_speed"`
	Icon        string    `json:"icon"`
	FetchedAt   time.Time `json:"fetched_at"`
	IsOutdoorOK bool      `json:"is_outdoor_ok"`
}

type WeatherForecast struct {
	City      string          `json:"city"`
	Forecasts []DailyForecast `json:"forecasts"`
}

type DailyForecast struct {
	Date        string  `json:"date"`
	TempMin     float64 `json:"temp_min"`
	TempMax     float64 `json:"temp_max"`
	Condition   string  `json:"condition"`
	Description string  `json:"description"`
	Icon        string  `json:"icon"`
}

// ==========================================
// GET WEATHER FORECAST
// ==========================================

func GetWeatherForecast(city string) (*WeatherForecast, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENWEATHER_API_KEY not configured in .env file")
	}

	// ✅ Map city name for API
	mappedCity := mapCityName(city)

	url := fmt.Sprintf(
		"https://api.openweathermap.org/data/2.5/forecast?q=%s,PK&appid=%s&units=metric&cnt=40",
		mappedCity, apiKey,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("weather API request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("weather API error (%d): %s", resp.StatusCode, string(body))
	}

	var apiResp struct {
		City struct {
			Name string `json:"name"`
		} `json:"city"`
		List []struct {
			Dt   int64 `json:"dt"`
			Main struct {
				TempMin float64 `json:"temp_min"`
				TempMax float64 `json:"temp_max"`
			} `json:"main"`
			Weather []struct {
				Main        string `json:"main"`
				Description string `json:"description"`
				Icon        string `json:"icon"`
			} `json:"weather"`
		} `json:"list"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed to parse weather API response: %v", err)
	}

	// Group by day
	dailyMap := make(map[string]*DailyForecast)

	for _, item := range apiResp.List {
		date := time.Unix(item.Dt, 0).Format("2006-01-02")

		if _, exists := dailyMap[date]; !exists {
			dailyMap[date] = &DailyForecast{
				Date:    date,
				TempMin: item.Main.TempMin,
				TempMax: item.Main.TempMax,
			}
			if len(item.Weather) > 0 {
				dailyMap[date].Condition = item.Weather[0].Main
				dailyMap[date].Description = item.Weather[0].Description
				dailyMap[date].Icon = item.Weather[0].Icon
			}
		} else {
			if item.Main.TempMin < dailyMap[date].TempMin {
				dailyMap[date].TempMin = item.Main.TempMin
			}
			if item.Main.TempMax > dailyMap[date].TempMax {
				dailyMap[date].TempMax = item.Main.TempMax
			}
		}
	}

	var forecasts []DailyForecast
	for _, forecast := range dailyMap {
		forecasts = append(forecasts, *forecast)
	}

	return &WeatherForecast{
		City:      city, // Return ORIGINAL city name for display
		Forecasts: forecasts,
	}, nil
}

// ==========================================
// GET CURRENT WEATHER
// ==========================================

func GetCurrentWeather(city string) (*WeatherData, error) {
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENWEATHER_API_KEY not configured")
	}

	// ✅ Map city name for API
	mappedCity := mapCityName(city)

	url := fmt.Sprintf(
		"https://api.openweathermap.org/data/2.5/weather?q=%s,PK&appid=%s&units=metric",
		mappedCity, apiKey,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (%d): %s", resp.StatusCode, string(body))
	}

	var apiResp struct {
		Main struct {
			Temp     float64 `json:"temp"`
			Humidity int     `json:"humidity"`
		} `json:"main"`
		Weather []struct {
			Main        string `json:"main"`
			Description string `json:"description"`
			Icon        string `json:"icon"`
		} `json:"weather"`
		Wind struct {
			Speed float64 `json:"speed"`
		} `json:"wind"`
		Name string `json:"name"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}

	weather := &WeatherData{
		City:        city, // Return ORIGINAL city name
		Temperature: apiResp.Main.Temp,
		Humidity:    apiResp.Main.Humidity,
		WindSpeed:   apiResp.Wind.Speed,
		FetchedAt:   time.Now(),
	}

	if len(apiResp.Weather) > 0 {
		weather.Condition = apiResp.Weather[0].Main
		weather.Description = apiResp.Weather[0].Description
		weather.Icon = apiResp.Weather[0].Icon
	}

	weather.IsOutdoorOK = isOutdoorFriendly(weather.Condition, weather.Temperature)

	return weather, nil
}

// ==========================================
// HELPER: CHECK OUTDOOR FRIENDLY
// ==========================================

func isOutdoorFriendly(condition string, temp float64) bool {
	badConditions := []string{"Rain", "Drizzle", "Thunderstorm", "Snow", "Mist", "Fog"}
	for _, bad := range badConditions {
		if condition == bad {
			return false
		}
	}
	if temp > 40 || temp < 5 {
		return false
	}
	return true
}
