package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRecommendationRoutes(router *gin.Engine) {
	rec := router.Group("/recommendations")
	rec.Use(middlewares.AuthMiddleware())
	{
		// Get user's itinerary analysis (for displaying before form)
		rec.GET("/analysis", controllers.GetUserAnalysis)

		// Generate recommendations based on user input
		rec.POST("/generate", controllers.GenerateRecommendations)

		// Get cached recommendations
		rec.GET("/cached", controllers.GetCachedRecommendations)
		// ✅ NEW: Save and get saved AI itineraries
		rec.POST("/save", controllers.SaveAIItinerary)
		rec.GET("/saved", controllers.GetSavedAIItineraries)
		rec.DELETE("/saved/:id", controllers.DeleteSavedAIItinerary)
	}
}
