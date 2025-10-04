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
