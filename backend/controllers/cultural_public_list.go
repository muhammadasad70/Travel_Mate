// // // // // controllers/cultural_public_list.go
// // // // package controllers

// // // // import (
// // // // 	"net/http"
// // // // 	"strconv"
// // // // 	"strings"

// // // // 	"travel_mate/backend/models"

// // // // 	"github.com/gin-gonic/gin"
// // // // )

// // // // type publicListQuery struct {
// // // // 	ID       string  `form:"id"` // optional: fetch single item
// // // // 	Q        string  `form:"q"`
// // // // 	City     string  `form:"city"`
// // // // 	Type     string  `form:"type"` // workshop|walk|home_experience|skill_exchange
// // // // 	MinPrice float64 `form:"min_price"`
// // // // 	MaxPrice float64 `form:"max_price"`
// // // // 	Date     string  `form:"date"` // YYYY-MM-DD (optional)
// // // // }

// // // // // GET /public/cultural/services
// // // // // - /public/cultural/services?id=123 -> returns single object
// // // // // - /public/cultural/services?q=...&city=... -> returns list
// // // // func PublicListOrGetCulturalServices(c *gin.Context) {
// // // // 	var q publicListQuery
// // // // 	_ = c.BindQuery(&q)

// // // // 	id := strings.TrimSpace(q.ID)
// // // // 	if id != "" {
// // // // 		n, err := strconv.Atoi(id)
// // // // 		if err != nil || n <= 0 {
// // // // 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
// // // // 			return
// // // // 		}
// // // // 		m, err := models.GetCulturalServiceByID(n)
// // // // 		if err != nil {
// // // // 			if err == models.ErrNotFound {
// // // // 				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // // 				return
// // // // 			}
// // // // 			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // // // 			return
// // // // 		}
// // // // 		c.JSON(http.StatusOK, m)
// // // // 		return
// // // // 	}

// // // // 	items, err := models.ListAllCulturalServices(
// // // // 		strings.TrimSpace(q.Q),
// // // // 		strings.TrimSpace(q.City),
// // // // 		strings.TrimSpace(q.Type),
// // // // 		q.MinPrice, q.MaxPrice,
// // // // 		strings.TrimSpace(q.Date),
// // // // 	)
// // // // 	if err != nil {
// // // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
// // // // 		return
// // // // 	}
// // // // 	c.JSON(http.StatusOK, items)
// // // // }

// // // package controllers

// // // import (
// // // 	"fmt"
// // // 	"net/http"
// // // 	"strings"
// // // 	"time"
// // // 	"unicode"

// // // 	"travel_mate/backend/models"

// // // 	"github.com/gin-gonic/gin"
// // // )

// // // /* ========= Helpers ========= */

// // // func trimArr(a []string) []string {
// // // 	out := make([]string, 0, len(a))
// // // 	for _, s := range a {
// // // 		t := strings.TrimSpace(s)
// // // 		if t != "" {
// // // 			out = append(out, t)
// // // 		}
// // // 	}
// // // 	return out
// // // }
// // // func isHHMM(s string) bool {
// // // 	if len(s) != 5 || s[2] != ':' {
// // // 		return false
// // // 	}
// // // 	for i, r := range s {
// // // 		if i == 2 {
// // // 			continue
// // // 		}
// // // 		if !unicode.IsDigit(r) {
// // // 			return false
// // // 		}
// // // 	}
// // // 	hh := (int(s[0]-'0') * 10) + int(s[1]-'0')
// // // 	mm := (int(s[3]-'0') * 10) + int(s[4]-'0')
// // // 	return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59
// // // }
// // // func looksYMD(s string) bool {
// // // 	if len(s) != 10 {
// // // 		return false
// // // 	}
// // // 	_, err := time.Parse("2006-01-02", s)
// // // 	return err == nil
// // // }

// // // /* ========= Payloads ========= */

// // // type schedulePayload struct {
// // // 	Type       string   `json:"type"`        // fixed_dates | repeat_weekly | on_request
// // // 	FixedDates []string `json:"fixed_dates"` // YYYY-MM-DD strings
// // // 	Weekly     *struct {
// // // 		DaysOfWeek    []string `json:"days_of_week"`   // Mon..Sun
// // // 		StartTime     string   `json:"start_time"`     // HH:MM 24h
// // // 		DurationHours float64  `json:"duration_hours"` // > 0
// // // 	} `json:"weekly"`
// // // 	OnRequest *struct {
// // // 		LeadTimeDays  int     `json:"lead_time_days"` // >= 0
// // // 		DurationHours float64 `json:"duration_hours"` // > 0
// // // 	} `json:"on_request"`
// // // }

// // // type pricingPayload struct {
// // // 	Model     string `json:"model"` // per_person | per_group | free | exchange
// // // 	PerPerson *struct {
// // // 		PricePerPerson float64 `json:"price_per_person"`
// // // 	} `json:"per_person"`
// // // 	PerGroup *struct {
// // // 		PricePerGroup     float64 `json:"price_per_group"`
// // // 		GroupIncludedSize int     `json:"group_included_size"`
// // // 	} `json:"per_group"`
// // // 	Free *struct {
// // // 		Reason string `json:"reason"`
// // // 	} `json:"free"`
// // // 	Exchange *struct {
// // // 		HostOffers        string   `json:"host_offers"`
// // // 		TravelerCanOffer  []string `json:"traveler_can_offer"`
// // // 		ExchangeValueHint string   `json:"exchange_value_hint"`
// // // 	} `json:"exchange"`
// // // }

// // // type createSvcPayload struct {
// // // 	Title             string          `json:"title"`
// // // 	ExperienceType    string          `json:"experience_type"` // workshop | walk | home_experience | skill_exchange
// // // 	Category          string          `json:"category"`
// // // 	Tags              []string        `json:"tags"`
// // // 	Description       string          `json:"description"`
// // // 	City              string          `json:"city"`
// // // 	MeetingPointLabel string          `json:"meeting_point_label"`
// // // 	Schedule          schedulePayload `json:"schedule"`

// // // 	GroupSizeMax int      `json:"group_size_max"`
// // // 	Languages    []string `json:"languages"`

// // // 	Pricing pricingPayload `json:"pricing"`

// // // 	Includes             []string `json:"includes"`
// // // 	Excludes             []string `json:"excludes"`
// // // 	MaterialRequirements []string `json:"material_requirements"`
// // // 	AccessibilityNotes   string   `json:"accessibility_notes"`
// // // 	AgeRestriction       *string  `json:"age_restriction"`
// // // 	CancellationPolicy   string   `json:"cancellation_policy"` // flexible | moderate | strict
// // // }

// // // /* ========= Validation ========= */

// // // var allowedExp = map[string]bool{
// // // 	"workshop": true, "walk": true, "home_experience": true, "skill_exchange": true,
// // // }
// // // var allowedSched = map[string]bool{
// // // 	"fixed_dates": true, "repeat_weekly": true, "on_request": true,
// // // }
// // // var weekNames = map[string]bool{
// // // 	"Mon": true, "Tue": true, "Wed": true, "Thu": true, "Fri": true, "Sat": true, "Sun": true,
// // // }
// // // var allowedPricing = map[string]bool{
// // // 	"per_person": true, "per_group": true, "free": true, "exchange": true,
// // // }
// // // var allowedCancel = map[string]bool{
// // // 	"flexible": true, "moderate": true, "strict": true,
// // // }

// // // func validateCreate(in *createSvcPayload) (string, bool) {
// // // 	if strings.TrimSpace(in.Title) == "" {
// // // 		return "title is required", false
// // // 	}
// // // 	if !allowedExp[in.ExperienceType] {
// // // 		return "invalid experience_type", false
// // // 	}
// // // 	if strings.TrimSpace(in.City) == "" {
// // // 		return "city is required", false
// // // 	}
// // // 	if !allowedSched[in.Schedule.Type] {
// // // 		return "invalid schedule.type", false
// // // 	}

// // // 	switch in.Schedule.Type {
// // // 	case "fixed_dates":
// // // 		if len(in.Schedule.FixedDates) == 0 {
// // // 			return "at least one fixed date is required", false
// // // 		}
// // // 		for _, d := range in.Schedule.FixedDates {
// // // 			if !looksYMD(d) {
// // // 				return "fixed_dates must be YYYY-MM-DD", false
// // // 			}
// // // 		}
// // // 	case "repeat_weekly":
// // // 		if in.Schedule.Weekly == nil {
// // // 			return "weekly schedule object required", false
// // // 		}
// // // 		if len(in.Schedule.Weekly.DaysOfWeek) == 0 {
// // // 			return "pick at least one day_of_week", false
// // // 		}
// // // 		for _, d := range in.Schedule.Weekly.DaysOfWeek {
// // // 			if !weekNames[d] {
// // // 				return "invalid day_of_week", false
// // // 			}
// // // 		}
// // // 		if !isHHMM(in.Schedule.Weekly.StartTime) {
// // // 			return "start_time must be HH:MM (24h)", false
// // // 		}
// // // 		if !(in.Schedule.Weekly.DurationHours > 0) {
// // // 			return "duration_hours must be > 0", false
// // // 		}
// // // 	case "on_request":
// // // 		if in.Schedule.OnRequest == nil {
// // // 			return "on_request object required", false
// // // 		}
// // // 		if in.Schedule.OnRequest.LeadTimeDays < 0 {
// // // 			return "lead_time_days must be >= 0", false
// // // 		}
// // // 		if !(in.Schedule.OnRequest.DurationHours > 0) {
// // // 			return "duration_hours must be > 0", false
// // // 		}
// // // 	}

// // // 	if in.GroupSizeMax < 0 {
// // // 		return "group_size_max must be >= 0", false
// // // 	}

// // // 	if !allowedPricing[in.Pricing.Model] {
// // // 		return "invalid pricing.model", false
// // // 	}
// // // 	switch in.Pricing.Model {
// // // 	case "per_person":
// // // 		if in.Pricing.PerPerson == nil || !(in.Pricing.PerPerson.PricePerPerson > 0) {
// // // 			return "price_per_person required", false
// // // 		}
// // // 	case "per_group":
// // // 		if in.Pricing.PerGroup == nil || !(in.Pricing.PerGroup.PricePerGroup > 0) || !(in.Pricing.PerGroup.GroupIncludedSize > 0) {
// // // 			return "price_per_group and group_included_size required", false
// // // 		}
// // // 	case "exchange":
// // // 		if in.Pricing.Exchange == nil || strings.TrimSpace(in.Pricing.Exchange.HostOffers) == "" || len(trimArr(in.Pricing.Exchange.TravelerCanOffer)) == 0 {
// // // 			return "exchange requires host_offers and at least one traveler_can_offer", false
// // // 		}
// // // 	}

// // // 	if !allowedCancel[in.CancellationPolicy] {
// // // 		return "invalid cancellation_policy", false
// // // 	}

// // // 	return "", true
// // // }

// // // /* ========= Handlers ========= */

// // // func CreateCulturalService(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")

// // // 	var in createSvcPayload
// // // 	if err := c.ShouldBindJSON(&in); err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // // 		return
// // // 	}
// // // 	if msg, ok := validateCreate(&in); !ok {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
// // // 		return
// // // 	}

// // // 	m := flattenToModel(uid, &in)

// // // 	if err := models.CreateCulturalService(&m); err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusCreated, m)
// // // }

// // // func ListMyCulturalServices(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	list, err := models.GetCulturalServicesByUser(uid)
// // // 	if err != nil {
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, list)
// // // }

// // // func GetMyCulturalService(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	id, ok := parseIDParam(c, "id")
// // // 	if !ok {
// // // 		return
// // // 	}
// // // 	svc, err := models.GetCulturalServiceByIDForUser(uid, id)
// // // 	if err != nil {
// // // 		if err == models.ErrNotFound {
// // // 			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, svc)
// // // }

// // // /* ----- PUT (replace) and PATCH (partial) ----- */

// // // type updateSvcPutPayload createSvcPayload

// // // func UpdateCulturalServicePUT(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	id, ok := parseIDParam(c, "id")
// // // 	if !ok {
// // // 		return
// // // 	}

// // // 	var in updateSvcPutPayload
// // // 	if err := c.ShouldBindJSON(&in); err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // // 		return
// // // 	}
// // // 	if msg, ok := validateCreate((*createSvcPayload)(&in)); !ok {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
// // // 		return
// // // 	}

// // // 	m := flattenToModel(uid, (*createSvcPayload)(&in))

// // // 	svc, err := models.UpdateCulturalServiceFull(uid, id, m)
// // // 	if err != nil {
// // // 		if err == models.ErrNotFound {
// // // 			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, svc)
// // // }

// // // type updateSvcPatchPayload struct {
// // // 	Title             *string   `json:"title"`
// // // 	ExperienceType    *string   `json:"experience_type"`
// // // 	Category          *string   `json:"category"`
// // // 	Tags              *[]string `json:"tags"`
// // // 	Description       *string   `json:"description"`
// // // 	City              *string   `json:"city"`
// // // 	MeetingPointLabel *string   `json:"meeting_point_label"`

// // // 	Schedule *schedulePayload `json:"schedule"`

// // // 	GroupSizeMax *int      `json:"group_size_max"`
// // // 	Languages    *[]string `json:"languages"`

// // // 	Pricing *pricingPayload `json:"pricing"`

// // // 	Includes             *[]string `json:"includes"`
// // // 	Excludes             *[]string `json:"excludes"`
// // // 	MaterialRequirements *[]string `json:"material_requirements"`
// // // 	AccessibilityNotes   *string   `json:"accessibility_notes"`
// // // 	AgeRestriction       **string  `json:"age_restriction"`
// // // 	CancellationPolicy   *string   `json:"cancellation_policy"`
// // // }

// // // func UpdateCulturalServicePATCH(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	id, ok := parseIDParam(c, "id")
// // // 	if !ok {
// // // 		return
// // // 	}

// // // 	var in updateSvcPatchPayload
// // // 	if err := c.ShouldBindJSON(&in); err != nil {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
// // // 		return
// // // 	}

// // // 	if in.ExperienceType != nil && !allowedExp[*in.ExperienceType] {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid experience_type"})
// // // 		return
// // // 	}
// // // 	if in.Schedule != nil {
// // // 		if !allowedSched[in.Schedule.Type] {
// // // 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid schedule.type"})
// // // 			return
// // // 		}
// // // 		switch in.Schedule.Type {
// // // 		case "fixed_dates":
// // // 			for _, d := range in.Schedule.FixedDates {
// // // 				if !looksYMD(d) {
// // // 					c.JSON(http.StatusBadRequest, gin.H{"error": "fixed_dates must be YYYY-MM-DD"})
// // // 					return
// // // 				}
// // // 			}
// // // 		case "repeat_weekly":
// // // 			if in.Schedule.Weekly == nil || len(in.Schedule.Weekly.DaysOfWeek) == 0 {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "weekly requires days_of_week"})
// // // 				return
// // // 			}
// // // 			for _, d := range in.Schedule.Weekly.DaysOfWeek {
// // // 				if !weekNames[d] {
// // // 					c.JSON(http.StatusBadRequest, gin.H{"error": "invalid day_of_week"})
// // // 					return
// // // 				}
// // // 			}
// // // 			if !isHHMM(in.Schedule.Weekly.StartTime) {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "start_time must be HH:MM"})
// // // 				return
// // // 			}
// // // 			if !(in.Schedule.Weekly.DurationHours > 0) {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "duration_hours must be > 0"})
// // // 				return
// // // 			}
// // // 		case "on_request":
// // // 			if in.Schedule.OnRequest == nil || in.Schedule.OnRequest.LeadTimeDays < 0 || !(in.Schedule.OnRequest.DurationHours > 0) {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "on_request requires lead_time_days >=0 and duration_hours >0"})
// // // 				return
// // // 			}
// // // 		}
// // // 	}
// // // 	if in.GroupSizeMax != nil && *in.GroupSizeMax < 0 {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "group_size_max must be >= 0"})
// // // 		return
// // // 	}
// // // 	if in.Pricing != nil {
// // // 		if !allowedPricing[in.Pricing.Model] {
// // // 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid pricing.model"})
// // // 			return
// // // 		}
// // // 		switch in.Pricing.Model {
// // // 		case "per_person":
// // // 			if in.Pricing.PerPerson == nil || !(in.Pricing.PerPerson.PricePerPerson > 0) {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "price_per_person required"})
// // // 				return
// // // 			}
// // // 		case "per_group":
// // // 			if in.Pricing.PerGroup == nil || !(in.Pricing.PerGroup.PricePerGroup > 0) || !(in.Pricing.PerGroup.GroupIncludedSize > 0) {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "price_per_group and group_included_size required"})
// // // 				return
// // // 			}
// // // 		case "exchange":
// // // 			if in.Pricing.Exchange == nil || strings.TrimSpace(in.Pricing.Exchange.HostOffers) == "" || len(trimArr(in.Pricing.Exchange.TravelerCanOffer)) == 0 {
// // // 				c.JSON(http.StatusBadRequest, gin.H{"error": "exchange requires host_offers and at least one traveler_can_offer"})
// // // 				return
// // // 			}
// // // 		}
// // // 	}
// // // 	if in.CancellationPolicy != nil && !allowedCancel[*in.CancellationPolicy] {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid cancellation_policy"})
// // // 		return
// // // 	}

// // // 	patch := models.PartialCulturalService{
// // // 		Title:             in.Title,
// // // 		ExperienceType:    in.ExperienceType,
// // // 		Category:          in.Category,
// // // 		Tags:              in.Tags,
// // // 		Description:       in.Description,
// // // 		City:              in.City,
// // // 		MeetingPointLabel: in.MeetingPointLabel,

// // // 		ScheduleType:  nil,
// // // 		FixedDates:    nil,
// // // 		DaysOfWeek:    nil,
// // // 		StartTime:     nil,
// // // 		DurationHours: nil,
// // // 		LeadTimeDays:  nil,

// // // 		GroupSizeMax: in.GroupSizeMax,
// // // 		Languages:    in.Languages,

// // // 		PricingModel:      nil,
// // // 		PricePerPerson:    nil,
// // // 		PricePerGroup:     nil,
// // // 		GroupIncludedSize: nil,
// // // 		HostOffers:        nil,
// // // 		TravelerCanOffer:  nil,
// // // 		ExchangeValueHint: nil,

// // // 		Includes:             in.Includes,
// // // 		Excludes:             in.Excludes,
// // // 		MaterialRequirements: in.MaterialRequirements,
// // // 		AccessibilityNotes:   in.AccessibilityNotes,
// // // 		AgeRestriction:       in.AgeRestriction,
// // // 		CancellationPolicy:   in.CancellationPolicy,
// // // 	}

// // // 	if patch.Includes != nil {
// // // 		x := trimArr(*patch.Includes)
// // // 		patch.Includes = &x
// // // 	}
// // // 	if patch.Excludes != nil {
// // // 		x := trimArr(*patch.Excludes)
// // // 		patch.Excludes = &x
// // // 	}
// // // 	if patch.MaterialRequirements != nil {
// // // 		x := trimArr(*patch.MaterialRequirements)
// // // 		patch.MaterialRequirements = &x
// // // 	}
// // // 	if patch.Languages != nil {
// // // 		x := trimArr(*patch.Languages)
// // // 		patch.Languages = &x
// // // 	}
// // // 	if patch.Tags != nil {
// // // 		x := trimArr(*patch.Tags)
// // // 		patch.Tags = &x
// // // 	}

// // // 	if in.Schedule != nil {
// // // 		patch.ScheduleType = &in.Schedule.Type
// // // 		switch in.Schedule.Type {
// // // 		case "fixed_dates":
// // // 			fd := trimArr(in.Schedule.FixedDates)
// // // 			patch.FixedDates = &fd
// // // 			zero := ""
// // // 			nilFloat := 0.0
// // // 			zeroI := 0
// // // 			patch.StartTime = &zero
// // // 			patch.DurationHours = &nilFloat
// // // 			patch.LeadTimeDays = &zeroI
// // // 			empty := []string{}
// // // 			patch.DaysOfWeek = &empty
// // // 		case "repeat_weekly":
// // // 			days := trimArr(in.Schedule.Weekly.DaysOfWeek)
// // // 			patch.DaysOfWeek = &days
// // // 			st := in.Schedule.Weekly.StartTime
// // // 			patch.StartTime = &st
// // // 			dh := in.Schedule.Weekly.DurationHours
// // // 			patch.DurationHours = &dh
// // // 			fd := []string{}
// // // 			patch.FixedDates = &fd
// // // 			zeroI := 0
// // // 			patch.LeadTimeDays = &zeroI
// // // 		case "on_request":
// // // 			lt := in.Schedule.OnRequest.LeadTimeDays
// // // 			patch.LeadTimeDays = &lt
// // // 			dh := in.Schedule.OnRequest.DurationHours
// // // 			patch.DurationHours = &dh
// // // 			fd := []string{}
// // // 			patch.FixedDates = &fd
// // // 			empty := []string{}
// // // 			patch.DaysOfWeek = &empty
// // // 			st := ""
// // // 			patch.StartTime = &st
// // // 		}
// // // 	}

// // // 	if in.Pricing != nil {
// // // 		patch.PricingModel = &in.Pricing.Model
// // // 		switch in.Pricing.Model {
// // // 		case "per_person":
// // // 			pp := in.Pricing.PerPerson.PricePerPerson
// // // 			patch.PricePerPerson = &pp
// // // 			patch.PricePerGroup, patch.GroupIncludedSize, patch.HostOffers, patch.TravelerCanOffer, patch.ExchangeValueHint = nil, nil, nil, nil, nil
// // // 		case "per_group":
// // // 			pg := in.Pricing.PerGroup.PricePerGroup
// // // 			gi := in.Pricing.PerGroup.GroupIncludedSize
// // // 			patch.PricePerGroup = &pg
// // // 			patch.GroupIncludedSize = &gi
// // // 			patch.PricePerPerson, patch.HostOffers, patch.TravelerCanOffer, patch.ExchangeValueHint = nil, nil, nil, nil
// // // 		case "free":
// // // 			patch.PricePerPerson, patch.PricePerGroup, patch.GroupIncludedSize, patch.HostOffers, patch.TravelerCanOffer, patch.ExchangeValueHint = nil, nil, nil, nil, nil, nil
// // // 		case "exchange":
// // // 			ho := strings.TrimSpace(in.Pricing.Exchange.HostOffers)
// // // 			tco := trimArr(in.Pricing.Exchange.TravelerCanOffer)
// // // 			patch.HostOffers = &ho
// // // 			patch.TravelerCanOffer = &tco
// // // 			hint := strings.TrimSpace(in.Pricing.Exchange.ExchangeValueHint)
// // // 			if hint != "" {
// // // 				patch.ExchangeValueHint = &hint
// // // 			} else {
// // // 				patch.ExchangeValueHint = nil
// // // 			}
// // // 			patch.PricePerPerson, patch.PricePerGroup, patch.GroupIncludedSize = nil, nil, nil
// // // 		}
// // // 	}

// // // 	svc, err := models.UpdateCulturalServicePartial(uid, id, patch)
// // // 	if err != nil {
// // // 		if err == models.ErrNotFound {
// // // 			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// // // 		return
// // // 	}
// // // 	c.JSON(http.StatusOK, svc)
// // // }

// // // func DeleteCulturalService(c *gin.Context) {
// // // 	uid := c.GetInt("user_id")
// // // 	id, ok := parseIDParam(c, "id")
// // // 	if !ok {
// // // 		return
// // // 	}
// // // 	if err := models.DeleteCulturalServiceForUser(uid, id); err != nil {
// // // 		if err == models.ErrNotFound {
// // // 			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // // 			return
// // // 		}
// // // 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// // // 		return
// // // 	}
// // // 	c.Status(http.StatusNoContent)
// // // }

// // // /* ---- tiny shared helpers ---- */

// // // func parseIDParam(c *gin.Context, key string) (int, bool) {
// // // 	id, err := strconvAtoi(c.Param(key))
// // // 	if err != nil || id <= 0 {
// // // 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
// // // 		return 0, false
// // // 	}
// // // 	return id, true
// // // }
// // // func strconvAtoi(s string) (int, error) {
// // // 	n := 0
// // // 	if s == "" {
// // // 		return 0, fmt.Errorf("empty")
// // // 	}
// // // 	for _, r := range s {
// // // 		if r < '0' || r > '9' {
// // // 			return 0, fmt.Errorf("bad")
// // // 		}
// // // 		n = n*10 + int(r-'0')
// // // 	}
// // // 	return n, nil
// // // }
// // // func strPtr(s string) *string { return &s }

// // // func flattenToModel(uid int, in *createSvcPayload) models.CulturalService {
// // // 	m := models.CulturalService{
// // // 		UserId:               uid,
// // // 		Title:                strings.TrimSpace(in.Title),
// // // 		ExperienceType:       in.ExperienceType,
// // // 		Category:             strings.TrimSpace(in.Category),
// // // 		Tags:                 trimArr(in.Tags),
// // // 		Description:          strings.TrimSpace(in.Description),
// // // 		City:                 strings.TrimSpace(in.City),
// // // 		MeetingPointLabel:    strings.TrimSpace(in.MeetingPointLabel),
// // // 		ScheduleType:         in.Schedule.Type,
// // // 		FixedDates:           trimArr(in.Schedule.FixedDates),
// // // 		GroupSizeMax:         in.GroupSizeMax,
// // // 		Languages:            trimArr(in.Languages),
// // // 		PricingModel:         in.Pricing.Model,
// // // 		Includes:             trimArr(in.Includes),
// // // 		Excludes:             trimArr(in.Excludes),
// // // 		MaterialRequirements: trimArr(in.MaterialRequirements),
// // // 		AccessibilityNotes:   strings.TrimSpace(in.AccessibilityNotes),
// // // 		AgeRestriction:       in.AgeRestriction,
// // // 		CancellationPolicy:   in.CancellationPolicy,
// // // 	}
// // // 	switch in.Schedule.Type {
// // // 	case "repeat_weekly":
// // // 		m.DaysOfWeek = trimArr(in.Schedule.Weekly.DaysOfWeek)
// // // 		m.StartTime = in.Schedule.Weekly.StartTime
// // // 		m.DurationHours = in.Schedule.Weekly.DurationHours
// // // 	case "on_request":
// // // 		m.LeadTimeDays = in.Schedule.OnRequest.LeadTimeDays
// // // 		m.DurationHours = in.Schedule.OnRequest.DurationHours
// // // 	}
// // // 	switch in.Pricing.Model {
// // // 	case "per_person":
// // // 		pp := in.Pricing.PerPerson.PricePerPerson
// // // 		m.PricePerPerson = &pp
// // // 	case "per_group":
// // // 		pg := in.Pricing.PerGroup.PricePerGroup
// // // 		gi := in.Pricing.PerGroup.GroupIncludedSize
// // // 		m.PricePerGroup = &pg
// // // 		m.GroupIncludedSize = &gi
// // // 	case "exchange":
// // // 		ho := strings.TrimSpace(in.Pricing.Exchange.HostOffers)
// // // 		m.HostOffers = &ho
// // // 		tco := trimArr(in.Pricing.Exchange.TravelerCanOffer)
// // // 		m.TravelerCanOffer = &tco
// // // 		h := strings.TrimSpace(in.Pricing.Exchange.ExchangeValueHint)
// // // 		if h != "" {
// // // 			m.ExchangeValueHint = &h
// // // 		}
// // // 	}
// // // 	return m
// // // }

// // package controllers

// // import (
// // 	"net/http"
// // 	"strconv"
// // 	"strings"

// // 	"travel_mate/backend/models"

// // 	"github.com/gin-gonic/gin"
// // )

// // type publicListQuery struct {
// // 	ID       string  `form:"id"`
// // 	Q        string  `form:"q"`
// // 	City     string  `form:"city"`
// // 	Type     string  `form:"type"`
// // 	MinPrice float64 `form:"min_price"`
// // 	MaxPrice float64 `form:"max_price"`
// // 	Date     string  `form:"date"`
// // }

// // // GET /public/cultural/services
// // // - ?id=123 => single object
// // // - or list via query filters
// // func PublicListOrGetCulturalServices(c *gin.Context) {
// // 	var q publicListQuery
// // 	_ = c.BindQuery(&q)

// // 	id := strings.TrimSpace(q.ID)
// // 	if id != "" {
// // 		n, err := strconv.Atoi(id)
// // 		if err != nil || n <= 0 {
// // 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
// // 			return
// // 		}
// // 		m, err := models.GetCulturalServiceByID(n)
// // 		if err != nil {
// // 			if err == models.ErrNotFound {
// // 				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// // 				return
// // 			}
// // 			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// // 			return
// // 		}
// // 		c.JSON(http.StatusOK, m)
// // 		return
// // 	}

// // 	items, err := models.ListAllCulturalServices(
// // 		strings.TrimSpace(q.Q),
// // 		strings.TrimSpace(q.City),
// // 		strings.TrimSpace(q.Type),
// // 		q.MinPrice, q.MaxPrice,
// // 		strings.TrimSpace(q.Date),
// // 	)
// // 	if err != nil {
// // 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
// // 		return
// // 	}
// // 	c.JSON(http.StatusOK, items)
// // }

// package controllers

// import (
// 	"net/http"
// 	"strconv"
// 	"strings"

// 	"travel_mate/backend/models"

// 	"github.com/gin-gonic/gin"
// )

// type publicListQuery struct {
// 	ID       string  `form:"id"`
// 	Q        string  `form:"q"`
// 	City     string  `form:"city"`
// 	Type     string  `form:"type"`
// 	MinPrice float64 `form:"min_price"`
// 	MaxPrice float64 `form:"max_price"`
// 	Date     string  `form:"date"`
// }

// // GET /public/cultural/services
// // - ?id=123 => single object WITH vendor preview
// // - or list via query filters (without vendor preview for performance)
// func PublicListOrGetCulturalServices(c *gin.Context) {
// 	var q publicListQuery
// 	_ = c.BindQuery(&q)

// 	id := strings.TrimSpace(q.ID)
// 	if id != "" {
// 		n, err := strconv.Atoi(id)
// 		if err != nil || n <= 0 {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
// 			return
// 		}
// 		// 🔹 Return service WITH vendor preview
// 		m, err := models.GetCulturalServiceByID(n)
// 		if err != nil {
// 			if err == models.ErrNotFound {
// 				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
// 				return
// 			}
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
// 			return
// 		}
// 		c.JSON(http.StatusOK, m)
// 		return
// 	}

// 	// List view - no vendor preview (use existing function)
// 	items, err := models.ListAllCulturalServices(
// 		strings.TrimSpace(q.Q),
// 		strings.TrimSpace(q.City),
// 		strings.TrimSpace(q.Type),
// 		q.MinPrice, q.MaxPrice,
// 		strings.TrimSpace(q.Date),
// 	)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, items)
// }

package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

type publicListQuery struct {
	ID       string  `form:"id"`
	Q        string  `form:"q"`
	City     string  `form:"city"`
	Type     string  `form:"type"`
	MinPrice float64 `form:"min_price"`
	MaxPrice float64 `form:"max_price"`
	Date     string  `form:"date"`
}

// GET /public/cultural/services
// - ?id=123 => single object WITH vendor preview
// - or list via query filters
func PublicListOrGetCulturalServices(c *gin.Context) {
	var q publicListQuery
	_ = c.BindQuery(&q)

	id := strings.TrimSpace(q.ID)
	if id != "" {
		n, err := strconv.Atoi(id)
		if err != nil || n <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
			return
		}
		m, err := models.GetCulturalServiceByID(n)
		if err != nil {
			if err == models.ErrNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
			return
		}
		c.JSON(http.StatusOK, m)
		return
	}

	items, err := models.ListAllCulturalServices(
		strings.TrimSpace(q.Q),
		strings.TrimSpace(q.City),
		strings.TrimSpace(q.Type),
		q.MinPrice, q.MaxPrice,
		strings.TrimSpace(q.Date),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}
	c.JSON(http.StatusOK, items)
}
