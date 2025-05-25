package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	// ✅ Auth group
	auth := router.Group("/auth")
	{
		auth.POST("/complete-registration", controllers.CompleteRegistration)

		// 🔑 Password Reset Routes
		// auth.POST("/send-reset-link", controllers.SendResetLink) // Sends reset email
		// auth.POST("/reset-password", controllers.ResetPassword)  // Applies new password
	}

	// Optional: Keep signup/login if needed
	router.POST("/signup", controllers.SignupUser)
	router.POST("/login", controllers.LoginUser)
	router.POST("/email-varification", controllers.EmailVarification)

	// ✅ Protected routes
	protected := router.Group("/user")
	protected.Use(middlewares.AuthMiddleware())
	{
		protected.PUT("/profile", controllers.UpdateProfile)
		protected.GET("/profile", controllers.GetProfile)
	}
}
