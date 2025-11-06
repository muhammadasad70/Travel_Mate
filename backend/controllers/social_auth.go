// package controllers

// import (
// 	"context"
// 	"encoding/json"
// 	"errors"
// 	"fmt"
// 	"net/http"
// 	"os"

// 	"travel_mate/backend/models"
// 	"travel_mate/backend/utils"

// 	"github.com/gin-gonic/gin"
// 	"google.golang.org/api/idtoken"
// )

// type socialReq struct {
// 	Provider    string `json:"provider" binding:"required,oneof=google facebook"`
// 	IDToken     string `json:"idToken"`     // google
// 	AccessToken string `json:"accessToken"` // facebook
// 	Role        string `json:"role"`        // optional: traveler/vendor
// }

// func SocialLogin(c *gin.Context) {
// 	var req socialReq
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
// 		return
// 	}

// 	var email, name, avatar, providerID string
// 	var emailVerified bool
// 	var err error

// 	switch req.Provider {
// 	case "google":
// 		email, name, avatar, providerID, emailVerified, err = verifyGoogleIDTokenStrict(req.IDToken)
// 	case "facebook":
// 		email, name, avatar, providerID, err = verifyFacebookAccessToken(req.AccessToken)
// 		emailVerified = (email != "")
// 	default:
// 		err = errors.New("unsupported provider")
// 	}

// 	if err != nil || email == "" || providerID == "" {
// 		if err == nil {
// 			err = errors.New("failed to verify token")
// 		}
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
// 		return
// 	}
// 	if req.Provider == "google" && !emailVerified {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Google email is not verified"})
// 		return
// 	}

// 	// Upsert / link
// 	user, err := models.UpsertSocialUser(models.SocialUserIn{
// 		Provider:   req.Provider,
// 		ProviderID: providerID,
// 		Email:      email,
// 		Name:       name,
// 		AvatarURL:  avatar,
// 		Role:       req.Role,
// 	})
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
// 		return
// 	}

// 	token, _ := utils.GenerateTokenWithRole(user.Email, user.Id, user.Role)

// 	// Progressive profile info
// 	missing := computeMissingFields(user)
// 	first, last := splitName(name)

// 	// Welcome email (best-effort) if never sent
// 	if user.WelcomeEmailSentAt == nil {
// 		fireWelcomeEmailOnce(user)
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":        "Login successful",
// 		"token":          token,
// 		"role":           user.Role,
// 		"user_id":        user.Id,
// 		"completed":      user.IsProfileComplete,
// 		"missing_fields": missing,
// 		"prefill": gin.H{
// 			"email":      user.Email,
// 			"first_name": first,
// 			"last_name":  last,
// 			"avatar_url": avatar,
// 		},
// 	})
// }

// // ---------- Google ----------
// func verifyGoogleIDTokenStrict(idTok string) (email, name, avatar, sub string, emailVerified bool, err error) {
// 	if idTok == "" {
// 		return "", "", "", "", false, errors.New("missing idToken")
// 	}
// 	aud := os.Getenv("GOOGLE_WEB_CLIENT_ID")
// 	payload, err := idtoken.Validate(context.Background(), idTok, aud)
// 	if err != nil {
// 		return "", "", "", "", false, err
// 	}
// 	email, _ = payload.Claims["email"].(string)
// 	name, _ = payload.Claims["name"].(string)
// 	picture, _ := payload.Claims["picture"].(string)
// 	sub, _ = payload.Claims["sub"].(string)
// 	ev, _ := payload.Claims["email_verified"].(bool)
// 	return email, name, picture, sub, ev, nil
// }

// // ---------- Facebook ----------

// type fbDebugResp struct {
// 	Data struct {
// 		IsValid bool   `json:"is_valid"`
// 		UserID  string `json:"user_id"`
// 		AppID   string `json:"app_id"`
// 	} `json:"data"`
// }
// type fbMe struct {
// 	ID      string `json:"id"`
// 	Name    string `json:"name"`
// 	Email   string `json:"email"`
// 	Picture struct {
// 		Data struct {
// 			URL string `json:"url"`
// 		} `json:"data"`
// 	} `json:"picture"`
// }

// func verifyFacebookAccessToken(accessToken string) (email, name, avatar, userID string, err error) {
// 	if accessToken == "" {
// 		return "", "", "", "", errors.New("missing accessToken")
// 	}
// 	appID := os.Getenv("FB_APP_ID")
// 	appSecret := os.Getenv("FB_APP_SECRET")
// 	if appID == "" || appSecret == "" {
// 		return "", "", "", "", errors.New("facebook app credentials not configured")
// 	}
// 	// 1) Debug token
// 	appAccess := appID + "|" + appSecret
// 	debugURL := fmt.Sprintf("https://graph.facebook.com/debug_token?input_token=%s&access_token=%s", accessToken, appAccess)
// 	resp, err := http.Get(debugURL)
// 	if err != nil {
// 		return "", "", "", "", err
// 	}
// 	defer resp.Body.Close()
// 	var dbg fbDebugResp
// 	if err := json.NewDecoder(resp.Body).Decode(&dbg); err != nil || !dbg.Data.IsValid {
// 		return "", "", "", "", errors.New("invalid facebook token")
// 	}
// 	// 2) Fetch profile
// 	meURL := fmt.Sprintf("https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=%s", accessToken)
// 	r2, err := http.Get(meURL)
// 	if err != nil {
// 		return "", "", "", "", err
// 	}
// 	defer r2.Body.Close()
// 	var me fbMe
// 	if err := json.NewDecoder(r2.Body).Decode(&me); err != nil {
// 		return "", "", "", "", err
// 	}
// 	return me.Email, me.Name, me.Picture.Data.URL, me.ID, nil
// }

package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

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

func SocialLogin(c *gin.Context) {
	var req socialReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	var email, name, avatar, providerID string
	var emailVerified bool
	var err error

	switch req.Provider {
	case "google":
		email, name, avatar, providerID, emailVerified, err = verifyGoogleIDTokenStrict(req.IDToken)
	case "facebook":
		email, name, avatar, providerID, err = verifyFacebookAccessToken(req.AccessToken)
		emailVerified = (email != "")
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
	if req.Provider == "google" && !emailVerified {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Google email is not verified"})
		return
	}

	// Upsert / link
	user, err := models.UpsertSocialUser(models.SocialUserIn{
		Provider:   req.Provider,
		ProviderID: providerID,
		Email:      strings.ToLower(strings.TrimSpace(email)),
		Name:       name,
		AvatarURL:  avatar,
		Role:       req.Role,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	token, _ := utils.GenerateTokenWithRole(user.Email, user.Id, user.Role)

	// Progressive profile info
	missing := computeMissingFields(user)
	first, last := splitName(name)

	// Welcome email (best-effort) if never sent
	if user.WelcomeEmailSentAt == nil {
		fireWelcomeEmailOnce(user)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Login successful",
		"token":          token,
		"role":           user.Role,
		"user_id":        user.Id,
		"completed":      user.IsProfileComplete,
		"missing_fields": missing,
		"prefill": gin.H{
			"email":      user.Email,
			"first_name": first,
			"last_name":  last,
			"avatar_url": avatar,
		},
	})
}

// ---------- Google (accept WEB + ANDROID + IOS audiences) ----------
func verifyGoogleIDTokenStrict(idTok string) (email, name, avatar, sub string, emailVerified bool, err error) {
	if idTok == "" {
		return "", "", "", "", false, errors.New("missing idToken")
	}

	cands := []string{
		os.Getenv("GOOGLE_WEB_CLIENT_ID"),
		os.Getenv("GOOGLE_ANDROID_CLIENT_ID"),
		os.Getenv("GOOGLE_IOS_CLIENT_ID"),
	}

	var payload *idtoken.Payload
	var lastErr error
	for _, aud := range cands {
		aud = strings.TrimSpace(aud)
		if aud == "" {
			continue
		}
		p, e := idtoken.Validate(context.Background(), idTok, aud)
		if e == nil {
			payload = p
			break
		}
		lastErr = e
	}
	if payload == nil {
		if lastErr == nil {
			lastErr = errors.New("invalid google id token (audience)")
		}
		return "", "", "", "", false, lastErr
	}

	email, _ = payload.Claims["email"].(string)
	name, _ = payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)
	sub, _ = payload.Claims["sub"].(string)
	ev, _ := payload.Claims["email_verified"].(bool)
	return email, name, picture, sub, ev, nil
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
