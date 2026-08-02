CREATE TABLE "priya_gpt_time_unlocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"minutes" integer NOT NULL,
	"razorpay_order_id" text NOT NULL,
	"razorpay_payment_id" text,
	"amount_paise" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "priya_gpt_time_unlocks_razorpay_order_id_unique" UNIQUE("razorpay_order_id")
);
--> statement-breakpoint
ALTER TABLE "priya_gpt_time_unlocks" ADD CONSTRAINT "priya_gpt_time_unlocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
