package models

import (
	"fmt"
	"strings"
	"time"

	"travel_mate/backend/database"
)

type Event struct {
	Id         int        `json:"id"`
	Source     string     `json:"source"`
	ExternalID *string    `json:"external_id,omitempty"`
	Title      string     `json:"title"`
	Category   *string    `json:"category,omitempty"`
	StartTime  *time.Time `json:"start,omitempty"`
	EndTime    *time.Time `json:"end,omitempty"`
	TZ         *string    `json:"tz,omitempty"`
	VenueName  *string    `json:"venue_name,omitempty"`
	VenueAddr  *string    `json:"venue_address,omitempty"`
	City       *string    `json:"city,omitempty"`
	Lat        *float64   `json:"lat,omitempty"`
	Lng        *float64   `json:"lng,omitempty"`
	ImageURL   *string    `json:"image,omitempty"`
	Price      *string    `json:"price,omitempty"`
	URL        *string    `json:"url,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

type EventsQuery struct {
	Q        string
	City     string
	Category string
	DateFrom *time.Time
	DateTo   *time.Time
	Limit    int
	Offset   int
}

func GetEvents(q EventsQuery) ([]Event, error) {
	where := []string{}
	args := []any{}
	i := 1
	add := func(expr string, v any) {
		where = append(where, expr)
		args = append(args, v)
		i++
	}

	if q.Q != "" {
		like := "%" + strings.ToLower(q.Q) + "%"
		add("(LOWER(title) LIKE $"+itoa(i)+" OR LOWER(category) LIKE $"+itoa(i)+" OR LOWER(city) LIKE $"+itoa(i)+")", like)
	}
	if q.City != "" {
		add("city = $"+itoa(i), q.City)
	}
	if q.Category != "" {
		add("category = $"+itoa(i), q.Category)
	}
	if q.DateFrom != nil {
		add("start_time >= $"+itoa(i), *q.DateFrom)
	}
	if q.DateTo != nil {
		add("start_time <= $"+itoa(i), *q.DateTo)
	}

	sqlQ := `
		SELECT id, source, external_id, title, category, start_time, end_time, tz,
		       venue_name, venue_address, city, lat, lng, image_url, price, url, created_at
		  FROM events
	`
	if len(where) > 0 {
		sqlQ += " WHERE " + strings.Join(where, " AND ")
	}
	sqlQ += " ORDER BY start_time DESC NULLS LAST, id DESC"
	if q.Limit <= 0 || q.Limit > 200 {
		q.Limit = 50
	}
	sqlQ += fmt.Sprintf(" LIMIT %d OFFSET %d", q.Limit, q.Offset)

	rows, err := database.DB.Query(sqlQ, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []Event{}
	for rows.Next() {
		var e Event
		if err := rows.Scan(
			&e.Id, &e.Source, &e.ExternalID, &e.Title, &e.Category, &e.StartTime, &e.EndTime, &e.TZ,
			&e.VenueName, &e.VenueAddr, &e.City, &e.Lat, &e.Lng, &e.ImageURL, &e.Price, &e.URL, &e.CreatedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, e)
	}
	return out, nil
}

func UpsertEvents(batch []Event) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	stmt := `
		INSERT INTO events (source, external_id, title, category, start_time, end_time, tz, venue_name, venue_address,
		                    city, lat, lng, image_url, price, url)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
		ON CONFLICT (source, external_id) DO UPDATE
		    SET title=EXCLUDED.title,
		        category=EXCLUDED.category,
		        start_time=EXCLUDED.start_time,
		        end_time=EXCLUDED.end_time,
		        tz=EXCLUDED.tz,
		        venue_name=EXCLUDED.venue_name,
		        venue_address=EXCLUDED.venue_address,
		        city=EXCLUDED.city,
		        lat=EXCLUDED.lat,
		        lng=EXCLUDED.lng,
		        image_url=EXCLUDED.image_url,
		        price=EXCLUDED.price,
		        url=EXCLUDED.url
	`
	for _, e := range batch {
		var ext any
		if e.ExternalID != nil && *e.ExternalID != "" {
			ext = *e.ExternalID
		} else {
			ext = nil
		}
		if _, err := tx.Exec(stmt,
			e.Source, ext, e.Title, e.Category, e.StartTime, e.EndTime, e.TZ, e.VenueName, e.VenueAddr,
			e.City, e.Lat, e.Lng, e.ImageURL, e.Price, e.URL,
		); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func itoa(i int) string {
	const d = "0123456789"
	if i == 0 {
		return "0"
	}
	var b [20]byte
	p := len(b)
	for i > 0 {
		p--
		b[p] = d[i%10]
		i /= 10
	}
	return string(b[p:])
}
