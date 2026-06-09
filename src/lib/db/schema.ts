import { pgTable, text, integer, boolean, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

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
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | paid | completed | cancelled
  meetLink: text("meet_link"),
  adminNotes: text("admin_notes"),
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
  downloadToken: text("download_token").unique(),
  tokenExpiresAt: timestamp("token_expires_at"),
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
})

// Auth.js tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
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
