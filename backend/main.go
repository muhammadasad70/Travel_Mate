package main

import (
	"travel_mate/backend/database"
	"travel_mate/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()
	router := gin.Default()

	// CORS middleware setup
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8081"},
		AllowMethods:     []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Register routes
	routes.RegisterUserRoutes(router)

	router.Run(":8080")
}
