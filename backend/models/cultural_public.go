// models/cultural_public.go
package models

import (
	"fmt"
	"strings"

	"travel_mate/backend/database"

	"github.com/lib/pq"
)

func ListAllCulturalServices(q, city, typ string, minPrice, maxPrice float64, date string) ([]CulturalService, error) {
	sb := strings.Builder{}
	args := []any{}
	i := 1

	sb.WriteString(`
		SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
		       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
			   group_size_max, languages,
			   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
			   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
			   created_at
		FROM cultural_services WHERE 1=1`)

	add := func(cond string, v any) {
		sb.WriteString(" AND ")
		sb.WriteString(cond)
		args = append(args, v)
		i++
	}

	if q != "" {
		add("(title ILIKE '%'||$"+fmt.Sprint(i)+"||'%' OR description ILIKE '%'||$"+fmt.Sprint(i)+"||'%')", q)
	}
	if city != "" {
		add("city ILIKE $"+fmt.Sprint(i), city)
	}
	if typ != "" {
		add("experience_type=$"+fmt.Sprint(i), typ)
	}
	// price filters are simple: check both models with coalesce to a comparable number
	if minPrice > 0 {
		add("(COALESCE(price_per_person, price_per_group, 0) >= $"+fmt.Sprint(i)+")", minPrice)
	}
	if maxPrice > 0 {
		add("(COALESCE(price_per_person, price_per_group, 1e15) <= $"+fmt.Sprint(i)+")", maxPrice)
	}
	if date != "" {
		// for fixed_dates, date must be present; for weekly/on_request we don't filter here
		add(" (schedule_type <> 'fixed_dates' OR $"+fmt.Sprint(i)+" = ANY(fixed_dates)) ", date)
	}

	sb.WriteString(" ORDER BY created_at DESC LIMIT 200")

	rows, err := database.DB.Query(sb.String(), args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []CulturalService{}
	for rows.Next() {
		var m CulturalService
		var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
		if err := rows.Scan(
			&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
			&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
			&m.GroupSizeMax, &langs,
			&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
			&includes, &excludes, pq.Array(&m.MaterialRequirements),
			&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
			&m.CreatedAt,
		); err != nil {
			return nil, err
		}
		m.Tags = []string(tags)
		m.FixedDates = []string(fixed)
		m.DaysOfWeek = []string(dow)
		m.Languages = []string(langs)
		m.Includes = []string(includes)
		m.Excludes = []string(excludes)
		if traveler != nil {
			tmp := []string(traveler)
			m.TravelerCanOffer = &tmp
		}
		out = append(out, m)
	}
	return out, nil
}
