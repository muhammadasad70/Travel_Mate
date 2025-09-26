package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"travel_mate/backend/cloudinary"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

// // HandleAssetUpload handles the HTTP request for uploading a media asset (image/video).
// func HandleAssetUpload(c *gin.Context) {
// 	log.Println("--- Starting HandleAssetUpload ---")

// 	// 1. Extract user ID
// 	userIDParam := c.Param("user_id")
// 	userID, err := strconv.Atoi(userIDParam)
// 	if err != nil {
// 		log.Printf("Invalid user ID '%s': %v", userIDParam, err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid user ID: %s", err.Error())})
// 		return
// 	}
// 	log.Printf("Parsed userID: %d", userID)

// 	// 2. Get file
// 	file, fileHeader, err := c.Request.FormFile("asset")
// 	if err != nil {
// 		log.Printf("Error retrieving file: %v", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Error retrieving file: %s", err.Error())})
// 		return
// 	}
// 	defer file.Close()
// 	log.Printf("Retrieved file: %s (size: %d)", fileHeader.Filename, fileHeader.Size)

// 	// 3. Upload to Cloudinary
// 	secureURL, cloudinaryID, err := cloudinary.UploadMedia(file)
// 	if err != nil {
// 		log.Printf("Cloudinary upload failed: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloud upload failed"})
// 		return
// 	}
// 	log.Printf("Cloudinary upload success: %s", secureURL)

// 	// 4. Create DB record
// 	imageRecord := &models.Image{
// 		UserID:       userID,
// 		CloudinaryID: cloudinaryID,
// 		URL:          secureURL,
// 		UploadedAt:   time.Now(),
// 	}

// 	insertedID, err := models.InsertImageRecord(imageRecord)
// 	if err != nil {
// 		log.Printf("DB insert failed: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed"})
// 		return
// 	}
// 	log.Printf("Image record inserted with ID: %d", insertedID)

// 	// 5. Response
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Media uploaded successfully",
// 		"id":      insertedID,
// 		"url":     secureURL,
// 	})
// }

func HandleAssetUpload(c *gin.Context) {
	log.Println("--- Starting HandleAssetUpload ---")

	userIDParam := c.Param("user_id")
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid user ID: %s", err.Error())})
		return
	}

	// Expect multipart/form-data with field name "asset"
	fileHeader, err := c.FormFile("asset")
	if err != nil {
		log.Printf("FormFile error (expecting field 'asset'): %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received. Ensure field name is 'asset' and content-type is multipart/form-data."})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		log.Printf("Open file error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not open uploaded file"})
		return
	}
	defer file.Close()

	log.Printf("Retrieved file: %s (size: %d)", fileHeader.Filename, fileHeader.Size)

	secureURL, cloudinaryID, err := cloudinary.UploadMedia(file)
	if err != nil {
		log.Printf("Cloudinary upload failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cloud upload failed"})
		return
	}

	imageRecord := &models.Image{
		UserID:       userID,
		CloudinaryID: cloudinaryID,
		URL:          secureURL,
		UploadedAt:   time.Now(),
	}
	insertedID, err := models.InsertImageRecord(imageRecord)
	if err != nil {
		log.Printf("DB insert failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Media uploaded successfully",
		"id":      insertedID,
		"url":     secureURL,
	})
}
