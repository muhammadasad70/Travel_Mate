// // package routes

// // import (
// // 	"travel_mate/backend/controllers"
// // 	"travel_mate/backend/middlewares"

// // 	"github.com/gin-gonic/gin"
// // )

// // func RegisterGroupRoutes(r *gin.Engine) {
// // 	g := r.Group("/groups")
// // 	g.Use(middlewares.AuthMiddleware()) // require JWT
// // 	{
// // 		// groups
// // 		g.POST("", controllers.CreateGroup)
// // 		g.GET("/mine", controllers.GetMyGroups)
// // 		g.GET("/:id", controllers.GetGroup)

// // 		g.GET("/:group_id/members", controllers.ListGroupMembers)
// // 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
// // 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
// // 		g.GET("/:id/invites", controllers.ListGroupInvitesForGroup)

// // 		// invites (for GroupsHomeScreen)
// // 		g.GET("/invites", controllers.ListMyInvites)
// // 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
// // 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
// // 	}
// // }

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
// 		g.GET("/:group_id", controllers.GetGroup)

// 		// members + invites (admin endpoints)
// 		g.GET("/:group_id/members", controllers.ListGroupMembers)
// 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
// 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
// 		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup)

// 		// invites (for invitee’s inbox / GroupsHomeScreen)
// 		g.GET("/invites", controllers.ListMyInvites)
// 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
// 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
// 	}
// }

// //update these the above one we are not using them anymore add new routes if missing dont use any of above routes only use the above given functions

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
		// Groups
		g.POST("", controllers.CreateGroup)       // POST /groups
		g.GET("/mine", controllers.GetMyGroups)   // GET  /groups/mine
		g.GET("/:group_id", controllers.GetGroup) // GET  /groups/:group_id

		// Members & Invites (admin-only inside controllers)
		g.GET("/:group_id/members", controllers.ListGroupMembers)         // GET  /groups/:group_id/members
		g.POST("/:group_id/invites", controllers.CreateGroupInvite)       // POST /groups/:group_id/invites
		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup) // GET  /groups/:group_id/invites

		// Invite lifecycle
		g.GET("/invites/:userId", controllers.ListMyInvites)                      // GET  /groups/invites (invitee inbox)
		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)             // POST /groups/invites/:inviteId/accept
		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)           // POST /groups/invites/:inviteId/decline
		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler) // POST /groups/invites/:inviteId/cancel
	}
}
