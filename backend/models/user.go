// package models

// import (
// 	"errors"
// 	"fmt"
// 	"travel_mate/backend/database"
// )

// type User struct {
// 	Id          int    `json:"id"`
// 	Email       string `json:"email"`
// 	Password    string `json:"password"`
// 	FirstName   string `json:"first_name"`
// 	LastName    string `json:"last_name"`
// 	CountryCode string `json:"country_code"`
// 	Phone       string `json:"phone"`
// 	Country     string `json:"country"`
// 	Role        string `json:"role"`
// 	CreatedAt   string `json:"created_at"`
// }

// func (u *User) CreateUser() error {
// 	query := `
// 		INSERT INTO users (email, password, role)
// 		VALUES ($1, $2, $3)
// 		RETURNING id
// 	`

// 	fmt.Printf("📥 Creating user: email=%s, role=%s\n", u.Email, u.Role)

// 	err := database.DB.QueryRow(query, u.Email, u.Password, u.Role).Scan(&u.Id)
// 	if err != nil {
// 		fmt.Printf("❌ Error inserting user: %v\n", err)
// 	}
// 	return err
// }

// func (u *User) CreateUserWithFullProfile() error {
// 	query := `
// 		INSERT INTO users (email, password, role, first_name, last_name, country_code, phone, country)
// 		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
// 		RETURNING id
// 	`

// 	err := database.DB.QueryRow(query,
// 		u.Email, u.Password, u.Role,
// 		u.FirstName, u.LastName, u.CountryCode,
// 		u.Phone, u.Country,
// 	).Scan(&u.Id)

// 	if err != nil {
// 		fmt.Printf("❌ Error inserting user: %v\n", err)
// 	}
// 	return err
// }

// func (u *User) UpdateUserProfile() error {
// 	query := `
// 		UPDATE users
// 		SET first_name = $1,
// 		    last_name = $2,
// 		    country_code = $3,
// 		    phone = $4,
// 		    country = $5
// 		WHERE id = $6
// 	`

// 	_, err := database.DB.Exec(query,
// 		u.FirstName, u.LastName, u.CountryCode,
// 		u.Phone, u.Country, u.Id,
// 	)

// 	fmt.Printf("🔁 Saving to DB: %+v\n", u)
// 	return err
// }

// func GetUserByEmail(email string) (*User, error) {
// 	query := `SELECT id, email, password, role FROM users WHERE email = $1`

// 	row := database.DB.QueryRow(query, email)
// 	var user User
// 	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.Role)
// 	if err != nil {
// 		return nil, errors.New("user not found")
// 	}
// 	return &user, nil
// }

// func GetUserByID(id int) (User, error) {
// 	query := `SELECT id, email, role, first_name, last_name, country_code, phone, country FROM users WHERE id = $1`

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
// 	)
// 	return user, err
// }

package models

import (
	"errors"
	"fmt"
	"travel_mate/backend/database"
)

type User struct {
	Id          int    `json:"id"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	CountryCode string `json:"country_code"`
	Phone       string `json:"phone"`
	Country     string `json:"country"`
	Role        string `json:"role"`
	CreatedAt   string `json:"created_at"`
}

func (u *User) CreateUser() error {
	query := `
		INSERT INTO users (email, password, role)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	fmt.Printf("📥 Creating user: email=%s, role=%s\n", u.Email, u.Role)

	err := database.DB.QueryRow(query, u.Email, u.Password, u.Role).Scan(&u.Id)
	if err != nil {
		fmt.Printf("❌ Error inserting user: %v\n", err)
	}
	return err
}

func (u *User) CreateUserWithFullProfile() error {
	query := `
		INSERT INTO users (email, password, role, first_name, last_name, country_code, phone, country)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	err := database.DB.QueryRow(query,
		u.Email, u.Password, u.Role,
		u.FirstName, u.LastName, u.CountryCode,
		u.Phone, u.Country,
	).Scan(&u.Id)

	if err != nil {
		fmt.Printf("❌ Error inserting user: %v\n", err)
	}
	return err
}

func (u *User) UpdateUserProfile() error {
	query := `
		UPDATE users
		SET first_name = $1,
		    last_name = $2,
		    country_code = $3,
		    phone = $4,
		    country = $5
		WHERE id = $6
	`

	_, err := database.DB.Exec(query,
		u.FirstName, u.LastName, u.CountryCode,
		u.Phone, u.Country, u.Id,
	)

	fmt.Printf("🔁 Saving to DB: %+v\n", u)
	return err
}

func GetUserByEmail(email string) (*User, error) {
	query := `SELECT id, email, password, role FROM users WHERE email = $1`

	row := database.DB.QueryRow(query, email)
	var user User
	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func GetUserByEmailAndRole(email string, role string) (*User, error) {
	query := `SELECT id, email, password, role FROM users WHERE email = $1 AND role = $2`

	row := database.DB.QueryRow(query, email, role)
	var user User
	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.Role)
	if err != nil {
		return nil, errors.New("user not found with this role")
	}
	return &user, nil
}

func GetUserByID(id int) (User, error) {
	query := `SELECT id, email, role, first_name, last_name, country_code, phone, country FROM users WHERE id = $1`

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
	)
	return user, err
}
  