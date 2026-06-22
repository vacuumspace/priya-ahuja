-- Unique constraints on razorpay_payment_id across all payment tables.
-- Postgres treats each NULL as distinct, so existing NULL rows are unaffected.
CREATE UNIQUE INDEX IF NOT EXISTS bookings_razorpay_payment_id_unique
  ON "bookings" ("razorpay_payment_id")
  WHERE "razorpay_payment_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS purchases_razorpay_payment_id_unique
  ON "purchases" ("razorpay_payment_id")
  WHERE "razorpay_payment_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS startup_scores_razorpay_payment_id_unique
  ON "startup_scores" ("razorpay_payment_id")
  WHERE "razorpay_payment_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS startup_idea_scores_razorpay_payment_id_unique
  ON "startup_idea_scores" ("razorpay_payment_id")
  WHERE "razorpay_payment_id" IS NOT NULL;
