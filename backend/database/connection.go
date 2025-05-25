package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	connStr := "postgres://t_m_user:nm00@localhost:5432/travelmate?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("Ping failed:", err)
	}
	DB = db
	log.Println("✅ Connected to PostgreSQL!")
}
