package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"
	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
	gomail "gopkg.in/gomail.v2"
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

	if input.Password != input.Confirm {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	role := input.Role
	if role != "vendor" && role != "traveler" {
		role = "traveler"
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Email:    input.Email,
		Password: hashed,
		Role:     role,
	}

	fmt.Printf("🧪 Creating user with: %+v\n", user)

	if err := user.CreateUser(); err != nil {
		fmt.Println("❌ Error creating user:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Signup successful",
		"role":    user.Role,
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

	user, err := models.GetUserByEmailAndRole(input.Email, input.Role)
	if err != nil || !utils.CheckPasswordHash(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials or role"})
		return
	}

	token, _ := utils.GenerateToken(user.Email, user.Id)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"role":    user.Role,
	})
}

func UpdateProfile(c *gin.Context) {
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(int)
	fmt.Println("📥 Hitting UpdateProfile endpoint...")
	fmt.Println("✅ Token user_id:", userID)

	var input struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		CountryCode string `json:"country_code"`
		Phone       string `json:"phone"`
		Country     string `json:"country"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("❌ JSON Bind Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	fmt.Printf("📩 Received input: %+v\n", input)

	user, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	fmt.Printf("👤 Loaded existing user: %+v\n", user)

	user.FirstName = input.FirstName
	user.LastName = input.LastName
	user.CountryCode = input.CountryCode
	user.Phone = input.Phone
	user.Country = input.Country
	fmt.Printf("📤 Updated user to save: %+v\n", user)

	if err := user.UpdateUserProfile(); err != nil {
		fmt.Println("❌ DB Save Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"user":    user,
	})
}

func GetProfile(c *gin.Context) {
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDInterface.(int)

	user, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": user})
}

func CompleteRegistration(c *gin.Context) {
	fmt.Println("✅ HIT: CompleteRegistration endpoint")

	var input struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		Role        string `json:"role"`
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

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
		return
	}

	user := models.User{
		Email:       input.Email,
		Password:    hashed,
		Role:        input.Role,
		FirstName:   input.FirstName,
		LastName:    input.LastName,
		CountryCode: input.CountryCode,
		Phone:       input.Phone,
		Country:     input.Country,
	}

	if err := user.CreateUserWithFullProfile(); err != nil {
		fmt.Println("❌ DB Insert Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	token, _ := utils.GenerateToken(user.Email, user.Id)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration complete",
		"token":   token,
		"user":    user,
	})
}
func EmailVarification(c *gin.Context) {
	var request struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email provided"})
		return
	}

	code := generateCode()
	err := sendEmail(request.Email, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	// Optionally store code in memory/db for verification
	c.JSON(http.StatusOK, gin.H{"message": "Verification code sent!"})
}

func generateCode() string {
	rand.Seed(time.Now().UnixNano())
	return strconv.Itoa(100000 + rand.Intn(900000)) // 6-digit code
}

func sendEmail(to string, code string) error {
	fmt.Println("Received email:", to)
	fmt.Println("Generated code:", code)

	m := gomail.NewMessage()
	m.SetHeader("From", "muhammadabdullah146k@gmail.com")
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Your Verification Code")
	m.SetBody("text/plain", "Your verification code is: "+code)

	d := gomail.NewDialer("smtp.gmail.com", 587, "muhammadabdullah146k@gmail.com", "ynrk yqft wrkq pnva")
	if err := d.DialAndSend(m); err != nil {
		fmt.Println("❌ Email sending failed:", err)
		return err
	}

	fmt.Println("✅ Email sent successfully to:", to)
	return nil
}
