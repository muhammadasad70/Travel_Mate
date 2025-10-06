// controllers/group_members.go
package controllers

import (
	"net/http"
	"strconv"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func ListGroupMembers(c *gin.Context) {
	gid, _ := strconv.Atoi(c.Param("group_id"))
	rows, err := models.GetMembersByGroup(gid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load members"})
		return
	}
	c.JSON(http.StatusOK, rows)
}
