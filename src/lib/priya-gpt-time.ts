import { db } from "@/lib/db"
import { priyaGptTimeBalances, priyaGptTimeTransactions } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function getMinutesBalance(userId: string): Promise<number> {
  const [row] = await db
    .select({ minutesRemaining: priyaGptTimeBalances.minutesRemaining })
    .from(priyaGptTimeBalances)
    .where(eq(priyaGptTimeBalances.userId, userId))
    .limit(1)
  return row?.minutesRemaining ?? 0
}

// neon-http has no transaction support, so balance updates use an atomic upsert instead of read-then-write
export async function addMinutes(
  userId: string,
  minutes: number,
  meta: { amountPaise?: number | null; razorpayOrderId?: string | null; razorpayPaymentId?: string | null; reason?: string }
): Promise<number> {
  const [row] = await db
    .insert(priyaGptTimeBalances)
    .values({ userId, minutesRemaining: minutes })
    .onConflictDoUpdate({
      target: priyaGptTimeBalances.userId,
      set: { minutesRemaining: sql`${priyaGptTimeBalances.minutesRemaining} + ${minutes}`, updatedAt: new Date() },
    })
    .returning({ minutesRemaining: priyaGptTimeBalances.minutesRemaining })

  await db.insert(priyaGptTimeTransactions).values({
    userId,
    deltaMinutes: minutes,
    reason: meta.reason ?? "purchase",
    amountPaise: meta.amountPaise ?? null,
    razorpayOrderId: meta.razorpayOrderId ?? null,
    razorpayPaymentId: meta.razorpayPaymentId ?? null,
  })

  return row.minutesRemaining
}

export class InsufficientTimeError extends Error {
  constructor() {
    super("Insufficient time balance")
  }
}

export async function spendMinutes(userId: string, minutes: number, reason: string): Promise<number> {
  // atomic conditional update: only deducts if balance covers it, avoiding overdraw without a transaction/row lock
  const [row] = await db
    .update(priyaGptTimeBalances)
    .set({ minutesRemaining: sql`${priyaGptTimeBalances.minutesRemaining} - ${minutes}`, updatedAt: new Date() })
    .where(sql`${priyaGptTimeBalances.userId} = ${userId} and ${priyaGptTimeBalances.minutesRemaining} >= ${minutes}`)
    .returning({ minutesRemaining: priyaGptTimeBalances.minutesRemaining })

  if (!row) {
    throw new InsufficientTimeError()
  }

  await db.insert(priyaGptTimeTransactions).values({
    userId,
    deltaMinutes: -minutes,
    reason,
  })

  return row.minutesRemaining
}
