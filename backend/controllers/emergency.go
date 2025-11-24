package controllers

import (
	"database/sql"
	"net/http"
	"travel_mate/backend/database"

	"github.com/gin-gonic/gin"
)

// EmergencyContact represents a single emergency contact
type EmergencyContact struct {
	ID             int      `json:"id"`
	City           string   `json:"city"`
	ParentCity     *string  `json:"parent_city,omitempty"`
	Category       string   `json:"category"`
	Name           string   `json:"name"`
	Phone          string   `json:"phone"`
	AlternatePhone *string  `json:"alternate_phone,omitempty"`
	Address        string   `json:"address"`
	Latitude       *float64 `json:"latitude,omitempty"`
	Longitude      *float64 `json:"longitude,omitempty"`
	Is247          bool     `json:"is_24_7"`
	Notes          *string  `json:"notes,omitempty"`
}

// CityEmergency represents organized emergency contacts for a city
type CityEmergency struct {
	Name     string                        `json:"name"`
	Contacts map[string][]EmergencyContact `json:"contacts"`
}

// EmergencyResponse is the complete API response
type EmergencyResponse struct {
	National     []EmergencyContact `json:"national"`
	City         *CityEmergency     `json:"city,omitempty"`
	Embassies    []EmergencyContact `json:"embassies"`
	Tips         []string           `json:"tips"`
	FallbackUsed bool               `json:"fallback_used"`
	FallbackCity string             `json:"fallback_city,omitempty"`
	FallbackInfo string             `json:"fallback_info,omitempty"`
}

// CityMapping represents tourist destination to major city mapping
type CityMapping struct {
	TouristDestination string  `json:"tourist_destination"`
	MajorCity          string  `json:"major_city"`
	DistanceKm         int     `json:"distance_km"`
	TravelTimeHours    float64 `json:"travel_time_hours"`
	Notes              string  `json:"notes"`
}

// GetEmergencyContacts - Main endpoint to get emergency contacts for a city
func GetEmergencyContacts(c *gin.Context) {
	city := c.Query("city")

	if city == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "City parameter required"})
		return
	}

	response := EmergencyResponse{
		Tips:         getSafetyTips(),
		FallbackUsed: false,
	}

	// 1. Get National emergency numbers (always included)
	national, err := getContactsByCity("National")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch national contacts"})
		return
	}
	response.National = national

	// 2. Try to get city-specific contacts
	cityContacts, err := getContactsByCity(city)

	// 3. If no direct city data, check for parent city mapping
	if err != nil || len(cityContacts) == 0 {
		mapping, mappingErr := getCityMapping(city)
		if mappingErr == nil && mapping != nil {
			// Found a parent city, use that data
			parentContacts, parentErr := getContactsByCity(mapping.MajorCity)
			if parentErr == nil && len(parentContacts) > 0 {
				cityContacts = append(cityContacts, parentContacts...)
				response.FallbackUsed = true
				response.FallbackCity = mapping.MajorCity
				response.FallbackInfo = mapping.Notes
			}
		}
	}

	// 4. Organize city contacts by category
	if len(cityContacts) > 0 {
		response.City = &CityEmergency{
			Name:     city,
			Contacts: groupContactsByCategory(cityContacts),
		}
	}

	// 5. Get Embassies (always from Islamabad)
	embassies, err := getEmbassies()
	if err == nil {
		response.Embassies = embassies
	}

	c.JSON(http.StatusOK, response)
}

// GetAllCities - Get list of all cities with emergency data
func GetAllCities(c *gin.Context) {
	query := `
		SELECT DISTINCT city 
		FROM emergency_contacts 
		WHERE city != 'National'
		ORDER BY city
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cities"})
		return
	}
	defer rows.Close()

	cities := []string{}
	for rows.Next() {
		var city string
		if err := rows.Scan(&city); err != nil {
			continue
		}
		cities = append(cities, city)
	}

	c.JSON(http.StatusOK, gin.H{
		"cities": cities,
		"count":  len(cities),
	})
}

// GetCityMappings - Get all tourist destination to major city mappings
func GetCityMappings(c *gin.Context) {
	query := `
		SELECT 
			tourist_destination, 
			major_city, 
			distance_km, 
			travel_time_hours, 
			notes
		FROM city_mappings
		ORDER BY tourist_destination
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mappings"})
		return
	}
	defer rows.Close()

	mappings := []CityMapping{}
	for rows.Next() {
		var mapping CityMapping
		var notes sql.NullString

		err := rows.Scan(
			&mapping.TouristDestination,
			&mapping.MajorCity,
			&mapping.DistanceKm,
			&mapping.TravelTimeHours,
			&notes,
		)
		if err != nil {
			continue
		}

		if notes.Valid {
			mapping.Notes = notes.String
		}

		mappings = append(mappings, mapping)
	}

	c.JSON(http.StatusOK, gin.H{
		"mappings": mappings,
		"count":    len(mappings),
	})
}

// GetEmergencyCategories - Get all emergency categories
func GetEmergencyCategories(c *gin.Context) {
	query := `
		SELECT 
			category_key, 
			category_name, 
			icon, 
			priority, 
			description
		FROM emergency_categories
		ORDER BY priority
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	defer rows.Close()

	type Category struct {
		Key         string  `json:"key"`
		Name        string  `json:"name"`
		Icon        string  `json:"icon"`
		Priority    int     `json:"priority"`
		Description *string `json:"description,omitempty"`
	}

	categories := []Category{}
	for rows.Next() {
		var cat Category
		var icon, desc sql.NullString

		err := rows.Scan(&cat.Key, &cat.Name, &icon, &cat.Priority, &desc)
		if err != nil {
			continue
		}

		if icon.Valid {
			cat.Icon = icon.String
		}
		if desc.Valid {
			cat.Description = &desc.String
		}

		categories = append(categories, cat)
	}

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
		"count":      len(categories),
	})
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// getContactsByCity fetches all emergency contacts for a specific city
func getContactsByCity(city string) ([]EmergencyContact, error) {
	query := `
		SELECT 
			id, city, parent_city, category, name, phone, 
			alternate_phone, address, latitude, longitude, 
			is_24_7, notes
		FROM emergency_contacts
		WHERE city = $1
		ORDER BY 
			CASE category
				WHEN 'police' THEN 1
				WHEN 'hospital' THEN 2
				WHEN 'ambulance' THEN 3
				WHEN 'fire' THEN 4
				WHEN 'embassy' THEN 5
				WHEN 'tourism' THEN 6
				ELSE 7
			END,
			name
	`

	rows, err := database.DB.Query(query, city)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	contacts := []EmergencyContact{}
	for rows.Next() {
		var contact EmergencyContact
		var parentCity, altPhone, notes sql.NullString
		var lat, lng sql.NullFloat64

		err := rows.Scan(
			&contact.ID,
			&contact.City,
			&parentCity,
			&contact.Category,
			&contact.Name,
			&contact.Phone,
			&altPhone,
			&contact.Address,
			&lat,
			&lng,
			&contact.Is247,
			&notes,
		)
		if err != nil {
			continue
		}

		// Handle nullable fields
		if parentCity.Valid {
			contact.ParentCity = &parentCity.String
		}
		if altPhone.Valid {
			contact.AlternatePhone = &altPhone.String
		}
		if lat.Valid {
			contact.Latitude = &lat.Float64
		}
		if lng.Valid {
			contact.Longitude = &lng.Float64
		}
		if notes.Valid {
			contact.Notes = &notes.String
		}

		contacts = append(contacts, contact)
	}

	return contacts, nil
}

// getCityMapping gets the parent city mapping for a tourist destination
func getCityMapping(touristDestination string) (*CityMapping, error) {
	query := `
		SELECT 
			tourist_destination, 
			major_city, 
			distance_km, 
			travel_time_hours, 
			notes
		FROM city_mappings
		WHERE tourist_destination = $1
		LIMIT 1
	`

	var mapping CityMapping
	var notes sql.NullString

	err := database.DB.QueryRow(query, touristDestination).Scan(
		&mapping.TouristDestination,
		&mapping.MajorCity,
		&mapping.DistanceKm,
		&mapping.TravelTimeHours,
		&notes,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if notes.Valid {
		mapping.Notes = notes.String
	}

	return &mapping, nil
}

// getEmbassies fetches all embassy contacts
func getEmbassies() ([]EmergencyContact, error) {
	query := `
		SELECT 
			id, city, parent_city, category, name, phone, 
			alternate_phone, address, latitude, longitude, 
			is_24_7, notes
		FROM emergency_contacts
		WHERE category = 'embassy'
		ORDER BY name
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	embassies := []EmergencyContact{}
	for rows.Next() {
		var embassy EmergencyContact
		var parentCity, altPhone, notes sql.NullString
		var lat, lng sql.NullFloat64

		err := rows.Scan(
			&embassy.ID,
			&embassy.City,
			&parentCity,
			&embassy.Category,
			&embassy.Name,
			&embassy.Phone,
			&altPhone,
			&embassy.Address,
			&lat,
			&lng,
			&embassy.Is247,
			&notes,
		)
		if err != nil {
			continue
		}

		if parentCity.Valid {
			embassy.ParentCity = &parentCity.String
		}
		if altPhone.Valid {
			embassy.AlternatePhone = &altPhone.String
		}
		if lat.Valid {
			embassy.Latitude = &lat.Float64
		}
		if lng.Valid {
			embassy.Longitude = &lng.Float64
		}
		if notes.Valid {
			embassy.Notes = &notes.String
		}

		embassies = append(embassies, embassy)
	}

	return embassies, nil
}

// groupContactsByCategory organizes contacts by their category
func groupContactsByCategory(contacts []EmergencyContact) map[string][]EmergencyContact {
	grouped := make(map[string][]EmergencyContact)

	for _, contact := range contacts {
		grouped[contact.Category] = append(grouped[contact.Category], contact)
	}

	return grouped
}

// getSafetyTips returns safety tips for travelers
func getSafetyTips() []string {
	return []string{
		"Always keep emergency numbers saved in your phone contacts",
		"Share your complete itinerary with family or friends",
		"Keep your hotel address and contact number with you at all times",
		"Note the nearest hospital location when you arrive at a destination",
		"Carry photocopies of important documents (passport, ID, visa)",
		"Keep local currency for emergencies",
		"Download offline maps and emergency contacts before traveling",
		"Register with your embassy if traveling for an extended period",
		"Keep a charged power bank with you",
		"Learn basic local emergency phrases",
	}
}
