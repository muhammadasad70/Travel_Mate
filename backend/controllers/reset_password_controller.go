package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
)

type codeEntry struct {
	Code      string
	ExpiresAt time.Time
}

var (
	resetCodes    = make(map[string]codeEntry) // email -> code + expiry
	verifiedEmail = make(map[string]time.Time) // email -> verified-until
	mu            sync.Mutex
)

func genCode() string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	now := time.Now().UnixNano()
	b := make([]byte, 6)
	for i := 0; i < 6; i++ {
		b[i] = chars[(now+int64(i))%int64(len(chars))]
	}
	return string(b)
}

// === 1) Send code (kept route name to match your front-end) ===
// POST /email-varification { "email": "user@example.com" }
func ForgetPasswordHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// Optional: soft check. We still return 200 to avoid account enumeration.
	if _, err := models.GetUserByEmail(email); err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "If that email is registered, a code has been sent"})
		return
	}

	code := genCode()
	mu.Lock()
	resetCodes[email] = codeEntry{Code: code, ExpiresAt: time.Now().Add(10 * time.Minute)}
	mu.Unlock()

	_ = sendEmail(email, "Your password reset code",
		fmt.Sprintf("Your verification code is: %s\nThis code expires in 10 minutes.", code))

	c.JSON(http.StatusOK, gin.H{"message": "If that email is registered, a code has been sent"})
}

// === 2) Verify code ===
// POST /verify-code { "email": "user@example.com", "code": "ABC123" }
func VerifyCodeHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}
	if err := c.ShouldBindJSON(&req); err != nil ||
		strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	code := strings.ToUpper(strings.TrimSpace(req.Code))

	mu.Lock()
	entry, ok := resetCodes[email]
	mu.Unlock()

	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "No verification code found for this email"})
		return
	}
	if time.Now().After(entry.ExpiresAt) {
		mu.Lock()
		delete(resetCodes, email)
		mu.Unlock()
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Verification code expired. Please request a new one."})
		return
	}
	if entry.Code != code {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect verification code"})
		return
	}

	// mark verified; clear the one-time code
	mu.Lock()
	delete(resetCodes, email)
	verifiedEmail[email] = time.Now().Add(10 * time.Minute)
	mu.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "Code verified successfully"})
}

// === 3) Reset password ===
// POST /reset-password { "email": "user@example.com", "newPassword": "********" }
func ResetPasswordHandler(c *gin.Context) {
	var req struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}
	if err := c.ShouldBindJSON(&req); err != nil ||
		strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.NewPassword) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	if len(req.NewPassword) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters long"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))

	mu.Lock()
	until, ok := verifiedEmail[email]
	mu.Unlock()
	if !ok || time.Now().After(until) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please verify the code before resetting the password"})
		return
	}

	if _, err := models.GetUserByEmail(email); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	hashed, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}
	if err := models.UpdateUserPasswordByEmail(email, hashed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	mu.Lock()
	delete(verifiedEmail, email)
	mu.Unlock()

	_ = sendEmail(email, "Your password has been reset",
		fmt.Sprintf("Hello,\nYour password was reset at %s. If this wasn’t you, contact support.", time.Now().Format(time.RFC822)))

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
