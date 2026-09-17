DROP INDEX "workshop_registrations_active_unique";--> statement-breakpoint
ALTER TABLE "workshop_registrations" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "workshop_registrations_active_unique" ON "workshop_registrations" USING btree ("workshop_id","user_email") WHERE "workshop_registrations"."status" <> 'cancelled';