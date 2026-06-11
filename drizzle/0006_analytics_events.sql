CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" varchar(30) NOT NULL,
  "page" varchar(200),
  "cta_id" varchar(100),
  "session_id" varchar(100),
  "created_at" timestamp DEFAULT now() NOT NULL
);
