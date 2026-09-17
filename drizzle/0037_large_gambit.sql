ALTER TABLE "workshop_registrations" DROP CONSTRAINT "workshop_registrations_workshop_id_workshops_id_fk";
--> statement-breakpoint
ALTER TABLE "workshop_registrations" ADD CONSTRAINT "workshop_registrations_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workshop_registrations_active_unique" ON "workshop_registrations" USING btree ("workshop_id","user_id") WHERE "workshop_registrations"."status" <> 'cancelled';