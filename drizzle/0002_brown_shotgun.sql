CREATE TABLE "blocked_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10) NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "startup_idea_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"pillar_scores" jsonb NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availability_config" ADD COLUMN "min_days_offset" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_messages" ADD COLUMN "admin_read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "amount_paid" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "feedback_rating" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "feedback_text" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "msg_email_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "reschedule_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "admin_seen" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "amount_paid" integer;--> statement-breakpoint
ALTER TABLE "startup_idea_scores" ADD CONSTRAINT "startup_idea_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;