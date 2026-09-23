import { pgTable, text, integer, boolean, timestamp, uuid, varchar, jsonb, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

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
  confirmationEmailSent: boolean("confirmation_email_sent").notNull().default(false),
  // Workshop referral code applied at checkout (see workshop-referral.ts) and
  // the amount it took off, in paise. A code counts as redeemed while any
  // non-cancelled booking carries it.
  referralCode: varchar("referral_code", { length: 20 }),
  discountAmount: integer("discount_amount"),
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
  // platform-wide block - set only via the Users admin page; also blocks sign-in (see bannedIdentities). Separate from PriyaGPT chat blocking below.
  blocked: boolean("blocked").notNull().default(false),
  blockedReason: text("blocked_reason"),
  blockedAt: timestamp("blocked_at"),
  blockedBy: varchar("blocked_by", { length: 20 }), // "admin_ban"
  // PriyaGPT chat-only block - independent of the platform block above; sign-in still works.
  priyaGptBlocked: boolean("priya_gpt_blocked").notNull().default(false),
  priyaGptBlockedReason: text("priya_gpt_blocked_reason"),
  priyaGptBlockedAt: timestamp("priya_gpt_blocked_at"),
  priyaGptBlockedBy: varchar("priya_gpt_blocked_by", { length: 20 }), // "auto" | "admin"
  lastSeenIp: text("last_seen_ip"),
  createdAt: timestamp("created_at").defaultNow(),
})

// permanent signup ban list - only ever written by an explicit admin action, never by the
// auto-moderation classifier. Survives account deletion so a banned email/IP can't re-signup.
export const bannedIdentities = pgTable("banned_identities", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  ip: text("ip"),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  // Shown on the public "100 days" journal wall instead of the real Google
  // name/photo - set the first time a user makes their journal public.
  journalDisplayName: text("journal_display_name"),
  // Whole-journal setting, not per entry - "public" puts every non-flagged
  // entry on the wall, "private" hides all of them regardless of individual
  // entry content.
  journalVisibility: varchar("journal_visibility", { length: 10 }).notNull().default("private"),
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
  amountPaid: integer("amount_paid"), // paise actually captured; null for admin test runs
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
  amountPaid: integer("amount_paid"), // paise actually captured; null for admin test runs
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Personalised Startup Idea Generator. Pay-first (see tool_unlocks, tool =
// 'startup-idea-generator') - the wizard only unlocks after payment. Answers
// are write-once: editable while status = 'answering', then locked forever
// once submitted so the questions themselves stay a moat (never re-shown,
// never referenced in the generated report's own text).
export const ideaGenReports = pgTable("idea_gen_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("answering"), // answering | locked | ready | failed
  answers: jsonb("answers").notNull().default({}), // draft while answering; frozen at submit
  currentStep: integer("current_step").notNull().default(0),
  submittedAt: timestamp("submitted_at"),
  // Random 45-60min target set at submit time - purely a UI pacing device for
  // the progress bar, decoupled from how long Gemini actually takes.
  revealAt: timestamp("reveal_at"),
  report: jsonb("report"), // final IdeaGenReport JSON once generation finishes
  generationError: text("generation_error"),
  amountPaid: integer("amount_paid"), // paise actually captured
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const pitchDeckAnalyses = pgTable("pitch_deck_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileSizeBytes: integer("file_size_bytes"),
  totalScore: integer("total_score").notNull(),
  report: jsonb("report").notNull(), // full PitchDeckReport JSON from Gemini
  isPaid: boolean("is_paid").notNull().default(false),
  amountPaid: integer("amount_paid"), // paise actually captured; null for admin test runs
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// A paid-for pitch deck analysis credit. Created when the Razorpay order is
// created, marked "paid" on payment capture (client verify or webhook), and
// "consumed" when the analysis row is saved - so a captured payment survives
// a closed tab or failed upload and the user isn't asked to pay again.
export const pitchDeckUnlocks = pgTable("pitch_deck_unlocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending' | 'paid' | 'consumed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Same durable-payment pattern as pitch_deck_unlocks, shared by the quiz
// tools (fundability/startup score, idea score) where a long quiz sits
// between payment and the saved result.
export const toolUnlocks = pgTable("tool_unlocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  tool: varchar("tool", { length: 40 }).notNull(), // 'startup-score' | 'startup-idea-score'
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending' | 'paid' | 'consumed'
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

// Same durable-payment pattern as pitch_deck_unlocks/tool_unlocks. The gap
// here is smaller (minutes are credited by the same handler that gets the
// Razorpay success callback) but a lost network call or closed tab right
// after payment still left captured money with zero DB trace and no
// webhook safety net, since priya_gpt_time_transactions rows were only
// ever written from that one client-triggered call.
export const priyaGptTimeUnlocks = pgTable("priya_gpt_time_unlocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  minutes: integer("minutes").notNull(),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending' | 'paid' | 'consumed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const priyaGptTimeTransactions = pgTable("priya_gpt_time_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deltaMinutes: integer("delta_minutes").notNull(), // +/- minutes
  reason: varchar("reason", { length: 50 }).notNull(), // "purchase" | "session_start"
  amountPaise: integer("amount_paise"), // actual rupees paid, only set on "purchase" rows
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ── Pitch Deck - Story ───────────────────────────────────────────
// one row per user - a single continuous chat thread, not a series of discrete "sessions".
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

// ── School / Workshops ─────────────────────────────────────────────
// One shared Google Calendar event per workshop (created when the workshop
// itself is created, not per registration) - every registrant is added as an
// attendee to this same event/Meet link, with guestsCanSeeOtherGuests off so
// attendees can't see each other. See workshopRegistrations.calendarInviteSent.
export const workshops = pgTable("workshops", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM (IST)
  endTime: varchar("end_time", { length: 5 }).notNull(),     // HH:MM (IST)
  price: integer("price").notNull(), // in paise
  isActive: boolean("is_active").notNull().default(true),
  googleCalendarEventId: text("google_calendar_event_id"),
  meetLink: text("meet_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Same single-row payment lifecycle as bookings (pending -> confirmed ->
// cancelled) rather than the separate-unlock pattern used by pitch_deck_unlocks/
// tool_unlocks - registering is the delivered product itself (a calendar invite +
// confirmation email), there's no async "generate a result" step in between.
export const workshopRegistrations = pgTable("workshop_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  // No onDelete cascade here on purpose - a workshop with registrations
  // (i.e. sales/attendance history) must not be deletable out from under
  // them; the admin delete route surfaces the resulting FK error instead.
  workshopId: uuid("workshop_id").notNull().references(() => workshops.id),
  // Nullable - registering doesn't require an account (guest checkout, just
  // name + email). Set when the registrant is signed in, and backfilled
  // later if a guest's email signs in afterwards (see
  // linkGuestWorkshopRegistrations in workshop-perks.ts, called from the
  // auth signIn event) - userEmail is the durable identity here, not userId.
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  stage: varchar("stage", { length: 30 }),
  sector: varchar("sector", { length: 30 }),
  // Personal code for the workshop's "₹1000 off a 1:1" gift, shared across all
  // of one email's registrations (see ensureReferralCode).
  referralCode: varchar("referral_code", { length: 20 }),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaid: integer("amount_paid"), // actual captured amount in paise
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | confirmed | cancelled
  calendarInviteSent: boolean("calendar_invite_sent").notNull().default(false),
  confirmationEmailSent: boolean("confirmation_email_sent").notNull().default(false),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  // Guards against a double-submit race creating two live registrations for
  // the same person - only one non-cancelled row per (workshop, email) at a
  // time. Keyed on email rather than userId since a guest registration has
  // no userId at all, and email is the one identity guaranteed present
  // whether or not the registrant ever signs in.
  uniqueIndex("workshop_registrations_active_unique")
    .on(table.workshopId, table.userEmail)
    .where(sql`${table.status} <> 'cancelled'`),
])

// Placeholder testimonials for past workshops - hand-entered per workshop,
// not tied to an actual registration/review flow.
export const workshopFeedback = pgTable("workshop_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  workshopId: uuid("workshop_id").notNull().references(() => workshops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const serviceInquiries = pgTable("service_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 20 }).notNull(), // "tech" | "branding" | "consultancy"
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  budget: varchar("budget", { length: 50 }),
  projectDescription: text("project_description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new | reviewing | in-progress | closed
  adminNotes: text("admin_notes"),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// A person's enrolment in a course. Two possible payments on one row: the
// small pre-registration deposit that locks the founder price, and the
// balance paid once the course launches (or, for someone who never
// pre-registered, the full price paid in one go - same balance_* columns).
// Sign-in is required, so user_id is always present.
export const courseEnrollments = pgTable("course_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseSlug: varchar("course_slug", { length: 80 }).notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  // pending (order created, nothing paid) | preregistered | paid | cancelled
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // Total price this person owes, fixed when they enrol: the founder price if
  // they pre-registered in time, the list price otherwise.
  lockedPricePaise: integer("locked_price_paise").notNull(),
  preRegOrderId: text("pre_reg_order_id"),
  preRegPaymentId: text("pre_reg_payment_id"),
  preRegAmountPaid: integer("pre_reg_amount_paid"), // paise
  preRegisteredAt: timestamp("pre_registered_at"),
  balanceOrderId: text("balance_order_id"),
  balancePaymentId: text("balance_payment_id"),
  balanceAmountPaid: integer("balance_amount_paid"), // paise
  paidAt: timestamp("paid_at"),
  // Personal code for the free 1:1 brainstorm gift, issued once fully paid.
  giftCode: varchar("gift_code", { length: 20 }),
  preRegEmailSent: boolean("pre_reg_email_sent").notNull().default(false),
  enrolledEmailSent: boolean("enrolled_email_sent").notNull().default(false),
  // Admin-created test rows skip Razorpay entirely (no payment ids).
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("course_enrollments_active_unique")
    .on(table.courseSlug, table.userId)
    .where(sql`${table.status} <> 'cancelled'`),
  uniqueIndex("course_enrollments_gift_code_unique").on(table.giftCode),
])

// "100 days" daily-win journal. One row per user per calendar day within the
// fixed challenge window (see lib/daily-win-journal.ts) - late joiners can
// backfill any past day in that window, so entryDate is not tied to signup.
export const dailyWinEntries = pgTable("daily_win_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  entryDate: varchar("entry_date", { length: 10 }).notNull(), // YYYY-MM-DD
  points: text("points").array().notNull().default([]), // up to 3 one-liners, ≤180 chars each
  // Checked on every save (regardless of the journal's current public/private
  // setting) so a later switch to public never surfaces unmoderated
  // wording that was written while the journal was still private.
  moderationFlagged: boolean("moderation_flagged").notNull().default(false),
  // Null for every real, user-written entry (always visible once posted).
  // Only set by scripts/seed-synthetic-wall.ts, so a pre-loaded synthetic
  // entry doesn't appear on the public wall until this real-world instant -
  // see the scheduledAt filter in lib/journal-wall.ts.
  // withTimezone: true - a naive timestamp here gets misread by ~5:30h on any
  // machine/runtime whose local zone is IST (the pg driver parses the naive
  // string in local time), which silently unlocked synthetic posts early.
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("daily_win_entries_user_date_unique").on(table.userId, table.entryDate),
])

// A course bought as a gift. The purchaser pays in full and gets a one-time
// link (token); whoever opens it and signs in is enrolled as a normal, fully
// paid student. The gift row carries the payment, the redeemed enrolment
// carries none - so revenue is counted once, here.
export const courseGifts = pgTable("course_gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseSlug: varchar("course_slug", { length: 80 }).notNull(),
  purchaserId: text("purchaser_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  purchaserName: text("purchaser_name").notNull(),
  purchaserEmail: text("purchaser_email").notNull(),
  // Who the gift is for and the note on the card the purchaser sends them.
  recipientName: text("recipient_name"),
  message: text("message"),
  // The secret in the gift link.
  token: varchar("token", { length: 64 }).notNull().unique(),
  // What the purchaser was charged, fixed at purchase (offer price or list price).
  pricePaise: integer("price_paise").notNull(),
  razorpayOrderId: text("razorpay_order_id").unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaid: integer("amount_paid"), // paise actually captured
  // pending (order created) | paid (link is live) | redeemed | cancelled
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  redeemedById: text("redeemed_by_id").references(() => users.id, { onDelete: "set null" }),
  redeemedByEmail: text("redeemed_by_email"),
  redeemedAt: timestamp("redeemed_at"),
  enrollmentId: uuid("enrollment_id"),
  linkEmailSent: boolean("link_email_sent").notNull().default(false),
  adminSeen: boolean("admin_seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
