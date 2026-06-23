import type { Config } from "drizzle-kit"

const url = (process.env.DATABASE_URL ?? "").replace("sslmode=require", "sslmode=verify-full")

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config
