// routes/assets.go
package routes

import (
	"travel_mate/backend/controllers"
	"travel_mate/backend/middlewares"

	"github.com/gin-gonic/gin"
)

// RegisterAssetRoutes registers routes for image/video uploads
func RegisterAssetRoutes(router *gin.Engine) {
	asset := router.Group("/asset")
	asset.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
	{
		// Upload media
		asset.POST("/:user_id", controllers.HandleAssetUpload)

	}
}

// package routes

// import (
// 	"html/template"
// 	"net/http"
// 	"os"

// 	"travel_mate/backend/controllers"
// 	"travel_mate/backend/middlewares"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterAssetRoutes(router *gin.Engine) {
// 	asset := router.Group("/asset")

// 	// In test mode, skip auth/profile middleware for easy manual testing.
// 	// Set TEST_MODE=1 to bypass; any other value uses the middlewares.
// 	if os.Getenv("TEST_MODE") != "1" {
// 		asset.Use(middlewares.AuthMiddleware(), middlewares.RequireCompleteProfile())
// 	}

// 	// Quick health check
// 	asset.GET("/health", func(c *gin.Context) {
// 		c.JSON(http.StatusOK, gin.H{"ok": true, "service": "asset"})
// 	})

// 	// Simple HTML form to test uploads in a browser:
// 	// Visit: http://localhost:8080/asset/demo
// 	asset.GET("/demo", func(c *gin.Context) {
// 		// Minimal HTML form that posts to /asset/:user_id (default user 1)
// 		const html = `
// <!doctype html>
// <html>
// <head><meta charset="utf-8"><title>Asset Upload Demo</title></head>
// <body style="font-family: sans-serif; max-width: 640px; margin: 40px auto;">
//   <h1>TravelMate • Asset Upload Demo</h1>
//   <form id="f" action="/asset/1" method="post" enctype="multipart/form-data">
//     <p><label>Pick an image/video: <input type="file" name="asset" required></label></p>
//     <p><button type="submit">Upload</button></p>
//   </form>
//   <p style="color:#666">POST → /asset/1 with multipart field <code>asset</code></p>
// </body>
// </html>`
// 		t := template.Must(template.New("demo").Parse(html))
// 		c.Status(http.StatusOK)
// 		_ = t.Execute(c.Writer, nil)
// 	})

// 	// Actual upload endpoint (expects multipart field "asset")
// 	asset.POST("/:user_id", controllers.HandleAssetUpload)

// 	// (Optional) if you added these controller handlers earlier:
// 	// asset.GET("/:user_id", controllers.ListUserAssets)
// 	// asset.GET("/view/:id", controllers.GetAssetById)
// }
