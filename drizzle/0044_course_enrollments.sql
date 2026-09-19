CREATE TABLE "course_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_slug" varchar(80) NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"user_email" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"locked_price_paise" integer NOT NULL,
	"pre_reg_order_id" text,
	"pre_reg_payment_id" text,
	"pre_reg_amount_paid" integer,
	"pre_registered_at" timestamp,
	"balance_order_id" text,
	"balance_payment_id" text,
	"balance_amount_paid" integer,
	"paid_at" timestamp,
	"gift_code" varchar(20),
	"pre_reg_email_sent" boolean DEFAULT false NOT NULL,
	"enrolled_email_sent" boolean DEFAULT false NOT NULL,
	"admin_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "course_enrollments_active_unique" ON "course_enrollments" USING btree ("course_slug","user_id") WHERE "course_enrollments"."status" <> 'cancelled';--> statement-breakpoint
CREATE UNIQUE INDEX "course_enrollments_gift_code_unique" ON "course_enrollments" USING btree ("gift_code");
