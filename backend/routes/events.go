package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterEventRoutes(router *gin.Engine) {
	ev := router.Group("/events")
	{
		ev.GET("", controllers.ListEvents)
		ev.GET("/", controllers.ListEvents)
		ev.POST("/ingest", controllers.IngestEvents)

		// ✅ Live events from Predicthq
		ev.GET("/live", controllers.GetLiveEvents)
		ev.POST("/seed", controllers.SeedRealEvents)
	}
}
