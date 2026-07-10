CREATE TABLE "pitch_deck_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size_bytes" integer,
	"total_score" integer NOT NULL,
	"report" jsonb NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"admin_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pitch_deck_analyses" ADD CONSTRAINT "pitch_deck_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
