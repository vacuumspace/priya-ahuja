// Gives every confirmed workshop registration that predates referral codes its
// personal code (one per email, matching ensureReferralCode). Idempotent -
// re-running only touches registrations that still have no code.
//
// Dry run by default (.env.local is the prod DB); pass --apply to write.
//   npx tsx scripts/backfill-referral-codes.ts
//   npx tsx scripts/backfill-referral-codes.ts --apply
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshopRegistrations } from "../src/lib/db/schema"
import { and, eq, isNull, isNotNull } from "drizzle-orm"
import { randomInt } from "crypto"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { workshopRegistrations } })

const apply = process.argv.includes("--apply")

// Keep in sync with src/lib/workshop-referral.ts
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
function generateCode() {
  let suffix = ""
  for (let i = 0; i < 6; i++) suffix += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  return suffix
}

async function backfill() {
  const missing = await db
    .select({ id: workshopRegistrations.id, userEmail: workshopRegistrations.userEmail })
    .from(workshopRegistrations)
    .where(and(eq(workshopRegistrations.status, "confirmed"), isNull(workshopRegistrations.referralCode)))

  const existing = await db
    .select({ userEmail: workshopRegistrations.userEmail, referralCode: workshopRegistrations.referralCode })
    .from(workshopRegistrations)
    .where(isNotNull(workshopRegistrations.referralCode))

  const codeByEmail = new Map<string, string>()
  const usedCodes = new Set<string>()
  for (const r of existing) {
    codeByEmail.set(r.userEmail, r.referralCode!)
    usedCodes.add(r.referralCode!)
  }

  console.log(`${missing.length} confirmed registration(s) without a code${apply ? "" : " (dry run)"}`)

  for (const reg of missing) {
    let code = codeByEmail.get(reg.userEmail)
    if (!code) {
      do { code = generateCode() } while (usedCodes.has(code))
      usedCodes.add(code)
      codeByEmail.set(reg.userEmail, code)
    }
    console.log(`${apply ? "✓" : "-"} ${reg.userEmail} -> ${code}`)
    if (apply) {
      await db.update(workshopRegistrations).set({ referralCode: code }).where(eq(workshopRegistrations.id, reg.id))
    }
  }

  console.log(apply ? "\nDone." : "\nDry run only - re-run with --apply to write.")
}

backfill().catch((err) => { console.error(err); process.exit(1) })
