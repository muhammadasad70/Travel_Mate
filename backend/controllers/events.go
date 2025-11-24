package controllers

import (
	"net/http"
	"strconv"
	"time"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func ListEvents(c *gin.Context) {
	q := models.EventsQuery{}

	if v := c.Query("q"); v != "" {
		q.Q = v
	}
	if v := c.Query("city"); v != "" && v != "All" {
		q.City = v
	}
	if v := c.Query("category"); v != "" && v != "All" {
		q.Category = v
	}

	// optional date window: date_from=YYYY-MM-DD, date_to=YYYY-MM-DD
	const dfmt = "2006-01-02"
	if v := c.Query("date_from"); v != "" {
		if t, err := time.Parse(dfmt, v); err == nil {
			q.DateFrom = &t
		}
	}
	if v := c.Query("date_to"); v != "" {
		if t, err := time.Parse(dfmt, v); err == nil {
			q.DateTo = &t
		}
	}
	// pagination
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	q.Limit = limit
	q.Offset = offset

	items, err := models.GetEvents(q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch events"})
		return
	}
	nextOffset := offset + len(items)
	c.JSON(http.StatusOK, gin.H{
		"items":       items,
		"next_offset": nextOffset,
		"has_more":    len(items) == q.Limit,
	})
}

// Minimal ingest to quickly dump a batch into DB (protect with Auth + role if you like)
type IngestEventsPayload struct {
	Items []models.Event `json:"items"`
}

func IngestEvents(c *gin.Context) {
	var in IngestEventsPayload
	if err := c.ShouldBindJSON(&in); err != nil || len(in.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid or empty payload"})
		return
	}
	if err := models.UpsertEvents(in.Items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upsert"})
		return
	}
	c.Status(http.StatusNoContent)
}

// SeedRealEvents - Seeds database with real Pakistan events
func SeedRealEvents(c *gin.Context) {
	events := []models.Event{
		{
			Source:     "custom",
			ExternalID: stringPtr("psl-2026"),
			Title:      "Pakistan Super League 2026",
			Category:   stringPtr("Sports"),
			StartTime:  timePtr("2026-02-15T14:00:00Z"),
			EndTime:    timePtr("2026-03-25T20:00:00Z"),
			VenueName:  stringPtr("National Stadium Karachi"),
			VenueAddr:  stringPtr("Stadium Road, Karachi"),
			City:       stringPtr("Karachi"),
			Lat:        floatPtr(24.8607),
			Lng:        floatPtr(67.0011),
			Price:      stringPtr("PKR 1,000 - 15,000"),
			URL:        stringPtr("https://www.cricketpakistan.com.pk/psl"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("lmm-2026"),
			Title:      "Lahore Music Meet 2026",
			Category:   stringPtr("Music"),
			StartTime:  timePtr("2026-03-20T15:00:00Z"),
			EndTime:    timePtr("2026-03-22T23:00:00Z"),
			VenueName:  stringPtr("Alhamra Arts Council"),
			VenueAddr:  stringPtr("Mall Road, Lahore"),
			City:       stringPtr("Lahore"),
			Lat:        floatPtr(31.5204),
			Lng:        floatPtr(74.3587),
			Price:      stringPtr("PKR 2,000 - 10,000"),
			URL:        stringPtr("https://www.lahoremusicmeet.com"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("karachi-eat-2026"),
			Title:      "Karachi Eat Festival 2026",
			Category:   stringPtr("Food"),
			StartTime:  timePtr("2026-01-16T12:00:00Z"),
			EndTime:    timePtr("2026-01-18T23:00:00Z"),
			VenueName:  stringPtr("Frere Hall"),
			VenueAddr:  stringPtr("Fatima Jinnah Road, Saddar, Karachi"),
			City:       stringPtr("Karachi"),
			Lat:        floatPtr(24.8465),
			Lng:        floatPtr(67.0310),
			Price:      stringPtr("PKR 800 - 1,500"),
			URL:        stringPtr("https://www.karachieat.com"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("ilf-2026"),
			Title:      "Islamabad Literature Festival 2026",
			Category:   stringPtr("Cultural"),
			StartTime:  timePtr("2026-04-24T10:00:00Z"),
			EndTime:    timePtr("2026-04-26T18:00:00Z"),
			VenueName:  stringPtr("Pakistan National Council of the Arts"),
			VenueAddr:  stringPtr("F-5/1, Islamabad"),
			City:       stringPtr("Islamabad"),
			Lat:        floatPtr(33.7077),
			Lng:        floatPtr(73.0480),
			Price:      stringPtr("Free Entry"),
			URL:        stringPtr("https://www.ilf.com.pk"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("lok-mela-2026"),
			Title:      "National Folk Festival (Lok Mela) 2026",
			Category:   stringPtr("Cultural"),
			StartTime:  timePtr("2026-10-15T09:00:00Z"),
			EndTime:    timePtr("2026-10-25T22:00:00Z"),
			VenueName:  stringPtr("Lok Virsa Museum"),
			VenueAddr:  stringPtr("Garden Avenue, Shakarparian, Islamabad"),
			City:       stringPtr("Islamabad"),
			Lat:        floatPtr(33.6972),
			Lng:        floatPtr(73.0856),
			Price:      stringPtr("Free Entry"),
			URL:        stringPtr("https://www.lokvirsa.org.pk"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("hunza-spring-2026"),
			Title:      "Hunza Spring Festival 2026",
			Category:   stringPtr("Festival"),
			StartTime:  timePtr("2026-04-05T09:00:00Z"),
			EndTime:    timePtr("2026-04-10T18:00:00Z"),
			VenueName:  stringPtr("Central Hunza Valley"),
			VenueAddr:  stringPtr("Karimabad, Hunza"),
			City:       stringPtr("Hunza Valley"),
			Lat:        floatPtr(36.3167),
			Lng:        floatPtr(74.6500),
			Price:      stringPtr("Free"),
			URL:        stringPtr("https://www.hunzatourism.com"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("bcw-lahore-2026"),
			Title:      "Bridal Couture Week Lahore 2026",
			Category:   stringPtr("Fashion"),
			StartTime:  timePtr("2026-09-10T17:00:00Z"),
			EndTime:    timePtr("2026-09-13T23:00:00Z"),
			VenueName:  stringPtr("Expo Centre Lahore"),
			VenueAddr:  stringPtr("Johar Town, Lahore"),
			City:       stringPtr("Lahore"),
			Lat:        floatPtr(31.4645),
			Lng:        floatPtr(74.2595),
			Price:      stringPtr("PKR 5,000 - 25,000"),
			URL:        stringPtr("https://www.bridalcoutureweek.pk"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("pak-independence-2026"),
			Title:      "Pakistan Independence Day Celebrations",
			Category:   stringPtr("Holiday"),
			StartTime:  timePtr("2026-08-14T00:00:00Z"),
			EndTime:    timePtr("2026-08-14T23:59:59Z"),
			VenueName:  stringPtr("Various Locations Nationwide"),
			VenueAddr:  stringPtr("Nationwide"),
			City:       stringPtr("Islamabad"),
			Lat:        floatPtr(33.6844),
			Lng:        floatPtr(73.0479),
			Price:      stringPtr("Free"),
			URL:        stringPtr("https://www.pakistan.gov.pk"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("shandur-polo-2026"),
			Title:      "Shandur Polo Festival 2026",
			Category:   stringPtr("Sports"),
			StartTime:  timePtr("2026-07-07T10:00:00Z"),
			EndTime:    timePtr("2026-07-09T18:00:00Z"),
			VenueName:  stringPtr("Shandur Polo Ground"),
			VenueAddr:  stringPtr("Shandur Pass, Gilgit-Baltistan"),
			City:       stringPtr("Skardu"),
			Lat:        floatPtr(36.0833),
			Lng:        floatPtr(72.5833),
			Price:      stringPtr("Free"),
			URL:        stringPtr("https://www.shandurpolo.com"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("murree-winter-2026"),
			Title:      "Murree Winter Festival 2026",
			Category:   stringPtr("Festival"),
			StartTime:  timePtr("2026-12-20T10:00:00Z"),
			EndTime:    timePtr("2026-12-31T20:00:00Z"),
			VenueName:  stringPtr("Mall Road Murree"),
			VenueAddr:  stringPtr("Mall Road, Murree"),
			City:       stringPtr("Murree"),
			Lat:        floatPtr(33.9070),
			Lng:        floatPtr(73.3943),
			Price:      stringPtr("Free Entry, Paid Activities"),
			URL:        stringPtr("https://www.visitmurree.com"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("quaid-birthday-2026"),
			Title:      "Quaid-e-Azam Birthday",
			Category:   stringPtr("Holiday"),
			StartTime:  timePtr("2026-12-25T00:00:00Z"),
			EndTime:    timePtr("2026-12-25T23:59:59Z"),
			VenueName:  stringPtr("Nationwide"),
			VenueAddr:  stringPtr("Pakistan"),
			City:       stringPtr("Islamabad"),
			Lat:        floatPtr(33.6844),
			Lng:        floatPtr(73.0479),
			Price:      stringPtr("Free"),
			URL:        stringPtr("https://www.pakistan.gov.pk"),
		},
		{
			Source:     "custom",
			ExternalID: stringPtr("swat-cultural-2026"),
			Title:      "Swat Cultural Festival 2026",
			Category:   stringPtr("Cultural"),
			StartTime:  timePtr("2026-06-15T11:00:00Z"),
			EndTime:    timePtr("2026-06-20T22:00:00Z"),
			VenueName:  stringPtr("Swat Valley Center"),
			VenueAddr:  stringPtr("Mingora, Swat"),
			City:       stringPtr("Swat Valley"),
			Lat:        floatPtr(34.7787),
			Lng:        floatPtr(72.3600),
			Price:      stringPtr("PKR 500"),
			URL:        stringPtr("https://www.swatvalleys.com"),
		},
	}

	if err := models.UpsertEvents(events); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed events"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully seeded real Pakistan events",
		"count":   len(events),
		"events":  events,
	})
}

// Helper functions
func stringPtr(s string) *string {
	return &s
}

func floatPtr(f float64) *float64 {
	return &f
}

func timePtr(s string) *time.Time {
	t, _ := time.Parse(time.RFC3339, s)
	return &t
}
