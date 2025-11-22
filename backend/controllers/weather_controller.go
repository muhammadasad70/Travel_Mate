package controllers

import (
	"net/http"
	"travel_mate/backend/services"

	"github.com/gin-gonic/gin"
)

// ==========================================
// GET CURRENT WEATHER
// ==========================================

// GET /weather/current?city=Islamabad
func GetCityWeather(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city parameter required"})
		return
	}

	weather, err := services.GetCurrentWeather(city)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch weather",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"weather": weather,
		"source":  "OpenWeather API",
	})
}

// ==========================================
// GET WEATHER FORECAST
// ==========================================

// GET /weather/forecast?city=Hunza
func GetCityForecast(c *gin.Context) {
	city := c.Query("city")
	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "city parameter required"})
		return
	}

	forecast, err := services.GetWeatherForecast(city)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch forecast",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"forecast": forecast,
		"source":   "OpenWeather API",
		"days":     len(forecast.Forecasts),
	})
}
