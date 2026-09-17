ALTER TABLE "workshop_registrations" ADD COLUMN "calendar_invite_sent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workshops" ADD COLUMN "google_calendar_event_id" text;--> statement-breakpoint
ALTER TABLE "workshops" ADD COLUMN "meet_link" text;