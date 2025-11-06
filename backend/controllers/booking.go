// controllers/booking.go
package controllers

import (
	"net/http"
	"strings"
	"time"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type createBookingPayload struct {
	ServiceId    int     `json:"service_id"`
	ChosenDate   *string `json:"chosen_date"` // optional
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

	// require a date (YYYY-MM-DD), because the rule is "not same service on same date"
	if in.ChosenDate == nil || len(strings.TrimSpace(*in.ChosenDate)) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date (YYYY-MM-DD) is required"})
		return
	}
	if _, err := time.Parse("2006-01-02", strings.TrimSpace(*in.ChosenDate)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chosen_date must be YYYY-MM-DD"})
		return
	}

	// fetch service to derive vendor/pricing snapshot
	svc, err := models.GetCulturalServiceByID(in.ServiceId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found"})
		return
	}

	// optional: if the service uses fixed_dates, ensure chosen_date is one of them
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

	var snap *float64
	if svc.PricingModel == "per_person" && svc.PricePerPerson != nil {
		snap = svc.PricePerPerson
	}
	if svc.PricingModel == "per_group" && svc.PricePerGroup != nil {
		snap = svc.PricePerGroup
	}

	b := models.Booking{
		ServiceId:     svc.Id,
		VendorId:      svc.UserId,
		TravelerId:    travelerId,
		Status:        "pending",
		ChosenDate:    in.ChosenDate,
		Participants:  in.Participants,
		Message:       strings.TrimSpace(in.Message),
		PriceSnapshot: snap,
		PricingModel:  svc.PricingModel,
	}

	if err := models.CreateBooking(&b); err != nil {
		// if the DB’s unique index blocked a duplicate, return 409 with a friendly message
		if pgErr, ok := err.(*pq.Error); ok && pgErr.Code == "23505" {
			c.JSON(http.StatusConflict, gin.H{"error": "You already booked this service for that date."})
			return
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

func ListVendorRequests(c *gin.Context) {
	uid := c.GetInt("user_id")
	list, err := models.ListVendorBookingsByStatus(uid, "pending")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	c.JSON(http.StatusOK, list)
}

func ListVendorBooked(c *gin.Context) {
	uid := c.GetInt("user_id")
	list, err := models.ListVendorBookingsByStatus(uid, "confirmed")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}
	c.JSON(http.StatusOK, list)
}

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
