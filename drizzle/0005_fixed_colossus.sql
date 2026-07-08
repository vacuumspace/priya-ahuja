CREATE TABLE "wellbeing_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"category_scores" jsonb NOT NULL,
	"admin_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wellbeing_scores" ADD CONSTRAINT "wellbeing_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;