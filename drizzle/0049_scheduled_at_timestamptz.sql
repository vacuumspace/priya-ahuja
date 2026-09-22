ALTER TABLE "daily_win_entries" ALTER COLUMN "scheduled_at" SET DATA TYPE timestamptz USING "scheduled_at" AT TIME ZONE 'UTC';
