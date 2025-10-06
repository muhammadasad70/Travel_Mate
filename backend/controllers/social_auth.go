package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"travel_mate/backend/models"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type socialReq struct {
	Provider    string `json:"provider" binding:"required,oneof=google facebook"`
	IDToken     string `json:"idToken"`     // google
	AccessToken string `json:"accessToken"` // facebook
	Role        string `json:"role"`        // optional: traveler/vendor
}

// POST /auth/social
func SocialLogin(c *gin.Context) {
	var req socialReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	var email, name, avatar, providerID string
	var err error
	switch req.Provider {
	case "google":
		email, name, avatar, providerID, err = verifyGoogleIDToken(req.IDToken)
	case "facebook":
		email, name, avatar, providerID, err = verifyFacebookAccessToken(req.AccessToken)
	default:
		err = errors.New("unsupported provider")
	}
	if err != nil || email == "" || providerID == "" {
		if err == nil {
			err = errors.New("failed to verify token")
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Upsert / link
	user, err := models.UpsertSocialUser(models.SocialUserIn{
		Provider:   req.Provider,
		ProviderID: providerID,
		Email:      email,
		Name:       name,
		AvatarURL:  avatar,
		Role:       req.Role, // may be empty, model defaults to traveler
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	// JWT
	token, _ := utils.GenerateTokenWithRole(user.Email, user.Id, user.Role)

	c.JSON(http.StatusOK, gin.H{
		"message":   "Login successful",
		"token":     token,
		"role":      user.Role,
		"user_id":   user.Id,
		"completed": user.IsProfileComplete,
	})
}

// ---------- Google ----------

func verifyGoogleIDToken(idTok string) (email, name, avatar, sub string, err error) {
	if idTok == "" {
		return "", "", "", "", errors.New("missing idToken")
	}
	// Audience is optional if you use multiple client IDs. Provide primary WEB client if you have it.
	aud := os.Getenv("GOOGLE_WEB_CLIENT_ID")
	payload, err := idtoken.Validate(context.Background(), idTok, aud)
	if err != nil {
		return "", "", "", "", err
	}
	// fields we care about
	email, _ = payload.Claims["email"].(string)
	name, _ = payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)
	sub, _ = payload.Claims["sub"].(string)
	return email, name, picture, sub, nil
}

// ---------- Facebook ----------

type fbDebugResp struct {
	Data struct {
		IsValid bool   `json:"is_valid"`
		UserID  string `json:"user_id"`
		AppID   string `json:"app_id"`
	} `json:"data"`
}
type fbMe struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Picture struct {
		Data struct {
			URL string `json:"url"`
		} `json:"data"`
	} `json:"picture"`
}

func verifyFacebookAccessToken(accessToken string) (email, name, avatar, userID string, err error) {
	if accessToken == "" {
		return "", "", "", "", errors.New("missing accessToken")
	}
	appID := os.Getenv("FB_APP_ID")
	appSecret := os.Getenv("FB_APP_SECRET")
	if appID == "" || appSecret == "" {
		return "", "", "", "", errors.New("facebook app credentials not configured")
	}
	// 1) Debug token
	appAccess := appID + "|" + appSecret
	debugURL := fmt.Sprintf("https://graph.facebook.com/debug_token?input_token=%s&access_token=%s", accessToken, appAccess)
	resp, err := http.Get(debugURL)
	if err != nil {
		return "", "", "", "", err
	}
	defer resp.Body.Close()
	var dbg fbDebugResp
	if err := json.NewDecoder(resp.Body).Decode(&dbg); err != nil || !dbg.Data.IsValid {
		return "", "", "", "", errors.New("invalid facebook token")
	}
	// 2) Fetch profile
	meURL := fmt.Sprintf("https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=%s", accessToken)
	r2, err := http.Get(meURL)
	if err != nil {
		return "", "", "", "", err
	}
	defer r2.Body.Close()
	var me fbMe
	if err := json.NewDecoder(r2.Body).Decode(&me); err != nil {
		return "", "", "", "", err
	}
	return me.Email, me.Name, me.Picture.Data.URL, me.ID, nil
}
