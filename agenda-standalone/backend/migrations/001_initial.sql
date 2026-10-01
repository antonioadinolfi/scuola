CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub text UNIQUE NOT NULL,
  email text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_time time,
  timezone text NOT NULL DEFAULT 'Europe/Rome',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Generale',
  priority text NOT NULL DEFAULT 'media'
    CHECK (priority IN ('bassa','media','alta')),
  status text NOT NULL DEFAULT 'aperto'
    CHECK (status IN ('aperto','completato','annullato')),
  reminder_minutes integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_user_date
  ON events(user_id,event_date,event_time);
