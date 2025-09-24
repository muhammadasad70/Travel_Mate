// controllers/itineraries.go
package controllers

import (
	"net/http"
	"time"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

type createItineraryPayload struct {
	Title       string                   `json:"title"`
	Description string                   `json:"description"`
	City        string                   `json:"city"`
	Budget      string                   `json:"budget"`
	Style       string                   `json:"style"`
	StartDate   string                   `json:"start_date"` // "YYYY-MM-DD"
	EndDate     string                   `json:"end_date"`   // "YYYY-MM-DD"
	CoverURL    string                   `json:"cover_url"`  // can be ""
	Days        []models.ItineraryDayDTO `json:"days"`
}

func CreateItinerary(c *gin.Context) {
	uid := c.GetInt("user_id")

	var in createItineraryPayload
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// basic required fields
	if in.Title == "" || in.Description == "" || in.City == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title, description, city are required"})
		return
	}
	if in.StartDate == "" || in.EndDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date and end_date are required"})
		return
	}

	// parse "YYYY-MM-DD"
	const dfmt = "2006-01-02"
	sd, err := time.Parse(dfmt, in.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "start_date must be YYYY-MM-DD"})
		return
	}
	ed, err := time.Parse(dfmt, in.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be YYYY-MM-DD"})
		return
	}
	if ed.Before(sd) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be after start_date"})
		return
	}

	it := models.Itinerary{
		UserId:      uid,
		Title:       in.Title,
		Description: in.Description,
		City:        in.City,
		Budget:      in.Budget,
		Style:       in.Style,
		StartDate:   sd,
		EndDate:     ed,
		CoverURL:    in.CoverURL, // ok if empty string (no image yet)
	}

	// normalize days; day_number = index+1 if not provided
	it.Days = make([]models.ItineraryDay, 0, len(in.Days))
	for i, d := range in.Days {
		dayNum := d.DayNumber
		if dayNum <= 0 {
			dayNum = i + 1
		}
		it.Days = append(it.Days, models.ItineraryDay{
			DayNumber:  dayNum,
			Place:      d.Place,
			StartTime:  d.StartTime, // optional strings are fine
			EndTime:    d.EndTime,
			Activities: d.Activities,
		})
	}

	if err := models.CreateItinerary(&it); err != nil {
		// return real DB error so you can see what's wrong during dev
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, it)
}

func ListMyItineraries(c *gin.Context) {
	uid := c.GetInt("user_id")
	itins, err := models.GetItinerariesByUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch"})
		return
	}
	c.JSON(http.StatusOK, itins)
}
