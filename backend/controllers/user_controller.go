// package controllers

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"strconv"
// 	"strings"
// 	"travel_mate/backend/models"
// 	"travel_mate/backend/utils"

// 	"github.com/gin-gonic/gin"
// )

// /* ---------------- small helper: welcome email (fire-and-forget) --------------- */

// func fireWelcomeEmailOnce(u *models.User) {
// 	// best-effort, non-blocking
// 	go func(user *models.User) {
// 		displayName := strings.TrimSpace(strings.TrimSpace(user.FirstName + " " + user.LastName))
// 		if displayName == "" {
// 			displayName = "Traveler"
// 		}
// 		subject := "Welcome to TravelMate 🎉"
// 		body := fmt.Sprintf(
// 			"Hi %s!\n\nThanks for joining TravelMate. You can start exploring services, planning itineraries, and booking experiences.\n\nHappy travels!\n— The TravelMate Team",
// 			displayName,
// 		)
// 		// send via existing email transport (controllers/email.go)
// 		if err := sendEmail(user.Email, subject, body); err != nil {
// 			log.Printf("[welcome-email] send failed for user %d (%s): %v", user.Id, user.Email, err)
// 		} else {
// 			// mark as sent (ignore error)
// 			if err := models.MarkWelcomeEmailSent(user.Id); err != nil {
// 				log.Printf("[welcome-email] mark sent failed for user %d: %v", user.Id, err)
// 			}
// 		}
// 	}(u)
// }

// /* ---------------------------------- AUTH ------------------------------------- */

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

// 	// 🔔 Fire-and-forget welcome email
// 	fireWelcomeEmailOnce(&user)

// 	token, _ := utils.GenerateToken(user.Email, user.Id)

// 	// tell client to open ProfileCompletion
// 	missing := []string{"first_name", "last_name", "country_code", "phone", "country"}

// 	c.JSON(http.StatusCreated, gin.H{
// 		"message":        "Signup successful",
// 		"token":          token,
// 		"user_id":        user.Id,
// 		"role":           user.Role,
// 		"completed":      false, // brand-new accounts are incomplete
// 		"missing_fields": missing,
// 		"prefill": gin.H{ // optional prefill for UI
// 			"email": user.Email,
// 		},
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

// 	// loads id/email/password/role/is_profile_complete/welcome_email_sent_at
// 	user, err := models.GetUserByEmail(input.Email)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "No account found for this email"})
// 		return
// 	}

// 	// Optional role check
// 	if input.Role != "" && input.Role != user.Role {
// 		c.JSON(http.StatusForbidden, gin.H{
// 			"error":        "Incorrect role for this account",
// 			"registeredAs": user.Role,
// 		})
// 		return
// 	}

// 	// Social-only account has no local password
// 	if strings.TrimSpace(user.Password) == "" {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please sign in using your social provider"})
// 		return
// 	}

// 	if !utils.CheckPasswordHash(user.Password, input.Password) {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
// 		return
// 	}

// 	token, _ := utils.GenerateToken(user.Email, user.Id)

// 	// welcome email for legacy users
// 	if user.WelcomeEmailSentAt == nil {
// 		fireWelcomeEmailOnce(user)
// 	}

// 	// ⚠️ IMPORTANT: fetch full profile to compute missing fields
// 	full, _ := models.GetUserByID(user.Id)
// 	missing := computeMissingFields(&full)

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":        "Login successful",
// 		"token":          token,
// 		"role":           user.Role,
// 		"completed":      user.IsProfileComplete,
// 		"user_id":        user.Id,
// 		"missing_fields": missing,
// 	})
// }

// /* ------------------------------- PROFILE & SEARCH ----------------------------- */

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
// 	if input.FirstName == "" || input.LastName == "" || input.Country == "" ||
// 		input.CountryCode == "" || input.Phone == "" {
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

// func GetMyProfile(c *gin.Context) {
// 	uid := c.GetInt("user_id")
// 	u, err := models.GetUserByID(uid)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, u)
// }

// func GetProfileStatus(c *gin.Context) {
// 	if emailAny, ok := c.Get("email"); ok {
// 		if emailStr, ok2 := emailAny.(string); ok2 && emailStr != "" {
// 			if u, err := models.GetUserByEmail(emailStr); err == nil {
// 				c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
// 				return
// 			}
// 			c.JSON(http.StatusOK, gin.H{"completed": false})
// 			return
// 		}
// 	}

// 	uidAny, ok := c.Get("user_id")
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 		return
// 	}
// 	userID := uidAny.(int)

// 	u, err := models.GetUserByID(userID)
// 	if err != nil {
// 		c.JSON(http.StatusOK, gin.H{"completed": false})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"completed": u.IsProfileComplete})
// }

// func CompleteRegistration(c *gin.Context) {
// 	c.JSON(http.StatusGone, gin.H{
// 		"error":  "Endpoint deprecated. Use PUT /user/profile after signup.",
// 		"status": 410,
// 	})
// }

// /* --------------------------------- SEARCH ------------------------------------ */

// func SearchUsers(c *gin.Context) {
// 	q := strings.TrimSpace(c.Query("q"))
// 	if q == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
// 		return
// 	}
// 	limit := 20
// 	if s := c.Query("limit"); s != "" {
// 		if n, err := strconv.Atoi(s); err == nil && n > 0 && n <= 100 {
// 			limit = n
// 		}
// 	}

// 	rows, err := models.SearchUsersBasic(q, limit)
// 	if err != nil {
// 		log.Printf("[SearchUsers] model error: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search users"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"users": rows,
// 		"query": q,
// 		"count": len(rows),
// 	})
// }

// func AdvancedSearchUsers(c *gin.Context) {
// 	q := strings.TrimSpace(c.Query("q"))
// 	if q == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
// 		return
// 	}
// 	var role *string
// 	if r := strings.TrimSpace(c.Query("role")); r != "" {
// 		role = &r
// 	}
// 	limit := 20
// 	if s := c.Query("limit"); s != "" {
// 		if n, err := strconv.Atoi(s); err == nil && n > 0 && n <= 100 {
// 			limit = n
// 		}
// 	}

// 	rows, err := models.SearchUsersAdvanced(q, role, limit)
// 	if err != nil {
// 		log.Printf("[AdvancedSearchUsers] model error: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"users":    rows,
// 		"query":    q,
// 		"count":    len(rows),
// 		"has_more": len(rows) == limit,
// 		"filters":  gin.H{"role": roleIf(role)},
// 	})
// }

// func OptimizeSearchIndexes(c *gin.Context) {
// 	indexes := models.GetSearchIndexStatements()
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Database indexes for optimal search performance",
// 		"indexes": indexes,
// 		"note":    "Run these SQL commands manually in your database for better search performance",
// 	})
// }

// func GetUserProfile(c *gin.Context) {
// 	idStr := c.Param("id")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil || id <= 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
// 		return
// 	}
// 	data, err := models.GetUserProfileByID(id)
// 	if err != nil {
// 		if err == models.ErrNotFound {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 			return
// 		}
// 		log.Printf("[GetUserProfile] model error: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, data)
// }

// /* ---------- tiny helper ---------- */
// func roleIf(p *string) any {
// 	if p == nil {
// 		return nil
// 	}
// 	return *p
// }
// func computeMissingFields(u *models.User) []string {
// 	miss := []string{}
// 	if strings.TrimSpace(u.FirstName) == "" {
// 		miss = append(miss, "first_name")
// 	}
// 	if strings.TrimSpace(u.LastName) == "" {
// 		miss = append(miss, "last_name")
// 	}
// 	if strings.TrimSpace(u.Country) == "" {
// 		miss = append(miss, "country")
// 	}
// 	if strings.TrimSpace(u.CountryCode) == "" {
// 		miss = append(miss, "country_code")
// 	}
// 	if strings.TrimSpace(u.Phone) == "" {
// 		miss = append(miss, "phone")
// 	}
// 	return miss
// }

// func splitName(full string) (string, string) {
// 	t := strings.Fields(strings.TrimSpace(full))
// 	if len(t) == 0 {
// 		return "", ""
// 	}
// 	if len(t) == 1 {
// 		return t[0], ""
// 	}
// 	return strings.Join(t[:len(t)-1], " "), t[len(t)-1]
// }

package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
)

/* ---------------- small helper: welcome email (fire-and-forget) --------------- */

func fireWelcomeEmailOnce(u *models.User) {
	// best-effort, non-blocking
	go func(user *models.User) {
		displayName := strings.TrimSpace(strings.TrimSpace(user.FirstName + " " + user.LastName))
		if displayName == "" {
			displayName = "Traveler"
		}
		subject := "Welcome to TravelMate 🎉"
		body := fmt.Sprintf(
			"Hi %s!\n\nThanks for joining TravelMate. You can start exploring services, planning itineraries, and booking experiences.\n\nHappy travels!\n— The TravelMate Team",
			displayName,
		)
		// send via existing email transport (controllers/email.go)
		if err := sendEmail(user.Email, subject, body); err != nil {
			log.Printf("[welcome-email] send failed for user %d (%s): %v", user.Id, user.Email, err)
		} else {
			// mark as sent (ignore error)
			if err := models.MarkWelcomeEmailSent(user.Id); err != nil {
				log.Printf("[welcome-email] mark sent failed for user %d: %v", user.Id, err)
			}
		}
	}(u)
}

/* ---------------------------------- AUTH ------------------------------------- */

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

	// 🔔 welcome email
	fireWelcomeEmailOnce(&user)

	token, _ := utils.GenerateToken(user.Email, user.Id)

	// tell client to open ProfileCompletion
	missing := []string{"first_name", "last_name", "country_code", "phone", "country"}

	c.JSON(http.StatusCreated, gin.H{
		"message":        "Signup successful",
		"token":          token,
		"user_id":        user.Id,
		"role":           user.Role,
		"completed":      false,
		"missing_fields": missing,
		"prefill": gin.H{
			"email": user.Email,
		},
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

	// loads id/email/password/role/is_profile_complete/welcome_email_sent_at
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

	// Social-only account has no local password
	if strings.TrimSpace(user.Password) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please sign in using your social provider"})
		return
	}

	if !utils.CheckPasswordHash(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
		return
	}

	token, _ := utils.GenerateToken(user.Email, user.Id)

	// welcome email for legacy users
	if user.WelcomeEmailSentAt == nil {
		fireWelcomeEmailOnce(user)
	}

	// fetch full profile to compute missing fields
	full, _ := models.GetUserByID(user.Id)
	missing := computeMissingFields(&full)

	c.JSON(http.StatusOK, gin.H{
		"message":        "Login successful",
		"token":          token,
		"role":           user.Role,
		"completed":      user.IsProfileComplete,
		"user_id":        user.Id,
		"missing_fields": missing,
	})
}

/* ------------------------------- PROFILE & SEARCH ----------------------------- */

func UpdateProfile(c *gin.Context) {
	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uidAny.(int)

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

func GetMyProfile(c *gin.Context) {
	uid := c.GetInt("user_id")
	u, err := models.GetUserByID(uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, u)
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

/* --------------------------------- SEARCH ------------------------------------ */

func SearchUsers(c *gin.Context) {
	q := strings.TrimSpace(c.Query("q"))
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}
	limit := 20
	if s := c.Query("limit"); s != "" {
		if n, err := strconv.Atoi(s); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}

	rows, err := models.SearchUsersBasic(q, limit)
	if err != nil {
		log.Printf("[SearchUsers] model error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"users": rows,
		"query": q,
		"count": len(rows),
	})
}

func AdvancedSearchUsers(c *gin.Context) {
	q := strings.TrimSpace(c.Query("q"))
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}
	var role *string
	if r := strings.TrimSpace(c.Query("role")); r != "" {
		role = &r
	}
	limit := 20
	if s := c.Query("limit"); s != "" {
		if n, err := strconv.Atoi(s); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}

	rows, err := models.SearchUsersAdvanced(q, role, limit)
	if err != nil {
		log.Printf("[AdvancedSearchUsers] model error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"users":    rows,
		"query":    q,
		"count":    len(rows),
		"has_more": len(rows) == limit,
		"filters":  gin.H{"role": roleIf(role)},
	})
}

func OptimizeSearchIndexes(c *gin.Context) {
	indexes := models.GetSearchIndexStatements()
	c.JSON(http.StatusOK, gin.H{
		"message": "Database indexes for optimal search performance",
		"indexes": indexes,
		"note":    "Run these SQL commands manually in your database for better search performance",
	})
}

func GetUserProfile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	data, err := models.GetUserProfileByID(id)
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		log.Printf("[GetUserProfile] model error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}
	c.JSON(http.StatusOK, data)
}

/* ---------- helpers ---------- */
func roleIf(p *string) any {
	if p == nil {
		return nil
	}
	return *p
}
func computeMissingFields(u *models.User) []string {
	miss := []string{}
	if strings.TrimSpace(u.FirstName) == "" {
		miss = append(miss, "first_name")
	}
	if strings.TrimSpace(u.LastName) == "" {
		miss = append(miss, "last_name")
	}
	if strings.TrimSpace(u.Country) == "" {
		miss = append(miss, "country")
	}
	if strings.TrimSpace(u.CountryCode) == "" {
		miss = append(miss, "country_code")
	}
	if strings.TrimSpace(u.Phone) == "" {
		miss = append(miss, "phone")
	}
	return miss
}

func splitName(full string) (string, string) {
	t := strings.Fields(strings.TrimSpace(full))
	if len(t) == 0 {
		return "", ""
	}
	if len(t) == 1 {
		return t[0], ""
	}
	return strings.Join(t[:len(t)-1], " "), t[len(t)-1]
}
