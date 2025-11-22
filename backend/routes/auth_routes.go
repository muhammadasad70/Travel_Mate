// routes/auth_routes.go
package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterSocialAuthRoutes(router *gin.Engine) {
	auth := router.Group("/auth")
	{
		// Web OAuth flows
		auth.GET("/google", controllers.GoogleLogin)
		auth.GET("/google/callback", controllers.GoogleCallback)
		auth.GET("/facebook", controllers.FacebookLogin)
		auth.GET("/facebook/callback", controllers.FacebookCallback)

		// Mobile direct token verification
		auth.POST("/google/mobile", controllers.GoogleMobileAuth)
		auth.POST("/facebook/mobile", controllers.FacebookMobileAuth)
		auth.POST("/apple/mobile", controllers.AppleMobileAuth)
	}
}
