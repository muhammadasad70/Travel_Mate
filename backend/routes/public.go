// routes/public.go
package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterPublicRoutes(r *gin.Engine) {
	p := r.Group("/public/cultural")
	{
		p.GET("/services", controllers.ListAllCulturalServices) // no auth
	}
}
