package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterEventRoutes(router *gin.Engine) {
	ev := router.Group("/events")
	{
		// Public read (keep it simple so your explore screen can load without auth if you want)
		ev.GET("", controllers.ListEvents)
		ev.GET("/", controllers.ListEvents)

		// Simple ingest (lock it down later with your Auth + role)
		ev.POST("/ingest", controllers.IngestEvents)
	}
}
