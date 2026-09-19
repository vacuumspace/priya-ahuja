ALTER TABLE "workshop_registrations" ADD COLUMN "referral_code" varchar(20);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "referral_code" varchar(20);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "discount_amount" integer;
