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
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

ALTER TABLE group_members
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','removed'));

CREATE TABLE IF NOT EXISTS group_invites (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  inviter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending', 'accepted', 'declined', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, invitee_id)
);

-- Add inviter_id column if it doesn't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'group_invites' 
    AND column_name = 'inviter_id'
  ) THEN
    ALTER TABLE group_invites
      ADD COLUMN inviter_id BIGINT REFERENCES users(id) ON DELETE CASCADE;
    
    -- Update existing NULL values to admin_id from groups table
    UPDATE group_invites gi
    SET inviter_id = g.admin_id
    FROM groups g
    WHERE gi.group_id = g.id AND gi.inviter_id IS NULL;
    
    -- Make it NOT NULL after populating values
    ALTER TABLE group_invites
      ALTER COLUMN inviter_id SET NOT NULL;
  END IF;
END$$;
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id ON group_invites(invitee_id);

-- group polls
CREATE TABLE IF NOT EXISTS group_polls (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_group_polls_group_id ON group_polls(group_id);

CREATE TABLE IF NOT EXISTS group_poll_votes (
  id BIGSERIAL PRIMARY KEY,
  poll_id BIGINT NOT NULL REFERENCES group_polls(id) ON DELETE CASCADE,
  voter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, voter_id)
);
CREATE INDEX IF NOT EXISTS idx_group_poll_votes_poll_id ON group_poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_group_poll_votes_voter_id ON group_poll_votes(voter_id);

-- group polls
CREATE TABLE IF NOT EXISTS group_polls (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_group_polls_group_id ON group_polls(group_id);

CREATE TABLE IF NOT EXISTS group_poll_votes (
  id BIGSERIAL PRIMARY KEY,
  poll_id BIGINT NOT NULL REFERENCES group_polls(id) ON DELETE CASCADE,
  voter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, voter_id)
);
CREATE INDEX IF NOT EXISTS idx_group_poll_votes_poll_id ON group_poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_group_poll_votes_voter_id ON group_poll_votes(voter_id);

-- group plans (trip plans)
CREATE TABLE IF NOT EXISTS group_plans (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  budget TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_group_plans_group_id ON group_plans(group_id);
CREATE INDEX IF NOT EXISTS idx_group_plans_creator_id ON group_plans(creator_id);
CREATE INDEX IF NOT EXISTS idx_group_plans_status ON group_plans(status);

-- group plan comments
CREATE TABLE IF NOT EXISTS group_plan_comments (
  id BIGSERIAL PRIMARY KEY,
  plan_id BIGINT NOT NULL REFERENCES group_plans(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_group_plan_comments_plan_id ON group_plan_comments(plan_id);
CREATE INDEX IF NOT EXISTS idx_group_plan_comments_user_id ON group_plan_comments(user_id);

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
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id BIGINT,
  related_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update notifications table CHECK constraints (create if not exists, update if needed)
DO $$
DECLARE
  constraint_name text;
  constraint_def text;
  has_new_types boolean;
BEGIN
  -- Only proceed if notifications table exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications') THEN
    -- Handle type constraint
    -- First, check if notifications_type_check already exists and has new types
    has_new_types := false;
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'notifications'::regclass 
      AND conname = 'notifications_type_check'
    ) THEN
      -- Get the constraint definition to check if it has new types
      SELECT pg_get_constraintdef(oid) INTO constraint_def
      FROM pg_constraint
      WHERE conrelid = 'notifications'::regclass 
      AND conname = 'notifications_type_check';
      
      -- Check if it contains the new notification types
      has_new_types := constraint_def LIKE '%group_poll_created%';
    END IF;
    
    -- If constraint doesn't exist or doesn't have new types, update it
    IF NOT has_new_types THEN
      -- Drop the specific constraint by name if it exists
      BEGIN
        ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
      EXCEPTION WHEN OTHERS THEN
        -- Ignore errors if constraint doesn't exist
        NULL;
      END;
      
      -- Drop any other type-related constraints (in case they have different names)
      FOR constraint_name IN
        SELECT conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'notifications'
          AND c.contype = 'c'
          AND c.conname != 'notifications_type_check'
          AND pg_get_constraintdef(c.oid) LIKE '%type IN%'
          AND pg_get_constraintdef(c.oid) NOT LIKE '%group_poll_created%'
      LOOP
        BEGIN
          EXECUTE format('ALTER TABLE notifications DROP CONSTRAINT IF EXISTS %I', constraint_name);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
      END LOOP;
      
      -- Add new type constraint (only if it doesn't exist)
      BEGIN
        ALTER TABLE notifications 
        ADD CONSTRAINT notifications_type_check 
        CHECK (type IN ('booking_request', 'booking_confirmed', 'booking_declined', 'booking_cancelled', 'new_message', 'follow_request', 'system', 'group_invite', 'group_member_joined', 'group_poll_created', 'group_poll_voted'));
      EXCEPTION WHEN duplicate_object THEN
        -- Constraint already exists, skip
        NULL;
      WHEN OTHERS THEN
        -- Other error, skip
        NULL;
      END;
    END IF;
    
    -- Handle related_type constraint
    has_new_types := false;
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'notifications'::regclass 
      AND conname = 'notifications_related_type_check'
    ) THEN
      SELECT pg_get_constraintdef(oid) INTO constraint_def
      FROM pg_constraint
      WHERE conrelid = 'notifications'::regclass 
      AND conname = 'notifications_related_type_check';
      
      has_new_types := constraint_def LIKE '%group%';
    END IF;
    
    -- If constraint doesn't exist or doesn't have 'group', update it
    IF NOT has_new_types THEN
      -- Drop the specific constraint by name if it exists
      BEGIN
        ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_related_type_check;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
      
      -- Drop any other related_type constraints
      FOR constraint_name IN
        SELECT conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'notifications'
          AND c.contype = 'c'
          AND c.conname != 'notifications_related_type_check'
          AND pg_get_constraintdef(c.oid) LIKE '%related_type%'
          AND pg_get_constraintdef(c.oid) NOT LIKE '%group%'
      LOOP
        BEGIN
          EXECUTE format('ALTER TABLE notifications DROP CONSTRAINT IF EXISTS %I', constraint_name);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
      END LOOP;
      
      -- Add new related_type constraint
      BEGIN
        ALTER TABLE notifications 
        ADD CONSTRAINT notifications_related_type_check 
        CHECK (related_type IN ('booking', 'service', 'message', 'post', 'user', 'group') OR related_type IS NULL);
      EXCEPTION WHEN duplicate_object THEN
        NULL;
      WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore any errors during migration
    NULL;
END$$;

CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
-- Booking-specific conversations (separate from community chat)
CREATE TABLE IF NOT EXISTS booking_conversations (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES cultural_service_bookings(id) ON DELETE CASCADE,
    traveler_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES cultural_services(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id)
);

-- Booking chat messages
CREATE TABLE IF NOT EXISTS booking_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES booking_conversations(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS social_auths (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'facebook', 'apple', etc.
    provider_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id),
    UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_social_auths_user ON social_auths(user_id);
CREATE INDEX IF NOT EXISTS idx_social_auths_provider ON social_auths(provider, provider_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_booking_conversations_booking ON booking_conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_conversations_traveler ON booking_conversations(traveler_id);
CREATE INDEX IF NOT EXISTS idx_booking_conversations_vendor ON booking_conversations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_booking_messages_conversation ON booking_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_booking_messages_sender ON booking_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_booking_messages_created ON booking_messages(created_at DESC);


-- Main emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    parent_city VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_24_7 BOOLEAN DEFAULT true,
    notes TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- City mappings (tourist destinations → major cities)
CREATE TABLE IF NOT EXISTS city_mappings (
    id SERIAL PRIMARY KEY,
    tourist_destination VARCHAR(100) NOT NULL,
    major_city VARCHAR(100) NOT NULL,
    distance_km INTEGER,
    travel_time_hours DECIMAL(3,1),
    notes TEXT,
    UNIQUE(tourist_destination, major_city)
);
-- Categories reference
CREATE TABLE IF NOT EXISTS emergency_categories (
    id SERIAL PRIMARY KEY,
    category_key VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    priority INTEGER DEFAULT 0,
    description TEXT
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_emergency_city ON emergency_contacts(city);
CREATE INDEX IF NOT EXISTS idx_emergency_parent_city ON emergency_contacts(parent_city);
CREATE INDEX IF NOT EXISTS idx_emergency_category ON emergency_contacts(category);
CREATE INDEX IF NOT EXISTS idx_city_mappings_dest ON city_mappings(tourist_destination);
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
