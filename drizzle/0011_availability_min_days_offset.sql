ALTER TABLE "availability_config" ADD COLUMN IF NOT EXISTS "min_days_offset" integer NOT NULL DEFAULT 0;
