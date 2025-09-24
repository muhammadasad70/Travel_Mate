// routes/itineraries.go
package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

// routes/itineraries.go
func RegisterItineraryRoutes(router *gin.Engine) {
	it := router.Group("/itineraries")
	it.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// accept both with and without trailing slash
		it.POST("", controllers.CreateItinerary)
		it.POST("/", controllers.CreateItinerary)

		it.GET("", controllers.ListMyItineraries)
		it.GET("/", controllers.ListMyItineraries)
	}
}
