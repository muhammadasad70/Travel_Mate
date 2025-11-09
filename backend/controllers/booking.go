// // // // controllers/booking.go
// // // package controllers

// // // import (
// // // 	"net/http"
// // // 	"strings"
// // // 	"time"

// // // 	"travel_mate/backend/models"

// // // 	"github.com/gin-gonic/gin"
// // // 	"github.com/lib/pq"
// // // )

// // // type createBookingPayload struct {
// // // 	ServiceId    int     `json:"service_id"`
// // // 	ChosenDate   *string `json:"chosen_date"` // optional
// // // 	Participants int     `json:"participants"`
// // // 	Message      string  `json:"message"`
// // // }

// // // func CreateBooking(c *gin.Context) {
// // // 	travelerId := c.GetInt("user_id")

// // // 	var in createBookingPayload
// // // 	if err := c.ShouldBindJSON(&in); err != nil || in.ServiceId <= 0 || in.Participants <= 0 {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // // 		return
// // // 	}

// // // 	// require a date (YYYY-MM-DD), because the rule is "not same service on same date"
// // // 	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
// // // 		return
// // // 	}
// // // 	if _, err := time.Parse("2006-01-02", strings.TrimSpace(*in.ChosenDate)); err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
// // // 		return
// // // 	}

// // // 	// fetch service to derive vendor/pricing snapshot
// // // 	svc, err := models.GetCulturalServiceByID(in.ServiceId)
// // // 	if err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
// // // 		return
// // // 	}

// // // 	// optional: if the service uses fixed_dates, ensure chosen_date is one of them
// // // 	if svc.ScheduleType == "fixed_dates" {
// // // 		cd := strings.TrimSpace(*in.ChosenDate)
// // // 		ok := false
// // // 		for _, d := range svc.FixedDates {
// // // 			if d == cd {
// // // 				ok = true
// // // 				break
// // // 			}
// // // 		}
// // // 		if !ok {
// // // 			c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
// // // 			return
// // // 		}
// // // 	}

// // // 	var snap *float64
// // // 	if svc.PricingModel == "per_person" && svc.PricePerPerson != nil {
// // // 		snap = svc.PricePerPerson
// // // 	}
// // // 	if svc.PricingModel == "per_group" && svc.PricePerGroup != nil {
// // // 		snap = svc.PricePerGroup
// // // 	}

// // // 	b := models.Booking{
// // // 		ServiceId:     svc.Id,
// // // 		VendorId:      svc.UserId,
// // // 		TravelerId:    travelerId,
// // // 		Status:        "pending",
// // // 		ChosenDate:    in.ChosenDate,
// // // 		Participants:  in.Participants,
// // // 		Message:       strings.TrimSpace(in.Message),
// // // 		PriceSnapshot: snap,
// // // 		PricingModel:  svc.PricingModel,
// // // 	}

// // // 	if err := models.CreateBooking(&b); err != nil {
// // // 		// if the DB’s unique index blocked a duplicate, return 409 with a friendly message
// // // 		if pgErr, ok := err.(*pq.Error); ok && pgErr.Code == "23505" {
// // // 			c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create booking"})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusCreated, b)
// // // }

// // // func ListTravelerBookings(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	list, err := models.ListTravelerBookingsEnriched(uid)
// // // 	if err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, list)
// // // }

// // // func ListVendorRequests(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	list, err := models.ListVendorBookingsByStatus(uid, "pending")
// // // 	if err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, list)
// // // }

// // // func ListVendorBooked(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	list, err := models.ListVendorBookingsByStatus(uid, "confirmed")
// // // 	if err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, list)
// // // }

// // // type updateStatusPayload struct {
// // // 	Action string `json:"action"` // confirm | decline
// // // }

// // // func UpdateVendorRequestStatus(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	id, ok := parseIDParam(c, "id")
// // // 	if !ok {
// // // 		return
// // // 	}

// // // 	var in updateStatusPayload
// // // 	if err := c.ShouldBindJSON(&in); err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // // 		return
// // // 	}
// // // 	b, err := models.GetBookingForVendor(uid, id)
// // // 	if err != nil {
// // // 		if err == models.ErrForbidden {
// // // 			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // 		return
// // // 	}

// // // 	var newStatus string
// // // 	switch in.Action {
// // // 	case "confirm":
// // // 		newStatus = "confirmed"
// // // 	case "decline":
// // // 		newStatus = "declined"
// // // 	default:
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action"})
// // // 		return
// // // 	}

// // // 	if b.Status != "pending" {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "not pending"})
// // // 		return
// // // 	}
// // // 	if err := models.UpdateBookingStatus(id, newStatus); err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // // 		return
// // // 	}
// // // 	c.Status(http.StatusNoContent)
// // // }

// // package controllers

// // import (
// // 	"net/http"
// // 	"strings"
// // 	"time"

// // 	"travel_mate/backend/models"

// // 	"github.com/gin-gonic/gin"
// // 	"github.com/lib/pq"
// // )

// // type createBookingPayload struct {
// // 	ServiceId    int     `json:"service_id"`
// // 	ChosenDate   *string `json:"chosen_date"` // required by API rule
// // 	Participants int     `json:"participants"`
// // 	Message      string  `json:"message"`
// // }

// // func CreateBooking(c *gin.Context) {
// // 	travelerId := c.GetInt("user_id")

// // 	var in createBookingPayload
// // 	if err := c.ShouldBindJSON(&in); err != nil || in.ServiceId <= 0 || in.Participants <= 0 {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // 		return
// // 	}

// // 	// require a date (YYYY-MM-DD)
// // 	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
// // 		return
// // 	}
// // 	if _, err := time.Parse("2006-01-02", strings.TrimSpace(*in.ChosenDate)); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
// // 		return
// // 	}

// // 	// fetch service to derive vendor/pricing snapshot
// // 	svc, err := models.GetCulturalServiceByID(in.ServiceId)
// // 	if err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
// // 		return
// // 	}

// // 	// if fixed_dates, ensure chosen_date is allowed
// // 	if svc.ScheduleType == "fixed_dates" {
// // 		cd := strings.TrimSpace(*in.ChosenDate)
// // 		ok := false
// // 		for _, d := range svc.FixedDates {
// // 			if d == cd {
// // 				ok = true
// // 				break
// // 			}
// // 		}
// // 		if !ok {
// // 			c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
// // 			return
// // 		}
// // 	}

// // 	// snapshot
// // 	var snap *float64
// // 	if svc.PricingModel == "per_person" && svc.PricePerPerson != nil {
// // 		snap = svc.PricePerPerson
// // 	}
// // 	if svc.PricingModel == "per_group" && svc.PricePerGroup != nil {
// // 		snap = svc.PricePerGroup
// // 	}

// // 	b := models.Booking{
// // 		ServiceId:     svc.Id,
// // 		VendorId:      svc.UserId,
// // 		TravelerId:    travelerId,
// // 		Status:        "pending",
// // 		ChosenDate:    in.ChosenDate,
// // 		Participants:  in.Participants,
// // 		Message:       strings.TrimSpace(in.Message),
// // 		PriceSnapshot: snap,
// // 		PricingModel:  svc.PricingModel,
// // 	}

// // 	if err := models.CreateBooking(&b); err != nil {
// // 		if pgErr, ok := err.(*pq.Error); ok && pgErr.Code == "23505" {
// // 			c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
// // 			return
// // 		}
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create booking"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusCreated, b)
// // }

// // func ListTravelerBookings(c *gin.Context) {
// // 	uid := c.GetInt("user_id")
// // 	list, err := models.ListTravelerBookingsEnriched(uid)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, list)
// // }

// // func ListVendorRequests(c *gin.Context) {
// // 	uid := c.GetInt("user_id")
// // 	list, err := models.ListVendorBookingsByStatus(uid, "pending")
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, list)
// // }

// // func ListVendorBooked(c *gin.Context) {
// // 	uid := c.GetInt("user_id")
// // 	list, err := models.ListVendorBookingsByStatus(uid, "confirmed")
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, list)
// // }

// // type updateStatusPayload struct {
// // 	Action string `json:"action"` // confirm | decline
// // }

// // func UpdateVendorRequestStatus(c *gin.Context) {
// // 	uid := c.GetInt("user_id")
// // 	id, ok := parseIDParam(c, "id")
// // 	if !ok {
// // 		return
// // 	}

// // 	var in updateStatusPayload
// // 	if err := c.ShouldBindJSON(&in); err != nil {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // 		return
// // 	}
// // 	b, err := models.GetBookingForVendor(uid, id)
// // 	if err != nil {
// // 		if err == models.ErrForbidden {
// // 			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
// // 			return
// // 		}
// // 		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // 		return
// // 	}

// // 	var newStatus string
// // 	switch in.Action {
// // 	case "confirm":
// // 		newStatus = "confirmed"
// // 	case "decline":
// // 		newStatus = "declined"
// // 	default:
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action"})
// // 		return
// // 	}

// // 	if b.Status != "pending" {
// // 		c.JSON(http.StatusBadRequest, gin.H{"error": "not pending"})
// // 		return
// // 	}
// // 	if err := models.UpdateBookingStatus(id, newStatus); err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // 		return
// // 	}
// // 	c.Status(http.StatusNoContent)
// // }

// package controllers

// import (
// 	"database/sql"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"travel_mate/backend/database"
// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// 	"github.com/lib/pq"
// )

// type createBookingPayload struct {
// 	ServiceId    int     `json:"service_id"`
// 	ChosenDate   *string `json:"chosen_date"`
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

// 	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
// 		return
// 	}
// 	if _, err := time.Parse("2006-01-02", strings.TrimSpace(*in.ChosenDate)); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
// 		return
// 	}

// 	svc, err := models.GetCulturalServiceByID(in.ServiceId)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
// 		return
// 	}

// 	if svc.ScheduleType == "fixed_dates" {
// 		cd := strings.TrimSpace(*in.ChosenDate)
// 		ok := false
// 		for _, d := range svc.FixedDates {
// 			if d == cd {
// 				ok = true
// 				break
// 			}
// 		}
// 		if !ok {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
// 			return
// 		}
// 	}

// 	var snap *float64
// 	if svc.PricingModel == "per_person" && svc.PricePerPerson != nil {
// 		snap = svc.PricePerPerson
// 	}
// 	if svc.PricingModel == "per_group" && svc.PricePerGroup != nil {
// 		snap = svc.PricePerGroup
// 	}

// 	b := models.Booking{
// 		ServiceId:     svc.Id,
// 		VendorId:      svc.UserId,
// 		TravelerId:    travelerId,
// 		Status:        "pending",
// 		ChosenDate:    in.ChosenDate,
// 		Participants:  in.Participants,
// 		Message:       strings.TrimSpace(in.Message),
// 		PriceSnapshot: snap,
// 		PricingModel:  svc.PricingModel,
// 	}

// 	if err := models.CreateBooking(&b); err != nil {
// 		if pgErr, ok := err.(*pq.Error); ok && pgErr.Code == "23505" {
// 			c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
// 			return
// 		}
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create booking"})
// 		return
// 	}
// 	c.JSON(http.StatusCreated, b)
// }

// func ListTravelerBookings(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	list, err := models.ListTravelerBookingsEnriched(uid)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, list)
// }

// /* ---------- VENDOR LISTS WITH DETAILS (service + traveler) ---------- */

// type vendorBookingDTO struct {
// 	ID           int64          `json:"id"`
// 	ServiceID    int64          `json:"service_id"`
// 	UserID       int64          `json:"user_id"` // traveler id
// 	Status       string         `json:"status"`
// 	Participants int            `json:"participants"`
// 	ChosenDate   sql.NullString `json:"chosen_date"`
// 	PriceSnap    sql.NullInt64  `json:"price_snapshot"`
// 	PricingModel sql.NullString `json:"pricing_model"`

// 	Service struct {
// 		ID             int64          `json:"id"`
// 		Title          string         `json:"title"`
// 		City           sql.NullString `json:"city"`
// 		DurationHours  sql.NullInt64  `json:"duration_hours"`
// 		PricingModel   sql.NullString `json:"pricing_model"`
// 		PricePerPerson sql.NullInt64  `json:"price_per_person"`
// 		PricePerGroup  sql.NullInt64  `json:"price_per_group"`
// 		GroupIncluded  sql.NullInt64  `json:"group_included_size"`
// 		GroupMax       sql.NullInt64  `json:"group_size_max"`
// 	} `json:"service"`

// 	Traveler struct {
// 		ID     int64          `json:"id"`
// 		Name   sql.NullString `json:"name"`
// 		Email  sql.NullString `json:"email"`
// 		Avatar sql.NullString `json:"avatar_url"`
// 	} `json:"traveler"`
// }

// func listVendorByStatus(c *gin.Context, status string) {
// 	vendorID := c.GetInt64("user_id")
// 	db := database.DB

// 	rows, err := db.Query(`
// SELECT
//   b.id, b.service_id, b.user_id, b.status, b.participants, b.chosen_date, b.price_snapshot, b.pricing_model,
//   s.id, s.title, s.city, s.duration_hours, s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.group_size_max,
//   u.id, COALESCE(u.full_name, u.name) AS traveler_name, u.email, u.avatar_url
// FROM cultural_bookings b
// JOIN cultural_services s ON s.id = b.service_id
// JOIN users u             ON u.id = b.user_id
// WHERE s.user_id = $1 AND LOWER(b.status) = $2
// ORDER BY b.id DESC
// `, vendorID, strings.ToLower(status))
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	defer rows.Close()

// 	out := make([]vendorBookingDTO, 0, 32)
// 	for rows.Next() {
// 		var x vendorBookingDTO
// 		if err := rows.Scan(
// 			&x.ID, &x.ServiceID, &x.UserID, &x.Status, &x.Participants, &x.ChosenDate, &x.PriceSnap, &x.PricingModel,
// 			&x.Service.ID, &x.Service.Title, &x.Service.City, &x.Service.DurationHours, &x.Service.PricingModel,
// 			&x.Service.PricePerPerson, &x.Service.PricePerGroup, &x.Service.GroupIncluded, &x.Service.GroupMax,
// 			&x.Traveler.ID, &x.Traveler.Name, &x.Traveler.Email, &x.Traveler.Avatar,
// 		); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 			return
// 		}
// 		out = append(out, x)
// 	}
// 	c.JSON(http.StatusOK, out)
// }

// func ListVendorRequests(c *gin.Context) { listVendorByStatus(c, "pending") }
// func ListVendorBooked(c *gin.Context)   { listVendorByStatus(c, "confirmed") }

// /* ---------- status update ---------- */

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

//		if b.Status != "pending" {
//			c.JSON(http.StatusBadRequest, gin.H{"error": "not pending"})
//			return
//		}
//		if err := models.UpdateBookingStatus(id, newStatus); err != nil {
//			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
//			return
//		}
//		c.Status(http.StatusNoContent)
//	}
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
	if _, err := time.Parse("2006-01-02", strings.TrimSpace(*in.ChosenDate)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
		return
	}

	// Load service (to get vendor + pricing)
	svc, err := models.GetCulturalServiceByID(in.ServiceId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
		return
	}

	// If fixed dates, enforce the pick
	if svc.ScheduleType == "fixed_dates" {
		cd := strings.TrimSpace(*in.ChosenDate)
		ok := false
		for _, d := range svc.FixedDates {
			if d == cd {
				ok = true
				break
			}
		}
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "selected date is not available for this experience"})
			return
		}
	}

	// Snapshot (optional for free/exchange)
	var snap *float64
	if svc.PricingModel == "per_person" && svc.PricePerPerson != nil {
		snap = svc.PricePerPerson
	}
	if svc.PricingModel == "per_group" && svc.PricePerGroup != nil {
		snap = svc.PricePerGroup
	}

	// Build booking row
	b := models.Booking{
		ServiceId:     svc.Id,
		VendorId:      svc.UserId,
		TravelerId:    travelerId,
		Status:        "pending",
		ChosenDate:    in.ChosenDate,
		Participants:  in.Participants,
		Message:       strings.TrimSpace(in.Message),
		PriceSnapshot: snap,
		PricingModel:  svc.PricingModel, // <-- REQUIRED (NOT NULL in schema)
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

func ListTravelerBookings(c *gin.Context) {
	uid := c.GetInt("user_id")
	list, err := models.ListTravelerBookingsEnriched(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	c.JSON(http.StatusOK, list)
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
		ID     int64          `json:"id"`
		Name   sql.NullString `json:"name"`
		Email  sql.NullString `json:"email"`
		Avatar sql.NullString `json:"avatar_url"`
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
  b.chosen_date,                 -- TEXT (nullable)
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
  COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email) AS traveler_name,
  u.email,
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
			&x.Traveler.ID, &x.Traveler.Name, &x.Traveler.Email, &x.Traveler.Avatar,
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
