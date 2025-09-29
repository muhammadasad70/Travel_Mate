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
  place_source TEXT NOT NULL DEFAULT 'custom' CHECK (place_source IN ('curated','custom')),
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

-- =========================
-- Groups
-- =========================
CREATE TABLE IF NOT EXISTS groups (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- group members
CREATE TABLE IF NOT EXISTS group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

-- invites: creator invites invitee to a group (no codes, only requests)
CREATE TABLE IF NOT EXISTS group_invites (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  inviter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, invitee_id)
);

-- =========================
-- Constraints for data quality on groups
-- Use NOT VALID so existing bad rows don't break startup.
-- They WILL be enforced for all NEW inserts/updates.
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'groups_name_len_check'
  ) THEN
    ALTER TABLE groups
      ADD CONSTRAINT groups_name_len_check
      CHECK (char_length(btrim(name)) >= 4) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'groups_desc_len_check'
  ) THEN
    ALTER TABLE groups
      ADD CONSTRAINT groups_desc_len_check
      CHECK (char_length(btrim(description)) >= 10) NOT VALID;
  END IF;
END$$;
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
