// controllers/cultural_public.go
package controllers

import (
	"net/http"
	"strings"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

type listQuery struct {
	Q        string  `form:"q"`
	City     string  `form:"city"`
	Type     string  `form:"type"` // workshop|walk|home_experience|skill_exchange
	MinPrice float64 `form:"min_price"`
	MaxPrice float64 `form:"max_price"`
	Date     string  `form:"date"` // YYYY-MM-DD (optional)
}

func ListAllCulturalServices(c *gin.Context) {
	var q listQuery
	_ = c.BindQuery(&q)
	items, err := models.ListAllCulturalServices(
		strings.TrimSpace(q.Q),
		strings.TrimSpace(q.City),
		strings.TrimSpace(q.Type),
		q.MinPrice, q.MaxPrice,
		strings.TrimSpace(q.Date),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}
	c.JSON(http.StatusOK, items)
}
