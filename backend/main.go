package main

import (
	"log"
	"net/http"

	"travel_mate/backend/cloudinary"
	"travel_mate/backend/database"
	"travel_mate/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// DB + schema
	database.Connect()
	database.InitSchema()

	// other inits
	cloudinary.InitCloudinary()
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Gin
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	// CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:8081",
			"http://127.0.0.1:8081",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "pong"})
	})

	// ===== Register routes =====
	routes.RegisterUserRoutes(router)
	routes.RegisterItineraryRoutes(router)
	routes.RegisterAssetRoutes(router)
	routes.RegisterChatRoutes(router)
	routes.RegisterPostRoutes(router)
	routes.RegisterFollowRoutes(router)
	// ✅ NEW: Groups (lists, invites, create, details)
	routes.RegisterGroupRoutes(router)
	routes.RegisterEventRoutes(router)
	routes.RegisterCulturalServiceRoutes(router)
	routes.RegisterPublicRoutes(router)
	// routes.RegisterCulturalServiceRoutes(router)
	routes.RegisterBookingRoutes(router)

	// Debug: list routes
	router.GET("/__routes", func(c *gin.Context) {
		type R struct {
			Method string `json:"method"`
			Path   string `json:"path"`
		}
		out := []R{}
		for _, r := range router.Routes() {
			out = append(out, R{Method: r.Method, Path: r.Path})
		}
		c.JSON(http.StatusOK, gin.H{"routes": out})
	})

	// 404 logger
	router.NoRoute(func(c *gin.Context) {
		log.Printf("NoRoute: %s %s", c.Request.Method, c.Request.URL.Path)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "not found",
			"path":  c.Request.URL.Path,
		})
	})

	log.Println("🚀 API on :8080")
	router.Run(":8080")
}
