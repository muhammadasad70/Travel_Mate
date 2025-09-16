// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterUserRoutes(router *gin.Engine) {
// 	auth := router.Group("/auth")
// 	{
// 		auth.POST("/signup", controllers.SignupUser)
// 		auth.POST("/login", controllers.LoginUser)
// 		auth.POST("/complete-registration", controllers.CompleteRegistration) // deprecated placeholder
// 	}

// 		protected := router.Group("/user")
// 		protected.Use(middlewares.AuthMiddleware())
// 		{
// 			protected.PUT("/profile", controllers.UpdateProfile)
// 			protected.GET("/profile-status", controllers.GetProfileStatus) // <— NEW
// 		}
// 	}

// routes/user_routes.go
package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(router *gin.Engine) {
	// ---------- PUBLIC ----------
	auth := router.Group("/auth")
	{
		auth.POST("/signup", controllers.SignupUser)
		auth.POST("/login", controllers.LoginUser)
		auth.POST("/complete-registration", controllers.CompleteRegistration) // deprecated
	}

	// ---------- AUTH ONLY (user can finish profile here even if incomplete) ----------
	profile := router.Group("/user")
	profile.Use(middlewares.AuthMiddleware())
	{
		profile.PUT("/profile", controllers.UpdateProfile)      // complete / update profile
		profile.PATCH("/profile/me", controllers.UpdateProfile) // optional alias
		profile.GET("/profile/me", controllers.GetMyProfile)    // read-only for UI
		profile.GET("/profile-status", controllers.GetProfileStatus)
	}

	// ---------- AUTH + PROFILE MUST BE COMPLETE ----------
	protected := router.Group("/user")
	protected.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// Example protected endpoint (for testing)
		protected.GET("/_ping-protected", func(c *gin.Context) {
			c.JSON(200, gin.H{"ok": true})
		})

		// Put your real protected routes here:
		// protected.GET("/trips", controllers.ListTrips)
		// protected.POST("/bookings", controllers.CreateBooking)
	}
}
