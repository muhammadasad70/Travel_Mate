// // models/cultural_public_get.go
// package models

// import (
// 	"database/sql"

// 	"travel_mate/backend/database"

// 	"github.com/lib/pq"
// )

// func GetCulturalServiceByID(id int) (CulturalService, error) {
// 	const q = `
// 	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// 	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// 		   group_size_max, languages,
// 		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// 		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// 		   created_at
// 	FROM cultural_services WHERE id=$1`
// 	var m CulturalService
// 	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
// 	err := database.DB.QueryRow(q, id).Scan(
// 		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// 		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// 		&m.GroupSizeMax, &langs,
// 		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// 		&includes, &excludes, pq.Array(&m.MaterialRequirements),
// 		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// 		&m.CreatedAt,
// 	)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			return CulturalService{}, ErrNotFound
// 		}
// 		return CulturalService{}, err
// 	}
// 	m.Tags = []string(tags)
// 	m.FixedDates = []string(fixed)
// 	m.DaysOfWeek = []string(dow)
// 	m.Languages = []string(langs)
// 	m.Includes = []string(includes)
// 	m.Excludes = []string(excludes)
// 	if traveler != nil {
// 		tmp := []string(traveler)
// 		m.TravelerCanOffer = &tmp
// 	}
// 	return m, nil
// }

package models

import (
	"database/sql"

	"travel_mate/backend/database"

	"github.com/lib/pq"
)

func GetCulturalServiceByID(id int) (CulturalService, error) {
	const q = `
    SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
           schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
           group_size_max, languages,
           pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
           includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
           created_at
    FROM cultural_services WHERE id=$1`
	var m CulturalService
	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
	err := database.DB.QueryRow(q, id).Scan(
		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
		&m.GroupSizeMax, &langs,
		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
		&includes, &excludes, pq.Array(&m.MaterialRequirements),
		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
		&m.CreatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return CulturalService{}, ErrNotFound
		}
		return CulturalService{}, err
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
	return m, nil
}
