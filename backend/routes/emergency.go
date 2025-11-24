package routes

import (
	"travel_mate/backend/controllers"

	"github.com/gin-gonic/gin"
)

// RegisterEmergencyRoutes registers all emergency-related routes
func RegisterEmergencyRoutes(router *gin.Engine) {
	emergency := router.Group("/emergency")
	{
		// Get emergency contacts for a specific city
		emergency.GET("/contacts", controllers.GetEmergencyContacts)

		// Get list of all cities with emergency data
		emergency.GET("/cities", controllers.GetAllCities)

		// Get city mappings (tourist destinations → major cities)
		emergency.GET("/mappings", controllers.GetCityMappings)

		// Get emergency categories
		emergency.GET("/categories", controllers.GetEmergencyCategories)
	}
}
