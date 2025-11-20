// controllers/social_auth_controller.go
package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"travel_mate/backend/database"
	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

// AppleUserData - Define at package level for reuse
type AppleUserData struct {
	Email string `json:"email"`
	Name  struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	} `json:"name"`
}

// Google OAuth Config
var googleOAuthConfig = &oauth2.Config{
	ClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
	ClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
	RedirectURL:  getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8080/auth/google/callback"),
	Scopes: []string{
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/userinfo.profile",
	},
	Endpoint: google.Endpoint,
}

// Facebook OAuth Config
var facebookOAuthConfig = &oauth2.Config{
	ClientID:     getEnv("FACEBOOK_APP_ID", ""),
	ClientSecret: getEnv("FACEBOOK_APP_SECRET", ""),
	RedirectURL:  getEnv("FACEBOOK_REDIRECT_URL", "http://localhost:8080/auth/facebook/callback"),
	Scopes:       []string{"email", "public_profile"},
	Endpoint:     facebook.Endpoint,
}

// Google Login
func GoogleLogin(c *gin.Context) {
	url := googleOAuthConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
	c.JSON(http.StatusOK, gin.H{"auth_url": url})
}

// Google Callback
func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code not provided"})
		return
	}

	token, err := googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to exchange token"})
		return
	}

	profile, err := getGoogleUserInfo(token.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info"})
		return
	}

	user, jwtToken, err := handleSocialLogin(profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}

// Facebook Login
func FacebookLogin(c *gin.Context) {
	url := facebookOAuthConfig.AuthCodeURL("state")
	c.JSON(http.StatusOK, gin.H{"auth_url": url})
}

// Facebook Callback
func FacebookCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code not provided"})
		return
	}

	token, err := facebookOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to exchange token"})
		return
	}

	profile, err := getFacebookUserInfo(token.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info"})
		return
	}

	user, jwtToken, err := handleSocialLogin(profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}

// Mobile Google Sign-In
func GoogleMobileAuth(c *gin.Context) {
	var payload struct {
		IDToken     string `json:"id_token"`
		AccessToken string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "token required"})
		return
	}

	fmt.Printf("Received request - ID Token: %t, Access Token: %t\n", payload.IDToken != "", payload.AccessToken != "")

	var profile *models.SocialAuthProfile
	var err error

	// Determine token type by checking prefix
	token := payload.IDToken
	if token == "" {
		token = payload.AccessToken
	}

	// Check if it's an access token (starts with ya29) or ID token (starts with eyJ)
	if strings.HasPrefix(token, "ya29.") {
		fmt.Println("🔑 Detected access token, using userinfo endpoint")
		profile, err = getGoogleUserInfo(token)
	} else if strings.HasPrefix(token, "eyJ") {
		fmt.Println("🔑 Detected ID token, using tokeninfo endpoint")
		profile, err = verifyGoogleIDToken(token)
	} else {
		fmt.Printf("❌ Unknown token format: %s...\n", token[:10])
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid token format"})
		return
	}

	if err != nil {
		fmt.Printf("❌ Token verification failed: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	fmt.Printf("✅ Token verified for: %s\n", profile.Email)

	user, jwtToken, err := handleSocialLogin(profile)
	if err != nil {
		fmt.Printf("❌ Social login failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("✅ User logged in successfully: %s (ID: %d)\n", user.Email, user.Id)

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}

// Facebook Mobile Auth
func FacebookMobileAuth(c *gin.Context) {
	var payload struct {
		AccessToken string `json:"access_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "access_token required"})
		return
	}

	profile, err := getFacebookUserInfo(payload.AccessToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	user, jwtToken, err := handleSocialLogin(profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}

// Apple Sign-In
func AppleMobileAuth(c *gin.Context) {
	var payload struct {
		IdentityToken string        `json:"identity_token" binding:"required"`
		User          AppleUserData `json:"user"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	profile, err := verifyAppleIdentityToken(payload.IdentityToken, payload.User)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	user, jwtToken, err := handleSocialLogin(profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user":  user,
	})
}

// Handle Social Login - Fixed to match your User model
func handleSocialLogin(profile *models.SocialAuthProfile) (*models.User, string, error) {
	// Check if user exists with this social account
	var existingUserID int
	err := database.DB.QueryRow(`
		SELECT user_id FROM social_auths 
		WHERE provider = $1 AND provider_id = $2
	`, profile.Provider, profile.ProviderID).Scan(&existingUserID)

	if err == nil {
		// User exists, fetch full profile
		user, err := models.GetUserByID(existingUserID)
		if err != nil {
			return nil, "", err
		}

		token, err := utils.GenerateToken(user.Email, user.Id)
		if err != nil {
			return nil, "", err
		}
		return &user, token, nil
	}

	// Check if user exists with this email (link accounts)
	var user models.User
	err = database.DB.QueryRow(`
		SELECT id, email, role, COALESCE(is_profile_complete, false) 
		FROM users WHERE LOWER(email) = LOWER($1)
	`, profile.Email).Scan(&user.Id, &user.Email, &user.Role, &user.IsProfileComplete)

	if err == nil {
		// Link social account to existing user
		_, err = database.DB.Exec(`
			INSERT INTO social_auths (user_id, provider, provider_id, email, access_token)
			VALUES ($1, $2, $3, $4, $5)
		`, user.Id, profile.Provider, profile.ProviderID, profile.Email, profile.AccessToken)

		if err != nil {
			return nil, "", err
		}

		token, err := utils.GenerateToken(user.Email, user.Id)
		if err != nil {
			return nil, "", err
		}
		return &user, token, nil
	}

	// Create new user - split name into first/last
	firstName, lastName := splitNameFromProfile(profile.Name)

	err = database.DB.QueryRow(`
		INSERT INTO users (email, password, role, first_name, last_name, is_profile_complete, created_at)
		VALUES ($1, '', 'traveler', $2, $3, false, NOW())
		RETURNING id, email, role, is_profile_complete
	`, profile.Email, firstName, lastName).Scan(&user.Id, &user.Email, &user.Role, &user.IsProfileComplete)

	if err != nil {
		return nil, "", err
	}

	user.FirstName = firstName
	user.LastName = lastName

	// Link social account
	_, err = database.DB.Exec(`
		INSERT INTO social_auths (user_id, provider, provider_id, email, access_token)
		VALUES ($1, $2, $3, $4, $5)
	`, user.Id, profile.Provider, profile.ProviderID, profile.Email, profile.AccessToken)

	if err != nil {
		return nil, "", err
	}

	token, err := utils.GenerateToken(user.Email, user.Id)
	if err != nil {
		return nil, "", err
	}

	return &user, token, nil
}

// Get Google User Info
func getGoogleUserInfo(accessToken string) (*models.SocialAuthProfile, error) {
	fmt.Printf("Fetching user info with access token...\n")

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		fmt.Printf("Error calling Google userinfo API: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	fmt.Printf("Google userinfo response status: %d\n", resp.StatusCode)
	fmt.Printf("Google userinfo response body: %s\n", string(body))

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("google userinfo returned status %d", resp.StatusCode)
	}

	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		fmt.Printf("Error unmarshaling response: %v\n", err)
		return nil, err
	}

	providerID := ""
	if data["id"] != nil {
		providerID = fmt.Sprint(data["id"])
	}

	email := ""
	if data["email"] != nil {
		email = data["email"].(string)
	}

	name := ""
	if data["name"] != nil {
		name = data["name"].(string)
	}

	picture := ""
	if data["picture"] != nil {
		picture = data["picture"].(string)
	}

	fmt.Printf("✅ User info fetched successfully: %s\n", email)

	return &models.SocialAuthProfile{
		Provider:    "google",
		ProviderID:  providerID,
		Email:       email,
		Name:        name,
		Picture:     picture,
		AccessToken: accessToken,
	}, nil
}

// Get Facebook User Info
func getFacebookUserInfo(accessToken string) (*models.SocialAuthProfile, error) {
	resp, err := http.Get(fmt.Sprintf("https://graph.facebook.com/me?fields=id,name,email,picture&access_token=%s", accessToken))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var data map[string]interface{}
	json.Unmarshal(body, &data)

	email := ""
	if data["email"] != nil {
		email = data["email"].(string)
	}

	picture := ""
	if data["picture"] != nil {
		if pictureMap, ok := data["picture"].(map[string]interface{}); ok {
			if pictureData, ok := pictureMap["data"].(map[string]interface{}); ok {
				if url, ok := pictureData["url"].(string); ok {
					picture = url
				}
			}
		}
	}

	return &models.SocialAuthProfile{
		Provider:    "facebook",
		ProviderID:  fmt.Sprint(data["id"]),
		Email:       email,
		Name:        fmt.Sprint(data["name"]),
		Picture:     picture,
		AccessToken: accessToken,
	}, nil
}

// Verify Google ID Token
func verifyGoogleIDToken(idToken string) (*models.SocialAuthProfile, error) {
	// Log the token for debugging (first 50 chars only for security)
	if len(idToken) > 50 {
		fmt.Printf("Verifying Google token (first 50 chars): %s...\n", idToken[:50])
	}

	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
	if err != nil {
		fmt.Printf("Error calling Google tokeninfo: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	// Log the response for debugging
	fmt.Printf("Google tokeninfo response status: %d\n", resp.StatusCode)
	fmt.Printf("Google tokeninfo response body: %s\n", string(body))

	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		fmt.Printf("Error unmarshaling response: %v\n", err)
		return nil, err
	}

	if data["error"] != nil {
		fmt.Printf("Google returned error: %v\n", data["error"])
		return nil, fmt.Errorf("invalid token: %v", data["error"])
	}

	// Check if token is for our app
	aud, ok := data["aud"].(string)
	if !ok || aud != os.Getenv("GOOGLE_CLIENT_ID") {
		fmt.Printf("Token audience mismatch. Expected: %s, Got: %s\n", os.Getenv("GOOGLE_CLIENT_ID"), aud)
		return nil, fmt.Errorf("token audience mismatch")
	}

	email := ""
	if data["email"] != nil {
		email = data["email"].(string)
	}

	name := ""
	if data["name"] != nil {
		name = data["name"].(string)
	}

	picture := ""
	if data["picture"] != nil {
		picture = data["picture"].(string)
	}

	fmt.Printf("✅ Token verified successfully for user: %s\n", email)

	return &models.SocialAuthProfile{
		Provider:   "google",
		ProviderID: fmt.Sprint(data["sub"]),
		Email:      email,
		Name:       name,
		Picture:    picture,
	}, nil
}

// Verify Apple Identity Token
func verifyAppleIdentityToken(identityToken string, userData AppleUserData) (*models.SocialAuthProfile, error) {
	parts := strings.Split(identityToken, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format")
	}

	name := strings.TrimSpace(userData.Name.FirstName + " " + userData.Name.LastName)
	if name == "" {
		name = "Apple User"
	}

	// In production, verify JWT signature with Apple's public keys
	return &models.SocialAuthProfile{
		Provider:   "apple",
		ProviderID: "apple_" + fmt.Sprint(time.Now().Unix()),
		Email:      userData.Email,
		Name:       name,
	}, nil
}

// Helper: Split full name into first and last
func splitNameFromProfile(fullName string) (string, string) {
	parts := strings.Fields(strings.TrimSpace(fullName))
	if len(parts) == 0 {
		return "User", ""
	}
	if len(parts) == 1 {
		return parts[0], ""
	}
	// First name = first word, Last name = rest
	return parts[0], strings.Join(parts[1:], " ")
}

// Helper: Get environment variable
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
