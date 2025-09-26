// package cloudinary

// import (
// 	"context"
// 	"log"
// 	"mime/multipart"
// 	"os"

// 	"github.com/cloudinary/cloudinary-go/v2"
// 	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
// )

// var cld *cloudinary.Cloudinary

// // InitCloudinary initializes Cloudinary client
// func InitCloudinary() {
// 	log.Println("Reading CLOUDINARY_CLOUD_NAME:", os.Getenv("CLOUDINARYKEYNAME"))
// 	log.Println("Reading CLOUDINARY_API_KEY:", os.Getenv("CLOUDINARYAPIKEY"))
// 	log.Println("Reading CLOUDINARY_API_SECRET:", os.Getenv("CLOUDINARYAPISECRET"))

// 	var err error
// 	cld, err = cloudinary.NewFromParams(
// 		os.Getenv("CLOUDINARYKEYNAME"),
// 		os.Getenv("CLOUDINARYAPIKEY"),
// 		os.Getenv("CLOUDINARYAPISECRET"),
// 	)
// 	if err != nil {
// 		panic("❌ Failed to initialize Cloudinary: " + err.Error())
// 	}
// 	log.Println("✅ Cloudinary initialized successfully")
// }

// // UploadMedia uploads image/video and returns secureURL, publicID, and error
// func UploadMedia(file multipart.File) (string, string, error) {
// 	ctx := context.Background()

// 	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
// 		ResourceType: "auto", // auto-detect image/video
// 	})
// 	if err != nil {
// 		log.Printf("❌ Cloudinary API call error: %v", err)
// 		return "", "", err
// 	}

//		log.Printf("✅ Cloudinary raw upload result: %+v", uploadResult)
//		return uploadResult.SecureURL, uploadResult.PublicID, nil
//	}
// package cloudinary

// import (
// 	"context"
// 	"log"
// 	"mime/multipart"

// 	"github.com/cloudinary/cloudinary-go/v2"
// 	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
// )

// var cld *cloudinary.Cloudinary

// func InitCloudinary() {
// 	var err error
// 	cld, err = cloudinary.NewFromParams(
// 		"dp93cxbby",                   // cloud name
// 		"884742249728356",             // api key
// 		"WV1_q6ZQ-nZZLrwCt-CHR79DYjM", // api secret  (⚠️ don’t hardcode in prod)
// 	)
// 	if err != nil {
// 		panic("Failed to init Cloudinary: " + err.Error())
// 	}
// 	log.Println("✅ Cloudinary initialized")
// }

// func UploadMedia(file multipart.File) (string, string, error) {
// 	ctx := context.Background()

// 	res, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
// 		ResourceType: "auto",               // image/video autodetect
// 		Folder:       "travelmate_uploads", // keep your FYP media organized
// 	})
// 	if err != nil {
// 		log.Printf("Cloudinary upload error: %v", err)
// 		return "", "", err
// 	}
// 	log.Printf("Cloudinary upload OK: public_id=%s url=%s", res.PublicID, res.SecureURL)
// 	return res.SecureURL, res.PublicID, nil
// }

// package cloudinary

// import (
// 	"context"
// 	"log"
// 	"mime/multipart"

// 	"github.com/cloudinary/cloudinary-go/v2"
// 	"github.com/cloudinary/cloudinary-go/v2/api"
// 	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
// )

// var cld *cloudinary.Cloudinary

// // ⚠️ For production, read from env instead of hardcoding.
// func InitCloudinary() {
// 	var err error
// 	cld, err = cloudinary.NewFromParams(
// 		"dp93cxbby",                   // cloud name
// 		"884742249728356",             // api key
// 		"WV1_q6ZQ-nZZLrwCt-CHR79DYjM", // api secret
// 	)
// 	if err != nil {
// 		panic("Failed to init Cloudinary: " + err.Error())
// 	}
// 	log.Println("✅ Cloudinary initialized")
// }

// func UploadMedia(file multipart.File) (string, string, error) {
// 	ctx := context.Background()

// 	res, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
// 		ResourceType:   "auto",               // image/video autodetect
// 		Folder:         "travelmate_uploads", // organize by project
// 		UseFilename:    api.Bool(true),       // <-- pointer bool helper
// 		UniqueFilename: api.Bool(true),       // <-- keep names unique
// 		Overwrite:      api.Bool(false),      // <-- safety: don't overwrite
// 	})
// 	if err != nil {
// 		log.Printf("Cloudinary upload error: %v", err)
// 		return "", "", err
// 	}
// 	log.Printf("Cloudinary upload OK: public_id=%s url=%s", res.PublicID, res.SecureURL)
// 	return res.SecureURL, res.PublicID, nil
// }

package cloudinary

import (
	"context"
	"log"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/joho/godotenv"
)

var cld *cloudinary.Cloudinary

// InitCloudinary initializes Cloudinary client from .env
func InitCloudinary() {
	// Load .env
	_ = godotenv.Load()

	cloudName := os.Getenv("CLOUDINARYKEYNAME")
	apiKey := os.Getenv("CLOUDINARYAPIKEY")
	apiSecret := os.Getenv("CLOUDINARYAPISECRET")

	var err error
	cld, err = cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		panic("❌ Failed to init Cloudinary: " + err.Error())
	}
	log.Println("✅ Cloudinary initialized with account:", cloudName)
}

// UploadMedia uploads image/video and returns URL + publicID
func UploadMedia(file multipart.File) (string, string, error) {
	ctx := context.Background()

	res, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		ResourceType:   "auto",               // image/video autodetect
		Folder:         "travelmate_uploads", // keep project organized
		UseFilename:    api.Bool(true),
		UniqueFilename: api.Bool(true),
		Overwrite:      api.Bool(false),
	})
	if err != nil {
		log.Printf("❌ Cloudinary upload error: %v", err)
		return "", "", err
	}

	log.Printf("✅ Cloudinary upload OK: public_id=%s url=%s", res.PublicID, res.SecureURL)
	return res.SecureURL, res.PublicID, nil
}
