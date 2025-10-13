package routes

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	ical "github.com/arran4/golang-ical"
	"github.com/gin-gonic/gin"
)

type LiveEvent struct {
	Source     string     `json:"source"`
	ExternalID string     `json:"external_id,omitempty"`
	Title      string     `json:"title"`
	Category   *string    `json:"category,omitempty"`
	Start      *time.Time `json:"start,omitempty"`
	End        *time.Time `json:"end,omitempty"`
	TZ         *string    `json:"tz,omitempty"`
	VenueName  *string    `json:"venue_name,omitempty"`
	VenueAddr  *string    `json:"venue_address,omitempty"`
	City       *string    `json:"city,omitempty"`
	Lat        *float64   `json:"lat,omitempty"`
	Lng        *float64   `json:"lng,omitempty"`
	ImageURL   *string    `json:"image,omitempty"`
	Price      *string    `json:"price,omitempty"`
	URL        *string    `json:"url,omitempty"`
}

// TODO: put real ICS feeds from Meetup (or any ICS provider) here
// Example (replace with your groups' ICS URLs):
//
//	https://www.meetup.com/<group>/events/ical/
//	https://calendar.google.com/calendar/ical/<public_calendar_id>/public/basic.ics
var meetupICS = []string{
	// "https://calendar.google.com/calendar/ical/en.pk%23holiday%40group.v.calendar.google.com/public/basic.ics",
	// "https://calendar.google.com/calendar/ical/en.pk%23holiday%40group.v.calendar.google.com/public/basic.ics",
	// "https://www.meetup.com/islamabad-Atlassian-Community-Events/events/ical/",
	"http://localhost:8000/2494e25f-c438-477f-a36c-bb530a82328b.ics", // your real meetup events
	"https://calendar.google.com/calendar/ical/en.pk%23holiday%40group.v.calendar.google.com/public/basic.ics",
}

// ---- helpers ----

// parseICSTime parses common iCal date-time formats.
func parseICSTime(v string) (time.Time, error) {
	v = strings.TrimSpace(v)
	// Most feeds put TZID in a *parameter*; the value itself after ":" is the datetime.
	if i := strings.Index(v, ":"); i >= 0 {
		v = v[i+1:]
	}
	layouts := []string{
		time.RFC3339,       // 2006-01-02T15:04:05Z
		"20060102T150405Z", // 20060102T150405Z
		"20060102T150405",  // 20060102T150405
		"20060102",         // all-day
	}
	var lastErr error
	for _, l := range layouts {
		if t, err := time.Parse(l, v); err == nil {
			return t, nil
		} else {
			lastErr = err
		}
	}
	return time.Time{}, lastErr
}

// best-effort TZID scraper from a DTSTART/DTEND property string
func extractTZID(v string) *string {
	// formats like: "TZID=Asia/Karachi:20251031T190000"
	if i := strings.Index(v, "TZID="); i >= 0 {
		rest := v[i+5:]
		j := strings.IndexAny(rest, ":;")
		if j < 0 {
			rest = strings.TrimSpace(rest)
			if rest != "" {
				return &rest
			}
		} else {
			val := strings.TrimSpace(rest[:j])
			if val != "" {
				return &val
			}
		}
	}
	return nil
}

func splitLocation(val string) (venue *string, addr *string, city *string) {
	val = strings.TrimSpace(val)
	if val == "" {
		return nil, nil, nil
	}
	parts := strings.Split(val, ",")
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	if len(parts) > 0 && parts[0] != "" {
		v := parts[0]
		venue = &v
	}
	if len(parts) > 1 {
		// crude guess: second token might be city
		if parts[1] != "" {
			c := parts[1]
			city = &c
		}
	}
	full := strings.Join(parts, ", ")
	if strings.TrimSpace(full) != "" {
		addr = &full
	}
	return
}

// ---- route registration ----

func RegisterLiveEventRoutes(r *gin.Engine) {
	r.GET("/events/live", getLiveEvents)
}

// ---- handler ----

func getLiveEvents(c *gin.Context) {
	// optional client filters
	wantCity := strings.TrimSpace(c.Query("city"))
	// allow ?from=YYYY-MM-DD & ?to=YYYY-MM-DD if you want
	const dfmt = "2006-01-02"
	now := time.Now().Add(-2 * time.Hour) // small tolerance

	type acc struct {
		Items []LiveEvent `json:"items"`
	}
	out := acc{Items: []LiveEvent{}}

	httpClient := &http.Client{Timeout: 15 * time.Second}

	for _, feed := range meetupICS {
		if feed == "" {
			continue
		}
		if _, err := url.Parse(feed); err != nil {
			continue
		}

		resp, err := httpClient.Get(feed)
		if err != nil {
			continue
		}
		b, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		cal, err := ical.ParseCalendar(strings.NewReader(string(b)))
		if err != nil {
			continue
		}

		for _, ev := range cal.Events() {
			// Title
			summary := ev.GetProperty(ical.ComponentPropertySummary)
			if summary == nil {
				continue
			}
			title := strings.TrimSpace(summary.Value)
			if title == "" {
				continue
			}

			// Start (required)
			sProp := ev.GetProperty(ical.ComponentPropertyDtStart)
			if sProp == nil || strings.TrimSpace(sProp.Value) == "" {
				continue
			}
			start, err := parseICSTime(sProp.Value)
			if err != nil || start.Before(now) {
				continue
			}

			// End (optional)
			var end *time.Time
			if eProp := ev.GetProperty(ical.ComponentPropertyDtEnd); eProp != nil && strings.TrimSpace(eProp.Value) != "" {
				if t, err := parseICSTime(eProp.Value); err == nil {
					end = &t
				}
			}

			// TZ (best-effort)
			tz := extractTZID(sProp.Value)

			// Location
			var venueName, venueAddr, city *string
			if loc := ev.GetProperty(ical.ComponentPropertyLocation); loc != nil {
				venueName, venueAddr, city = splitLocation(loc.Value)
			}

			// Filter by ?city=
			if wantCity != "" && city != nil {
				if !strings.EqualFold(*city, wantCity) {
					continue
				}
			}

			// Link
			var link *string
			if uProp := ev.GetProperty(ical.ComponentPropertyUrl); uProp != nil && strings.TrimSpace(uProp.Value) != "" {
				u := strings.TrimSpace(uProp.Value)
				link = &u
			}

			// UID
			var uid string
			if up := ev.GetProperty(ical.ComponentPropertyUniqueId); up != nil {
				uid = strings.TrimSpace(up.Value)
			}

			// Pack
			e := LiveEvent{
				Source:     "meetup_ics",
				ExternalID: uid,
				Title:      title,
				Start:      &start,
				End:        end,
				TZ:         tz,
				VenueName:  venueName,
				VenueAddr:  venueAddr,
				City:       city,
				URL:        link,
				// Image/price/lat/lng typically aren’t in ICS → leave nil
			}
			out.Items = append(out.Items, e)
		}
	}

	// Optional: allow basic date window filtering via ?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
	if df := c.Query("date_from"); df != "" {
		if ft, err := time.Parse(dfmt, df); err == nil {
			filtered := out.Items[:0]
			for _, e := range out.Items {
				if e.Start != nil && !e.Start.Before(ft) {
					filtered = append(filtered, e)
				}
			}
			out.Items = filtered
		}
	}
	if dt := c.Query("date_to"); dt != "" {
		if tt, err := time.Parse(dfmt, dt); err == nil {
			filtered := out.Items[:0]
			for _, e := range out.Items {
				if e.Start != nil && !e.Start.After(tt.Add(24*time.Hour)) {
					filtered = append(filtered, e)
				}
			}
			out.Items = filtered
		}
	}

	// stable JSON envelope like your other endpoints
	c.Header("Content-Type", "application/json")
	_ = json.NewEncoder(c.Writer).Encode(gin.H{
		"items":    out.Items,
		"has_more": false,
	})
}
