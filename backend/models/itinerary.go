package models

import (
	"time"
	"travel_mate/backend/database"
)

type Itinerary struct {
	Id          int            `json:"id"`
	UserId      int            `json:"user_id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	City        string         `json:"city"`
	Budget      string         `json:"budget"`
	Style       string         `json:"style"`
	StartDate   time.Time      `json:"start_date"`
	EndDate     time.Time      `json:"end_date"`
	CoverURL    string         `json:"cover_url"`
	CreatedAt   time.Time      `json:"created_at"`
	Days        []ItineraryDay `json:"days"`
}

type ItineraryDay struct {
	Id          int    `json:"id"`
	ItineraryId int    `json:"itinerary_id"`
	DayNumber   int    `json:"day_number"`
	Place       string `json:"place"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	Activities  string `json:"activities"`
}
type ItineraryDayDTO struct {
	DayNumber  int    `json:"day_number"`
	Place      string `json:"place"`
	StartTime  string `json:"start_time"`
	EndTime    string `json:"end_time"`
	Activities string `json:"activities"`
}

/* ---------- DB operations ---------- */

func CreateItinerary(i *Itinerary) error {
	const q = `
		INSERT INTO itineraries (user_id, title, description, city, budget, style, start_date, end_date, cover_url)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at`
	err := database.DB.QueryRow(q,
		i.UserId, i.Title, i.Description, i.City, i.Budget, i.Style,
		i.StartDate, i.EndDate, i.CoverURL,
	).Scan(&i.Id, &i.CreatedAt)
	if err != nil {
		return err
	}

	// insert days
	for _, d := range i.Days {
		_, err := database.DB.Exec(`
			INSERT INTO itinerary_days (itinerary_id, day_number, place, start_time, end_time, activities)
			VALUES ($1,$2,$3,$4,$5,$6)
		`, i.Id, d.DayNumber, d.Place, d.StartTime, d.EndTime, d.Activities)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetItinerariesByUser(userId int) ([]Itinerary, error) {
	const q = `SELECT id, user_id, title, description, city, budget, style, start_date, end_date, cover_url, created_at FROM itineraries WHERE user_id=$1 ORDER BY created_at DESC`
	rows, err := database.DB.Query(q, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []Itinerary{}
	for rows.Next() {
		var it Itinerary
		if err := rows.Scan(&it.Id, &it.UserId, &it.Title, &it.Description, &it.City,
			&it.Budget, &it.Style, &it.StartDate, &it.EndDate, &it.CoverURL, &it.CreatedAt); err != nil {
			return nil, err
		}

		// load days
		days, _ := GetDaysByItinerary(it.Id)
		it.Days = days

		list = append(list, it)
	}
	return list, nil
}

func GetDaysByItinerary(itineraryId int) ([]ItineraryDay, error) {
	const q = `SELECT id, itinerary_id, day_number, place, start_time, end_time, activities FROM itinerary_days WHERE itinerary_id=$1 ORDER BY day_number`
	rows, err := database.DB.Query(q, itineraryId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	days := []ItineraryDay{}
	for rows.Next() {
		var d ItineraryDay
		if err := rows.Scan(&d.Id, &d.ItineraryId, &d.DayNumber, &d.Place, &d.StartTime, &d.EndTime, &d.Activities); err != nil {
			return nil, err
		}
		days = append(days, d)
	}
	return days, nil
}
