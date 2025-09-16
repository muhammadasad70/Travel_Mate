// package controllers

// import (
// 	"net/http"
// 	"strings"
// 	"travel_mate/backend/models"
// 	"travel_mate/backend/utils"

// 	"github.com/gin-gonic/gin"
// )

// func SignupUser(c *gin.Context) {
// 	var input struct {
// 		Email    string `json:"email"`
// 		Password string `json:"password"`
// 		Confirm  string `json:"confirm"`
// 		Role     string `json:"role"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}
// 	if input.Password == "" || input.Confirm == "" || input.Email == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
// 		return
// 	}
// 	if input.Password != input.Confirm {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
// 		return
// 	}
// 	role := input.Role
// 	if role != "vendor" && role != "traveler" {
// 		role = "traveler"
// 	}

// 	// duplicate email check
// 	exists, err := models.EmailExists(input.Email)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email"})
// 		return
// 	}
// 	if exists {
// 		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
// 		return
// 	}

// 	hashed, err := utils.HashPassword(input.Password)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
// 		return
// 	}

// 	user := models.User{
// 		Email:    strings.ToLower(strings.TrimSpace(input.Email)),
// 		Password: hashed,
// 		Role:     role,
// 	}

// 	if err := user.CreateUser(); err != nil {
// 		msg := strings.ToLower(err.Error())
// 		if strings.Contains(msg, "duplicate") || strings.Contains(msg, "unique") {
// 			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
// 			return
// 		}
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create user"})
// 		return
// 	}

// 	token, _ := utils.GenerateToken(user.Email, user.Id)

// 	// IMPORTANT FOR NEW FLOW: do NOT push user to profile now.
// 	// Frontend will navigate to Login after Signup.

// 	c.JSON(http.StatusCreated, gin.H{
// 		"message":   "Signup successful",
// 		"token":     token,
// 		"user_id":   user.Id,
// 		"role":      user.Role,
// 		"completed": false, // brand-new accounts are incomplete
// 	})
// }

// func LoginUser(c *gin.Context) {
// 	var input struct {
// 		Email    string `json:"email"`
// 		Password string `json:"password"`
// 		Role     string `json:"role"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	// Get by email only (case-insensitive)
// 	user, err := models.GetUserByEmail(input.Email)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "No account found for this email"})
// 		return
// 	}

// 	// Optional: enforce role match (helpful UX)
// 	if input.Role != "" && input.Role != user.Role {
// 		c.JSON(http.StatusForbidden, gin.H{
// 			"error":        "Incorrect role for this account",
// 			"registeredAs": user.Role,
// 		})
// 		return
// 	}

// 	// Wrong password ⇒ explicit message
// 	if !utils.CheckPasswordHash(user.Password, input.Password) {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
// 		return
// 	}

// 	token, _ := utils.GenerateToken(user.Email, user.Id)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":   "Login successful",
// 		"token":     token,
// 		"role":      user.Role,
// 		"completed": user.IsProfileComplete,
// 		"user_id":   user.Id,
// 	})
// }

// func UpdateProfile(c *gin.Context) {
// 	uidAny, ok := c.Get("user_id")
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 		return
// 	}
// 	userID := uidAny.(int)

// 	var input struct {
// 		FirstName   string `json:"first_name"`
// 		LastName    string `json:"last_name"`
// 		CountryCode string `json:"country_code"`
// 		Phone       string `json:"phone"`
// 		Country     string `json:"country"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}
// 	// basic server-side validation
// 	if input.FirstName == "" || input.LastName == "" || input.Country == "" || input.CountryCode == "" || input.Phone == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
// 		return
// 	}

// 	user := models.User{
// 		Id:          userID,
// 		FirstName:   input.FirstName,
// 		LastName:    input.LastName,
// 		CountryCode: input.CountryCode,
// 		Phone:       input.Phone,
// 		Country:     input.Country,
// 	}
// 	if err := user.UpdateUserProfile(); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":   "Profile updated successfully",
// 		"completed": true,
// 	})
// }

// // NEW: used by Dashboard after 5 seconds to decide showing the popup
// // controllers/user_controller.go
// func GetProfileStatus(c *gin.Context) {
// 	// Prefer email from token (set by middleware)
// 	if emailAny, ok := c.Get("email"); ok {
// 		if emailStr, ok2 := emailAny.(string); ok2 && emailStr != "" {
// 			if u, err := models.GetUserByEmail(emailStr); err == nil {
// 				c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
// 				return
// 			}
// 			// Soft-fail: treat as incomplete so the UI can prompt
// 			c.JSON(http.StatusOK, gin.H{"completed": false})
// 			return
// 		}
// 	}

// 	// Fallback to user_id from token
// 	uidAny, ok := c.Get("user_id")
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 		return
// 	}
// 	userID := uidAny.(int)

// 	u, err := models.GetUserByID(userID)
// 	if err != nil {
// 		// Soft-fail: incomplete instead of 404
// 		c.JSON(http.StatusOK, gin.H{"completed": false})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
// }

// // OPTIONAL: legacy/deprecated
// func CompleteRegistration(c *gin.Context) {
// 	c.JSON(http.StatusGone, gin.H{
// 		"error":  "Endpoint deprecated. Use PUT /user/profile after signup.",
// 		"status": 410,
// 	})
// }

// controllers/user_controller.go

package controllers

import (
	"net/http"
	"strings"

	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
)

func SignupUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Confirm  string `json:"confirm"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	if input.Password == "" || input.Confirm == "" || input.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}
	if input.Password != input.Confirm {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}
	role := input.Role
	if role != "vendor" && role != "traveler" {
		role = "traveler"
	}

	// duplicate email check
	exists, err := models.EmailExists(input.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email"})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Email:    strings.ToLower(strings.TrimSpace(input.Email)),
		Password: hashed,
		Role:     role,
	}

	if err := user.CreateUser(); err != nil {
		msg := strings.ToLower(err.Error())
		if strings.Contains(msg, "duplicate") || strings.Contains(msg, "unique") {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create user"})
		return
	}

	token, _ := utils.GenerateToken(user.Email, user.Id)

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Signup successful",
		"token":     token,
		"user_id":   user.Id,
		"role":      user.Role,
		"completed": false, // brand-new accounts are incomplete
	})
}

func LoginUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	user, err := models.GetUserByEmail(input.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No account found for this email"})
		return
	}

	// Optional role check
	if input.Role != "" && input.Role != user.Role {
		c.JSON(http.StatusForbidden, gin.H{
			"error":        "Incorrect role for this account",
			"registeredAs": user.Role,
		})
		return
	}

	if !utils.CheckPasswordHash(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
		return
	}

	token, _ := utils.GenerateToken(user.Email, user.Id)

	c.JSON(http.StatusOK, gin.H{
		"message":   "Login successful",
		"token":     token,
		"role":      user.Role,
		"completed": user.IsProfileComplete,
		"user_id":   user.Id,
	})
}

func UpdateProfile(c *gin.Context) {
	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uidAny.(int)

	// ✅ include city
	var input struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		CountryCode string `json:"country_code"`
		Phone       string `json:"phone"`
		Country     string `json:"country"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	if input.FirstName == "" || input.LastName == "" || input.Country == "" ||
		input.CountryCode == "" || input.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	user := models.User{
		Id:          userID,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		CountryCode: input.CountryCode,
		Phone:       input.Phone,
		Country:     input.Country,
	}
	if err := user.UpdateUserProfile(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Profile updated successfully",
		"completed": true,
	})
}

// NEW: return the signed-in user's profile (used by /user/profile/me)
func GetMyProfile(c *gin.Context) {
	uid := c.GetInt("user_id")
	u, err := models.GetUserByID(uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"id":          u.Id,
		"email":       u.Email,
		"role":        u.Role,
		"firstName":   u.FirstName,
		"lastName":    u.LastName,
		"countryCode": u.CountryCode,
		"phone":       u.Phone,
		"country":     u.Country,
		// if present in your model/schema
		"completed": u.IsProfileComplete,
	})
}

func GetProfileStatus(c *gin.Context) {
	if emailAny, ok := c.Get("email"); ok {
		if emailStr, ok2 := emailAny.(string); ok2 && emailStr != "" {
			if u, err := models.GetUserByEmail(emailStr); err == nil {
				c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
				return
			}
			c.JSON(http.StatusOK, gin.H{"completed": false})
			return
		}
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uidAny.(int)

	u, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"completed": false})
		return
	}
	c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
}

func CompleteRegistration(c *gin.Context) {
	c.JSON(http.StatusGone, gin.H{
		"error":  "Endpoint deprecated. Use PUT /user/profile after signup.",
		"status": 410,
	})
}
