package models

import (
	"time"
	"travel_mate/backend/database"
)

type Image struct {
	Id           int       `json:"id"`
	UserID       int       `json:"user_id"`
	CloudinaryID string    `json:"cloudinary_id"`
	URL          string    `json:"url"`
	UploadedAt   time.Time `json:"uploaded_at"`
}

/* ---------- DB operations ---------- */

// InsertImageRecord inserts an image into DB and returns the ID
func InsertImageRecord(img *Image) (int, error) {
	const q = `
		INSERT INTO images (user_id, cloudinary_id, url, uploaded_at)
		VALUES ($1,$2,$3,$4) RETURNING id`
	err := database.DB.QueryRow(q,
		img.UserID, img.CloudinaryID, img.URL, img.UploadedAt,
	).Scan(&img.Id)
	if err != nil {
		return 0, err
	}
	return img.Id, nil
}

// GetImagesByUser fetches all images uploaded by a user
func GetImagesByUser(userId int) ([]Image, error) {
	const q = `SELECT id, user_id, cloudinary_id, url, uploaded_at 
	           FROM images WHERE user_id=$1 ORDER BY uploaded_at DESC`
	rows, err := database.DB.Query(q, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	images := []Image{}
	for rows.Next() {
		var img Image
		if err := rows.Scan(&img.Id, &img.UserID, &img.CloudinaryID, &img.URL, &img.UploadedAt); err != nil {
			return nil, err
		}
		images = append(images, img)
	}
	return images, nil
}

// GetImageById fetches a single image by its ID
func GetImageById(id int) (*Image, error) {
	const q = `SELECT id, user_id, cloudinary_id, url, uploaded_at 
	           FROM images WHERE id=$1`
	var img Image
	err := database.DB.QueryRow(q, id).Scan(&img.Id, &img.UserID, &img.CloudinaryID, &img.URL, &img.UploadedAt)
	if err != nil {
		return nil, err
	}
	return &img, nil
}
