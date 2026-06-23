ALTER TABLE "booking_messages" ADD COLUMN "admin_read" boolean DEFAULT false NOT NULL;
-- Mark existing admin-sent messages as already read (admin wrote them, no need to re-read)
UPDATE "booking_messages" SET "admin_read" = true WHERE "is_admin" = true;
