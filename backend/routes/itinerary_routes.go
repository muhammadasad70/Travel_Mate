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
	it.Use(middlewares.RequireCompleteProfile())
	{
		// create + list
		it.POST("", controllers.CreateItinerary)
		it.POST("/", controllers.CreateItinerary)
		it.GET("", controllers.ListMyItineraries)
		it.GET("/", controllers.ListMyItineraries)

		// get one
		it.GET("/:id", controllers.GetMyItinerary)

		// update
		it.PUT("/:id", controllers.UpdateItineraryPUT)
		it.PATCH("/:id", controllers.UpdateItineraryPATCH)

		// delete
		it.DELETE("/:id", controllers.DeleteItinerary)
	}
}
