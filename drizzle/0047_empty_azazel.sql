ALTER TABLE "user_profiles" ADD COLUMN "journal_visibility" varchar(10) DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_win_entries" DROP COLUMN "visibility";