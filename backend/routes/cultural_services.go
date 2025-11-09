// //routes//cultural_services.go
// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterCulturalServiceRoutes(router *gin.Engine) {
// 	g := router.Group("/cultural/services")
// 	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	{
// 		g.POST("", controllers.CreateCulturalService)
// 		g.POST("/", controllers.CreateCulturalService)

// 		g.GET("", controllers.ListMyCulturalServices)
// 		g.GET("/", controllers.ListMyCulturalServices)

// 		g.GET("/:id", controllers.GetMyCulturalService)
// 		g.PUT("/:id", controllers.UpdateCulturalServicePUT)
// 		g.PATCH("/:id", controllers.UpdateCulturalServicePATCH)
// 		g.DELETE("/:id", controllers.DeleteCulturalService)
// 	}
// }

package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterCulturalServiceRoutes(router *gin.Engine) {
	g := router.Group("/cultural/services")
	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		g.POST("", controllers.CreateCulturalService)

		g.GET("", controllers.ListMyCulturalServices)

		g.GET("/:id", controllers.GetMyCulturalService)
		g.PUT("/:id", controllers.UpdateCulturalServicePUT)
		g.PATCH("/:id", controllers.UpdateCulturalServicePATCH)
		g.DELETE("/:id", controllers.DeleteCulturalService)
	}
}
