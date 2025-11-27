// // // package routes

// // // import (
// // // 	"travel_mate/backend/controllers"
// // // 	"travel_mate/backend/middlewares"

// // // 	"github.com/gin-gonic/gin"
// // // )

// // // func RegisterGroupRoutes(r *gin.Engine) {
// // // 	g := r.Group("/groups")
// // // 	g.Use(middlewares.AuthMiddleware()) // require JWT
// // // 	{
// // // 		// groups
// // // 		g.POST("", controllers.CreateGroup)
// // // 		g.GET("/mine", controllers.GetMyGroups)
// // // 		g.GET("/:id", controllers.GetGroup)

// // // 		g.GET("/:group_id/members", controllers.ListGroupMembers)
// // // 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
// // // 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
// // // 		g.GET("/:id/invites", controllers.ListGroupInvitesForGroup)

// // // 		// invites (for GroupsHomeScreen)
// // // 		g.GET("/invites", controllers.ListMyInvites)
// // // 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
// // // 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
// // // 	}
// // // }

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
// // 		g.GET("/:group_id", controllers.GetGroup)

// // 		// members + invites (admin endpoints)
// // 		g.GET("/:group_id/members", controllers.ListGroupMembers)
// // 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)
// // 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler)
// // 		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup)

// // 		// invites (for invitee’s inbox / GroupsHomeScreen)
// // 		g.GET("/invites", controllers.ListMyInvites)
// // 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)
// // 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)
// // 	}
// // }

// // //update these the above one we are not using them anymore add new routes if missing dont use any of above routes only use the above given functions

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
// 		// Groups
// 		g.POST("", controllers.CreateGroup)       // POST /groups
// 		g.GET("/mine", controllers.GetMyGroups)   // GET  /groups/mine
// 		g.GET("/:group_id", controllers.GetGroup) // GET  /groups/:group_id

// 		// Members & Invites (admin-only inside controllers)
// 		g.GET("/:group_id/members", controllers.ListGroupMembers)         // GET  /groups/:group_id/members
// 		g.POST("/:group_id/invites", controllers.CreateGroupInvite)       // POST /groups/:group_id/invites
// 		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup) // GET  /groups/:group_id/invites

// 		// Invite lifecycle
// 		g.GET("/invites/:userId", controllers.ListMyInvites)                      // GET  /groups/invites (invitee inbox)
// 		g.POST("/invites/:inviteId/accept", controllers.AcceptInvite)             // POST /groups/invites/:inviteId/accept
// 		g.POST("/invites/:inviteId/decline", controllers.DeclineInvite)           // POST /groups/invites/:inviteId/decline
// 		g.POST("/invites/:inviteId/cancel", controllers.CancelGroupInviteHandler) // POST /groups/invites/:inviteId/cancel
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
		// Groups
		g.POST("", controllers.CreateGroup)       // POST /groups
		g.GET("/mine", controllers.GetMyGroups)   // GET  /groups/mine

		// Members & Invites (admin-only inside controllers)
		// DELETE must come before GET to avoid route conflicts
		g.DELETE("/:group_id/members/:user_id", controllers.RemoveGroupMember) // DELETE /groups/:group_id/members/:user_id
		g.GET("/:group_id/members", controllers.ListGroupMembers)         // GET  /groups/:group_id/members
		g.POST("/:group_id/invites", controllers.CreateGroupInvite)       // POST /groups/:group_id/invites
		g.GET("/:group_id/invites", controllers.ListGroupInvitesForGroup) // GET  /groups/:group_id/invites

		// Polls (group members) - must come before /:group_id
		g.POST("/:group_id/polls", controllers.CreateGroupPollHandler)         // POST /groups/:group_id/polls
		g.GET("/:group_id/polls", controllers.ListGroupPollsHandler)           // GET  /groups/:group_id/polls
		g.POST("/:group_id/polls/:poll_id/vote", controllers.VoteOnGroupPollHandler) // POST /groups/:group_id/polls/:poll_id/vote

		// Plans (trip plans) - must come before /:group_id
		g.POST("/:group_id/plans", controllers.CreateGroupPlanHandler)                    // POST /groups/:group_id/plans
		g.GET("/:group_id/plans", controllers.ListGroupPlansHandler)                      // GET  /groups/:group_id/plans
		g.GET("/:group_id/plans/:plan_id", controllers.GetGroupPlanHandler)                // GET  /groups/:group_id/plans/:plan_id
		g.PUT("/:group_id/plans/:plan_id", controllers.UpdateGroupPlanHandler)             // PUT  /groups/:group_id/plans/:plan_id
		g.DELETE("/:group_id/plans/:plan_id", controllers.DeleteGroupPlanHandler)         // DELETE /groups/:group_id/plans/:plan_id
		g.POST("/:group_id/plans/:plan_id/comments", controllers.AddPlanCommentHandler)    // POST /groups/:group_id/plans/:plan_id/comments
		g.GET("/:group_id/plans/:plan_id/comments", controllers.ListPlanCommentsHandler)   // GET  /groups/:group_id/plans/:plan_id/comments
		g.DELETE("/:group_id/plans/:plan_id/comments/:comment_id", controllers.DeletePlanCommentHandler) // DELETE /groups/:group_id/plans/:plan_id/comments/:comment_id

		// Shared Itineraries - must come before /:group_id
		g.POST("/:group_id/itineraries/share", controllers.ShareItineraryToGroup)  // POST /groups/:group_id/itineraries/share
		g.GET("/:group_id/itineraries", controllers.GetGroupSharedItineraries)     // GET  /groups/:group_id/itineraries
		g.PUT("/:group_id/itineraries/:shared_itinerary_id", controllers.UpdateSharedItinerary)  // PUT /groups/:group_id/itineraries/:shared_itinerary_id
		g.POST("/:group_id/itineraries/:shared_itinerary_id/comments", controllers.AddSharedItineraryComment)  // POST /groups/:group_id/itineraries/:shared_itinerary_id/comments
		g.GET("/:group_id/itineraries/:shared_itinerary_id/comments", controllers.ListSharedItineraryComments)  // GET /groups/:group_id/itineraries/:shared_itinerary_id/comments
		g.DELETE("/:group_id/itineraries/:shared_itinerary_id/comments/:comment_id", controllers.DeleteSharedItineraryComment)  // DELETE /groups/:group_id/itineraries/:shared_itinerary_id/comments/:comment_id

		// Group Conversations (separate from community chat)
		g.GET("/:group_id/conversations", controllers.GetGroupConversationsHandler) // GET /groups/:group_id/conversations
		g.GET("/:group_id/chat", controllers.GetGroupChatHandler) // GET /groups/:group_id/chat (get or ensure group conversation)
		g.GET("/:group_id/chat/unread-count", controllers.GetGroupChatUnreadCountHandler) // GET /groups/:group_id/chat/unread-count
		
		// Group Notifications
		g.GET("/:group_id/notifications", controllers.GetGroupNotifications) // GET /groups/:group_id/notifications
		g.GET("/:group_id/notifications/unread-count", controllers.GetGroupUnreadCount) // GET /groups/:group_id/notifications/unread-count

		// Group Settings (admin only - must come before GET /:group_id)
		g.PUT("/:group_id", controllers.UpdateGroupName)   // PUT /groups/:group_id (update name)
		g.DELETE("/:group_id", controllers.DeleteGroup)    // DELETE /groups/:group_id (delete group)

		// Groups (must come last to avoid route conflicts)
		g.GET("/:group_id", controllers.GetGroup) // GET  /groups/:group_id

		// Invite lifecycle - FIXED: userId should be in path, not query
		g.GET("/invites/mine", controllers.ListMyInvites)                          // GET  /groups/invites/mine (current user's invites)
		g.POST("/invites/:invite_id/accept", controllers.AcceptInvite)             // POST /groups/invites/:invite_id/accept
		g.POST("/invites/:invite_id/decline", controllers.DeclineInvite)           // POST /groups/invites/:invite_id/decline
		g.POST("/invites/:invite_id/cancel", controllers.CancelGroupInviteHandler) // POST /groups/invites/:invite_id/cancel
	}
}
