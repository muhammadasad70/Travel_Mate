package models

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
	"travel_mate/backend/database"
)

type User struct {
	Id                 int        `json:"id"`
	Email              string     `json:"email"`
	Password           string     `json:"-"`
	FirstName          string     `json:"first_name"`
	LastName           string     `json:"last_name"`
	CountryCode        string     `json:"country_code"`
	Phone              string     `json:"phone"`
	Country            string     `json:"country"`
	Role               string     `json:"role"`
	IsProfileComplete  bool       `json:"is_profile_complete"`
	CreatedAt          time.Time  `json:"created_at"`
	WelcomeEmailSentAt *time.Time `json:"welcome_email_sent_at"` // <-- NEW
}

func EmailExists(email string) (bool, error) {
	const q = `SELECT 1 FROM users WHERE LOWER(email)=LOWER($1) LIMIT 1`
	var one int
	err := database.DB.QueryRow(q, email).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

func (u *User) CreateUser() error {
	// always store lowercase email
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	const query = `
		INSERT INTO users (email, password, role)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	return database.DB.QueryRow(query, u.Email, u.Password, u.Role).Scan(&u.Id)
}

func (u *User) CreateUserWithFullProfile() error {
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
	const query = `
		INSERT INTO users (email, password, role, first_name, last_name, country_code, phone, country, is_profile_complete)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
		RETURNING id
	`
	return database.DB.QueryRow(query,
		u.Email, u.Password, u.Role,
		u.FirstName, u.LastName, u.CountryCode,
		u.Phone, u.Country,
	).Scan(&u.Id)
}

func (u *User) UpdateUserProfile() error {
	const query = `UPDATE users
	SET first_name=$1, last_name=$2, country_code=$3, phone=$4, country=$5, is_profile_complete = TRUE
	WHERE id=$6`
	_, err := database.DB.Exec(query,
		u.FirstName, u.LastName, u.CountryCode, u.Phone, u.Country, u.Id,
	)
	return err
}

func GetUserByEmail(email string) (*User, error) {
	const q = `
		SELECT id, email, password, role, COALESCE(is_profile_complete,false),
		       welcome_email_sent_at
		FROM users
		WHERE LOWER(email)=LOWER($1)
		LIMIT 1`
	var u User
	var sentAt sql.NullTime
	if err := database.DB.QueryRow(q, email).
		Scan(&u.Id, &u.Email, &u.Password, &u.Role, &u.IsProfileComplete, &sentAt); err != nil {
		return nil, errors.New("user not found")
	}
	if sentAt.Valid {
		t := sentAt.Time
		u.WelcomeEmailSentAt = &t
	}
	return &u, nil
}

func GetUserByEmailAndRole(email string, role string) (*User, error) {
	const query = `SELECT id, email, password, role, is_profile_complete FROM users WHERE LOWER(email) = LOWER($1) AND role = $2`
	row := database.DB.QueryRow(query, email, role)
	var user User
	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.Role, &user.IsProfileComplete)
	if err != nil {
		return nil, errors.New("user not found with this role")
	}
	return &user, nil
}

func IsProfileCompleteByID(id int) (bool, error) {
	const q = `SELECT COALESCE(is_profile_complete,false) FROM users WHERE id=$1`
	var v bool
	err := database.DB.QueryRow(q, id).Scan(&v)
	return v, err
}

type SocialUserIn struct {
	Provider   string
	ProviderID string
	Email      string
	Name       string
	AvatarURL  string
	Role       string // "traveler" or "vendor" (fallback "traveler")
}

func UpsertSocialUser(in SocialUserIn) (*User, error) {
	// Normalize
	in.Email = strings.ToLower(strings.TrimSpace(in.Email))
	role := in.Role
	if role != "vendor" && role != "traveler" {
		role = "traveler"
	}

	// If an account already exists with this provider_id -> return it
	{
		const q = `
			SELECT id, email, COALESCE(is_profile_complete,false), role
			FROM users
			WHERE provider=$1 AND provider_id=$2
			LIMIT 1`
		var u User
		var completed bool
		err := database.DB.QueryRow(q, in.Provider, in.ProviderID).
			Scan(&u.Id, &u.Email, &completed, &u.Role)
		if err == nil {
			u.IsProfileComplete = completed
			return &u, nil
		}
	}

	// If same email exists (email/password or another social), link it to this provider
	{
		const q = `
			SELECT id, email, role, COALESCE(is_profile_complete,false)
			FROM users WHERE LOWER(email)=LOWER($1) LIMIT 1`
		var u User
		err := database.DB.QueryRow(q, in.Email).Scan(&u.Id, &u.Email, &u.Role, &u.IsProfileComplete)
		if err == nil {
			_, _ = database.DB.Exec(`
				UPDATE users
				SET provider=$1, provider_id=$2, name=COALESCE(name,$3), avatar_url=COALESCE(avatar_url,$4)
				WHERE id=$5`,
				in.Provider, in.ProviderID, nullIfBlank(in.Name), nullIfBlank(in.AvatarURL), u.Id,
			)
			return &u, nil
		}
	}

	// Otherwise create a fresh user (no password)
	const ins = `
		INSERT INTO users (email, password, role, provider, provider_id, name, avatar_url, is_profile_complete)
		VALUES ($1, '', $2, $3, $4, $5, $6, false)
		RETURNING id, COALESCE(is_profile_complete,false)`
	var u User
	u.Email = in.Email
	u.Role = role
	u.FirstName = "" // can be filled later from profile completion
	u.LastName = ""
	var completed bool
	if err := database.DB.QueryRow(ins, in.Email, role, in.Provider, in.ProviderID, nullIfBlank(in.Name), nullIfBlank(in.AvatarURL)).
		Scan(&u.Id, &completed); err != nil {
		return nil, err
	}
	u.IsProfileComplete = completed
	return &u, nil
}

func nullIfBlank(s string) any {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	return s
}

// func GetUserByID(id int) (User, error) {
// 	const query = `
// 		SELECT id, email, role, first_name, last_name, country_code, phone, country, is_profile_complete
// 		FROM users WHERE id = $1
// 	`
// 	var user User
// 	err := database.DB.QueryRow(query, id).Scan(
// 		&user.Id,
// 		&user.Email,
// 		&user.Role,
// 		&user.FirstName,
// 		&user.LastName,
// 		&user.CountryCode,
// 		&user.Phone,
// 		&user.Country,
// 		&user.IsProfileComplete,
// 	)
// 	return user, err
// }

func GetUserByID(id int) (User, error) {
	const query = `
		SELECT id, email, role, first_name, last_name, country_code, phone, country,
		       COALESCE(is_profile_complete,false), created_at
		FROM users
		WHERE id = $1
	`
	var user User
	err := database.DB.QueryRow(query, id).Scan(
		&user.Id,
		&user.Email,
		&user.Role,
		&user.FirstName,
		&user.LastName,
		&user.CountryCode,
		&user.Phone,
		&user.Country,
		&user.IsProfileComplete,
		&user.CreatedAt, // <-- new
	)
	return user, err
}
func UpdateUserPasswordByEmail(email, hashed string) error {
	res, err := database.DB.Exec(`UPDATE users SET password=$1 WHERE LOWER(email)=LOWER($2)`, hashed, email)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return errors.New("no user updated")
	}
	return nil
}

/*
SearchUsersBasic runs a relevance-ranked search over email / first_name / last_name /
and computed full name (first_name + ' ' + last_name).

Params:
  - q: raw query string from user input
  - limit: max rows to return (use 20–50 typical)

Returns a slice of map[string]interface{} so we don’t introduce new DTO structs.
Keys: id, email, first_name, last_name, country_code, phone, country, role,
is_profile_complete, created_at, relevance_score
*/
func SearchUsersBasic(q string, limit int) ([]map[string]interface{}, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	searchLower := strings.ToLower(strings.TrimSpace(q))
	contains := "%" + searchLower + "%"
	starts := searchLower + "%"
	words := fieldsNonEmpty(searchLower)

	// Build dynamic param list
	params := []any{
		searchLower, // $1 exact
		starts,      // $2 startswith
		contains,    // $3 contains
	}

	// Build "all words in full name" condition with $4..$N
	allWordsCond, params := buildAllWordsInFullNameCond(params, words, 4)

	// Relevance scoring over email + name_concat
	// name_concat = LOWER(COALESCE(first_name,'') || ' ' || COALESCE(last_name,''))
	sb := strings.Builder{}
	sb.WriteString(`
		WITH src AS (
			SELECT
				id, email, first_name, last_name, country_code, phone, country, role,
				is_profile_complete, created_at,
				LOWER(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS name_concat
			FROM users
		)
		SELECT 
			id, email, first_name, last_name, country_code, phone, country, role,
			is_profile_complete, created_at,
			(
				CASE
					WHEN LOWER(email) = $1 THEN 1000
					WHEN LOWER(email) LIKE $2 THEN 900
					WHEN LOWER(email) LIKE $3 THEN 800
					WHEN name_concat = $1 THEN 700
					WHEN name_concat LIKE $2 THEN 600
					WHEN ` + nullIfEmpty(allWordsCond, "FALSE") + ` THEN 550
					WHEN name_concat LIKE $3 THEN 500
					WHEN LOWER(first_name) LIKE $2 OR LOWER(last_name) LIKE $2 THEN 450
					WHEN LOWER(first_name) LIKE $3 OR LOWER(last_name) LIKE $3 THEN 350
					ELSE 100
				END
			) AS relevance_score
		FROM src
		WHERE
			LOWER(email) LIKE $3
			OR name_concat LIKE $3
			OR LOWER(first_name) LIKE $3
			OR LOWER(last_name) LIKE $3
	`)
	// If multi-word, include the ANDed full-name words condition in WHERE too
	if allWordsCond != "" {
		sb.WriteString("\n   OR (")
		sb.WriteString(allWordsCond)
		sb.WriteString(")")
	}
	// Order & limit
	sb.WriteString(`
		ORDER BY relevance_score DESC, id ASC
		LIMIT $`)
	sb.WriteString(fmt.Sprint(len(params) + 1)) // next param index for LIMIT

	params = append(params, limit)

	rows, err := database.DB.Query(sb.String(), params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []map[string]interface{}
	for rows.Next() {
		var (
			id                int
			email             string
			firstName         sql.NullString
			lastName          sql.NullString
			countryCode       sql.NullString
			phone             sql.NullString
			country           sql.NullString
			role              string
			isProfileComplete bool
			createdAt         sql.NullTime
			score             int
		)
		if err := rows.Scan(
			&id, &email, &firstName, &lastName, &countryCode, &phone, &country, &role,
			&isProfileComplete, &createdAt, &score,
		); err != nil {
			return nil, err
		}
		out = append(out, map[string]interface{}{
			"id":                  id,
			"email":               email,
			"first_name":          nv(firstName),
			"last_name":           nv(lastName),
			"country_code":        nv(countryCode),
			"phone":               nv(phone),
			"country":             nv(country),
			"role":                role,
			"is_profile_complete": isProfileComplete,
			"created_at":          nt(createdAt),
			"relevance_score":     score,
		})
	}
	return out, nil
}

/*
SearchUsersAdvanced extends basic search with an optional role filter.
*/
func SearchUsersAdvanced(q string, role *string, limit int) ([]map[string]interface{}, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	searchLower := strings.ToLower(strings.TrimSpace(q))
	contains := "%" + searchLower + "%"
	starts := searchLower + "%"

	words := fieldsNonEmpty(searchLower)

	params := []any{
		searchLower, // $1 exact
		starts,      // $2 startswith
		contains,    // $3 contains
	}
	allWordsCond, params := buildAllWordsInFullNameCond(params, words, 4)

	roleFilter := ""
	if role != nil && strings.TrimSpace(*role) != "" {
		roleFilter = " AND role = $" + fmt.Sprint(len(params)+1)
		params = append(params, *role)
	}

	sb := strings.Builder{}
	sb.WriteString(`
		WITH src AS (
			SELECT
				id, email, first_name, last_name, country_code, phone, country, role,
				is_profile_complete, created_at,
				LOWER(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS name_concat
			FROM users
		)
		SELECT 
			id, email, first_name, last_name, country_code, phone, country, role,
			is_profile_complete, created_at,
			(
				CASE
					WHEN LOWER(email) = $1 THEN 2000
					WHEN LOWER(email) LIKE $2 THEN 1800
					WHEN LOWER(email) LIKE $3 THEN 1500
					WHEN name_concat = $1 THEN 1200
					WHEN name_concat LIKE $2 THEN 1000
					WHEN ` + nullIfEmpty(allWordsCond, "FALSE") + ` THEN 800
					WHEN name_concat LIKE $3 THEN 700
					ELSE 100
				END
			) AS relevance_score
		FROM src
		WHERE (
			LOWER(email) LIKE $3
			OR name_concat LIKE $3
			OR LOWER(first_name) LIKE $3
			OR LOWER(last_name) LIKE $3
	`)
	if allWordsCond != "" {
		sb.WriteString(" OR (")
		sb.WriteString(allWordsCond)
		sb.WriteString(")")
	}
	sb.WriteString(")")
	sb.WriteString(roleFilter)
	sb.WriteString(`
		ORDER BY relevance_score DESC, id ASC
		LIMIT $`)
	sb.WriteString(fmt.Sprint(len(params) + 1))

	params = append(params, limit)

	rows, err := database.DB.Query(sb.String(), params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []map[string]interface{}
	for rows.Next() {
		var (
			id                int
			email             string
			firstName         sql.NullString
			lastName          sql.NullString
			countryCode       sql.NullString
			phone             sql.NullString
			country           sql.NullString
			roleVal           string
			isProfileComplete bool
			createdAt         sql.NullTime
			score             int
		)
		if err := rows.Scan(
			&id, &email, &firstName, &lastName, &countryCode, &phone, &country, &roleVal,
			&isProfileComplete, &createdAt, &score,
		); err != nil {
			return nil, err
		}
		out = append(out, map[string]interface{}{
			"id":                  id,
			"email":               email,
			"first_name":          nv(firstName),
			"last_name":           nv(lastName),
			"country_code":        nv(countryCode),
			"phone":               nv(phone),
			"country":             nv(country),
			"role":                roleVal,
			"is_profile_complete": isProfileComplete,
			"created_at":          nt(createdAt),
			"relevance_score":     score,
		})
	}
	return out, nil
}

/*
GetUserProfileByID returns a single user's public profile by ID,
plus simple stats (posts, followers, following). Follower counts assume a `follows` table
with (follower_id, following_id, status='accepted').
*/
func GetUserProfileByID(id int) (map[string]interface{}, error) {
	row := database.DB.QueryRow(`
		SELECT id, email, first_name, last_name, country_code, phone, country, role,
		       is_profile_complete, created_at
		FROM users
		WHERE id = $1
	`, id)

	var (
		userID            int
		email             string
		firstName         sql.NullString
		lastName          sql.NullString
		countryCode       sql.NullString
		phone             sql.NullString
		country           sql.NullString
		role              string
		isProfileComplete bool
		createdAt         sql.NullTime
	)
	if err := row.Scan(
		&userID, &email, &firstName, &lastName, &countryCode, &phone, &country, &role,
		&isProfileComplete, &createdAt,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}

	var posts, followers, following int
	_ = database.DB.QueryRow(`SELECT COUNT(*) FROM posts WHERE user_id=$1`, userID).Scan(&posts)
	// adjust table name/filters to your actual social-graph table
	_ = database.DB.QueryRow(`SELECT COUNT(*) FROM follows WHERE following_id=$1 AND status='accepted'`, userID).Scan(&followers)
	_ = database.DB.QueryRow(`SELECT COUNT(*) FROM follows WHERE follower_id=$1 AND status='accepted'`, userID).Scan(&following)

	return map[string]interface{}{
		"user": map[string]interface{}{
			"id":                  userID,
			"email":               email,
			"first_name":          nv(firstName),
			"last_name":           nv(lastName),
			"country_code":        nv(countryCode),
			"phone":               nv(phone),
			"country":             nv(country),
			"role":                role,
			"is_profile_complete": isProfileComplete,
			"created_at":          nt(createdAt),
		},
		"stats": map[string]interface{}{
			"posts":     posts,
			"followers": followers,
			"following": following,
		},
	}, nil
}

/*
GetSearchIndexStatements returns SQLs you can run to optimize search.
You can expose these via a controller endpoint for convenience.
*/
func GetSearchIndexStatements() []string {
	return []string{
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_first_name_lower ON users (LOWER(first_name));",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_name_lower ON users (LOWER(last_name));",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users (role);",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_country ON users (country);",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_profile_complete ON users (is_profile_complete);",
		"CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_search_composite ON users (LOWER(email), LOWER(first_name), LOWER(last_name));",
	}
}

/* ---------- small helpers (no new types) ---------- */

func fieldsNonEmpty(s string) []string {
	ws := strings.Fields(s)
	out := make([]string, 0, len(ws))
	for _, w := range ws {
		w = strings.TrimSpace(w)
		if w != "" {
			out = append(out, w)
		}
	}
	return out
}

// buildAllWordsInFullNameCond builds "name_concat LIKE $N AND name_concat LIKE $N+1 ..."
func buildAllWordsInFullNameCond(params []any, words []string, start int) (string, []any) {
	if len(words) <= 1 {
		return "", params
	}
	parts := make([]string, 0, len(words))
	idx := start
	for _, w := range words {
		parts = append(parts, fmt.Sprintf("name_concat LIKE $%d", idx))
		params = append(params, "%"+w+"%")
		idx++
	}
	return strings.Join(parts, " AND "), params
}

// null-handling helpers
func nv(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}
func nt(nt sql.NullTime) any {
	if nt.Valid {
		return nt.Time
	}
	return nil
}
func nullIfEmpty(s string, fallback string) string {
	if strings.TrimSpace(s) == "" {
		return fallback
	}
	return s
}
func MarkWelcomeEmailSent(userID int) error {
	_, err := database.DB.Exec(`UPDATE users SET welcome_email_sent_at = NOW() WHERE id=$1 AND welcome_email_sent_at IS NULL`, userID)
	return err
}
