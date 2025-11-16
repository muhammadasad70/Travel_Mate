// package controllers

// import (
// 	"database/sql"
// 	"log"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"travel_mate/backend/database"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// 	"github.com/lib/pq"
// )

// /* ---------------------------- Create + Traveler ---------------------------- */

// type createBookingPayload struct {
// 	ServiceId    int     `json:"service_id"`
// 	ChosenDate   *string `json:"chosen_date"` // YYYY-MM-DD (required)
// 	Participants int     `json:"participants"`
// 	Message      string  `json:"message"`
// }

// func CreateBooking(c *gin.Context) {
// 	travelerId := c.GetInt("user_id")

// 	var in createBookingPayload
// 	if err := c.ShouldBindJSON(&in); err != nil || in.ServiceId <= 0 || in.Participants <= 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// 		return
// 	}

// 	// Require a date in YYYY-MM-DD
// 	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
// 		return
// 	}
// 	cd := strings.TrimSpace(*in.ChosenDate)
// 	if _, err := time.Parse("2006-01-02", cd); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
// 		return
// 	}

// 	// Load service (to get vendor + pricing)
// 	svcMap, err := models.GetCulturalServiceByID(in.ServiceId)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
// 		return
// 	}

// 	// Extract fields from map
// 	scheduleType, _ := svcMap["schedule_type"].(string)
// 	pricingModel, _ := svcMap["pricing_model"].(string)
// 	userId, _ := svcMap["user_id"].(int)
// 	serviceId, _ := svcMap["id"].(int)

// 	// Fixed dates validation
// 	if scheduleType == "fixed_dates" {
// 		fixedDatesRaw, ok := svcMap["fixed_dates"].([]string)
// 		if ok {
// 			found := false
// 			for _, d := range fixedDatesRaw {
// 				if d == cd {
// 					found = true
// 					break
// 				}
// 			}
// 			if !found {
// 				c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
// 				return
// 			}
// 		}
// 	}

// 	// Snapshot (optional for free/exchange)
// 	var snap *float64
// 	if pricingModel == "per_person" {
// 		if pricePtr, ok := svcMap["price_per_person"].(*float64); ok && pricePtr != nil {
// 			snap = pricePtr
// 		}
// 	}
// 	if pricingModel == "per_group" {
// 		if pricePtr, ok := svcMap["price_per_group"].(*float64); ok && pricePtr != nil {
// 			snap = pricePtr
// 		}
// 	}

// 	// Build booking row
// 	b := models.Booking{
// 		ServiceId:     serviceId,
// 		VendorId:      userId,
// 		TravelerId:    travelerId,
// 		Status:        "pending",
// 		ChosenDate:    in.ChosenDate,
// 		Participants:  in.Participants,
// 		Message:       strings.TrimSpace(in.Message),
// 		PriceSnapshot: snap,
// 		PricingModel:  pricingModel,
// 	}

// 	// Insert
// 	if err := models.CreateBooking(&b); err != nil {
// 		if pgErr, ok := err.(*pq.Error); ok {
// 			// Unique on (service_id, traveler_id, chosen_date) for pending/confirmed
// 			if pgErr.Code == "23505" {
// 				c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
// 				return
// 			}
// 			log.Printf("CreateBooking DB error: %s (%s)", pgErr.Message, pgErr.Code)
// 		}
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create booking"})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, b)
// }

// /* ---------------------------- Traveler Bookings with Vendor Info ---------------------------- */

// type travelerBookingDTO struct {
// 	ID           int64           `json:"id"`
// 	ServiceID    int64           `json:"service_id"`
// 	VendorID     int64           `json:"vendor_id"`
// 	TravelerID   int64           `json:"traveler_id"`
// 	Status       string          `json:"status"`
// 	ChosenDate   sql.NullString  `json:"chosen_date"`
// 	Participants int             `json:"participants"`
// 	Message      string          `json:"message"`
// 	PriceSnap    sql.NullFloat64 `json:"price_snapshot"`
// 	PricingModel string          `json:"pricing_model"`
// 	CreatedAt    time.Time       `json:"created_at"`

// 	Service struct {
// 		ID             int64           `json:"id"`
// 		Title          string          `json:"title"`
// 		City           sql.NullString  `json:"city"`
// 		DurationHours  sql.NullFloat64 `json:"duration_hours"`
// 		PricingModel   sql.NullString  `json:"pricing_model"`
// 		PricePerPerson sql.NullFloat64 `json:"price_per_person"`
// 		PricePerGroup  sql.NullFloat64 `json:"price_per_group"`
// 		GroupIncluded  sql.NullInt64   `json:"group_included_size"`
// 		GroupMax       sql.NullInt64   `json:"group_size_max"`
// 	} `json:"service"`

// 	Vendor struct {
// 		ID          int64          `json:"id"`
// 		Name        sql.NullString `json:"name"`
// 		Email       sql.NullString `json:"email"`
// 		Phone       sql.NullString `json:"phone"`
// 		CountryCode sql.NullString `json:"country_code"`
// 		Avatar      sql.NullString `json:"avatar_url"`
// 	} `json:"vendor"`
// }

// func ListTravelerBookings(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	db := database.DB

// 	rows, err := db.Query(`
// SELECT
//   b.id,
//   b.service_id,
//   b.vendor_id,
//   b.traveler_id,
//   b.status,
//   b.chosen_date,
//   b.participants,
//   b.message,
//   b.price_snapshot,
//   b.pricing_model,
//   b.created_at,

//   s.id,
//   s.title,
//   s.city,
//   s.duration_hours,
//   s.pricing_model,
//   s.price_per_person,
//   s.price_per_group,
//   s.group_included_size,
//   s.group_size_max,

//   u.id,
//   COALESCE(u.name, NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''), u.email) AS vendor_name,
//   u.email,
//   u.phone,
//   u.country_code,
//   u.avatar_url
// FROM cultural_service_bookings b
// JOIN cultural_services s ON s.id = b.service_id
// JOIN users u ON u.id = b.vendor_id
// WHERE b.traveler_id = $1
// ORDER BY b.created_at DESC
// `, uid)
// 	if err != nil {
// 		log.Println("traveler bookings query error:", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// 		return
// 	}
// 	defer rows.Close()

// 	out := make([]travelerBookingDTO, 0, 32)
// 	for rows.Next() {
// 		var x travelerBookingDTO
// 		if err := rows.Scan(
// 			&x.ID, &x.ServiceID, &x.VendorID, &x.TravelerID, &x.Status, &x.ChosenDate,
// 			&x.Participants, &x.Message, &x.PriceSnap, &x.PricingModel, &x.CreatedAt,
// 			&x.Service.ID, &x.Service.Title, &x.Service.City, &x.Service.DurationHours,
// 			&x.Service.PricingModel, &x.Service.PricePerPerson, &x.Service.PricePerGroup,
// 			&x.Service.GroupIncluded, &x.Service.GroupMax,
// 			&x.Vendor.ID, &x.Vendor.Name, &x.Vendor.Email, &x.Vendor.Phone,
// 			&x.Vendor.CountryCode, &x.Vendor.Avatar,
// 		); err != nil {
// 			log.Println("traveler bookings scan error:", err)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
// 			return
// 		}
// 		out = append(out, x)
// 	}
// 	c.JSON(http.StatusOK, out)
// }

// /* ---------------------------- Vendor (enriched) ---------------------------- */

// type vendorBookingDTO struct {
// 	ID           int64           `json:"id"`
// 	ServiceID    int64           `json:"service_id"`
// 	UserID       int64           `json:"user_id"` // traveler id (for UI compatibility)
// 	Status       string          `json:"status"`
// 	Participants int             `json:"participants"`
// 	ChosenDate   sql.NullString  `json:"chosen_date"` // TEXT, may be NULL
// 	PriceSnap    sql.NullFloat64 `json:"price_snapshot"`

// 	Service struct {
// 		ID             int64           `json:"id"`
// 		Title          string          `json:"title"`
// 		City           sql.NullString  `json:"city"`
// 		DurationHours  sql.NullFloat64 `json:"duration_hours"`
// 		PricingModel   sql.NullString  `json:"pricing_model"`
// 		PricePerPerson sql.NullFloat64 `json:"price_per_person"`
// 		PricePerGroup  sql.NullFloat64 `json:"price_per_group"`
// 		GroupIncluded  sql.NullInt64   `json:"group_included_size"`
// 		GroupMax       sql.NullInt64   `json:"group_size_max"`
// 	} `json:"service"`

// 	Traveler struct {
// 		ID     int64          `json:"id"`
// 		Name   sql.NullString `json:"name"`
// 		Email  sql.NullString `json:"email"`
// 		Avatar sql.NullString `json:"avatar_url"`
// 	} `json:"traveler"`
// }

// func listVendorByStatus(c *gin.Context, status string) {
// 	vendorID := c.GetInt("user_id")
// 	db := database.DB

// 	rows, err := db.Query(`
// SELECT
//   b.id,
//   b.service_id,
//   b.traveler_id          AS user_id,
//   b.status,
//   b.participants,
//   b.chosen_date,                 -- TEXT (nullable)
//   b.price_snapshot,

//   s.id,
//   s.title,
//   s.city,
//   s.duration_hours,
//   s.pricing_model,
//   s.price_per_person,
//   s.price_per_group,
//   s.group_included_size,
//   s.group_size_max,

//   u.id,
//   COALESCE(u.name, NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''), u.email) AS traveler_name,
//   u.email,
//   u.avatar_url
// FROM cultural_service_bookings b
// JOIN cultural_services s ON s.id = b.service_id
// JOIN users u             ON u.id = b.traveler_id
// WHERE b.vendor_id = $1 AND LOWER(b.status) = $2
// ORDER BY b.id DESC
// `, vendorID, strings.ToLower(status))
// 	if err != nil {
// 		log.Println("vendor list query error:", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
// 		return
// 	}
// 	defer rows.Close()

// 	out := make([]vendorBookingDTO, 0, 32)
// 	for rows.Next() {
// 		var x vendorBookingDTO
// 		if err := rows.Scan(
// 			&x.ID, &x.ServiceID, &x.UserID, &x.Status, &x.Participants, &x.ChosenDate, &x.PriceSnap,
// 			&x.Service.ID, &x.Service.Title, &x.Service.City, &x.Service.DurationHours, &x.Service.PricingModel,
// 			&x.Service.PricePerPerson, &x.Service.PricePerGroup, &x.Service.GroupIncluded, &x.Service.GroupMax,
// 			&x.Traveler.ID, &x.Traveler.Name, &x.Traveler.Email, &x.Traveler.Avatar,
// 		); err != nil {
// 			log.Println("vendor list scan error:", err)
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
// 			return
// 		}
// 		out = append(out, x)
// 	}
// 	c.JSON(http.StatusOK, out)
// }

// func ListVendorRequests(c *gin.Context) { listVendorByStatus(c, "pending") }
// func ListVendorBooked(c *gin.Context)   { listVendorByStatus(c, "confirmed") }

// /* ------------------------------- Status update ------------------------------- */

// type updateStatusPayload struct {
// 	Action string `json:"action"` // confirm | decline
// }

// func UpdateVendorRequestStatus(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	id, ok := parseIDParam(c, "id")
// 	if !ok {
// 		return
// 	}

// 	var in updateStatusPayload
// 	if err := c.ShouldBindJSON(&in); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// 		return
// 	}
// 	b, err := models.GetBookingForVendor(uid, id)
// 	if err != nil {
// 		if err == models.ErrForbidden {
// 			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
// 			return
// 		}
// 		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// 		return
// 	}

// 	var newStatus string
// 	switch in.Action {
// 	case "confirm":
// 		newStatus = "confirmed"
// 	case "decline":
// 		newStatus = "declined"
// 	default:
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action"})
// 		return
// 	}

// 	if b.Status != "pending" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "not pending"})
// 		return
// 	}
// 	if err := models.UpdateBookingStatus(id, newStatus); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// 		return
// 	}
// 	c.Status(http.StatusNoContent)
// }

package controllers

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
	"time"

	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

/* ---------------------------- Create + Traveler ---------------------------- */

type createBookingPayload struct {
	ServiceId    int     `json:"service_id"`
	ChosenDate   *string `json:"chosen_date"` // YYYY-MM-DD (required)
	Participants int     `json:"participants"`
	Message      string  `json:"message"`
}

func CreateBooking(c *gin.Context) {
	travelerId := c.GetInt("user_id")

	var in createBookingPayload
	if err := c.ShouldBindJSON(&in); err != nil || in.ServiceId <= 0 || in.Participants <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// Require a date in YYYY-MM-DD
	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
		return
	}
	cd := strings.TrimSpace(*in.ChosenDate)
	if _, err := time.Parse("2006-01-02", cd); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
		return
	}

	// Load service (to get vendor + pricing)
	svcMap, err := models.GetCulturalServiceByID(in.ServiceId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
		return
	}

	// Extract fields from map
	scheduleType, _ := svcMap["schedule_type"].(string)
	pricingModel, _ := svcMap["pricing_model"].(string)
	userId, _ := svcMap["user_id"].(int)
	serviceId, _ := svcMap["id"].(int)

	// Fixed dates validation
	if scheduleType == "fixed_dates" {
		fixedDatesRaw, ok := svcMap["fixed_dates"].([]string)
		if ok {
			found := false
			for _, d := range fixedDatesRaw {
				if d == cd {
					found = true
					break
				}
			}
			if !found {
				c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
				return
			}
		}
	}

	// Snapshot (optional for free/exchange)
	var snap *float64
	if pricingModel == "per_person" {
		if pricePtr, ok := svcMap["price_per_person"].(*float64); ok && pricePtr != nil {
			snap = pricePtr
		}
	}
	if pricingModel == "per_group" {
		if pricePtr, ok := svcMap["price_per_group"].(*float64); ok && pricePtr != nil {
			snap = pricePtr
		}
	}

	// Build booking row
	b := models.Booking{
		ServiceId:     serviceId,
		VendorId:      userId,
		TravelerId:    travelerId,
		Status:        "pending",
		ChosenDate:    in.ChosenDate,
		Participants:  in.Participants,
		Message:       strings.TrimSpace(in.Message),
		PriceSnapshot: snap,
		PricingModel:  pricingModel,
	}

	// Insert
	if err := models.CreateBooking(&b); err != nil {
		if pgErr, ok := err.(*pq.Error); ok {
			// Unique on (service_id, traveler_id, chosen_date) for pending/confirmed
			if pgErr.Code == "23505" {
				c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
				return
			}
			log.Printf("CreateBooking DB error: %s (%s)", pgErr.Message, pgErr.Code)
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create booking"})
		return
	}

	c.JSON(http.StatusCreated, b)
}

/* ---------------------------- Traveler Bookings with Vendor Info ---------------------------- */

type travelerBookingDTO struct {
	ID           int64           `json:"id"`
	ServiceID    int64           `json:"service_id"`
	VendorID     int64           `json:"vendor_id"`
	TravelerID   int64           `json:"traveler_id"`
	Status       string          `json:"status"`
	ChosenDate   sql.NullString  `json:"chosen_date"`
	Participants int             `json:"participants"`
	Message      string          `json:"message"`
	PriceSnap    sql.NullFloat64 `json:"price_snapshot"`
	PricingModel string          `json:"pricing_model"`
	CreatedAt    time.Time       `json:"created_at"`

	Service struct {
		ID             int64           `json:"id"`
		Title          string          `json:"title"`
		City           sql.NullString  `json:"city"`
		DurationHours  sql.NullFloat64 `json:"duration_hours"`
		PricingModel   sql.NullString  `json:"pricing_model"`
		PricePerPerson sql.NullFloat64 `json:"price_per_person"`
		PricePerGroup  sql.NullFloat64 `json:"price_per_group"`
		GroupIncluded  sql.NullInt64   `json:"group_included_size"`
		GroupMax       sql.NullInt64   `json:"group_size_max"`
	} `json:"service"`

	Vendor struct {
		ID          int64          `json:"id"`
		Name        sql.NullString `json:"name"`
		Email       sql.NullString `json:"email"`
		Phone       sql.NullString `json:"phone"`
		CountryCode sql.NullString `json:"country_code"`
		Avatar      sql.NullString `json:"avatar_url"`
	} `json:"vendor"`
}

func ListTravelerBookings(c *gin.Context) {
	uid := c.GetInt("user_id")
	db := database.DB

	rows, err := db.Query(`
SELECT
  b.id,
  b.service_id,
  b.vendor_id,
  b.traveler_id,
  b.status,
  b.chosen_date,
  b.participants,
  b.message,
  b.price_snapshot,
  b.pricing_model,
  b.created_at,

  s.id,
  s.title,
  s.city,
  s.duration_hours,
  s.pricing_model,
  s.price_per_person,
  s.price_per_group,
  s.group_included_size,
  s.group_size_max,

  u.id,
  COALESCE(u.name, NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''), u.email) AS vendor_name,
  u.email,
  u.phone,
  u.country_code,
  u.avatar_url
FROM cultural_service_bookings b
JOIN cultural_services s ON s.id = b.service_id
JOIN users u ON u.id = b.vendor_id
WHERE b.traveler_id = $1
ORDER BY b.created_at DESC
`, uid)
	if err != nil {
		log.Println("traveler bookings query error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	defer rows.Close()

	out := make([]travelerBookingDTO, 0, 32)
	for rows.Next() {
		var x travelerBookingDTO
		if err := rows.Scan(
			&x.ID, &x.ServiceID, &x.VendorID, &x.TravelerID, &x.Status, &x.ChosenDate,
			&x.Participants, &x.Message, &x.PriceSnap, &x.PricingModel, &x.CreatedAt,
			&x.Service.ID, &x.Service.Title, &x.Service.City, &x.Service.DurationHours,
			&x.Service.PricingModel, &x.Service.PricePerPerson, &x.Service.PricePerGroup,
			&x.Service.GroupIncluded, &x.Service.GroupMax,
			&x.Vendor.ID, &x.Vendor.Name, &x.Vendor.Email, &x.Vendor.Phone,
			&x.Vendor.CountryCode, &x.Vendor.Avatar,
		); err != nil {
			log.Println("traveler bookings scan error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
			return
		}
		out = append(out, x)
	}
	c.JSON(http.StatusOK, out)
}

/* ---------------------------- Vendor (enriched) ---------------------------- */

type vendorBookingDTO struct {
	ID           int64           `json:"id"`
	ServiceID    int64           `json:"service_id"`
	UserID       int64           `json:"user_id"` // traveler id (for UI compatibility)
	Status       string          `json:"status"`
	Participants int             `json:"participants"`
	ChosenDate   sql.NullString  `json:"chosen_date"` // TEXT, may be NULL
	PriceSnap    sql.NullFloat64 `json:"price_snapshot"`

	Service struct {
		ID             int64           `json:"id"`
		Title          string          `json:"title"`
		City           sql.NullString  `json:"city"`
		DurationHours  sql.NullFloat64 `json:"duration_hours"`
		PricingModel   sql.NullString  `json:"pricing_model"`
		PricePerPerson sql.NullFloat64 `json:"price_per_person"`
		PricePerGroup  sql.NullFloat64 `json:"price_per_group"`
		GroupIncluded  sql.NullInt64   `json:"group_included_size"`
		GroupMax       sql.NullInt64   `json:"group_size_max"`
	} `json:"service"`

	Traveler struct {
		ID          int64          `json:"id"`
		Name        sql.NullString `json:"name"`
		Email       sql.NullString `json:"email"`
		Phone       sql.NullString `json:"phone"`
		CountryCode sql.NullString `json:"country_code"`
		Avatar      sql.NullString `json:"avatar_url"`
	} `json:"traveler"`
}

func listVendorByStatus(c *gin.Context, status string) {
	vendorID := c.GetInt("user_id")
	db := database.DB

	rows, err := db.Query(`
SELECT
  b.id,
  b.service_id,
  b.traveler_id          AS user_id,
  b.status,
  b.participants,
  b.chosen_date,
  b.price_snapshot,

  s.id,
  s.title,
  s.city,
  s.duration_hours,
  s.pricing_model,
  s.price_per_person,
  s.price_per_group,
  s.group_included_size,
  s.group_size_max,

  u.id,
  COALESCE(u.name, NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''), u.email) AS traveler_name,
  u.email,
  u.phone,
  u.country_code,
  u.avatar_url
FROM cultural_service_bookings b
JOIN cultural_services s ON s.id = b.service_id
JOIN users u             ON u.id = b.traveler_id
WHERE b.vendor_id = $1 AND LOWER(b.status) = $2
ORDER BY b.id DESC
`, vendorID, strings.ToLower(status))
	if err != nil {
		log.Println("vendor list query error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query error"})
		return
	}
	defer rows.Close()

	out := make([]vendorBookingDTO, 0, 32)
	for rows.Next() {
		var x vendorBookingDTO
		if err := rows.Scan(
			&x.ID, &x.ServiceID, &x.UserID, &x.Status, &x.Participants, &x.ChosenDate, &x.PriceSnap,
			&x.Service.ID, &x.Service.Title, &x.Service.City, &x.Service.DurationHours, &x.Service.PricingModel,
			&x.Service.PricePerPerson, &x.Service.PricePerGroup, &x.Service.GroupIncluded, &x.Service.GroupMax,
			&x.Traveler.ID, &x.Traveler.Name, &x.Traveler.Email, &x.Traveler.Phone,
			&x.Traveler.CountryCode, &x.Traveler.Avatar,
		); err != nil {
			log.Println("vendor list scan error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan error"})
			return
		}
		out = append(out, x)
	}
	c.JSON(http.StatusOK, out)
}

func ListVendorRequests(c *gin.Context) { listVendorByStatus(c, "pending") }
func ListVendorBooked(c *gin.Context)   { listVendorByStatus(c, "confirmed") }

/* ------------------------------- Status update ------------------------------- */

type updateStatusPayload struct {
	Action string `json:"action"` // confirm | decline
}

func UpdateVendorRequestStatus(c *gin.Context) {
	uid := c.GetInt("user_id")
	id, ok := parseIDParam(c, "id")
	if !ok {
		return
	}

	var in updateStatusPayload
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}
	b, err := models.GetBookingForVendor(uid, id)
	if err != nil {
		if err == models.ErrForbidden {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var newStatus string
	switch in.Action {
	case "confirm":
		newStatus = "confirmed"
	case "decline":
		newStatus = "declined"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action"})
		return
	}

	if b.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not pending"})
		return
	}
	if err := models.UpdateBookingStatus(id, newStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	c.Status(http.StatusNoContent)
}
