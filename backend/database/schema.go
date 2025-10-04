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

-- =========================
-- Social graph
-- =========================
CREATE TABLE IF NOT EXISTS follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_follow_unique UNIQUE (follower_id, following_id),
  CONSTRAINT follow_not_self CHECK (follower_id <> following_id)
);
CREATE INDEX IF NOT EXISTS ix_follows_follower ON follows (follower_id);
CREATE INDEX IF NOT EXISTS ix_follows_following ON follows (following_id);

-- =========================
-- Posts (content_id only)
-- =========================
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,                           -- app-level meaning (itinerary/event/service/skill)
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','friends','private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_posts_user      ON posts (user_id);
CREATE INDEX IF NOT EXISTS ix_posts_content   ON posts (content_id);
CREATE INDEX IF NOT EXISTS ix_posts_created   ON posts (created_at);

-- =========================
-- Comments
-- =========================
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_comments_post ON comments (post_id);
CREATE INDEX IF NOT EXISTS ix_comments_user ON comments (user_id);

-- =========================
-- Likes
-- =========================
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_like_unique UNIQUE (user_id, post_id)
);
CREATE INDEX IF NOT EXISTS ix_likes_post ON likes (post_id);
CREATE INDEX IF NOT EXISTS ix_likes_user ON likes (user_id);

-- =========================
-- Saves (polymorphic)
-- =========================
CREATE TABLE IF NOT EXISTS saves (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('itinerary','event','service','skill','post')),
  content_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_saves_unique UNIQUE (user_id, content_type, content_id)
);
CREATE INDEX IF NOT EXISTS ix_saves_user ON saves (user_id);
CREATE INDEX IF NOT EXISTS ix_saves_ct   ON saves (content_type, content_id);


-- =========================
-- Conversations & Messaging
-- =========================

-- Conversations (direct | group)
CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('direct','group')),
  title TEXT,                                        -- nullable (mainly for groups)
  group_id BIGINT REFERENCES groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_conversations_type     ON conversations (type);
CREATE INDEX IF NOT EXISTS ix_conversations_group_id ON conversations (group_id);
CREATE INDEX IF NOT EXISTS ix_conversations_created  ON conversations (created_at);

-- Conversation members
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS ix_conv_members_user ON conversation_members (user_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,   -- nullable for system messages
  content TEXT,                                               -- nullable
  file_url TEXT,                                              -- nullable
  message_type TEXT NOT NULL CHECK (message_type IN ('text','image','file','video','signal','call')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_messages_conv     ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS ix_messages_created  ON messages (created_at);
CREATE INDEX IF NOT EXISTS ix_messages_sender   ON messages (sender_id);

-- Message reads (who read which message)
CREATE TABLE IF NOT EXISTS message_reads (
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);
CREATE INDEX IF NOT EXISTS ix_message_reads_user ON message_reads (user_id);
-- =========================
-- Events
-- =========================
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('eventbrite','meetup','ticketmaster','custom')),
  external_id TEXT,                             -- id from the provider (nullable for custom)
  title TEXT NOT NULL,
  category TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  tz TEXT,
  venue_name TEXT,
  venue_address TEXT,
  city TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  image_url TEXT,
  price TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_events_source_extid UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS ix_events_start_time ON events (start_time DESC);
CREATE INDEX IF NOT EXISTS ix_events_city       ON events (city);
CREATE INDEX IF NOT EXISTS ix_events_category   ON events (category);


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
