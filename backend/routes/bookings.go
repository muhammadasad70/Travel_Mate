// // routes/bookings.go
// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterBookingRoutes(r *gin.Engine) {
// 	// traveler
// 	g := r.Group("/cultural/bookings")
// 	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	{
// 		g.POST("", controllers.CreateBooking)
// 		g.GET("", controllers.ListTravelerBookings)
// 	}

// 	// vendor
// 	v := r.Group("/vendor/cultural")
// 	v.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	{
// 		v.GET("/requests", controllers.ListVendorRequests)
// 		v.GET("/booked", controllers.ListVendorBooked)
// 		v.PATCH("/requests/:id", controllers.UpdateVendorRequestStatus) // {action: confirm|decline}
// 	}
// }

package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterBookingRoutes(r *gin.Engine) {
	// traveler
	g := r.Group("/cultural/bookings")
	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		g.POST("", controllers.CreateBooking)
		g.GET("", controllers.ListTravelerBookings)
	}

	// vendor
	v := r.Group("/vendor/cultural")
	v.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		v.GET("/requests", controllers.ListVendorRequests)
		v.GET("/booked", controllers.ListVendorBooked)
		v.PATCH("/requests/:id", controllers.UpdateVendorRequestStatus) // {action: confirm|decline}
	}
}
