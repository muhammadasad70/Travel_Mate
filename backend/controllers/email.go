// package controllers

// import (
// 	"fmt"
// 	"os"
// 	"strings"

// 	"gopkg.in/gomail.v2"
// )

// func sendEmail(to, subject, message string) error {
// 	user := os.Getenv("EMAIL_USERNAME")
// 	pw := os.Getenv("EMAIL_APP_PASSWORD")
// 	if pw == "" {
// 		pw = os.Getenv("EMAIL_PASSWORD") // fallback if you already use this name
// 	}
// 	pw = strings.ReplaceAll(pw, " ", "")

// 	if user == "" || pw == "" {
// 		return fmt.Errorf("EMAIL_USERNAME or EMAIL_APP_PASSWORD not set")
// 	}

// 	m := gomail.NewMessage()
// 	m.SetHeader("From", user)
// 	m.SetHeader("To", to)
// 	m.SetHeader("Subject", subject)
// 	m.SetBody("text/plain", message)

// 	d := gomail.NewDialer("smtp.gmail.com", 587, user, pw)
// 	if err := d.DialAndSend(m); err != nil {
// 		return fmt.Errorf("smtp send failed: %w", err)
// 	}
// 	return nil
// }

// package controllers

// import (
// 	"fmt"
// 	"os"
// 	"strings"

// 	"gopkg.in/gomail.v2"
// )

// // sendEmail sends an email using credentials from environment variables
// func sendEmail(to string, subject string, message string) error {
// 	// Load credentials
// 	username := os.Getenv("EMAIL_USERNAME")
// 	rawPassword := os.Getenv("EMAIL_PASSWORD")

// 	// Remove any accidental spaces in the app password
// 	password := strings.ReplaceAll(rawPassword, " ", "")

// 	fmt.Println("[DEBUG] EMAIL_USERNAME:", username)
// 	fmt.Println("[DEBUG] EMAIL_PASSWORD length:", len(password), "chars")

// 	// Fail early if env not set
// 	if username == "" || password == "" {
// 		return fmt.Errorf("[ERROR] EMAIL_USERNAME or EMAIL_PASSWORD not set in environment")
// 	}

// 	fmt.Println("[DEBUG] Preparing email to:", to, "| Subject:", subject)

// 	// Compose email
// 	m := gomail.NewMessage()
// 	m.SetHeader("From", username)
// 	m.SetHeader("To", to)
// 	m.SetHeader("Subject", subject)
// 	m.SetBody("text/plain", message)

// 	// Configure Gmail SMTP (TLS on port 587)
// 	d := gomail.NewDialer("smtp.gmail.com", 587, username, password)

// 	// Send email
// 	err := d.DialAndSend(m)
// 	if err != nil {
// 		fmt.Println("[ERROR] Email sending failed:", err)
// 		return err
// 	}

// 	fmt.Println("[DEBUG] Email sent successfully to:", to)
// 	return nil
// }

package controllers

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

// sendEmail sends an email using credentials from environment variables
func sendEmail(to string, subject string, message string) error {
	// Load .env (only once per app run; safe to call multiple times)
	_ = godotenv.Load()

	// Load credentials from env
	username := os.Getenv("EMAIL_USERNAME")
	rawPassword := os.Getenv("EMAIL_PASSWORD")

	// Remove accidental spaces in Gmail app password
	password := strings.ReplaceAll(rawPassword, " ", "")

	fmt.Println("[DEBUG] EMAIL_USERNAME:", username)
	fmt.Println("[DEBUG] EMAIL_PASSWORD length:", len(password), "chars")

	// Fail early if env not set
	if username == "" || password == "" {
		return fmt.Errorf("[ERROR] EMAIL_USERNAME or EMAIL_PASSWORD not set in environment")
	}

	fmt.Println("[DEBUG] Preparing email to:", to, "| Subject:", subject)

	// Compose email
	m := gomail.NewMessage()
	m.SetHeader("From", username)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", message)

	// Configure Gmail SMTP (TLS on port 587)
	d := gomail.NewDialer("smtp.gmail.com", 587, username, password)

	// Send email
	if err := d.DialAndSend(m); err != nil {
		fmt.Println("[ERROR] Email sending failed:", err)
		return err
	}

	fmt.Println("[DEBUG] Email sent successfully to:", to)
	return nil
}

func sendWelcomeEmail(to string, displayName string) error {
	if displayName == "" {
		displayName = "Traveler"
	}
	subject := "Welcome to TravelMate 🎉"
	body := fmt.Sprintf(
		"Hi %s!\n\nThanks for joining TravelMate. You can start exploring services, planning itineraries, and booking experiences.\n\nHappy travels!\n— The TravelMate Team",
		displayName,
	)
	return sendEmail(to, subject, body)
}
