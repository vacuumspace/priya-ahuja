CREATE TABLE "ai_feed_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(32) NOT NULL,
	"external_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"summary" text,
	"category_tag" varchar(32),
	"metric_label" varchar(64),
	"published_at" timestamp,
	"starred" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_feed_items_source_external_id_unique" UNIQUE("source","external_id")
);
