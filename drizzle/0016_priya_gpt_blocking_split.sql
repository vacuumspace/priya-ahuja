ALTER TABLE "users" ADD COLUMN "priya_gpt_blocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "priya_gpt_blocked_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "priya_gpt_blocked_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "priya_gpt_blocked_by" varchar(20);--> statement-breakpoint
-- migrate existing chat-only blocks (mistakenly stored in the platform "blocked" field) over
-- to the new PriyaGPT-only fields, and clear them from the platform field.
UPDATE "users"
SET "priya_gpt_blocked" = true,
    "priya_gpt_blocked_reason" = "blocked_reason",
    "priya_gpt_blocked_at" = "blocked_at",
    "priya_gpt_blocked_by" = CASE WHEN "blocked_by" = 'admin_block' THEN 'admin' ELSE "blocked_by" END
WHERE "blocked" = true AND "blocked_by" IN ('auto', 'admin_block');
--> statement-breakpoint
UPDATE "users"
SET "blocked" = false, "blocked_reason" = NULL, "blocked_at" = NULL, "blocked_by" = NULL
WHERE "blocked_by" IN ('auto', 'admin_block');
