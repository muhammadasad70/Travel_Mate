// controllers/itineraries.go
package controllers

import (
	"net/http"
	"strconv"
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

func GetMyItinerary(c *gin.Context) {
	uid := c.GetInt("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	it, err := models.GetItineraryByIDForUser(uid, id)
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, it)
}

/* ------------------ PUT: full replace ------------------ */

type updateItineraryPutPayload struct {
	Title       string                   `json:"title"`
	Description string                   `json:"description"`
	City        string                   `json:"city"`
	Budget      string                   `json:"budget"`
	Style       string                   `json:"style"`
	StartDate   string                   `json:"start_date"` // YYYY-MM-DD
	EndDate     string                   `json:"end_date"`   // YYYY-MM-DD
	CoverURL    string                   `json:"cover_url"`
	Days        []models.ItineraryDayDTO `json:"days"` // optional but if provided -> replace
}

func UpdateItineraryPUT(c *gin.Context) {
	uid := c.GetInt("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var in updateItineraryPutPayload
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}
	if in.Title == "" || in.Description == "" || in.City == "" || in.StartDate == "" || in.EndDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title, description, city, start_date, end_date are required"})
		return
	}

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

	// normalize days if provided
	newDays := make([]models.ItineraryDay, 0, len(in.Days))
	for i, d := range in.Days {
		dayNum := d.DayNumber
		if dayNum <= 0 {
			dayNum = i + 1
		}
		newDays = append(newDays, models.ItineraryDay{
			DayNumber:  dayNum,
			Place:      d.Place,
			StartTime:  d.StartTime,
			EndTime:    d.EndTime,
			Activities: d.Activities,
		})
	}

	it, err := models.UpdateItineraryFull(uid, id, models.Itinerary{
		Title:       in.Title,
		Description: in.Description,
		City:        in.City,
		Budget:      in.Budget,
		Style:       in.Style,
		StartDate:   sd,
		EndDate:     ed,
		CoverURL:    in.CoverURL,
		Days:        newDays, // if empty slice -> will replace to empty
	})
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, it)
}

/* ------------------ PATCH: partial update ------------------ */

type updateItineraryPatchPayload struct {
	Title       *string                   `json:"title"`
	Description *string                   `json:"description"`
	City        *string                   `json:"city"`
	Budget      *string                   `json:"budget"`
	Style       *string                   `json:"style"`
	StartDate   *string                   `json:"start_date"` // YYYY-MM-DD
	EndDate     *string                   `json:"end_date"`   // YYYY-MM-DD
	CoverURL    *string                   `json:"cover_url"`
	Days        *[]models.ItineraryDayDTO `json:"days"` // if provided -> replace; if omitted -> keep
}

func UpdateItineraryPATCH(c *gin.Context) {
	uid := c.GetInt("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var in updateItineraryPatchPayload
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	var sd, ed *time.Time
	const dfmt = "2006-01-02"
	if in.StartDate != nil {
		t, err := time.Parse(dfmt, *in.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "start_date must be YYYY-MM-DD"})
			return
		}
		sd = &t
	}
	if in.EndDate != nil {
		t, err := time.Parse(dfmt, *in.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be YYYY-MM-DD"})
			return
		}
		ed = &t
	}
	if sd != nil && ed != nil && ed.Before(*sd) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be after start_date"})
		return
	}

	var newDays *[]models.ItineraryDay
	if in.Days != nil {
		arr := make([]models.ItineraryDay, 0, len(*in.Days))
		for i, d := range *in.Days {
			dayNum := d.DayNumber
			if dayNum <= 0 {
				dayNum = i + 1
			}
			arr = append(arr, models.ItineraryDay{
				DayNumber:  dayNum,
				Place:      d.Place,
				StartTime:  d.StartTime,
				EndTime:    d.EndTime,
				Activities: d.Activities,
			})
		}
		newDays = &arr
	}

	it, err := models.UpdateItineraryPartial(uid, id, models.PartialItinerary{
		Title:       in.Title,
		Description: in.Description,
		City:        in.City,
		Budget:      in.Budget,
		Style:       in.Style,
		StartDate:   sd,
		EndDate:     ed,
		CoverURL:    in.CoverURL,
		Days:        newDays, // nil -> keep; non-nil -> replace
	})
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, it)
}

/* ------------------ DELETE ------------------ */

func DeleteItinerary(c *gin.Context) {
	uid := c.GetInt("user_id")
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	if err := models.DeleteItineraryForUser(uid, id); err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
