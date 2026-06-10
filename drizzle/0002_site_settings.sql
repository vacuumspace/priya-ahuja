CREATE TABLE IF NOT EXISTS "site_settings" (
  "key" varchar(100) PRIMARY KEY,
  "value" text NOT NULL
);

INSERT INTO "site_settings" ("key", "value") VALUES ('live', 'true') ON CONFLICT DO NOTHING;
