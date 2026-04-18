CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id BIGINT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  units TEXT NOT NULL
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id BIGINT UNIQUE NOT NULL,
  athlete_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  distance DOUBLE PRECISION,
  moving_time INT,
  elapsed_time INT,
  elevation DOUBLE PRECISION,
  sport TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  date_local TIMESTAMPTZ NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT
);

-- Strava Tokens
CREATE TABLE strava_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_activities_athlete_id ON activities(athlete_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);