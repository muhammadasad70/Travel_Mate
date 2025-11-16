// // // // models/cultural_public_get.go
// // // package models

// // // import (
// // // 	"database/sql"

// // // 	"travel_mate/backend/database"

// // // 	"github.com/lib/pq"
// // // )

// // // 	func GetCulturalServiceByID(id int) (CulturalService, error) {
// // // 		const q = `
// // // 		SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// // // 		       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// // // 			   group_size_max, languages,
// // // 			   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// // // 			   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// // // 			   created_at
// // // 		FROM cultural_services WHERE id=$1`
// // // 		var m CulturalService
// // // 		var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
// // // 		err := database.DB.QueryRow(q, id).Scan(
// // // 			&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// // // 			&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// // // 			&m.GroupSizeMax, &langs,
// // // 			&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// // // 			&includes, &excludes, pq.Array(&m.MaterialRequirements),
// // // 			&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// // // 			&m.CreatedAt,
// // // 		)
// // // 		if err != nil {
// // // 			if err == sql.ErrNoRows {
// // // 				return CulturalService{}, ErrNotFound
// // // 			}
// // // 			return CulturalService{}, err
// // // 		}
// // // 		m.Tags = []string(tags)
// // // 		m.FixedDates = []string(fixed)
// // // 		m.DaysOfWeek = []string(dow)
// // // 		m.Languages = []string(langs)
// // // 		m.Includes = []string(includes)
// // // 		m.Excludes = []string(excludes)
// // // 		if traveler != nil {
// // // 			tmp := []string(traveler)
// // // 			m.TravelerCanOffer = &tmp
// // // 		}
// // // 		return m, nil
// // // 	}

// // // package models

// // // import (
// // // 	"database/sql"

// // // 	"travel_mate/backend/database"

// // // 	"github.com/lib/pq"
// // // )

// // // // Returns a single service INCLUDING vendor_name (derived from users table).
// // // func GetCulturalServiceByID(id int) (CulturalService, error) {
// // // 	const q = `
// // // 	SELECT
// // // 	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
// // // 	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
// // // 	  s.group_size_max, s.languages,
// // // 	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
// // // 	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
// // // 	  s.created_at,
// // // 	  COALESCE(
// // // 	    NULLIF(TRIM(u.name), ''),
// // // 	    NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''),
// // // 	    split_part(u.email,'@',1)
// // // 	  ) AS vendor_name
// // // 	FROM cultural_services s
// // // 	JOIN users u ON u.id = s.user_id
// // // 	WHERE s.id = $1`

// // // 	var m CulturalService
// // // 	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray

// // // 	err := database.DB.QueryRow(q, id).Scan(
// // // 		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// // // 		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// // // 		&m.GroupSizeMax, &langs,
// // // 		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// // // 		&includes, &excludes, pq.Array(&m.MaterialRequirements),
// // // 		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// // // 		&m.CreatedAt,
// // // 		&m.VendorName, // ← new scan target
// // // 	)
// // // 	if err != nil {
// // // 		if err == sql.ErrNoRows {
// // // 			return CulturalService{}, ErrNotFound
// // // 		}
// // // 		return CulturalService{}, err
// // // 	}

// // // 	m.Tags = []string(tags)
// // // 	m.FixedDates = []string(fixed)
// // // 	m.DaysOfWeek = []string(dow)
// // // 	m.Languages = []string(langs)
// // // 	m.Includes = []string(includes)
// // // 	m.Excludes = []string(excludes)
// // // 	if traveler != nil {
// // // 		tmp := []string(traveler)
// // // 		m.TravelerCanOffer = &tmp
// // // 	}

// // // 	return m, nil
// // // }

// // // models/cultural_public_get.go
// // package models

// // import (
// // 	"database/sql"

// // 	"travel_mate/backend/database"

// // 	"github.com/lib/pq"
// // )

// // // Returns a single service INCLUDING vendor_name (derived from users table).
// // func GetCulturalServiceByID(id int) (CulturalService, error) {
// // 	const q = `
// // 	SELECT
// // 	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
// // 	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
// // 	  s.group_size_max, s.languages,
// // 	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
// // 	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
// // 	  s.created_at,
// // 	  COALESCE(
// // 	    NULLIF(TRIM(u.name), ''),
// // 	    NULLIF(TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')), ''),
// // 	    split_part(u.email,'@',1)
// // 	  ) AS vendor_name
// // 	FROM cultural_services s
// // 	JOIN users u ON u.id = s.user_id
// // 	WHERE s.id = $1`

// // 	var m CulturalService
// // 	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray

// // 	err := database.DB.QueryRow(q, id).Scan(
// // 		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// // 		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// // 		&m.GroupSizeMax, &langs,
// // 		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// // 		&includes, &excludes, pq.Array(&m.MaterialRequirements),
// // 		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// // 		&m.CreatedAt,
// // 		&m.VendorName,
// // 	)
// // 	if err != nil {
// // 		if err == sql.ErrNoRows {
// // 			return CulturalService{}, ErrNotFound
// // 		}
// // 		return CulturalService{}, err
// // 	}

// // 	m.Tags = []string(tags)
// // 	m.FixedDates = []string(fixed)
// // 	m.DaysOfWeek = []string(dow)
// // 	m.Languages = []string(langs)
// // 	m.Includes = []string(includes)
// // 	m.Excludes = []string(excludes)
// // 	if traveler != nil {
// // 		tmp := []string(traveler)
// // 		m.TravelerCanOffer = &tmp
// // 	}

// // 	return m, nil
// // }

// // models/cultural_public_get.go
// package models

// import (
// 	"database/sql"
// 	"time"

// 	"travel_mate/backend/database"

// 	"github.com/lib/pq"
// )

// // VendorPreview contains safe public info about the host
// type VendorPreview struct {
// 	ID               int       `json:"id"`
// 	FirstName        string    `json:"first_name"`
// 	LastName         string    `json:"last_name"`
// 	Name             string    `json:"name"` // for social users
// 	AvatarURL        *string   `json:"avatar_url"`
// 	IsVerified       bool      `json:"is_verified"`       // is_profile_complete
// 	MemberSince      time.Time `json:"member_since"`      // created_at
// 	City             string    `json:"city"`              // from service
// 	TotalExperiences int       `json:"total_experiences"` // count of services
// }

// // CulturalServiceWithVendor extends CulturalService with vendor preview
// type CulturalServiceWithVendor struct {
// 	CulturalService
// 	Vendor VendorPreview `json:"vendor"`
// }

// // GetCulturalServiceByID returns a single service INCLUDING vendor preview
// func GetCulturalServiceByID(id int) (CulturalServiceWithVendor, error) {
// 	const q = `
// 	SELECT
// 	  -- service fields
// 	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
// 	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
// 	  s.group_size_max, s.languages,
// 	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
// 	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
// 	  s.created_at,
// 	  -- vendor preview fields
// 	  u.id AS vendor_id,
// 	  u.first_name,
// 	  u.last_name,
// 	  u.name AS vendor_name,
// 	  u.avatar_url,
// 	  COALESCE(u.is_profile_complete, false) AS is_verified,
// 	  u.created_at AS member_since,
// 	  (SELECT COUNT(*) FROM cultural_services WHERE user_id = u.id) AS total_experiences
// 	FROM cultural_services s
// 	JOIN users u ON u.id = s.user_id
// 	WHERE s.id = $1`

// 	var result CulturalServiceWithVendor
// 	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
// 	var vendor VendorPreview
// 	var firstName, lastName, vendorName sql.NullString
// 	var avatarURL sql.NullString

// 	err := database.DB.QueryRow(q, id).Scan(
// 		// service fields
// 		&result.Id, &result.UserId, &result.Title, &result.ExperienceType, &result.Category, &tags, &result.Description, &result.City, &result.MeetingPointLabel,
// 		&result.ScheduleType, &fixed, &dow, &result.StartTime, &result.DurationHours, &result.LeadTimeDays,
// 		&result.GroupSizeMax, &langs,
// 		&result.PricingModel, &result.PricePerPerson, &result.PricePerGroup, &result.GroupIncludedSize, &result.HostOffers, &traveler, &result.ExchangeValueHint,
// 		&includes, &excludes, pq.Array(&result.MaterialRequirements),
// 		&result.AccessibilityNotes, &result.AgeRestriction, &result.CancellationPolicy,
// 		&result.CreatedAt,
// 		// vendor fields
// 		&vendor.ID,
// 		&firstName,
// 		&lastName,
// 		&vendorName,
// 		&avatarURL,
// 		&vendor.IsVerified,
// 		&vendor.MemberSince,
// 		&vendor.TotalExperiences,
// 	)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			return CulturalServiceWithVendor{}, ErrNotFound
// 		}
// 		return CulturalServiceWithVendor{}, err
// 	}

// 	// Map arrays
// 	result.Tags = []string(tags)
// 	result.FixedDates = []string(fixed)
// 	result.DaysOfWeek = []string(dow)
// 	result.Languages = []string(langs)
// 	result.Includes = []string(includes)
// 	result.Excludes = []string(excludes)
// 	if traveler != nil {
// 		tmp := []string(traveler)
// 		result.TravelerCanOffer = &tmp
// 	}

// 	// Build vendor preview
// 	vendor.FirstName = firstName.String
// 	vendor.LastName = lastName.String
// 	vendor.Name = vendorName.String
// 	vendor.City = result.City // Use service city as base location
// 	if avatarURL.Valid {
// 		vendor.AvatarURL = &avatarURL.String
// 	}

// 	result.Vendor = vendor
// 	return result, nil
// }

// models/cultural_public_get.go
package models

import (
	"database/sql"
	"time"

	"travel_mate/backend/database"

	"github.com/lib/pq"
)

// VendorPreview contains safe public info about the host
type VendorPreview struct {
	ID               int       `json:"id"`
	FirstName        string    `json:"first_name"`
	LastName         string    `json:"last_name"`
	Name             string    `json:"name"`
	AvatarURL        *string   `json:"avatar_url"`
	IsVerified       bool      `json:"is_verified"`
	MemberSince      time.Time `json:"member_since"`
	City             string    `json:"city"`
	TotalExperiences int       `json:"total_experiences"`
}

// Returns a single service INCLUDING vendor preview info
func GetCulturalServiceByID(id int) (map[string]interface{}, error) {
	const q = `
	SELECT
	  s.id, s.user_id, s.title, s.experience_type, s.category, s.tags, s.description, s.city, s.meeting_point_label,
	  s.schedule_type, s.fixed_dates, s.days_of_week, s.start_time, s.duration_hours, s.lead_time_days,
	  s.group_size_max, s.languages,
	  s.pricing_model, s.price_per_person, s.price_per_group, s.group_included_size, s.host_offers, s.traveler_can_offer, s.exchange_value_hint,
	  s.includes, s.excludes, s.material_requirements, s.accessibility_notes, s.age_restriction, s.cancellation_policy,
	  s.created_at,
	  u.id AS vendor_id,
	  u.first_name,
	  u.last_name,
	  u.name AS vendor_name,
	  u.avatar_url,
	  COALESCE(u.is_profile_complete, false) AS is_verified,
	  u.created_at AS member_since,
	  (SELECT COUNT(*) FROM cultural_services WHERE user_id = u.id) AS total_experiences
	FROM cultural_services s
	JOIN users u ON u.id = s.user_id
	WHERE s.id = $1`

	var (
		// Service fields
		serviceID          int
		userID             int
		title              string
		experienceType     string
		category           sql.NullString
		tags               pq.StringArray
		description        sql.NullString
		city               string
		meetingPointLabel  sql.NullString
		scheduleType       string
		fixedDates         pq.StringArray
		daysOfWeek         pq.StringArray
		startTime          sql.NullString
		durationHours      sql.NullFloat64
		leadTimeDays       sql.NullInt64
		groupSizeMax       int
		languages          pq.StringArray
		pricingModel       string
		pricePerPerson     sql.NullFloat64
		pricePerGroup      sql.NullFloat64
		groupIncludedSize  sql.NullInt64
		hostOffers         sql.NullString
		travelerCanOffer   pq.StringArray
		exchangeValueHint  sql.NullString
		includes           pq.StringArray
		excludes           pq.StringArray
		materialReqs       pq.StringArray
		accessibilityNotes sql.NullString
		ageRestriction     sql.NullString
		cancellationPolicy string
		createdAt          time.Time

		// Vendor fields
		vendorID         int
		firstName        sql.NullString
		lastName         sql.NullString
		vendorName       sql.NullString
		avatarURL        sql.NullString
		isVerified       bool
		memberSince      time.Time
		totalExperiences int
	)

	err := database.DB.QueryRow(q, id).Scan(
		&serviceID, &userID, &title, &experienceType, &category, &tags, &description, &city, &meetingPointLabel,
		&scheduleType, &fixedDates, &daysOfWeek, &startTime, &durationHours, &leadTimeDays,
		&groupSizeMax, &languages,
		&pricingModel, &pricePerPerson, &pricePerGroup, &groupIncludedSize, &hostOffers, &travelerCanOffer, &exchangeValueHint,
		&includes, &excludes, &materialReqs,
		&accessibilityNotes, &ageRestriction, &cancellationPolicy,
		&createdAt,
		&vendorID,
		&firstName,
		&lastName,
		&vendorName,
		&avatarURL,
		&isVerified,
		&memberSince,
		&totalExperiences,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}

	// Build vendor object
	vendor := map[string]interface{}{
		"id":                vendorID,
		"first_name":        nullStringToString(firstName),
		"last_name":         nullStringToString(lastName),
		"name":              nullStringToString(vendorName),
		"avatar_url":        nullStringToPtr(avatarURL),
		"is_verified":       isVerified,
		"member_since":      memberSince,
		"city":              city,
		"total_experiences": totalExperiences,
	}

	// Build service object
	service := map[string]interface{}{
		"id":                    serviceID,
		"user_id":               userID,
		"title":                 title,
		"experience_type":       experienceType,
		"category":              nullStringToString(category),
		"tags":                  arrayToSlice(tags),
		"description":           nullStringToString(description),
		"city":                  city,
		"meeting_point_label":   nullStringToString(meetingPointLabel),
		"schedule_type":         scheduleType,
		"fixed_dates":           arrayToSlice(fixedDates),
		"days_of_week":          arrayToSlice(daysOfWeek),
		"start_time":            nullStringToString(startTime),
		"duration_hours":        nullFloat64ToFloat(durationHours),
		"lead_time_days":        nullInt64ToInt(leadTimeDays),
		"group_size_max":        groupSizeMax,
		"languages":             arrayToSlice(languages),
		"pricing_model":         pricingModel,
		"price_per_person":      nullFloat64ToPtr(pricePerPerson),
		"price_per_group":       nullFloat64ToPtr(pricePerGroup),
		"group_included_size":   nullInt64ToPtr(groupIncludedSize),
		"host_offers":           nullStringToPtr(hostOffers),
		"traveler_can_offer":    arrayToSlicePtr(travelerCanOffer),
		"exchange_value_hint":   nullStringToPtr(exchangeValueHint),
		"includes":              arrayToSlice(includes),
		"excludes":              arrayToSlice(excludes),
		"material_requirements": arrayToSlice(materialReqs),
		"accessibility_notes":   nullStringToString(accessibilityNotes),
		"age_restriction":       nullStringToPtr(ageRestriction),
		"cancellation_policy":   cancellationPolicy,
		"created_at":            createdAt,
		"vendor":                vendor,
	}

	return service, nil
}

// Helper functions
func nullStringToString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func nullStringToPtr(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func nullFloat64ToFloat(nf sql.NullFloat64) float64 {
	if nf.Valid {
		return nf.Float64
	}
	return 0
}

func nullFloat64ToPtr(nf sql.NullFloat64) *float64 {
	if nf.Valid {
		return &nf.Float64
	}
	return nil
}

func nullInt64ToInt(ni sql.NullInt64) int {
	if ni.Valid {
		return int(ni.Int64)
	}
	return 0
}

func nullInt64ToPtr(ni sql.NullInt64) *int {
	if ni.Valid {
		i := int(ni.Int64)
		return &i
	}
	return nil
}

func arrayToSlice(arr pq.StringArray) []string {
	if arr == nil {
		return []string{}
	}
	return []string(arr)
}

func arrayToSlicePtr(arr pq.StringArray) *[]string {
	if arr == nil || len(arr) == 0 {
		return nil
	}
	slice := []string(arr)
	return &slice
}
