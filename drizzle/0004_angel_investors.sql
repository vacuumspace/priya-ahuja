CREATE TABLE "angel_investors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sno" integer NOT NULL,
  "name" text NOT NULL,
  "city" varchar(100) NOT NULL DEFAULT '',
  "state" varchar(100) NOT NULL DEFAULT '',
  "country" varchar(100) NOT NULL DEFAULT '',
  "linkedin" text NOT NULL DEFAULT '',
  "emails" text[] NOT NULL DEFAULT '{}',
  "created_at" timestamp NOT NULL DEFAULT now()
);
