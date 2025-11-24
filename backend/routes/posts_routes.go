// package routes

// import (
// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterPostRoutes(router *gin.Engine) {
// 	// Public feed reads (if you prefer auth, wrap with middleware)
// 	router.GET("/posts", controllers.GetAllPosts)
// 	router.GET("/users/:id/posts", controllers.GetUsersPosts)
// 	router.GET("/posts/:id/comments", controllers.GetCommentsByPost)

// 	// Auth-required interactions
// 	post := router.Group("/")
// 	post.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	{
// 		// Share existing item as a post (content_id only)
// 		post.POST("/posts", controllers.CreatePost)

// 		// Like / Unlike
// 		post.POST("/posts/:id/like", controllers.LikePost)
// 		post.DELETE("/posts/:id/like", controllers.UnlikePost)

// 		// Comments
// 		post.POST("/comments", controllers.AddComment)
// 		post.DELETE("/posts/:id/comments/:commentId", controllers.DeleteComment)

// 		// Delete post
// 		post.DELETE("/posts/:id", controllers.DeletePost)

// 		// Saves (polymorphic)
// 		post.POST("/saves", controllers.SaveItem)
// 		post.DELETE("/saves", controllers.UnsaveItem)

// 		// Saved posts for a user (content_type='post')
// 		post.GET("/users/:id/saved/posts", controllers.GetSavedPosts)
// 	}
// }

package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterPostRoutes(router *gin.Engine) {
	// 🔥 Public feed reads - NO AUTH REQUIRED
	router.GET("/posts", controllers.GetAllPosts)
	router.GET("/users/:id/posts", controllers.GetUsersPosts)
	router.GET("/posts/:id/comments", controllers.GetCommentsByPost)

	// Auth-required interactions
	post := router.Group("/")
	post.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		post.POST("/posts", controllers.CreatePost)

		// 🔥 Like / Unlike - User from JWT middleware
		post.POST("/posts/:id/like", controllers.LikePost)
		post.DELETE("/posts/:id/like", controllers.UnlikePost)

		// Comments
		post.POST("/comments", controllers.AddComment)
		post.DELETE("/posts/:id/comments/:commentId", controllers.DeleteComment)

		// Delete post
		post.DELETE("/posts/:id", controllers.DeletePost)

		// Saves
		post.POST("/saves", controllers.SaveItem)
		post.DELETE("/saves", controllers.UnsaveItem)

		// Saved posts
		post.GET("/users/:id/saved/posts", controllers.GetSavedPosts)
	}
}
