package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterPublicCulturalRoutes(r *gin.Engine) {
	pub := r.Group("/public/cultural")
	{
		pub.GET("/services", controllers.PublicListOrGetCulturalServices)
	}
}
