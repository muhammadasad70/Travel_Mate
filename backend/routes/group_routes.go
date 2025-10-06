// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterGroupRoutes(r *gin.Engine) {
// 	g := r.Group("/groups")
// 	g.Use(middlewares.AuthMiddleware()) // require JWT
// 	{
// 		// groups
// 		g.POST("", controllers.CreateGroup)
// 		g.GET("/mine", controllers.GetMyGroups)
// 		g.GET("/:id", controllers.GetGroup)

// 		g.GET("/:group_id/members", controllers.ListGroupMembers)
// 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
// 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
// 		g.GET("/:id/invites", controllers.ListGroupInvitesForGroup)

// 		// invites (for GroupsHomeScreen)
// 		g.GET("/invites", controllers.ListMyInvites)
// 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
// 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
// 	}
// }

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
		g.GET("/:group_id", controllers.GetGroup)

		// members + invites (admin endpoints)
		g.GET("/:group_id/members", controllers.ListGroupMembers)
		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup)

		// invites (for invitee’s inbox / GroupsHomeScreen)
		g.GET("/invites", controllers.ListMyInvites)
		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
	}
}
