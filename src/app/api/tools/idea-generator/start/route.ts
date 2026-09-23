import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports, toolUnlocks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { sendPurchaseWelcome } from "@/lib/mailer"

// Consumes a paid unlock and creates the draft answer row. If the user
// already has an unfinished draft (closed tab mid-wizard), resume it instead
// of consuming another unlock or creating a duplicate. Admins skip the
// payment requirement entirely - same "admin test run" pattern as the other
// paid tools (amountPaid null, no razorpay ids, no purchase email).
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id
  const adminUser = isAdmin(session.user.email)

  const [existingDraft] = await db
    .select({ id: ideaGenReports.id })
    .from(ideaGenReports)
    .where(and(eq(ideaGenReports.userId, userId), eq(ideaGenReports.status, "answering")))
    .limit(1)
  if (existingDraft) {
    return NextResponse.json({ id: existingDraft.id })
  }

  if (adminUser) {
    const [row] = await db
      .insert(ideaGenReports)
      .values({ userId })
      .returning({ id: ideaGenReports.id })
    return NextResponse.json({ id: row.id })
  }

  const [unlock] = await db
    .select()
    .from(toolUnlocks)
    .where(and(
      eq(toolUnlocks.userId, userId),
      eq(toolUnlocks.tool, "startup-idea-generator"),
      eq(toolUnlocks.status, "paid"),
    ))
    .limit(1)
  if (!unlock) {
    return NextResponse.json({ error: "Payment required", paymentRequired: true }, { status: 400 })
  }

  const [row] = await db
    .insert(ideaGenReports)
    .values({
      userId,
      amountPaid: unlock.amountPaise,
      razorpayOrderId: unlock.razorpayOrderId,
      razorpayPaymentId: unlock.razorpayPaymentId,
    })
    .returning({ id: ideaGenReports.id })

  await db.update(toolUnlocks).set({ status: "consumed" }).where(eq(toolUnlocks.id, unlock.id))

  if (session.user.email) {
    sendPurchaseWelcome({
      to: session.user.email,
      name: session.user.name ?? "there",
      productSlug: "startup-idea-generator",
      productName: "Personalised Startup Idea Generator",
    }).catch((err) => console.error("sendPurchaseWelcome idea-generator error:", err))
  }

  return NextResponse.json({ id: row.id })
}
