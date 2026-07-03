import { pgTable, text, integer, boolean, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core"

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: integer("price").notNull(), // in paise (₹100 = 10000)
  originalPrice: integer("original_price"), // for showing strikethrough
  durationMin: integer("duration_min"), // null for async (Priority DM)
  type: varchar("type", { length: 20 }).notNull().default("call"), // call | dm | report
  tag: varchar("tag", { length: 50 }).notNull().default("general"),
  highlights: text("highlights").array().notNull().default([]),
  whoIsItFor: text("who_is_it_for"),
  acceptsDeckLink: boolean("accepts_deck_link").notNull().default(false),
  deckLinkLabel: text("deck_link_label"),
  deckLinkPlaceholder: text("deck_link_placeholder"),
  urgencyNote: text("urgency_note"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id").notNull().references(() => services.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM
  endTime: varchar("end_time", { length: 5 }).notNull(), // HH:MM
  isBooked: boolean("is_booked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id").notNull().references(() => services.id),
  slotId: uuid("slot_id").references(() => availability.id),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  message: text("message"), // for Priority DM
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaid: integer("amount_paid"), // actual captured amount in paise
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | paid | confirmed | completed | cancelled
  meetLink: text("meet_link"),
  googleCalendarEventId: text("google_calendar_event_id"),
  adminNotes: text("admin_notes"),
  feedbackRating: integer("feedback_rating"), // 1–5
  feedbackText: text("feedback_text"),
  msgEmailEnabled: boolean("msg_email_enabled").notNull().default(true),
  rescheduleCount: integer("reschedule_count").notNull().default(0),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const bookingMessages = pgTable("booking_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  body: text("body").notNull(),
  adminRead: boolean("admin_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const digitalProducts = pgTable("digital_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  tag: varchar("tag", { length: 50 }).notNull().default("template"),
  price: integer("price").notNull(), // in paise
  fileUrl: text("file_url"), // Vercel Blob URL
  previewImageUrl: text("preview_image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => digitalProducts.id),
  userEmail: text("user_email").notNull(),
  userName: text("user_name").notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaid: integer("amount_paid"), // actual captured amount in paise
  downloadToken: text("download_token").unique(),
  tokenExpiresAt: timestamp("token_expires_at"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  publishedAt: timestamp("published_at"),
  isPublished: boolean("is_published").notNull().default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const availabilitySchedule = pgTable("availability_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM
  endTime: varchar("end_time", { length: 5 }).notNull(),     // HH:MM
  isActive: boolean("is_active").notNull().default(false),
})

export const availabilityConfig = pgTable("availability_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  daysAhead: integer("days_ahead").notNull().default(14),
  minDaysOffset: integer("min_days_offset").notNull().default(0),
})

export const blockedPeriods = pgTable("blocked_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  startDate: varchar("start_date", { length: 10 }).notNull(), // YYYY-MM-DD
  endDate: varchar("end_date", { length: 10 }).notNull(),     // YYYY-MM-DD inclusive
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
})

// Auth.js tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
})

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
})

export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  // Basic details
  phone: text("phone"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  // Business details
  businessName: text("business_name"),
  businessType: varchar("business_type", { length: 50 }), // founder | freelancer | agency | other
  industry: text("industry"),
  stage: varchar("stage", { length: 50 }), // idea | pre-revenue | revenue | scaling
  businessDescription: text("business_description"),
  businessWebsite: text("business_website"),
  instagramHandle: text("instagram_handle"),
  linkedinUrl: text("linkedin_url"),
  twitterHandle: text("twitter_handle"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const startupScores = pgTable("startup_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  answers: jsonb("answers").notNull(),
  totalScore: integer("total_score").notNull(),
  pillarScores: jsonb("pillar_scores").notNull(),
  scoreBand: text("score_band").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})


export const startupIdeaScores = pgTable("startup_idea_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  answers: jsonb("answers").notNull(),
  totalScore: integer("total_score").notNull(),
  pillarScores: jsonb("pillar_scores").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 30 }).notNull(), // 'pageview' | 'cta_click'
  page: varchar("page", { length: 200 }),
  ctaId: varchar("cta_id", { length: 100 }),
  sessionId: varchar("session_id", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const customRequests = pgTable("custom_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  source: varchar("source", { length: 100 }), // which page they submitted from
  status: varchar("status", { length: 20 }).notNull().default("new"), // new | reviewed | closed
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ── PriyaGPT time balance (replaces the old money wallet) ─────────
export const priyaGptTimeBalances = pgTable("priya_gpt_time_balances", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  minutesRemaining: integer("minutes_remaining").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const priyaGptTimeTransactions = pgTable("priya_gpt_time_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deltaMinutes: integer("delta_minutes").notNull(), // +/- minutes
  reason: varchar("reason", { length: 50 }).notNull(), // "purchase" | "session_start"
  amountPaise: integer("amount_paise"), // actual rupees paid, only set on "purchase" rows
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ── Pitch Deck — Story ───────────────────────────────────────────
// one row per user — a single continuous chat thread, not a series of discrete "sessions".
// expiresAt/pausedAt just track the metered time window; running out doesn't end the chat,
// it just requires more minutes to keep the countdown going on the same thread.
export const priyaGptSessions = pgTable("priya_gpt_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  pausedAt: timestamp("paused_at"), // set while the user has paused the timer; expiresAt shifts forward by the pause duration on resume
  rating: integer("rating"), // 1-5, most recent rating the user gave
  ratingFeedback: text("rating_feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const priyaGptMessages = pgTable("priya_gpt_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => priyaGptSessions.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const serviceInquiries = pgTable("service_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 20 }).notNull(), // "tech" | "branding"
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  budget: varchar("budget", { length: 50 }),
  projectDescription: text("project_description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new | reviewing | in-progress | closed
  adminNotes: text("admin_notes"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
