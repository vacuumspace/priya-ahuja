CREATE TABLE "idea_gen_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"status" varchar(20) DEFAULT 'answering' NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp,
	"reveal_at" timestamp,
	"report" jsonb,
	"generation_error" text,
	"amount_paid" integer,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"admin_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idea_gen_reports" ADD CONSTRAINT "idea_gen_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;