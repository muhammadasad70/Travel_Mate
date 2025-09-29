package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func CreateGroup(c *gin.Context) {
	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	creatorID := uidAny.(int)

	var in struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	name := strings.TrimSpace(in.Name)
	desc := strings.TrimSpace(in.Description)

	if len(name) < 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group name must be at least 4 characters"})
		return
	}
	if len(desc) < 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Description must be at least 20 characters"})
		return
	}

	gid, err := models.CreateGroup(creatorID, name, desc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": gid, "name": name, "description": desc})
}

func GetMyGroups(c *gin.Context) {
	uid := c.GetInt("user_id")
	gs, err := models.GetGroupsByUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch groups"})
		return
	}
	c.JSON(http.StatusOK, gs)
}

func GetGroup(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	g, err := models.GetGroupByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	c.JSON(http.StatusOK, g)
}
