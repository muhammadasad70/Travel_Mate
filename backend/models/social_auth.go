// models/social_auth.go
package models

import (
	"time"
)

type SocialAuth struct {
	ID           int64     `json:"id"`
	UserID       int64     `json:"user_id"`
	Provider     string    `json:"provider"` // google, facebook, apple, etc.
	ProviderID   string    `json:"provider_id"`
	Email        string    `json:"email"`
	AccessToken  string    `json:"-"` // Don't expose in JSON
	RefreshToken string    `json:"-"`
	ExpiresAt    time.Time `json:"expires_at"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type SocialAuthProfile struct {
	Provider    string `json:"provider"`
	ProviderID  string `json:"provider_id"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	Picture     string `json:"picture"`
	AccessToken string `json:"access_token"`
}
