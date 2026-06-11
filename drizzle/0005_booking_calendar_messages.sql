ALTER TABLE "bookings" ADD COLUMN "google_calendar_event_id" text;

CREATE TABLE "booking_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "booking_id" uuid NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
  "sender_email" text NOT NULL,
  "sender_name" text NOT NULL,
  "is_admin" boolean NOT NULL DEFAULT false,
  "body" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);
