/**
 * One-off: email everyone who has ever completed a paid transaction, letting
 * them know the main domain is in maintenance and the temp domain to use instead.
 *
 * Dry run (default) - just prints the recipient count and a sample:
 *   npx tsx scripts/send-maintenance-notice.ts
 *
 * Actually sends:
 *   npx tsx scripts/send-maintenance-notice.ts --send
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { isNotNull, inArray, eq, and } from "drizzle-orm"
import nodemailer from "nodemailer"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { bookings, purchases, pitchDeckUnlocks, toolUnlocks, priyaGptTimeUnlocks, users } from "../src/lib/db/schema"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const TEMP_DOMAIN = "https://priya.priyaahuja.in"
const SHOULD_SEND = process.argv.includes("--send")

async function collectRecipients(): Promise<Map<string, string>> {
  const recipients = new Map<string, string>() // lowercased email -> display name

  const add = (email: string | null | undefined, name: string | null | undefined) => {
    if (!email) return
    const key = email.trim().toLowerCase()
    if (!key || recipients.has(key)) return
    recipients.set(key, (name || "there").split(" ")[0])
  }

  const paidBookings = await db
    .select({ email: bookings.userEmail, name: bookings.userName })
    .from(bookings)
    .where(isNotNull(bookings.razorpayPaymentId))
  paidBookings.forEach((r) => add(r.email, r.name))

  const paidPurchases = await db
    .select({ email: purchases.userEmail, name: purchases.userName })
    .from(purchases)
    .where(isNotNull(purchases.razorpayPaymentId))
  paidPurchases.forEach((r) => add(r.email, r.name))

  const unlockTables = [pitchDeckUnlocks, toolUnlocks, priyaGptTimeUnlocks] as const
  for (const table of unlockTables) {
    const rows = await db
      .select({ email: users.email, name: users.name })
      .from(table)
      .innerJoin(users, eq(table.userId, users.id))
      .where(and(inArray(table.status, ["paid", "consumed"]), eq(users.blocked, false)))
    rows.forEach((r) => add(r.email, r.name))
  }

  return recipients
}

function buildEmailHtml(name: string): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;color:#2D2D2D">
      <p style="font-size:15px;margin:0 0 16px">Hi ${name},</p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px">
        priyaahuja.in is temporarily down for maintenance for the next couple of weeks.
      </p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px">
        To access your account or past purchases in the meantime, please use:<br/>
        <a href="${TEMP_DOMAIN}" style="color:#FFA07A;font-weight:600">${TEMP_DOMAIN}</a>
      </p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px">
        We'll let you know once the main site is back up.
      </p>
      <p style="font-size:14px;margin:24px 0 0">Priya</p>
    </div>
  `
}

async function main() {
  const recipients = await collectRecipients()
  console.log(`Found ${recipients.size} unique past buyers.`)

  if (!SHOULD_SEND) {
    const showAll = process.argv.includes("--list")
    console.log(showAll ? "Full recipient list:" : "Dry run - sample of up to 10 recipients:")
    let i = 0
    for (const [email, name] of recipients) {
      if (!showAll && i >= 10) break
      i++
      console.log(`  ${i}. ${email} (${name})`)
    }
    console.log("\nRe-run with --send to actually email everyone above.")
    return
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  })

  let sent = 0
  let failed = 0
  for (const [email, name] of recipients) {
    try {
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME ?? "Priya Ahuja"}" <${process.env.EMAIL_USER}>`,
        replyTo: process.env.EMAIL_USER,
        to: email,
        subject: "priyaahuja.in is temporarily under maintenance",
        html: buildEmailHtml(name),
      })
      sent++
    } catch (err) {
      failed++
      console.error(`Failed to send to ${email}:`, err)
    }
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log(`Done. Sent: ${sent}, Failed: ${failed}`)
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
