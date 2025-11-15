// // models/cultural_public_get.go
// package models

// import (
// 	"database/sql"

// 	"travel_mate/backend/database"

// 	"github.com/lib/pq"
// )

// 	func GetCulturalServiceByID(id int) (CulturalService, error) {
// 		const q = `
// 		SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// 		       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// 			   group_size_max, languages,
// 			   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// 			   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// 			   created_at
// 		FROM cultural_services WHERE id=$1`
// 		var m CulturalService
// 		var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
// 		err := database.DB.QueryRow(q, id).Scan(
// 			&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// 			&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// 			&m.GroupSizeMax, &langs,
// 			&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// 			&includes, &excludes, pq.Array(&m.MaterialRequirements),
// 			&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// 			&m.CreatedAt,
// 		)
// 		if err != nil {
// 			if err == sql.ErrNoRows {
// 				return CulturalService{}, ErrNotFound
// 			}
// 			return CulturalService{}, err
// 		}
// 		m.Tags = []string(tags)
// 		m.FixedDates = []string(fixed)
// 		m.DaysOfWeek = []string(dow)
// 		m.Languages = []string(langs)
// 		m.Includes = []string(includes)
// 		m.Excludes = []string(excludes)
// 		if traveler != nil {
// 			tmp := []string(traveler)
// 			m.TravelerCanOffer = &tmp
// 		}
// 		return m, nil
// 	}

// package models

// import (
// 	"database/sql"

// 	"travel_mate/backend/database"

// 	"github.com/lib/pq"
// )

// // Returns a single service INCLUDING vendor_name (derived from users table).
// func GetCulturalServiceByID(id int) (CulturalService, error) {
// 	const q = `
// 	SELECT
// 	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
// 	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
// 	  s.group_size_max, s.languages,
// 	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
// 	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
// 	  s.created_at,
// 	  COALESCE(
// 	    NULLIF(TRIM(u.name), ''),
// 	    NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''),
// 	    split_part(u.email,'@',1)
// 	  ) AS vendor_name
// 	FROM cultural_services s
// 	JOIN users u ON u.id = s.user_id
// 	WHERE s.id = $1`

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
// 		&m.VendorName, // ← new scan target
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

// models/cultural_public_get.go
package models

import (
	"database/sql"

	"travel_mate/backend/database"

	"github.com/lib/pq"
)

// Returns a single service INCLUDING vendor_name (derived from users table).
func GetCulturalServiceByID(id int) (CulturalService, error) {
	const q = `
	SELECT
	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
	  s.group_size_max, s.languages,
	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
	  s.created_at,
	  COALESCE(
	    NULLIF(TRIM(u.name), ''),
	    NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''),
	    split_part(u.email,'@',1)
	  ) AS vendor_name
	FROM cultural_services s
	JOIN users u ON u.id = s.user_id
	WHERE s.id = $1`

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
		&m.VendorName,
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
