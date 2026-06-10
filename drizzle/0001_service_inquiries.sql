CREATE TABLE "service_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"budget" varchar(50),
	"project_description" text NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
