ALTER TABLE "purchases" ADD COLUMN "admin_seen" boolean NOT NULL DEFAULT false;
ALTER TABLE "startup_scores" ADD COLUMN "admin_seen" boolean NOT NULL DEFAULT false;
ALTER TABLE "startup_idea_scores" ADD COLUMN "admin_seen" boolean NOT NULL DEFAULT false;
