// Grants a startup-score / idea-score unlock for a Razorpay payment that was
// captured but never recorded (paid before tool_unlocks existed, or the
// buyer's browser died mid-quiz). Verifies the payment against the Razorpay
// API first.
//
// Usage: npx tsx scripts/backfill-tool-unlock.ts <tool> <razorpay_payment_id> [user_email]
//   tool: "startup-score" | "startup-idea-score"
// If user_email is omitted, the email on the Razorpay payment is used.

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { and, eq, or } from "drizzle-orm"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { users, startupScores, startupIdeaScores, toolUnlocks } from "../src/lib/db/schema"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { users, startupScores, startupIdeaScores, toolUnlocks } })

async function main() {
  const [tool, paymentId, emailArg] = process.argv.slice(2)
  if ((tool !== "startup-score" && tool !== "startup-idea-score") || !paymentId?.startsWith("pay_")) {
    console.error("Usage: npx tsx scripts/backfill-tool-unlock.ts <startup-score|startup-idea-score> <razorpay_payment_id> [user_email]")
    process.exit(1)
  }

  const authHeader = "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: { Authorization: authHeader } })
  if (!res.ok) {
    console.error(`Razorpay payment fetch failed (${res.status}):`, await res.text())
    process.exit(1)
  }
  const payment = await res.json() as { id: string; order_id: string; amount: number; status: string; email?: string; refund_status?: string | null }
  console.log(`Payment ${payment.id}: order=${payment.order_id} amount=₹${payment.amount / 100} status=${payment.status} refund_status=${payment.refund_status} email=${payment.email}`)

  if (payment.status !== "captured") {
    console.error(`Refusing to backfill: payment status is "${payment.status}", not "captured".`)
    process.exit(1)
  }
  if (payment.refund_status) {
    console.error(`Refusing to backfill: payment has refund_status "${payment.refund_status}".`)
    process.exit(1)
  }

  const email = (emailArg ?? payment.email ?? "").toLowerCase()
  if (!email) {
    console.error("No email on the payment - pass the user's email as the third argument.")
    process.exit(1)
  }
  const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email)).limit(1)
  if (!user) {
    console.error(`No user found with email ${email}`)
    process.exit(1)
  }

  const resultsTable = tool === "startup-score" ? startupScores : startupIdeaScores
  const [usedResult] = await db
    .select({ id: resultsTable.id })
    .from(resultsTable)
    .where(eq(resultsTable.razorpayPaymentId, paymentId))
    .limit(1)
  if (usedResult) {
    console.error(`This payment already produced a ${tool} result ${usedResult.id} - nothing to backfill.`)
    process.exit(1)
  }

  const [existingUnlock] = await db
    .select({ id: toolUnlocks.id, status: toolUnlocks.status })
    .from(toolUnlocks)
    .where(or(eq(toolUnlocks.razorpayOrderId, payment.order_id), eq(toolUnlocks.razorpayPaymentId, paymentId)))
    .limit(1)
  if (existingUnlock) {
    if (existingUnlock.status === "pending") {
      await db
        .update(toolUnlocks)
        .set({ status: "paid", razorpayPaymentId: paymentId, amountPaise: payment.amount })
        .where(and(eq(toolUnlocks.id, existingUnlock.id), eq(toolUnlocks.status, "pending")))
      console.log(`Marked existing unlock ${existingUnlock.id} as paid.`)
    } else {
      console.log(`Unlock ${existingUnlock.id} already exists with status "${existingUnlock.status}" - nothing to do.`)
    }
    return
  }

  const [row] = await db
    .insert(toolUnlocks)
    .values({
      tool,
      userId: user.id,
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: paymentId,
      amountPaise: payment.amount,
      status: "paid",
    })
    .returning({ id: toolUnlocks.id })

  console.log(`Done. Unlock ${row.id} created for ${user.email} - they can now take the ${tool} quiz without paying again.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
