CREATE TABLE "course_gifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_slug" varchar(80) NOT NULL,
	"purchaser_id" text NOT NULL,
	"purchaser_name" text NOT NULL,
	"purchaser_email" text NOT NULL,
	"recipient_name" text,
	"message" text,
	"token" varchar(64) NOT NULL,
	"price_paise" integer NOT NULL,
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"amount_paid" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"redeemed_by_id" text,
	"redeemed_by_email" text,
	"redeemed_at" timestamp,
	"enrollment_id" uuid,
	"link_email_sent" boolean DEFAULT false NOT NULL,
	"admin_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_gifts_token_unique" UNIQUE("token"),
	CONSTRAINT "course_gifts_razorpay_order_id_unique" UNIQUE("razorpay_order_id")
);
--> statement-breakpoint
ALTER TABLE "course_gifts" ADD CONSTRAINT "course_gifts_purchaser_id_users_id_fk" FOREIGN KEY ("purchaser_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_gifts" ADD CONSTRAINT "course_gifts_redeemed_by_id_users_id_fk" FOREIGN KEY ("redeemed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
