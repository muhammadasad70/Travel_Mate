package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterGroupRoutes(r *gin.Engine) {
	g := r.Group("/groups")
	g.Use(middlewares.AuthMiddleware()) // require JWT
	{
		// groups
		g.POST("", controllers.CreateGroup)
		g.GET("/mine", controllers.GetMyGroups)
		g.GET("/:id", controllers.GetGroup)

		// invites (for GroupsHomeScreen)
		g.GET("/invites", controllers.ListMyInvites)
		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
	}
}
