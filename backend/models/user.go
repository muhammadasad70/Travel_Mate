package models

import (
	"database/sql"
	"errors"
	"strings"
	"travel_mate/backend/database"
)

type User struct {
	Id                int    `json:"id"`
	Email             string `json:"email"`
	Password          string `json:"password"`
	FirstName         string `json:"first_name"`
	LastName          string `json:"last_name"`
	CountryCode       string `json:"country_code"`
	Phone             string `json:"phone"`
	Country           string `json:"country"`
	Role              string `json:"role"`
	IsProfileComplete bool   `json:"is_profile_complete"`
	CreatedAt         string `json:"created_at"`
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
		SELECT id, email, password, role, COALESCE(is_profile_complete,false)
		FROM users
		WHERE LOWER(email)=LOWER($1)
		LIMIT 1`
	var u User
	if err := database.DB.QueryRow(q, email).Scan(&u.Id, &u.Email, &u.Password, &u.Role, &u.IsProfileComplete); err != nil {
		return nil, errors.New("user not found")
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

func GetUserByID(id int) (User, error) {
	const query = `
		SELECT id, email, role, first_name, last_name, country_code, phone, country, is_profile_complete
		FROM users WHERE id = $1
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
	)
	return user, err
}
