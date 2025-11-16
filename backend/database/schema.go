// package database

// import "log"

// const schema = `
// CREATE TABLE IF NOT EXISTS users (
//   id BIGSERIAL PRIMARY KEY,
//   email TEXT NOT NULL,
//   password TEXT NOT NULL,
//   role TEXT NOT NULL CHECK (role IN ('traveler','vendor')),
//   first_name TEXT,
//   last_name TEXT,
//   country_code VARCHAR(8),
//   phone TEXT,
//   country TEXT,
//   is_profile_complete BOOLEAN NOT NULL DEFAULT false,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_lower
//   ON users (LOWER(email));
// -- 001_alter_users_social.sql  (run once)
// ALTER TABLE users
//   ALTER COLUMN password DROP NOT NULL;
// ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ NULL;

// ALTER TABLE users
//   ADD COLUMN IF NOT EXISTS provider TEXT
//     CHECK (provider IN ('google','facebook')),

//   ADD COLUMN IF NOT EXISTS provider_id TEXT,
//   ADD COLUMN IF NOT EXISTS avatar_url TEXT,
//   ADD COLUMN IF NOT EXISTS name TEXT;

// -- prevent duplicate social identities
// DO $$
// BEGIN
//   IF NOT EXISTS (
//     SELECT 1 FROM pg_indexes WHERE indexname = 'ux_users_provider_pid'
//   ) THEN
//     CREATE UNIQUE INDEX ux_users_provider_pid ON users(provider, provider_id);
//   END IF;
// END$$;

// -- new itineraries table
// CREATE TABLE IF NOT EXISTS itineraries (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   description TEXT NOT NULL,
//   city TEXT NOT NULL,
//   budget TEXT,
//   style TEXT,
//   start_date DATE NOT NULL,
//   end_date DATE NOT NULL,
//   cover_url TEXT,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// -- itinerary days
// CREATE TABLE IF NOT EXISTS itinerary_days (
//   id BIGSERIAL PRIMARY KEY,
//   itinerary_id BIGINT NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
//   day_number INT NOT NULL,
//   place TEXT NOT NULL,
//   place_source TEXT NOT NULL DEFAULT 'custom' CHECK (place_source IN ('curated','custom')),
//   start_time TEXT,
//   end_time TEXT,
//   activities TEXT NOT NULL
// );

// -- user uploaded images (photos/videos)
// CREATE TABLE IF NOT EXISTS images (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   cloudinary_id TEXT NOT NULL,
//   url TEXT NOT NULL,
//   uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE TABLE IF NOT EXISTS groups (
//   id BIGSERIAL PRIMARY KEY,
//   admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   name TEXT NOT NULL,
//   description TEXT,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// -- Optional: Index to speed up admin lookups
// CREATE INDEX IF NOT EXISTS idx_groups_admin_id ON groups(admin_id);

// -- =========================
// -- Group Members
// -- =========================
// CREATE TABLE IF NOT EXISTS group_members (
//   id BIGSERIAL PRIMARY KEY,
//   group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   role TEXT NOT NULL DEFAULT 'member'
//        CHECK (role IN ('admin', 'member')),
//   status TEXT NOT NULL DEFAULT 'active'
//        CHECK (status IN ('active', 'removed')),
//   joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   UNIQUE (group_id, user_id)
// );

// CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
// CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

// -- =========================
// -- Group Invites
// -- =========================
// CREATE TABLE IF NOT EXISTS group_invites (
//   id BIGSERIAL PRIMARY KEY,
//   group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
//   invitee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   invitee_email TEXT NOT NULL,
//   status TEXT NOT NULL DEFAULT 'pending'
//        CHECK (status IN ('pending', 'accepted', 'declined', 'canceled')),
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   UNIQUE (group_id, invitee_id)
// );

// CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON group_invites(group_id);
// CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id ON group_invites(invitee_id);

// -- =========================
// -- Constraints for data quality on groups
// -- Use NOT VALID so existing bad rows don't break startup.
// -- They WILL be enforced for all NEW inserts/updates.
// -- =========================
// DO $$
// BEGIN
//   IF NOT EXISTS (
//     SELECT 1 FROM pg_constraint WHERE conname = 'groups_name_len_check'
//   ) THEN
//     ALTER TABLE groups
//       ADD CONSTRAINT groups_name_len_check
//       CHECK (char_length(btrim(name)) >= 4) NOT VALID;
//   END IF;

//   IF NOT EXISTS (
//     SELECT 1 FROM pg_constraint WHERE conname = 'groups_desc_len_check'
//   ) THEN
//     ALTER TABLE groups
//       ADD CONSTRAINT groups_desc_len_check
//       CHECK (char_length(btrim(description)) >= 10) NOT VALID;
//   END IF;
// END$$;
// CREATE INDEX IF NOT EXISTS ix_group_members_gid_user ON group_members(group_id, user_id);
// CREATE INDEX IF NOT EXISTS ix_group_invites_gid_invitee ON group_invites(group_id, invitee_id);
// CREATE INDEX IF NOT EXISTS ix_group_invites_status ON group_invites(status);

// -- =========================
// -- Social graph
// -- =========================
// CREATE TABLE IF NOT EXISTS follows (
//   id BIGSERIAL PRIMARY KEY,
//   follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   CONSTRAINT ux_follow_unique UNIQUE (follower_id, following_id),
//   CONSTRAINT follow_not_self CHECK (follower_id <> following_id)
// );
// CREATE INDEX IF NOT EXISTS ix_follows_follower ON follows (follower_id);
// CREATE INDEX IF NOT EXISTS ix_follows_following ON follows (following_id);

// -- =========================
// -- Posts (content_id only)
// -- =========================
// CREATE TABLE IF NOT EXISTS posts (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   content_id BIGINT NOT NULL,                           -- app-level meaning (itinerary/event/service/skill)
//   visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','friends','private')),
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
// CREATE INDEX IF NOT EXISTS ix_posts_user      ON posts (user_id);
// CREATE INDEX IF NOT EXISTS ix_posts_content   ON posts (content_id);
// CREATE INDEX IF NOT EXISTS ix_posts_created   ON posts (created_at);

// -- =========================
// -- Comments
// -- =========================
// CREATE TABLE IF NOT EXISTS comments (
//   id BIGSERIAL PRIMARY KEY,
//   post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   text TEXT NOT NULL,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
// CREATE INDEX IF NOT EXISTS ix_comments_post ON comments (post_id);
// CREATE INDEX IF NOT EXISTS ix_comments_user ON comments (user_id);

// -- =========================
// -- Likes
// -- =========================
// CREATE TABLE IF NOT EXISTS likes (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   CONSTRAINT ux_like_unique UNIQUE (user_id, post_id)
// );
// CREATE INDEX IF NOT EXISTS ix_likes_post ON likes (post_id);
// CREATE INDEX IF NOT EXISTS ix_likes_user ON likes (user_id);

// -- =========================
// -- Saves (polymorphic)
// -- =========================
// CREATE TABLE IF NOT EXISTS saves (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   content_type TEXT NOT NULL CHECK (content_type IN ('itinerary','event','service','skill','post')),
//   content_id BIGINT NOT NULL,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   CONSTRAINT ux_saves_unique UNIQUE (user_id, content_type, content_id)
// );
// CREATE INDEX IF NOT EXISTS ix_saves_user ON saves (user_id);
// CREATE INDEX IF NOT EXISTS ix_saves_ct   ON saves (content_type, content_id);

// -- =========================
// -- Conversations & Messaging
// -- =========================

// -- Conversations (direct | group)
// CREATE TABLE IF NOT EXISTS conversations (
//   id BIGSERIAL PRIMARY KEY,
//   type TEXT NOT NULL CHECK (type IN ('direct','group')),
//   title TEXT,                                        -- nullable (mainly for groups)
//   group_id BIGINT REFERENCES groups(id) ON DELETE SET NULL,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
// CREATE INDEX IF NOT EXISTS ix_conversations_type     ON conversations (type);
// CREATE INDEX IF NOT EXISTS ix_conversations_group_id ON conversations (group_id);
// CREATE INDEX IF NOT EXISTS ix_conversations_created  ON conversations (created_at);

// -- Conversation members
// CREATE TABLE IF NOT EXISTS conversation_members (
//   conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
//   joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   PRIMARY KEY (conversation_id, user_id)
// );
// CREATE INDEX IF NOT EXISTS ix_conv_members_user ON conversation_members (user_id);

// -- Messages
// CREATE TABLE IF NOT EXISTS messages (
//   id BIGSERIAL PRIMARY KEY,
//   conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
//   sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,   -- nullable for system messages
//   content TEXT,                                               -- nullable
//   file_url TEXT,                                              -- nullable
//   message_type TEXT NOT NULL CHECK (message_type IN ('text','image','file','video','signal','call')),
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
// CREATE INDEX IF NOT EXISTS ix_messages_conv     ON messages (conversation_id);
// CREATE INDEX IF NOT EXISTS ix_messages_created  ON messages (created_at);
// CREATE INDEX IF NOT EXISTS ix_messages_sender   ON messages (sender_id);

// -- Message reads (who read which message)
// CREATE TABLE IF NOT EXISTS message_reads (
//   message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   PRIMARY KEY (message_id, user_id)
// );
// CREATE INDEX IF NOT EXISTS ix_message_reads_user ON message_reads (user_id);

// -- =========================
// -- Events
// -- =========================
// CREATE TABLE IF NOT EXISTS events (
//   id BIGSERIAL PRIMARY KEY,
//   source TEXT NOT NULL CHECK (source IN ('eventbrite','meetup','ticketmaster','custom')),
//   external_id TEXT,                             -- id from the provider (nullable for custom)
//   title TEXT NOT NULL,
//   category TEXT,
//   start_time TIMESTAMPTZ,
//   end_time TIMESTAMPTZ,
//   tz TEXT,
//   venue_name TEXT,
//   venue_address TEXT,
//   city TEXT,
//   lat DOUBLE PRECISION,
//   lng DOUBLE PRECISION,
//   image_url TEXT,
//   price TEXT,
//   url TEXT,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   CONSTRAINT ux_events_source_extid UNIQUE (source, external_id)
// );

// CREATE INDEX IF NOT EXISTS ix_events_start_time ON events (start_time DESC);
// CREATE INDEX IF NOT EXISTS ix_events_city       ON events (city);
// CREATE INDEX IF NOT EXISTS ix_events_category   ON events (category);

// -- =========================
// -- Cultural Services (Vendor "Cultural Exchange")
// -- =========================
// CREATE TABLE IF NOT EXISTS cultural_services (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

//   title TEXT NOT NULL,
//   experience_type TEXT NOT NULL CHECK (experience_type IN ('workshop','walk','home_experience','skill_exchange')),
//   category TEXT,
//   tags TEXT[],

//   description TEXT,
//   city TEXT NOT NULL,
//   meeting_point_label TEXT,

//   -- schedule (one of)
//   schedule_type TEXT NOT NULL CHECK (schedule_type IN ('fixed_dates','repeat_weekly','on_request')),
//   fixed_dates TEXT[],         -- array of 'YYYY-MM-DD' strings (simpler than DATE[])
//   days_of_week TEXT[],        -- e.g., {'Mon','Wed','Fri'}
//   start_time TEXT,            -- 'HH:MM' for weekly
//   duration_hours DOUBLE PRECISION DEFAULT 0,
//   lead_time_days INT DEFAULT 0,

//   -- capacity
//   group_size_max INT DEFAULT 0,
//   languages TEXT[],

//   -- pricing
//   pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person','per_group','free','exchange')),
//   price_per_person DOUBLE PRECISION,
//   price_per_group DOUBLE PRECISION,
//   group_included_size INT,
//   host_offers TEXT,
//   traveler_can_offer TEXT[],
//   exchange_value_hint TEXT,

//   -- extras
//   includes TEXT[],
//   excludes TEXT[],
//   material_requirements TEXT[],
//   accessibility_notes TEXT,
//   age_restriction TEXT,
//   cancellation_policy TEXT NOT NULL CHECK (cancellation_policy IN ('flexible','moderate','strict')),

//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE INDEX IF NOT EXISTS ix_cultural_services_user ON cultural_services(user_id);
// CREATE INDEX IF NOT EXISTS ix_cultural_services_city ON cultural_services(city);
// CREATE INDEX IF NOT EXISTS ix_cultural_services_created ON cultural_services(created_at DESC);

// -- =========================
// -- Cultural Service Bookings
// -- =========================
// CREATE TABLE IF NOT EXISTS cultural_service_bookings (
//   id BIGSERIAL PRIMARY KEY,
//   service_id BIGINT NOT NULL REFERENCES cultural_services(id) ON DELETE CASCADE,
//   vendor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,   -- denormalized from service
//   traveler_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

//   status TEXT NOT NULL CHECK (status IN ('pending','confirmed','declined','cancelled')),
//   chosen_date TEXT,             -- 'YYYY-MM-DD' (for fixed_dates) or null for weekly/on_request
//   participants INT NOT NULL CHECK (participants > 0),
//   message TEXT,

//   price_snapshot DOUBLE PRECISION,   -- snapshot at time of request; nullable if exchange/free
//   pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person','per_group','free','exchange')),

//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE INDEX IF NOT EXISTS ix_csb_vendor ON cultural_service_bookings(vendor_id, status, created_at DESC);
// CREATE INDEX IF NOT EXISTS ix_csb_traveler ON cultural_service_bookings(traveler_id, status, created_at DESC);
// CREATE INDEX IF NOT EXISTS ix_csb_service  ON cultural_service_bookings(service_id);
// -- prevent same traveler booking the same service on the same date (if active)
// CREATE UNIQUE INDEX IF NOT EXISTS ux_csb_service_user_date
// ON cultural_service_bookings(service_id, traveler_id, chosen_date)
// WHERE status IN ('pending','confirmed') AND chosen_date IS NOT NULL;

// `

// func InitSchema() {
// 	if DB == nil {
// 		log.Fatal("InitSchema called before Connect()")
// 	}
// 	if _, err := DB.Exec(schema); err != nil {
// 		log.Fatal("❌ Failed to apply schema:", err)
// 	}
// 	log.Println("✅ Schema ensured")
// }

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

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_lower ON users (LOWER(email));

-- 001_alter_users_social.sql  (run once)
ALTER TABLE users
  ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS provider TEXT
    CHECK (provider IN ('google','facebook')),
  ADD COLUMN IF NOT EXISTS provider_id TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT;

-- prevent duplicate social identities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'ux_users_provider_pid'
  ) THEN
    CREATE UNIQUE INDEX ux_users_provider_pid ON users(provider, provider_id);
  END IF;
END$$;

-- itineraries
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

-- AI Recommendations cache (simplified - no search history, no preferences)
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendations JSONB NOT NULL,
    based_on_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_ai_recs_user ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS ix_ai_recs_expires ON ai_recommendations(expires_at);

CREATE TABLE IF NOT EXISTS saved_ai_itineraries (
    id BIGSERIAL PRIMARY KEY,           -- ✅ BIGSERIAL (64-bit, matches other tables)
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    budget TEXT,
    style TEXT,
    duration TEXT,
    highlights JSONB,
    reasoning TEXT,
    confidence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_saved_ai_itineraries_user ON saved_ai_itineraries(user_id);
CREATE INDEX IF NOT EXISTS ix_saved_ai_itineraries_created ON saved_ai_itineraries(created_at DESC);

-- user uploaded images (photos/videos)
-- images
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cloudinary_id TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- groups
CREATE TABLE IF NOT EXISTS groups (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_groups_admin_id ON groups(admin_id);

CREATE TABLE IF NOT EXISTS group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
       CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL DEFAULT 'active'
       CHECK (status IN ('active', 'removed')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

CREATE TABLE IF NOT EXISTS group_invites (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  invitee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending', 'accepted', 'declined', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, invitee_id)
);
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id ON group_invites(invitee_id);

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
CREATE INDEX IF NOT EXISTS ix_group_members_gid_user ON group_members(group_id, user_id);
CREATE INDEX IF NOT EXISTS ix_group_invites_gid_invitee ON group_invites(group_id, invitee_id);
CREATE INDEX IF NOT EXISTS ix_group_invites_status ON group_invites(status);

-- social graph
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

-- posts
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','friends','private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_posts_user      ON posts (user_id);
CREATE INDEX IF NOT EXISTS ix_posts_content   ON posts (content_id);
CREATE INDEX IF NOT EXISTS ix_posts_created   ON posts (created_at);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_comments_post ON comments (post_id);
CREATE INDEX IF NOT EXISTS ix_comments_user ON comments (user_id);

-- likes
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_like_unique UNIQUE (user_id, post_id)
);
CREATE INDEX IF NOT EXISTS ix_likes_post ON likes (post_id);
CREATE INDEX IF NOT EXISTS ix_likes_user ON likes (user_id);

-- saves
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

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('direct','group')),
  title TEXT,
  group_id BIGINT REFERENCES groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_conversations_type     ON conversations (type);
CREATE INDEX IF NOT EXISTS ix_conversations_group_id ON conversations (group_id);
CREATE INDEX IF NOT EXISTS ix_conversations_created  ON conversations (created_at);

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS ix_conv_members_user ON conversation_members (user_id);

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  file_url TEXT,
  message_type TEXT NOT NULL CHECK (message_type IN ('text','image','file','video','signal','call')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_messages_conv     ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS ix_messages_created  ON messages (created_at);
CREATE INDEX IF NOT EXISTS ix_messages_sender   ON messages (sender_id);

CREATE TABLE IF NOT EXISTS message_reads (
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);
CREATE INDEX IF NOT EXISTS ix_message_reads_user ON message_reads (user_id);

-- events
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('eventbrite','meetup','ticketmaster','custom')),
  external_id TEXT,
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

-- cultural_services
CREATE TABLE IF NOT EXISTS cultural_services (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('workshop','walk','home_experience','skill_exchange')),
  category TEXT,
  tags TEXT[],

  description TEXT,
  city TEXT NOT NULL,
  meeting_point_label TEXT,

  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('fixed_dates','repeat_weekly','on_request')),
  fixed_dates TEXT[],
  days_of_week TEXT[],
  start_time TEXT,
  duration_hours DOUBLE PRECISION DEFAULT 0,
  lead_time_days INT DEFAULT 0,

  group_size_max INT DEFAULT 0,
  languages TEXT[],

  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person','per_group','free','exchange')),
  price_per_person DOUBLE PRECISION,
  price_per_group DOUBLE PRECISION,
  group_included_size INT,
  host_offers TEXT,
  traveler_can_offer TEXT[],
  exchange_value_hint TEXT,

  includes TEXT[],
  excludes TEXT[],
  material_requirements TEXT[],
  accessibility_notes TEXT,
  age_restriction TEXT,
  cancellation_policy TEXT NOT NULL CHECK (cancellation_policy IN ('flexible','moderate','strict')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_cultural_services_user ON cultural_services(user_id);
CREATE INDEX IF NOT EXISTS ix_cultural_services_city ON cultural_services(city);
CREATE INDEX IF NOT EXISTS ix_cultural_services_created ON cultural_services(created_at DESC);

-- cultural_service_bookings
CREATE TABLE IF NOT EXISTS cultural_service_bookings (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT NOT NULL REFERENCES cultural_services(id) ON DELETE CASCADE,
  vendor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  traveler_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','declined','cancelled')),
  chosen_date TEXT,
  participants INT NOT NULL CHECK (participants > 0),
  message TEXT,

  price_snapshot DOUBLE PRECISION,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person','per_group','free','exchange')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_csb_vendor   ON cultural_service_bookings(vendor_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_csb_traveler ON cultural_service_bookings(traveler_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_csb_service  ON cultural_service_bookings(service_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_csb_service_user_date
ON cultural_service_bookings(service_id, traveler_id, chosen_date)
WHERE status IN ('pending','confirmed') AND chosen_date IS NOT NULL;
-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('booking_request', 'booking_confirmed', 'booking_declined', 'booking_cancelled', 'new_message', 'follow_request', 'system')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id BIGINT,
  related_type VARCHAR(50) CHECK (related_type IN ('booking', 'service', 'message', 'post', 'user')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
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
