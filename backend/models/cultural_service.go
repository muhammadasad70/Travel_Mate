// // package models

// // import (
// // 	"database/sql"
// // 	"errors"
// // 	"time"

// // 	"travel_mate/backend/database"

// // 	"github.com/lib/pq"
// // )

// // type CulturalService struct {
// // 	Id                int      `json:"id"`
// // 	UserId            int      `json:"user_id"`
// // 	Title             string   `json:"title"`
// // 	ExperienceType    string   `json:"experience_type"`
// // 	Category          string   `json:"category"`
// // 	Tags              []string `json:"tags"`
// // 	Description       string   `json:"description"`
// // 	City              string   `json:"city"`
// // 	MeetingPointLabel string   `json:"meeting_point_label"`

// // 	// schedule (one of three)
// // 	ScheduleType  string   `json:"schedule_type"`
// // 	FixedDates    []string `json:"fixed_dates"` // YYYY-MM-DD strings
// // 	DaysOfWeek    []string `json:"days_of_week"`
// // 	StartTime     string   `json:"start_time"`     // HH:MM (for weekly)
// // 	DurationHours float64  `json:"duration_hours"` // weekly | on_request
// // 	LeadTimeDays  int      `json:"lead_time_days"` // on_request

// // 	// capacity & langs
// // 	GroupSizeMax int      `json:"group_size_max"`
// // 	Languages    []string `json:"languages"`

// // 	// pricing
// // 	PricingModel      string    `json:"pricing_model"`
// // 	PricePerPerson    *float64  `json:"price_per_person,omitempty"`
// // 	PricePerGroup     *float64  `json:"price_per_group,omitempty"`
// // 	GroupIncludedSize *int      `json:"group_included_size,omitempty"`
// // 	HostOffers        *string   `json:"host_offers,omitempty"`
// // 	TravelerCanOffer  *[]string `json:"traveler_can_offer,omitempty"`
// // 	ExchangeValueHint *string   `json:"exchange_value_hint,omitempty"`

// // 	// extras
// // 	Includes             []string `json:"includes"`
// // 	Excludes             []string `json:"excludes"`
// // 	MaterialRequirements []string `json:"material_requirements"`
// // 	AccessibilityNotes   string   `json:"accessibility_notes"`
// // 	AgeRestriction       *string  `json:"age_restriction"`
// // 	CancellationPolicy   string   `json:"cancellation_policy"`

// // 	CreatedAt time.Time `json:"created_at"`
// // }

// // type PartialCulturalService struct {
// // 	Title             *string
// // 	ExperienceType    *string
// // 	Category          *string
// // 	Tags              *[]string
// // 	Description       *string
// // 	City              *string
// // 	MeetingPointLabel *string

// // 	ScheduleType  *string
// // 	FixedDates    *[]string
// // 	DaysOfWeek    *[]string
// // 	StartTime     *string
// // 	DurationHours *float64
// // 	LeadTimeDays  *int

// // 	GroupSizeMax *int
// // 	Languages    *[]string

// // 	PricingModel      *string
// // 	PricePerPerson    *float64
// // 	PricePerGroup     *float64
// // 	GroupIncludedSize *int
// // 	HostOffers        *string
// // 	TravelerCanOffer  *[]string
// // 	ExchangeValueHint *string

// // 	Includes             *[]string
// // 	Excludes             *[]string
// // 	MaterialRequirements *[]string
// // 	AccessibilityNotes   *string
// // 	AgeRestriction       **string
// // 	CancellationPolicy   *string
// // }

// // /* ===== DB ===== */

// // func CreateCulturalService(m *CulturalService) error {
// // 	const q = `
// // 	INSERT INTO cultural_services
// // 	(user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// // 	 schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// // 	 group_size_max, languages,
// // 	 pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// // 	 includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy)
// // 	VALUES
// // 	($1,$2,$3,$4,$5,$6,$7,$8,
// // 	 $9,$10,$11,$12,$13,$14,
// // 	 $15,$16,
// // 	 $17,$18,$19,$20,$21,$22,$23,
// // 	 $24,$25,$26,$27,$28,$29)
// // 	RETURNING id, created_at`
// // 	return database.DB.QueryRow(q,
// // 		m.UserId, m.Title, m.ExperienceType, m.Category, pq.Array(m.Tags), m.Description, m.City, m.MeetingPointLabel,
// // 		m.ScheduleType, pq.Array(m.FixedDates), pq.Array(m.DaysOfWeek), m.StartTime, m.DurationHours, m.LeadTimeDays,
// // 		m.GroupSizeMax, pq.Array(m.Languages),
// // 		m.PricingModel, m.PricePerPerson, m.PricePerGroup, m.GroupIncludedSize, m.HostOffers, pq.ArrayPtr(m.TravelerCanOffer), m.ExchangeValueHint,
// // 		pq.Array(m.Includes), pq.Array(m.Excludes), pq.Array(m.MaterialRequirements), m.AccessibilityNotes, m.AgeRestriction, m.CancellationPolicy,
// // 	).Scan(&m.Id, &m.CreatedAt)
// // }

// // func GetCulturalServicesByUser(userId int) ([]CulturalService, error) {
// // 	const q = `
// // 	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// // 	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// // 		   group_size_max, languages,
// // 		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// // 		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// // 		   created_at
// // 	FROM cultural_services
// // 	WHERE user_id=$1
// // 	ORDER BY created_at DESC`
// // 	rows, err := database.DB.Query(q, userId)
// // 	if err != nil {
// // 		return nil, err
// // 	}
// // 	defer rows.Close()

// // 	out := []CulturalService{}
// // 	for rows.Next() {
// // 		var m CulturalService
// // 		var tags, fixed, dow, langs, includes, excludes, mats, traveler pq.StringArray
// // 		if err := rows.Scan(
// // 			&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// // 			&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// // 			&m.GroupSizeMax, &langs,
// // 			&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// // 			&includes, &excludes, &m.MaterialRequirements, &m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// // 			&m.CreatedAt,
// // 		); err != nil {
// // 			return nil, err
// // 		}
// // 		m.Tags = []string(tags)
// // 		m.FixedDates = []string(fixed)
// // 		m.DaysOfWeek = []string(dow)
// // 		m.Languages = []string(langs)
// // 		m.Includes = []string(includes)
// // 		m.Excludes = []string(excludes)
// // 		if traveler != nil {
// // 			tmp := []string(traveler)
// // 			m.TravelerCanOffer = &tmp
// // 		}
// // 		out = append(out, m)
// // 	}
// // 	return out, nil
// // }

// // func GetCulturalServiceByIDForUser(userId, id int) (CulturalService, error) {
// // 	const q = `
// // 	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// // 	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// // 		   group_size_max, languages,
// // 		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// // 		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// // 		   created_at
// // 	FROM cultural_services WHERE id=$1 AND user_id=$2`
// // 	var m CulturalService
// // 	var tags, fixed, dow, langs, includes, excludes, mats, traveler pq.StringArray
// // 	err := database.DB.QueryRow(q, id, userId).Scan(
// // 		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// // 		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// // 		&m.GroupSizeMax, &langs,
// // 		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// // 		&includes, &excludes, &m.MaterialRequirements, &m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// // 		&m.CreatedAt,
// // 	)
// // 	if err != nil {
// // 		if errors.Is(err, sql.ErrNoRows) {
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

// // func UpdateCulturalServiceFull(userId, id int, in CulturalService) (CulturalService, error) {
// // 	// ensure ownership
// // 	var exists int
// // 	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
// // 		if errors.Is(err, sql.ErrNoRows) {
// // 			return CulturalService{}, ErrNotFound
// // 		}
// // 		return CulturalService{}, err
// // 	}

// // 	const q = `
// // 	UPDATE cultural_services SET
// // 	  title=$1, experience_type=$2, category=$3, tags=$4, description=$5, city=$6, meeting_point_label=$7,
// // 	  schedule_type=$8, fixed_dates=$9, days_of_week=$10, start_time=$11, duration_hours=$12, lead_time_days=$13,
// // 	  group_size_max=$14, languages=$15,
// // 	  pricing_model=$16, price_per_person=$17, price_per_group=$18, group_included_size=$19, host_offers=$20, traveler_can_offer=$21, exchange_value_hint=$22,
// // 	  includes=$23, excludes=$24, material_requirements=$25, accessibility_notes=$26, age_restriction=$27, cancellation_policy=$28
// // 	WHERE id=$29 AND user_id=$30`
// // 	_, err := database.DB.Exec(q,
// // 		in.Title, in.ExperienceType, in.Category, pq.Array(in.Tags), in.Description, in.City, in.MeetingPointLabel,
// // 		in.ScheduleType, pq.Array(in.FixedDates), pq.Array(in.DaysOfWeek), in.StartTime, in.DurationHours, in.LeadTimeDays,
// // 		in.GroupSizeMax, pq.Array(in.Languages),
// // 		in.PricingModel, in.PricePerPerson, in.PricePerGroup, in.GroupIncludedSize, in.HostOffers, pq.ArrayPtr(in.TravelerCanOffer), in.ExchangeValueHint,
// // 		pq.Array(in.Includes), pq.Array(in.Excludes), pq.Array(in.MaterialRequirements), in.AccessibilityNotes, in.AgeRestriction, in.CancellationPolicy,
// // 		id, userId,
// // 	)
// // 	if err != nil {
// // 		return CulturalService{}, err
// // 	}
// // 	return GetCulturalServiceByIDForUser(userId, id)
// // }

// // func UpdateCulturalServicePartial(userId, id int, p PartialCulturalService) (CulturalService, error) {
// // 	// ensure ownership
// // 	var exists int
// // 	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
// // 		if errors.Is(err, sql.ErrNoRows) {
// // 			return CulturalService{}, ErrNotFound
// // 		}
// // 		return CulturalService{}, err
// // 	}

// // 	q := `UPDATE cultural_services SET `
// // 	args := []any{}
// // 	idx := 1
// // 	add := func(set string, v any) {
// // 		if len(args) > 0 {
// // 			q += ", "
// // 		}
// // 		q += set
// // 		args = append(args, v)
// // 		idx++
// // 	}

// // 	if p.Title != nil {
// // 		add("title=$"+itoa(idx), *p.Title)
// // 	}
// // 	if p.ExperienceType != nil {
// // 		add("experience_type=$"+itoa(idx), *p.ExperienceType)
// // 	}
// // 	if p.Category != nil {
// // 		add("category=$"+itoa(idx), *p.Category)
// // 	}
// // 	if p.Tags != nil {
// // 		add("tags=$"+itoa(idx), pq.Array(*p.Tags))
// // 	}
// // 	if p.Description != nil {
// // 		add("description=$"+itoa(idx), *p.Description)
// // 	}
// // 	if p.City != nil {
// // 		add("city=$"+itoa(idx), *p.City)
// // 	}
// // 	if p.MeetingPointLabel != nil {
// // 		add("meeting_point_label=$"+itoa(idx), *p.MeetingPointLabel)
// // 	}

// // 	if p.ScheduleType != nil {
// // 		add("schedule_type=$"+itoa(idx), *p.ScheduleType)
// // 	}
// // 	if p.FixedDates != nil {
// // 		add("fixed_dates=$"+itoa(idx), pq.Array(*p.FixedDates))
// // 	}
// // 	if p.DaysOfWeek != nil {
// // 		add("days_of_week=$"+itoa(idx), pq.Array(*p.DaysOfWeek))
// // 	}
// // 	if p.StartTime != nil {
// // 		add("start_time=$"+itoa(idx), *p.StartTime)
// // 	}
// // 	if p.DurationHours != nil {
// // 		add("duration_hours=$"+itoa(idx), *p.DurationHours)
// // 	}
// // 	if p.LeadTimeDays != nil {
// // 		add("lead_time_days=$"+itoa(idx), *p.LeadTimeDays)
// // 	}

// // 	if p.GroupSizeMax != nil {
// // 		add("group_size_max=$"+itoa(idx), *p.GroupSizeMax)
// // 	}
// // 	if p.Languages != nil {
// // 		add("languages=$"+itoa(idx), pq.Array(*p.Languages))
// // 	}

// // 	if p.PricingModel != nil {
// // 		add("pricing_model=$"+itoa(idx), *p.PricingModel)
// // 	}
// // 	if p.PricePerPerson != nil {
// // 		add("price_per_person=$"+itoa(idx), *p.PricePerPerson)
// // 	}
// // 	if p.PricePerGroup != nil {
// // 		add("price_per_group=$"+itoa(idx), *p.PricePerGroup)
// // 	}
// // 	if p.GroupIncludedSize != nil {
// // 		add("group_included_size=$"+itoa(idx), *p.GroupIncludedSize)
// // 	}
// // 	if p.HostOffers != nil {
// // 		add("host_offers=$"+itoa(idx), *p.HostOffers)
// // 	}
// // 	if p.TravelerCanOffer != nil {
// // 		add("traveler_can_offer=$"+itoa(idx), pq.Array(*p.TravelerCanOffer))
// // 	}
// // 	if p.ExchangeValueHint != nil {
// // 		add("exchange_value_hint=$"+itoa(idx), *p.ExchangeValueHint)
// // 	}

// // 	if p.Includes != nil {
// // 		add("includes=$"+itoa(idx), pq.Array(*p.Includes))
// // 	}
// // 	if p.Excludes != nil {
// // 		add("excludes=$"+itoa(idx), pq.Array(*p.Excludes))
// // 	}
// // 	if p.MaterialRequirements != nil {
// // 		add("material_requirements=$"+itoa(idx), pq.Array(*p.MaterialRequirements))
// // 	}
// // 	if p.AccessibilityNotes != nil {
// // 		add("accessibility_notes=$"+itoa(idx), *p.AccessibilityNotes)
// // 	}
// // 	if p.AgeRestriction != nil {
// // 		add("age_restriction=$"+itoa(idx), *p.AgeRestriction)
// // 	}
// // 	if p.CancellationPolicy != nil {
// // 		add("cancellation_policy=$"+itoa(idx), *p.CancellationPolicy)
// // 	}

// // 	if len(args) == 0 {
// // 		return GetCulturalServiceByIDForUser(userId, id)
// // 	}

// // 	q += " WHERE id=$" + itoa(idx) + " AND user_id=$" + itoa(idx+1)
// // 	args = append(args, id, userId)

// // 	if _, err := database.DB.Exec(q, args...); err != nil {
// // 		return CulturalService{}, err
// // 	}
// // 	return GetCulturalServiceByIDForUser(userId, id)
// // }

// // func DeleteCulturalServiceForUser(userId, id int) error {
// // 	res, err := database.DB.Exec(`DELETE FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId)
// // 	if err != nil {
// // 		return err
// // 	}
// // 	aff, _ := res.RowsAffected()
// // 	if aff == 0 {
// // 		return ErrNotFound
// // 	}
// // 	return nil
// // }

// // /* tiny */
// // func itoa(i int) string {
// // 	const d = "0123456789"
// // 	if i == 0 {
// // 		return "0"
// // 	}
// // 	var b [20]byte
// // 	p := len(b)
// // 	for i > 0 {
// // 		p--
// // 		b[p] = d[i%10]
// // 		i /= 10
// // 	}
// // 	return string(b[p:])
// // }

// package models

// import (
// 	"database/sql"
// 	"errors"
// 	"strconv"
// 	"time"

// 	"travel_mate/backend/database"

// 	"github.com/lib/pq"
// )

// type CulturalService struct {
// 	Id                int      `json:"id"`
// 	UserId            int      `json:"user_id"`
// 	Title             string   `json:"title"`
// 	ExperienceType    string   `json:"experience_type"`
// 	Category          string   `json:"category"`
// 	Tags              []string `json:"tags"`
// 	Description       string   `json:"description"`
// 	City              string   `json:"city"`
// 	MeetingPointLabel string   `json:"meeting_point_label"`

// 	// schedule (one of three)
// 	ScheduleType  string   `json:"schedule_type"`
// 	FixedDates    []string `json:"fixed_dates"` // YYYY-MM-DD strings
// 	DaysOfWeek    []string `json:"days_of_week"`
// 	StartTime     string   `json:"start_time"`     // HH:MM (for weekly)
// 	DurationHours float64  `json:"duration_hours"` // weekly | on_request
// 	LeadTimeDays  int      `json:"lead_time_days"` // on_request

// 	// capacity & langs
// 	GroupSizeMax int      `json:"group_size_max"`
// 	Languages    []string `json:"languages"`

// 	// pricing
// 	PricingModel      string    `json:"pricing_model"`
// 	PricePerPerson    *float64  `json:"price_per_person,omitempty"`
// 	PricePerGroup     *float64  `json:"price_per_group,omitempty"`
// 	GroupIncludedSize *int      `json:"group_included_size,omitempty"`
// 	HostOffers        *string   `json:"host_offers,omitempty"`
// 	TravelerCanOffer  *[]string `json:"traveler_can_offer,omitempty"`
// 	ExchangeValueHint *string   `json:"exchange_value_hint,omitempty"`

// 	// extras
// 	Includes             []string `json:"includes"`
// 	Excludes             []string `json:"excludes"`
// 	MaterialRequirements []string `json:"material_requirements"`
// 	AccessibilityNotes   string   `json:"accessibility_notes"`
// 	AgeRestriction       *string  `json:"age_restriction"`
// 	CancellationPolicy   string   `json:"cancellation_policy"`

// 	CreatedAt time.Time `json:"created_at"`
// }

// type PartialCulturalService struct {
// 	Title             *string
// 	ExperienceType    *string
// 	Category          *string
// 	Tags              *[]string
// 	Description       *string
// 	City              *string
// 	MeetingPointLabel *string

// 	ScheduleType  *string
// 	FixedDates    *[]string
// 	DaysOfWeek    *[]string
// 	StartTime     *string
// 	DurationHours *float64
// 	LeadTimeDays  *int

// 	GroupSizeMax *int
// 	Languages    *[]string

// 	PricingModel      *string
// 	PricePerPerson    *float64
// 	PricePerGroup     *float64
// 	GroupIncludedSize *int
// 	HostOffers        *string
// 	TravelerCanOffer  *[]string
// 	ExchangeValueHint *string

// 	Includes             *[]string
// 	Excludes             *[]string
// 	MaterialRequirements *[]string
// 	AccessibilityNotes   *string
// 	AgeRestriction       **string
// 	CancellationPolicy   *string
// }

// /* ===== DB ===== */

// func CreateCulturalService(m *CulturalService) error {
// 	const q = `
// 	INSERT INTO cultural_services
// 	(user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// 	 schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// 	 group_size_max, languages,
// 	 pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// 	 includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy)
// 	VALUES
// 	($1,$2,$3,$4,$5,$6,$7,$8,
// 	 $9,$10,$11,$12,$13,$14,
// 	 $15,$16,
// 	 $17,$18,$19,$20,$21,$22,$23,
// 	 $24,$25,$26,$27,$28,$29)
// 	RETURNING id, created_at`
// 	return database.DB.QueryRow(q,
// 		m.UserId, m.Title, m.ExperienceType, m.Category, pq.Array(m.Tags), m.Description, m.City, m.MeetingPointLabel,
// 		m.ScheduleType, pq.Array(m.FixedDates), pq.Array(m.DaysOfWeek), m.StartTime, m.DurationHours, m.LeadTimeDays,
// 		m.GroupSizeMax, pq.Array(m.Languages),
// 		m.PricingModel, m.PricePerPerson, m.PricePerGroup, m.GroupIncludedSize, m.HostOffers, pq.Array(m.TravelerCanOffer), m.ExchangeValueHint,
// 		pq.Array(m.Includes), pq.Array(m.Excludes), pq.Array(m.MaterialRequirements), m.AccessibilityNotes, m.AgeRestriction, m.CancellationPolicy,
// 	).Scan(&m.Id, &m.CreatedAt)
// }

// func GetCulturalServicesByUser(userId int) ([]CulturalService, error) {
// 	const q = `
// 	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// 	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// 		   group_size_max, languages,
// 		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// 		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// 		   created_at
// 	FROM cultural_services
// 	WHERE user_id=$1
// 	ORDER BY created_at DESC`

// 	rows, err := database.DB.Query(q, userId)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	out := []CulturalService{}
// 	for rows.Next() {
// 		var m CulturalService
// 		var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray

// 		if err := rows.Scan(
// 			&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// 			&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// 			&m.GroupSizeMax, &langs,
// 			&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// 			&includes, &excludes, pq.Array(&m.MaterialRequirements), // ✅ change here
// 			&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// 			&m.CreatedAt,
// 		); err != nil {
// 			return nil, err
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
// 		out = append(out, m)
// 	}
// 	return out, nil
// }

// func GetCulturalServiceByIDForUser(userId, id int) (CulturalService, error) {
// 	const q = `
// 	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
// 	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
// 		   group_size_max, languages,
// 		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
// 		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
// 		   created_at
// 	FROM cultural_services WHERE id=$1 AND user_id=$2`
// 	var m CulturalService
// 	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray

// 	err := database.DB.QueryRow(q, id, userId).Scan(
// 		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
// 		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
// 		&m.GroupSizeMax, &langs,
// 		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
// 		&includes, &excludes, pq.Array(&m.MaterialRequirements), // ✅ change here
// 		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
// 		&m.CreatedAt,
// 	)
// 	if err != nil {
// 		if errors.Is(err, sql.ErrNoRows) {
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

// func UpdateCulturalServiceFull(userId, id int, in CulturalService) (CulturalService, error) {
// 	// ensure ownership
// 	var exists int
// 	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
// 		if errors.Is(err, sql.ErrNoRows) {
// 			return CulturalService{}, ErrNotFound
// 		}
// 		return CulturalService{}, err
// 	}

// 	const q = `
// 	UPDATE cultural_services SET
// 	  title=$1, experience_type=$2, category=$3, tags=$4, description=$5, city=$6, meeting_point_label=$7,
// 	  schedule_type=$8, fixed_dates=$9, days_of_week=$10, start_time=$11, duration_hours=$12, lead_time_days=$13,
// 	  group_size_max=$14, languages=$15,
// 	  pricing_model=$16, price_per_person=$17, price_per_group=$18, group_included_size=$19, host_offers=$20, traveler_can_offer=$21, exchange_value_hint=$22,
// 	  includes=$23, excludes=$24, material_requirements=$25, accessibility_notes=$26, age_restriction=$27, cancellation_policy=$28
// 	WHERE id=$29 AND user_id=$30`
// 	_, err := database.DB.Exec(q,
// 		in.Title, in.ExperienceType, in.Category, pq.Array(in.Tags), in.Description, in.City, in.MeetingPointLabel,
// 		in.ScheduleType, pq.Array(in.FixedDates), pq.Array(in.DaysOfWeek), in.StartTime, in.DurationHours, in.LeadTimeDays,
// 		in.GroupSizeMax, pq.Array(in.Languages),
// 		in.PricingModel, in.PricePerPerson, in.PricePerGroup, in.GroupIncludedSize, in.HostOffers, pq.Array(in.TravelerCanOffer), in.ExchangeValueHint,
// 		pq.Array(in.Includes), pq.Array(in.Excludes), pq.Array(in.MaterialRequirements), in.AccessibilityNotes, in.AgeRestriction, in.CancellationPolicy,
// 		id, userId,
// 	)
// 	if err != nil {
// 		return CulturalService{}, err
// 	}
// 	return GetCulturalServiceByIDForUser(userId, id)
// }

// func UpdateCulturalServicePartial(userId, id int, p PartialCulturalService) (CulturalService, error) {
// 	// ensure ownership
// 	var exists int
// 	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
// 		if errors.Is(err, sql.ErrNoRows) {
// 			return CulturalService{}, ErrNotFound
// 		}
// 		return CulturalService{}, err
// 	}

// 	q := `UPDATE cultural_services SET `
// 	args := []any{}
// 	idx := 1
// 	add := func(set string, v any) {
// 		if len(args) > 0 {
// 			q += ", "
// 		}
// 		q += set
// 		args = append(args, v)
// 		idx++
// 	}

// 	if p.Title != nil {
// 		add("title=$"+strconv.Itoa(idx), *p.Title)
// 	}
// 	if p.ExperienceType != nil {
// 		add("experience_type=$"+strconv.Itoa(idx), *p.ExperienceType)
// 	}
// 	if p.Category != nil {
// 		add("category=$"+strconv.Itoa(idx), *p.Category)
// 	}
// 	if p.Tags != nil {
// 		add("tags=$"+strconv.Itoa(idx), pq.Array(*p.Tags))
// 	}
// 	if p.Description != nil {
// 		add("description=$"+strconv.Itoa(idx), *p.Description)
// 	}
// 	if p.City != nil {
// 		add("city=$"+strconv.Itoa(idx), *p.City)
// 	}
// 	if p.MeetingPointLabel != nil {
// 		add("meeting_point_label=$"+strconv.Itoa(idx), *p.MeetingPointLabel)
// 	}

// 	if p.ScheduleType != nil {
// 		add("schedule_type=$"+strconv.Itoa(idx), *p.ScheduleType)
// 	}
// 	if p.FixedDates != nil {
// 		add("fixed_dates=$"+strconv.Itoa(idx), pq.Array(*p.FixedDates))
// 	}
// 	if p.DaysOfWeek != nil {
// 		add("days_of_week=$"+strconv.Itoa(idx), pq.Array(*p.DaysOfWeek))
// 	}
// 	if p.StartTime != nil {
// 		add("start_time=$"+strconv.Itoa(idx), *p.StartTime)
// 	}
// 	if p.DurationHours != nil {
// 		add("duration_hours=$"+strconv.Itoa(idx), *p.DurationHours)
// 	}
// 	if p.LeadTimeDays != nil {
// 		add("lead_time_days=$"+strconv.Itoa(idx), *p.LeadTimeDays)
// 	}

// 	if p.GroupSizeMax != nil {
// 		add("group_size_max=$"+strconv.Itoa(idx), *p.GroupSizeMax)
// 	}
// 	if p.Languages != nil {
// 		add("languages=$"+strconv.Itoa(idx), pq.Array(*p.Languages))
// 	}

// 	if p.PricingModel != nil {
// 		add("pricing_model=$"+strconv.Itoa(idx), *p.PricingModel)
// 	}
// 	if p.PricePerPerson != nil {
// 		add("price_per_person=$"+strconv.Itoa(idx), *p.PricePerPerson)
// 	}
// 	if p.PricePerGroup != nil {
// 		add("price_per_group=$"+strconv.Itoa(idx), *p.PricePerGroup)
// 	}
// 	if p.GroupIncludedSize != nil {
// 		add("group_included_size=$"+strconv.Itoa(idx), *p.GroupIncludedSize)
// 	}
// 	if p.HostOffers != nil {
// 		add("host_offers=$"+strconv.Itoa(idx), *p.HostOffers)
// 	}
// 	if p.TravelerCanOffer != nil {
// 		add("traveler_can_offer=$"+strconv.Itoa(idx), pq.Array(*p.TravelerCanOffer))
// 	}
// 	if p.ExchangeValueHint != nil {
// 		add("exchange_value_hint=$"+strconv.Itoa(idx), *p.ExchangeValueHint)
// 	}

// 	if p.Includes != nil {
// 		add("includes=$"+strconv.Itoa(idx), pq.Array(*p.Includes))
// 	}
// 	if p.Excludes != nil {
// 		add("excludes=$"+strconv.Itoa(idx), pq.Array(*p.Excludes))
// 	}
// 	if p.MaterialRequirements != nil {
// 		add("material_requirements=$"+strconv.Itoa(idx), pq.Array(*p.MaterialRequirements))
// 	}
// 	if p.AccessibilityNotes != nil {
// 		add("accessibility_notes=$"+strconv.Itoa(idx), *p.AccessibilityNotes)
// 	}
// 	if p.AgeRestriction != nil {
// 		add("age_restriction=$"+strconv.Itoa(idx), *p.AgeRestriction)
// 	}
// 	if p.CancellationPolicy != nil {
// 		add("cancellation_policy=$"+strconv.Itoa(idx), *p.CancellationPolicy)
// 	}

// 	if len(args) == 0 {
// 		return GetCulturalServiceByIDForUser(userId, id)
// 	}

// 	q += " WHERE id=$" + strconv.Itoa(idx) + " AND user_id=$" + strconv.Itoa(idx+1)
// 	args = append(args, id, userId)

// 	if _, err := database.DB.Exec(q, args...); err != nil {
// 		return CulturalService{}, err
// 	}
// 	return GetCulturalServiceByIDForUser(userId, id)
// }

// func DeleteCulturalServiceForUser(userId, id int) error {
// 	res, err := database.DB.Exec(`DELETE FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId)
// 	if err != nil {
// 		return err
// 	}
// 	aff, _ := res.RowsAffected()
// 	if aff == 0 {
// 		return ErrNotFound
// 	}
// 	return nil
// }

package models

import (
	"database/sql"
	"errors"
	"strconv"
	"time"

	"travel_mate/backend/database"

	"github.com/lib/pq"
)

type CulturalService struct {
	Id                int      `json:"id"`
	UserId            int      `json:"user_id"`
	Title             string   `json:"title"`
	ExperienceType    string   `json:"experience_type"`
	Category          string   `json:"category"`
	Tags              []string `json:"tags"`
	Description       string   `json:"description"`
	City              string   `json:"city"`
	MeetingPointLabel string   `json:"meeting_point_label"`

	// schedule (one of three)
	ScheduleType  string   `json:"schedule_type"`
	FixedDates    []string `json:"fixed_dates"` // YYYY-MM-DD strings
	DaysOfWeek    []string `json:"days_of_week"`
	StartTime     string   `json:"start_time"`     // HH:MM (for weekly)
	DurationHours float64  `json:"duration_hours"` // weekly | on_request
	LeadTimeDays  int      `json:"lead_time_days"` // on_request

	// capacity & langs
	GroupSizeMax int      `json:"group_size_max"`
	Languages    []string `json:"languages"`

	// pricing
	PricingModel      string    `json:"pricing_model"`
	PricePerPerson    *float64  `json:"price_per_person,omitempty"`
	PricePerGroup     *float64  `json:"price_per_group,omitempty"`
	GroupIncludedSize *int      `json:"group_included_size,omitempty"`
	HostOffers        *string   `json:"host_offers,omitempty"`
	TravelerCanOffer  *[]string `json:"traveler_can_offer,omitempty"`
	ExchangeValueHint *string   `json:"exchange_value_hint,omitempty"`

	// extras
	Includes             []string `json:"includes"`
	Excludes             []string `json:"excludes"`
	MaterialRequirements []string `json:"material_requirements"`
	AccessibilityNotes   string   `json:"accessibility_notes"`
	AgeRestriction       *string  `json:"age_restriction"`
	CancellationPolicy   string   `json:"cancellation_policy"`

	CreatedAt time.Time `json:"created_at"`
}

type PartialCulturalService struct {
	Title             *string
	ExperienceType    *string
	Category          *string
	Tags              *[]string
	Description       *string
	City              *string
	MeetingPointLabel *string

	ScheduleType  *string
	FixedDates    *[]string
	DaysOfWeek    *[]string
	StartTime     *string
	DurationHours *float64
	LeadTimeDays  *int

	GroupSizeMax *int
	Languages    *[]string

	PricingModel      *string
	PricePerPerson    *float64
	PricePerGroup     *float64
	GroupIncludedSize *int
	HostOffers        *string
	TravelerCanOffer  *[]string
	ExchangeValueHint *string

	Includes             *[]string
	Excludes             *[]string
	MaterialRequirements *[]string
	AccessibilityNotes   *string
	AgeRestriction       **string
	CancellationPolicy   *string
}

/* ===== DB ===== */

func CreateCulturalService(m *CulturalService) error {
	const q = `
	INSERT INTO cultural_services
	(user_id, title, experience_type, category, tags, description, city, meeting_point_label,
	 schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
	 group_size_max, languages,
	 pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
	 includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy)
	VALUES
	($1,$2,$3,$4,$5,$6,$7,$8,
	 $9,$10,$11,$12,$13,$14,
	 $15,$16,
	 $17,$18,$19,$20,$21,$22,$23,
	 $24,$25,$26,$27,$28,$29)
	RETURNING id, created_at`
	return database.DB.QueryRow(q,
		m.UserId, m.Title, m.ExperienceType, m.Category, pq.Array(m.Tags), m.Description, m.City, m.MeetingPointLabel,
		m.ScheduleType, pq.Array(m.FixedDates), pq.Array(m.DaysOfWeek), m.StartTime, m.DurationHours, m.LeadTimeDays,
		m.GroupSizeMax, pq.Array(m.Languages),
		m.PricingModel, m.PricePerPerson, m.PricePerGroup, m.GroupIncludedSize, m.HostOffers, pq.Array(m.TravelerCanOffer), m.ExchangeValueHint,
		pq.Array(m.Includes), pq.Array(m.Excludes), pq.Array(m.MaterialRequirements), m.AccessibilityNotes, m.AgeRestriction, m.CancellationPolicy,
	).Scan(&m.Id, &m.CreatedAt)
}

func GetCulturalServicesByUser(userId int) ([]CulturalService, error) {
	const q = `
	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
		   group_size_max, languages,
		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
		   created_at
	FROM cultural_services
	WHERE user_id=$1
	ORDER BY created_at DESC`
	rows, err := database.DB.Query(q, userId)
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
			&includes, &excludes, pq.Array(&m.MaterialRequirements), // <-- scan directly into slice
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

func GetCulturalServiceByIDForUser(userId, id int) (CulturalService, error) {
	const q = `
	SELECT id, user_id, title, experience_type, category, tags, description, city, meeting_point_label,
	       schedule_type, fixed_dates, days_of_week, start_time, duration_hours, lead_time_days,
		   group_size_max, languages,
		   pricing_model, price_per_person, price_per_group, group_included_size, host_offers, traveler_can_offer, exchange_value_hint,
		   includes, excludes, material_requirements, accessibility_notes, age_restriction, cancellation_policy,
		   created_at
	FROM cultural_services WHERE id=$1 AND user_id=$2`
	var m CulturalService
	var tags, fixed, dow, langs, includes, excludes, traveler pq.StringArray
	err := database.DB.QueryRow(q, id, userId).Scan(
		&m.Id, &m.UserId, &m.Title, &m.ExperienceType, &m.Category, &tags, &m.Description, &m.City, &m.MeetingPointLabel,
		&m.ScheduleType, &fixed, &dow, &m.StartTime, &m.DurationHours, &m.LeadTimeDays,
		&m.GroupSizeMax, &langs,
		&m.PricingModel, &m.PricePerPerson, &m.PricePerGroup, &m.GroupIncludedSize, &m.HostOffers, &traveler, &m.ExchangeValueHint,
		&includes, &excludes, pq.Array(&m.MaterialRequirements), // <-- scan directly into slice
		&m.AccessibilityNotes, &m.AgeRestriction, &m.CancellationPolicy,
		&m.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
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

func UpdateCulturalServiceFull(userId, id int, in CulturalService) (CulturalService, error) {
	// ensure ownership
	var exists int
	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return CulturalService{}, ErrNotFound
		}
		return CulturalService{}, err
	}

	const q = `
	UPDATE cultural_services SET
	  title=$1, experience_type=$2, category=$3, tags=$4, description=$5, city=$6, meeting_point_label=$7,
	  schedule_type=$8, fixed_dates=$9, days_of_week=$10, start_time=$11, duration_hours=$12, lead_time_days=$13,
	  group_size_max=$14, languages=$15,
	  pricing_model=$16, price_per_person=$17, price_per_group=$18, group_included_size=$19, host_offers=$20, traveler_can_offer=$21, exchange_value_hint=$22,
	  includes=$23, excludes=$24, material_requirements=$25, accessibility_notes=$26, age_restriction=$27, cancellation_policy=$28
	WHERE id=$29 AND user_id=$30`
	_, err := database.DB.Exec(q,
		in.Title, in.ExperienceType, in.Category, pq.Array(in.Tags), in.Description, in.City, in.MeetingPointLabel,
		in.ScheduleType, pq.Array(in.FixedDates), pq.Array(in.DaysOfWeek), in.StartTime, in.DurationHours, in.LeadTimeDays,
		in.GroupSizeMax, pq.Array(in.Languages),
		in.PricingModel, in.PricePerPerson, in.PricePerGroup, in.GroupIncludedSize, in.HostOffers, pq.Array(in.TravelerCanOffer), in.ExchangeValueHint,
		pq.Array(in.Includes), pq.Array(in.Excludes), pq.Array(in.MaterialRequirements), in.AccessibilityNotes, in.AgeRestriction, in.CancellationPolicy,
		id, userId,
	)
	if err != nil {
		return CulturalService{}, err
	}
	return GetCulturalServiceByIDForUser(userId, id)
}

func UpdateCulturalServicePartial(userId, id int, p PartialCulturalService) (CulturalService, error) {
	// ensure ownership
	var exists int
	if err := database.DB.QueryRow(`SELECT 1 FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId).Scan(&exists); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return CulturalService{}, ErrNotFound
		}
		return CulturalService{}, err
	}

	q := `UPDATE cultural_services SET `
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
		add("title=$"+strconv.Itoa(idx), *p.Title)
	}
	if p.ExperienceType != nil {
		add("experience_type=$"+strconv.Itoa(idx), *p.ExperienceType)
	}
	if p.Category != nil {
		add("category=$"+strconv.Itoa(idx), *p.Category)
	}
	if p.Tags != nil {
		add("tags=$"+strconv.Itoa(idx), pq.Array(*p.Tags))
	}
	if p.Description != nil {
		add("description=$"+strconv.Itoa(idx), *p.Description)
	}
	if p.City != nil {
		add("city=$"+strconv.Itoa(idx), *p.City)
	}
	if p.MeetingPointLabel != nil {
		add("meeting_point_label=$"+strconv.Itoa(idx), *p.MeetingPointLabel)
	}

	if p.ScheduleType != nil {
		add("schedule_type=$"+strconv.Itoa(idx), *p.ScheduleType)
	}
	if p.FixedDates != nil {
		add("fixed_dates=$"+strconv.Itoa(idx), pq.Array(*p.FixedDates))
	}
	if p.DaysOfWeek != nil {
		add("days_of_week=$"+strconv.Itoa(idx), pq.Array(*p.DaysOfWeek))
	}
	if p.StartTime != nil {
		add("start_time=$"+strconv.Itoa(idx), *p.StartTime)
	}
	if p.DurationHours != nil {
		add("duration_hours=$"+strconv.Itoa(idx), *p.DurationHours)
	}
	if p.LeadTimeDays != nil {
		add("lead_time_days=$"+strconv.Itoa(idx), *p.LeadTimeDays)
	}

	if p.GroupSizeMax != nil {
		add("group_size_max=$"+strconv.Itoa(idx), *p.GroupSizeMax)
	}
	if p.Languages != nil {
		add("languages=$"+strconv.Itoa(idx), pq.Array(*p.Languages))
	}

	if p.PricingModel != nil {
		add("pricing_model=$"+strconv.Itoa(idx), *p.PricingModel)
	}
	if p.PricePerPerson != nil {
		add("price_per_person=$"+strconv.Itoa(idx), *p.PricePerPerson)
	}
	if p.PricePerGroup != nil {
		add("price_per_group=$"+strconv.Itoa(idx), *p.PricePerGroup)
	}
	if p.GroupIncludedSize != nil {
		add("group_included_size=$"+strconv.Itoa(idx), *p.GroupIncludedSize)
	}
	if p.HostOffers != nil {
		add("host_offers=$"+strconv.Itoa(idx), *p.HostOffers)
	}
	if p.TravelerCanOffer != nil {
		add("traveler_can_offer=$"+strconv.Itoa(idx), pq.Array(*p.TravelerCanOffer))
	}
	if p.ExchangeValueHint != nil {
		add("exchange_value_hint=$"+strconv.Itoa(idx), *p.ExchangeValueHint)
	}

	if p.Includes != nil {
		add("includes=$"+strconv.Itoa(idx), pq.Array(*p.Includes))
	}
	if p.Excludes != nil {
		add("excludes=$"+strconv.Itoa(idx), pq.Array(*p.Excludes))
	}
	if p.MaterialRequirements != nil {
		add("material_requirements=$"+strconv.Itoa(idx), pq.Array(*p.MaterialRequirements))
	}
	if p.AccessibilityNotes != nil {
		add("accessibility_notes=$"+strconv.Itoa(idx), *p.AccessibilityNotes)
	}
	if p.AgeRestriction != nil {
		add("age_restriction=$"+strconv.Itoa(idx), *p.AgeRestriction)
	}
	if p.CancellationPolicy != nil {
		add("cancellation_policy=$"+strconv.Itoa(idx), *p.CancellationPolicy)
	}

	if len(args) == 0 {
		return GetCulturalServiceByIDForUser(userId, id)
	}

	q += " WHERE id=$" + strconv.Itoa(idx) + " AND user_id=$" + strconv.Itoa(idx+1)
	args = append(args, id, userId)

	if _, err := database.DB.Exec(q, args...); err != nil {
		return CulturalService{}, err
	}
	return GetCulturalServiceByIDForUser(userId, id)
}

func DeleteCulturalServiceForUser(userId, id int) error {
	res, err := database.DB.Exec(`DELETE FROM cultural_services WHERE id=$1 AND user_id=$2`, id, userId)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}
