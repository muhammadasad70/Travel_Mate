// package main

// import (
// 	"log"
// 	"net/http"
// 	"os"

// 	"travel_mate/backend/cloudinary"
// 	"travel_mate/backend/database"
// 	"travel_mate/backend/routes"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// 	"github.com/joho/godotenv"
// )

// func main() {
// 	// 1) Load env FIRST so everything sees keys
// 	if err := godotenv.Load(); err != nil {
// 		log.Println("No .env file found (using process env)")
// 	}

// 	// Sanity logs
// 	if os.Getenv("GOOGLE_WEB_CLIENT_ID") == "" {
// 		log.Println("⚠️  GOOGLE_WEB_CLIENT_ID not set")
// 	}
// 	if os.Getenv("GOOGLE_ANDROID_CLIENT_ID") == "" {
// 		log.Println("⚠️  GOOGLE_ANDROID_CLIENT_ID not set")
// 	}
// 	if os.Getenv("GOOGLE_IOS_CLIENT_ID") == "" {
// 		log.Println("⚠️  GOOGLE_IOS_CLIENT_ID not set")
// 	}
// 	if os.Getenv("FB_APP_ID") == "" || os.Getenv("FB_APP_SECRET") == "" {
// 		log.Println("⚠️  FB_APP_ID / FB_APP_SECRET not set")
// 	}

// 	// 2) DB
// 	database.Connect()
// 	database.InitSchema()

// 	// 3) Others
// 	cloudinary.InitCloudinary()

// 	// 4) Gin
// 	gin.SetMode(gin.DebugMode)
// 	router := gin.Default()

// 	// 5) CORS
// 	router.Use(cors.New(cors.Config{
// 		AllowOrigins: []string{
// 			"http://localhost:8081",
// 			"http://127.0.0.1:8081",
// 			"http://localhost:19006", // Expo web
// 			"http://127.0.0.1:19006",
// 		},
// 		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
// 		ExposeHeaders:    []string{"Content-Length"},
// 		AllowCredentials: false,
// 		MaxAge:           600,
// 	}))

// 	// 6) Health
// 	router.GET("/ping", func(c *gin.Context) {
// 		c.JSON(http.StatusOK, gin.H{"msg": "pong"})
// 	})

// 	// 7) Routes
// 	routes.RegisterItineraryRoutes(router)
// 	routes.RegisterRecommendationRoutes(router)
// 	routes.RegisterAssetRoutes(router)
// 	routes.RegisterChatRoutes(router)
// 	routes.RegisterPostRoutes(router)
// 	routes.RegisterFollowRoutes(router)
// 	routes.RegisterGroupRoutes(router)
// 	routes.RegisterEventRoutes(router)
// 	routes.RegisterNotificationRoutes(router)
// 	routes.RegisterCulturalServiceRoutes(router)
// 	routes.RegisterBookingChatRoutes(router)

// 	// ❌ REMOVE the next line to avoid duplicate /public/cultural/services registration
// 	// routes.RegisterPublicRoutes(router)
// 	routes.RegisterBookingRoutes(router)
// 	// ✅ This is the single source of truth for /public/cultural/services
// 	routes.RegisterPublicCulturalRoutes(router)

// 	// 8) Route list
// 	router.GET("/__routes", func(c *gin.Context) {
// 		type R struct{ Method, Path string }
// 		out := make([]R, 0, len(router.Routes()))
// 		for _, r := range router.Routes() {
// 			out = append(out, R{Method: r.Method, Path: r.Path})
// 		}
// 		c.JSON(http.StatusOK, gin.H{"routes": out})
// 	})

// 	// 9) 404
// 	router.NoRoute(func(c *gin.Context) {
// 		log.Printf("NoRoute: %s %s", c.Request.Method, c.Request.URL.Path)
// 		c.JSON(http.StatusNotFound, gin.H{"error": "not found", "path": c.Request.URL.Path})
// 	})

// 	log.Println("🚀 API on :8080")
// 	_ = router.Run(":8080")
// }

package main

import (
	"log"
	"net/http"
	"os"

	"travel_mate/backend/cloudinary"
	"travel_mate/backend/database"
	"travel_mate/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1) Load env FIRST so everything sees keys
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (using process env)")
	}
	if os.Getenv("OPENWEATHER_API_KEY") == "" {
		log.Println("⚠️  WARNING: OPENWEATHER_API_KEY not set - weather features unavailable")
	}
	if os.Getenv("MISTRAL_API_KEY") == "" {
		log.Println("⚠️  WARNING: MISTRAL_API_KEY not set - AI features unavailable")
	}

	// Sanity logs
	if os.Getenv("GOOGLE_WEB_CLIENT_ID") == "" {
		log.Println("⚠️  GOOGLE_WEB_CLIENT_ID not set")
	}
	if os.Getenv("GOOGLE_ANDROID_CLIENT_ID") == "" {
		log.Println("⚠️  GOOGLE_ANDROID_CLIENT_ID not set")
	}
	if os.Getenv("GOOGLE_IOS_CLIENT_ID") == "" {
		log.Println("⚠️  GOOGLE_IOS_CLIENT_ID not set")
	}
	if os.Getenv("FB_APP_ID") == "" || os.Getenv("FB_APP_SECRET") == "" {
		log.Println("⚠️  FB_APP_ID / FB_APP_SECRET not set")
	}

	// 2) DB
	database.Connect()
	database.InitSchema()

	// 3) Others
	cloudinary.InitCloudinary()

	// 4) Gin
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	// 5) CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:8081",
			"http://127.0.0.1:8081",
			"http://localhost:19006", // Expo web
			"http://127.0.0.1:19006",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           600,
	}))

	// 6) Health
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"msg": "pong"})
	})

	// 7) Routes
	routes.RegisterUserRoutes(router)
	routes.RegisterItineraryRoutes(router)
	routes.RegisterRecommendationRoutes(router)
	routes.RegisterAssetRoutes(router)
	routes.RegisterChatRoutes(router)
	routes.RegisterPostRoutes(router)
	routes.RegisterFollowRoutes(router)
	routes.RegisterGroupRoutes(router)
	routes.RegisterEventRoutes(router)
	routes.RegisterNotificationRoutes(router)
	routes.RegisterCulturalServiceRoutes(router)
	routes.RegisterBookingChatRoutes(router)
	routes.RegisterSocialAuthRoutes(router)

	// ❌ REMOVE the next line to avoid duplicate /public/cultural/services registration
	// routes.RegisterPublicRoutes(router)
	routes.RegisterBookingRoutes(router)
	// ✅ This is the single source of truth for /public/cultural/services
	routes.RegisterPublicCulturalRoutes(router)

	// 8) Route list
	router.GET("/__routes", func(c *gin.Context) {
		type R struct{ Method, Path string }
		out := make([]R, 0, len(router.Routes()))
		for _, r := range router.Routes() {
			out = append(out, R{Method: r.Method, Path: r.Path})
		}
		c.JSON(http.StatusOK, gin.H{"routes": out})
	})

	// 9) 404
	router.NoRoute(func(c *gin.Context) {
		log.Printf("NoRoute: %s %s", c.Request.Method, c.Request.URL.Path)
		c.JSON(http.StatusNotFound, gin.H{"error": "not found", "path": c.Request.URL.Path})
	})

	log.Println("🚀 API on :8080")
	_ = router.Run(":8080")
}
