// travel_mate/backend/routes/follow.go
package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterFollowRoutes(router *gin.Engine) {
	// Auth + completed profile required for all follow actions
	g := router.Group("/social")
	g.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// Follow / Unfollow
		g.POST("/followers", controllers.CreateFollower)
		g.DELETE("/followers/:follower_id/:following_id", controllers.Unfollow)

		// Follow request management
		g.POST("/follow-requests/approve", controllers.ApproveFollowRequest)
		g.POST("/follow-requests/reject", controllers.RejectFollowRequest)
		g.GET("/follow-requests/pending/:user_id", controllers.GetPendingFollowRequests)

		// Lists & counts
		g.GET("/followers/:user_id", controllers.GetFollowers)
		g.GET("/followers/:user_id/count", controllers.GetFollowersCount)
		g.GET("/following/:user_id/count", controllers.GetFollowingCount)
	}
}
