package database

import "log"

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('traveler','vendor')),
  first_name TEXT,
  last_name TEXT,
  country_code VARCHAR(8),
  phone TEXT,
  country TEXT,
  is_profile_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_lower
  ON users (LOWER(email));

-- new itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  budget TEXT,
  style TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- itinerary days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id BIGSERIAL PRIMARY KEY,
  itinerary_id BIGINT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  place TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  activities TEXT NOT NULL
);

-- user uploaded images (photos/videos)
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cloudinary_id TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

func InitSchema() {
	if DB == nil {
		log.Fatal("InitSchema called before Connect()")
	}
	if _, err := DB.Exec(schema); err != nil {
		log.Fatal("❌ Failed to apply schema:", err)
	}
	log.Println("✅ Schema ensured")
}
