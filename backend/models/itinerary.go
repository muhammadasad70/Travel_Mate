package models

import (
	"database/sql"
	"errors"
	"time"
	"travel_mate/backend/database"
)

var ErrNotFound = errors.New("not found")

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

func GetItineraryByIDForUser(userId, id int) (Itinerary, error) {
	const q = `SELECT id, user_id, title, description, city, budget, style, start_date, end_date, cover_url, created_at
			   FROM itineraries WHERE id=$1 AND user_id=$2`
	row := database.DB.QueryRow(q, id, userId)

	var it Itinerary
	if err := row.Scan(&it.Id, &it.UserId, &it.Title, &it.Description, &it.City, &it.Budget, &it.Style,
		&it.StartDate, &it.EndDate, &it.CoverURL, &it.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Itinerary{}, ErrNotFound
		}
		return Itinerary{}, err
	}
	days, err := GetDaysByItinerary(it.Id)
	if err == nil {
		it.Days = days
	}
	return it, nil
}

/* -------- Full update (PUT) – replaces base fields; replaces days with provided slice (even empty) -------- */

func UpdateItineraryFull(userId, id int, in Itinerary) (Itinerary, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return Itinerary{}, err
	}
	defer func() { _ = tx.Rollback() }()

	// ensure ownership
	var exists int
	if err := tx.QueryRow(`SELECT 1 FROM itineraries WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Itinerary{}, ErrNotFound
		}
		return Itinerary{}, err
	}

	// update base fields
	_, err = tx.Exec(`
		UPDATE itineraries
		   SET title=$1, description=$2, city=$3, budget=$4, style=$5, start_date=$6, end_date=$7, cover_url=$8
		 WHERE id=$9 AND user_id=$10
	`, in.Title, in.Description, in.City, in.Budget, in.Style, in.StartDate, in.EndDate, in.CoverURL, id, userId)
	if err != nil {
		return Itinerary{}, err
	}

	// replace days
	if _, err := tx.Exec(`DELETE FROM itinerary_days WHERE itinerary_id=$1`, id); err != nil {
		return Itinerary{}, err
	}
	for _, d := range in.Days {
		if _, err := tx.Exec(`
			INSERT INTO itinerary_days (itinerary_id, day_number, place, start_time, end_time, activities)
			VALUES ($1,$2,$3,$4,$5,$6)
		`, id, d.DayNumber, d.Place, d.StartTime, d.EndTime, d.Activities); err != nil {
			return Itinerary{}, err
		}
	}

	if err := tx.Commit(); err != nil {
		return Itinerary{}, err
	}
	// return fresh
	return GetItineraryByIDForUser(userId, id)
}

/* -------- Partial update (PATCH) -------- */

type PartialItinerary struct {
	Title       *string
	Description *string
	City        *string
	Budget      *string
	Style       *string
	StartDate   *time.Time
	EndDate     *time.Time
	CoverURL    *string
	// if Days == nil -> keep existing; if non-nil -> replace with that slice (even if empty)
	Days *([]ItineraryDay)
}

func UpdateItineraryPartial(userId, id int, p PartialItinerary) (Itinerary, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return Itinerary{}, err
	}
	defer func() { _ = tx.Rollback() }()

	// ensure ownership
	var exists int
	if err := tx.QueryRow(`SELECT 1 FROM itineraries WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Itinerary{}, ErrNotFound
		}
		return Itinerary{}, err
	}

	// build dynamic UPDATE
	q := `UPDATE itineraries SET `
	args := []any{}
	idx := 1
	add := func(set string, v any) {
		if len(args) > 0 {
			q += ", "
		}
		q += set
		args = append(args, v)
		idx++
	}

	if p.Title != nil {
		add("title=$"+strconvI(idx), *p.Title)
	}
	if p.Description != nil {
		add("description=$"+strconvI(idx), *p.Description)
	}
	if p.City != nil {
		add("city=$"+strconvI(idx), *p.City)
	}
	if p.Budget != nil {
		add("budget=$"+strconvI(idx), *p.Budget)
	}
	if p.Style != nil {
		add("style=$"+strconvI(idx), *p.Style)
	}
	if p.StartDate != nil {
		add("start_date=$"+strconvI(idx), *p.StartDate)
	}
	if p.EndDate != nil {
		add("end_date=$"+strconvI(idx), *p.EndDate)
	}
	if p.CoverURL != nil {
		add("cover_url=$"+strconvI(idx), *p.CoverURL)
	}

	if len(args) > 0 {
		q += " WHERE id=$" + strconvI(idx) + " AND user_id=$" + strconvI(idx+1)
		args = append(args, id, userId)
		if _, err := tx.Exec(q, args...); err != nil {
			return Itinerary{}, err
		}
	}

	// replace days if requested
	if p.Days != nil {
		if _, err := tx.Exec(`DELETE FROM itinerary_days WHERE itinerary_id=$1`, id); err != nil {
			return Itinerary{}, err
		}
		for _, d := range *p.Days {
			if _, err := tx.Exec(`
				INSERT INTO itinerary_days (itinerary_id, day_number, place, start_time, end_time, activities)
				VALUES ($1,$2,$3,$4,$5,$6)
			`, id, d.DayNumber, d.Place, d.StartTime, d.EndTime, d.Activities); err != nil {
				return Itinerary{}, err
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return Itinerary{}, err
	}
	return GetItineraryByIDForUser(userId, id)
}

/* -------- DELETE -------- */

func DeleteItineraryForUser(userId, id int) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	// ensure ownership
	var exists int
	if err := tx.QueryRow(`SELECT 1 FROM itineraries WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}

	// delete children first (in case FK doesn't cascade)
	if _, err := tx.Exec(`DELETE FROM itinerary_days WHERE itinerary_id=$1`, id); err != nil {
		return err
	}
	res, err := tx.Exec(`DELETE FROM itineraries WHERE id=$1 AND user_id=$2`, id, userId)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}

	return tx.Commit()
}

/* ---- tiny helper ---- */

func strconvI(i int) string { // avoid fmt import
	const digits = "0123456789"
	if i == 0 {
		return "0"
	}
	buf := [20]byte{}
	pos := len(buf)
	for i > 0 {
		pos--
		buf[pos] = digits[i%10]
		i /= 10
	}
	return string(buf[pos:])
}
