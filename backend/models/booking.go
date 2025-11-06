// // models/booking.go
// package models

// import (
// 	"errors"
// 	"time"

// 	"travel_mate/backend/database"
// )

// type Booking struct {
// 	Id            int       `json:"id"`
// 	ServiceId     int       `json:"service_id"`
// 	VendorId      int       `json:"vendor_id"`
// 	TravelerId    int       `json:"traveler_id"`
// 	Status        string    `json:"status"` // pending|confirmed|declined|cancelled
// 	ChosenDate    *string   `json:"chosen_date,omitempty"`
// 	Participants  int       `json:"participants"`
// 	Message       string    `json:"message"`
// 	PriceSnapshot *float64  `json:"price_snapshot,omitempty"`
// 	PricingModel  string    `json:"pricing_model"`
// 	CreatedAt     time.Time `json:"created_at"`
// }

// var ErrForbidden = errors.New("forbidden")
// var ErrNotFound = errors.New("not found")

// func CreateBooking(b *Booking) error {
// 	const q = `
// 	INSERT INTO cultural_service_bookings
// 	(service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model)
// 	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
// 	RETURNING id, created_at`
// 	return database.DB.QueryRow(q,
// 		b.ServiceId, b.VendorId, b.TravelerId, b.Status, b.ChosenDate, b.Participants, b.Message, b.PriceSnapshot, b.PricingModel,
// 	).Scan(&b.Id, &b.CreatedAt)
// }

// func ListTravelerBookings(uid int) ([]Booking, error) {
// 	const q = `
// 	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
// 	FROM cultural_service_bookings WHERE traveler_id=$1
// 	ORDER BY created_at DESC`
// 	rows, err := database.DB.Query(q, uid)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()
// 	var out []Booking
// 	for rows.Next() {
// 		var b Booking
// 		err := rows.Scan(&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants, &b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt)
// 		if err != nil {
// 			return nil, err
// 		}
// 		out = append(out, b)
// 	}
// 	return out, nil
// }

// func ListVendorBookingsByStatus(uid int, status string) ([]Booking, error) {
// 	const q = `
// 	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
// 	FROM cultural_service_bookings WHERE vendor_id=$1 AND status=$2
// 	ORDER BY created_at DESC`
// 	rows, err := database.DB.Query(q, uid, status)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()
// 	var out []Booking
// 	for rows.Next() {
// 		var b Booking
// 		if err := rows.Scan(&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants, &b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt); err != nil {
// 			return nil, err
// 		}
// 		out = append(out, b)
// 	}
// 	return out, nil
// }

// func GetBookingForVendor(uid, id int) (Booking, error) {
// 	const q = `
// 	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
// 	FROM cultural_service_bookings WHERE id=$1`
// 	var b Booking
// 	err := database.DB.QueryRow(q, id).Scan(
// 		&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants, &b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt,
// 	)
// 	if err != nil {
// 		return Booking{}, err
// 	}
// 	if b.VendorId != uid {
// 		return Booking{}, ErrForbidden
// 	}
// 	return b, nil
// }

// func UpdateBookingStatus(id int, newStatus string) error {
// 	_, err := database.DB.Exec(`UPDATE cultural_service_bookings SET status=$1 WHERE id=$2`, newStatus, id)
// 	return err
// }

// models/booking.go
package models

import (
	"database/sql"
	"errors"
	"time"

	"travel_mate/backend/database"
)

type Booking struct {
	Id            int       `json:"id"`
	ServiceId     int       `json:"service_id"`
	VendorId      int       `json:"vendor_id"`
	TravelerId    int       `json:"traveler_id"`
	Status        string    `json:"status"` // pending|confirmed|declined|cancelled
	ChosenDate    *string   `json:"chosen_date,omitempty"`
	Participants  int       `json:"participants"`
	Message       string    `json:"message"`
	PriceSnapshot *float64  `json:"price_snapshot,omitempty"`
	PricingModel  string    `json:"pricing_model"`
	CreatedAt     time.Time `json:"created_at"`
}
type ServiceSummary struct {
	ID             int      `json:"id"`
	Title          string   `json:"title"`
	City           string   `json:"city"`
	ExperienceType string   `json:"experience_type"`
	DurationHours  float64  `json:"duration_hours"`
	PricingModel   string   `json:"pricing_model"`
	PricePerPerson *float64 `json:"price_per_person,omitempty"`
	PricePerGroup  *float64 `json:"price_per_group,omitempty"`
}
type BookingEnriched struct {
	Id            int       `json:"id"`
	ServiceId     int       `json:"service_id"`
	VendorId      int       `json:"vendor_id"`
	TravelerId    int       `json:"traveler_id"`
	Status        string    `json:"status"`
	ChosenDate    *string   `json:"chosen_date,omitempty"`
	Participants  int       `json:"participants"`
	Message       string    `json:"message"`
	PriceSnapshot *float64  `json:"price_snapshot,omitempty"`
	PricingModel  string    `json:"pricing_model"`
	CreatedAt     time.Time `json:"created_at"`

	Service ServiceSummary `json:"service"`
}

// Keep only ErrForbidden here; ErrNotFound comes from models/errors.go
var ErrForbidden = errors.New("forbidden")

func CreateBooking(b *Booking) error {
	const q = `
	INSERT INTO cultural_service_bookings
	(service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
	RETURNING id, created_at`
	return database.DB.QueryRow(q,
		b.ServiceId, b.VendorId, b.TravelerId, b.Status, b.ChosenDate, b.Participants, b.Message, b.PriceSnapshot, b.PricingModel,
	).Scan(&b.Id, &b.CreatedAt)
}

func ListTravelerBookings(uid int) ([]Booking, error) {
	const q = `
	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
	FROM cultural_service_bookings WHERE traveler_id=$1
	ORDER BY created_at DESC`
	rows, err := database.DB.Query(q, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(
			&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants,
			&b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, b)
	}
	return out, nil
}
func ListTravelerBookingsEnriched(uid int) ([]BookingEnriched, error) {
	const q = `
	SELECT
	  b.id, b.service_id, b.vendor_id, b.traveler_id, b.status, b.chosen_date,
	  b.participants, b.message, b.price_snapshot, b.pricing_model, b.created_at,
	  s.id, s.title, s.city, s.experience_type, s.duration_hours, s.pricing_model,
	  s.price_per_person, s.price_per_group
	FROM cultural_service_bookings b
	JOIN cultural_services s ON s.id = b.service_id
	WHERE b.traveler_id = $1
	ORDER BY b.created_at DESC`
	rows, err := database.DB.Query(q, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []BookingEnriched
	for rows.Next() {
		var r BookingEnriched
		if err := rows.Scan(
			&r.Id, &r.ServiceId, &r.VendorId, &r.TravelerId, &r.Status, &r.ChosenDate,
			&r.Participants, &r.Message, &r.PriceSnapshot, &r.PricingModel, &r.CreatedAt,
			&r.Service.ID, &r.Service.Title, &r.Service.City, &r.Service.ExperienceType,
			&r.Service.DurationHours, &r.Service.PricingModel,
			&r.Service.PricePerPerson, &r.Service.PricePerGroup,
		); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, nil
}

func ListVendorBookingsByStatus(uid int, status string) ([]Booking, error) {
	const q = `
	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
	FROM cultural_service_bookings WHERE vendor_id=$1 AND status=$2
	ORDER BY created_at DESC`
	rows, err := database.DB.Query(q, uid, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(
			&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants,
			&b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, b)
	}
	return out, nil
}

func GetBookingForVendor(uid, id int) (Booking, error) {
	const q = `
	SELECT id, service_id, vendor_id, traveler_id, status, chosen_date, participants, message, price_snapshot, pricing_model, created_at
	FROM cultural_service_bookings WHERE id=$1`
	var b Booking
	err := database.DB.QueryRow(q, id).Scan(
		&b.Id, &b.ServiceId, &b.VendorId, &b.TravelerId, &b.Status, &b.ChosenDate, &b.Participants,
		&b.Message, &b.PriceSnapshot, &b.PricingModel, &b.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Booking{}, ErrNotFound
		}
		return Booking{}, err
	}
	if b.VendorId != uid {
		return Booking{}, ErrForbidden
	}
	return b, nil
}

func UpdateBookingStatus(id int, newStatus string) error {
	res, err := database.DB.Exec(`UPDATE cultural_service_bookings SET status=$1 WHERE id=$2`, newStatus, id)
	if err != nil {
		return err
	}
	if aff, _ := res.RowsAffected(); aff == 0 {
		return ErrNotFound
	}
	return nil
}
