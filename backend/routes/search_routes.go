package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

// Call this from RegisterUserRoutes (shown below) to attach search endpoints.
func registerSearchSubroutes(router *gin.Engine) {
	search := router.Group("/search")
	{
		search.GET("/users", controllers.SearchUsers)                   // ?q=&limit=
		search.GET("/users/advanced", controllers.AdvancedSearchUsers)  // ?q=&role=&limit=
		search.GET("/users/indexes", controllers.OptimizeSearchIndexes) // returns SQL statements
	}
}
