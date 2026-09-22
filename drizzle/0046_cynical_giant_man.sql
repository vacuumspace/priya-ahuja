CREATE TABLE "daily_win_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"entry_date" varchar(10) NOT NULL,
	"points" text[] DEFAULT '{}' NOT NULL,
	"visibility" varchar(10) DEFAULT 'private' NOT NULL,
	"moderation_flagged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "journal_display_name" text;--> statement-breakpoint
ALTER TABLE "daily_win_entries" ADD CONSTRAINT "daily_win_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_win_entries_user_date_unique" ON "daily_win_entries" USING btree ("user_id","entry_date");
