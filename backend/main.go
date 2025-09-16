package main

import (
	"log"
	"net/http"

	"travel_mate/backend/database"
	"travel_mate/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()
	database.InitSchema()

	// gin in release/debug prints
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	// CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8081"},
		AllowMethods:     []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// --- DEBUG 1: health
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "pong"})
	})

	// Register real routes
	routes.RegisterUserRoutes(router)

	// --- DEBUG 2: list all registered routes (so we can confirm /user/profile-status exists)
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

	// --- DEBUG 3: catch-all to log 404s
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
