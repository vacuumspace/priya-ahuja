CREATE TABLE IF NOT EXISTS "user_profiles" (
  "user_id" text PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "phone" text,
  "bio" text,
  "location" text,
  "website" text,
  "business_name" text,
  "business_type" varchar(50),
  "industry" text,
  "stage" varchar(50),
  "business_description" text,
  "business_website" text,
  "instagram_handle" text,
  "linkedin_url" text,
  "twitter_handle" text,
  "updated_at" timestamp NOT NULL DEFAULT now()
);
