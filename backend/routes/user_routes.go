// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterUserRoutes(router *gin.Engine) {
// 	// ---------- PUBLIC ----------
// 	auth := router.Group("/auth")
// 	{
// 		auth.POST("/signup", controllers.SignupUser)
// 		auth.POST("/login", controllers.LoginUser)
// 		auth.POST("/complete-registration", controllers.CompleteRegistration) // deprecated
// 		auth.POST("/email-varification", controllers.ForgetPasswordHandler)   // step 1 (send code)
// 		auth.POST("/verify-code", controllers.VerifyCodeHandler)              // step 2 (check code)
// 		auth.POST("/reset-password", controllers.ResetPasswordHandler)        // step 3 (set new password)

// 	}

// 	// ---------- AUTH ONLY (user can finish profile here even if incomplete) ----------
// 	profile := router.Group("/user")
// 	profile.Use(middlewares.AuthMiddleware())
// 	{
// 		profile.PUT("/profile", controllers.UpdateProfile)      // complete / update profile
// 		profile.PATCH("/profile/me", controllers.UpdateProfile) // optional alias
// 		profile.GET("/profile/me", controllers.GetMyProfile)    // read-only for UI
// 		profile.GET("/profile-status", controllers.GetProfileStatus)
// 	}

// 	// ---------- AUTH + PROFILE MUST BE COMPLETE ----------
// 	protected := router.Group("/user")
// 	protected.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	{
// 		// Example protected endpoint (for testing)
// 		protected.GET("/_ping-protected", func(c *gin.Context) {
// 			c.JSON(200, gin.H{"ok": true})
// 		})

// 		// Put your real protected routes here:
// 		// protected.GET("/trips", controllers.ListTrips)
// 		// protected.POST("/bookings", controllers.CreateBooking)
// 	}
// }

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
		auth.POST("/email-varification", controllers.ForgetPasswordHandler)   // step 1
		auth.POST("/verify-code", controllers.VerifyCodeHandler)              // step 2
		auth.POST("/reset-password", controllers.ResetPasswordHandler)        // step 3
	}

	// Public profile (by numeric id)
	router.GET("/users/:id/profile", controllers.GetUserProfile)

	// ---------- SEARCH (public) ----------
	registerSearchSubroutes(router)

	// ---------- AUTH ONLY ----------
	profile := router.Group("/user")
	profile.Use(middlewares.AuthMiddleware())
	{
		profile.PUT("/profile", controllers.UpdateProfile)
		profile.PATCH("/profile/me", controllers.UpdateProfile)
		profile.GET("/profile/me", controllers.GetMyProfile)
		profile.GET("/profile-status", controllers.GetProfileStatus)
	}

	// ---------- VENDOR ROUTES ----------
	vendor := router.Group("/vendor")
	vendor.Use(middlewares.AuthMiddleware())
	{
		vendor.GET("/profile/me", controllers.GetVendorProfile)
	}

	// ---------- AUTH + PROFILE COMPLETE ----------
	protected := router.Group("/user")
	protected.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		protected.GET("/_ping-protected", func(c *gin.Context) {
			c.JSON(200, gin.H{"ok": true})
		})
		// put other protected user routes here...
	}
}
