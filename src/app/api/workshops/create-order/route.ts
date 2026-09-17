import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshops, workshopRegistrations } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq, and, notInArray } from "drizzle-orm"
import { finalizeWorkshopRegistration } from "@/lib/finalize-workshop-registration"
import { WORKSHOP_STAGES, WORKSHOP_SECTORS } from "@/lib/workshop-form-options"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_STAGES = new Set(WORKSHOP_STAGES.map((s) => s.value))
const VALID_SECTORS = new Set(WORKSHOP_SECTORS.map((s) => s.value))

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const { workshopSlug, name, stage, sector } = body

    if (!workshopSlug || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (!VALID_STAGES.has(stage)) {
      return NextResponse.json({ error: "Select a valid stage" }, { status: 400 })
    }
    if (!VALID_SECTORS.has(sector)) {
      return NextResponse.json({ error: "Select a valid sector" }, { status: 400 })
    }

    // Signed-in users register under their verified account email - a
    // submitted email is only used for guest (no-account) checkout, so it
    // can't be spoofed to register someone else while tied to your own account.
    let userId: string | null = null
    let userEmail: string

    if (session?.user?.id && session.user.email) {
      userId = session.user.id
      userEmail = session.user.email
    } else {
      const email = typeof body.email === "string" ? body.email.trim() : ""
      if (!email || !EMAIL_PATTERN.test(email)) {
        return NextResponse.json({ error: "A valid email is required" }, { status: 400 })
      }
      userEmail = email
    }

    const [workshop] = await db
      .select()
      .from(workshops)
      .where(eq(workshops.slug, workshopSlug))
      .limit(1)

    if (!workshop || !workshop.isActive) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    const [existing] = await db
      .select()
      .from(workshopRegistrations)
      .where(and(
        eq(workshopRegistrations.workshopId, workshop.id),
        eq(workshopRegistrations.userEmail, userEmail),
        notInArray(workshopRegistrations.status, ["cancelled"]),
      ))
      .limit(1)

    if (existing) {
      return NextResponse.json({ error: "You already have a registration for this workshop" }, { status: 409 })
    }

    const adminUser = userId ? isAdmin(session?.user?.email) : false

    // Admin bypass, matching the pitch-deck-analyser pattern: skip Razorpay
    // entirely, register directly with no order/payment ids (a clear signal
    // this was a free admin test, not a real registration), and skip the
    // confirmation emails so admin doesn't get "New Registration" mail about
    // their own test - but still run the calendar invite + perk grant so the
    // rest of the flow can actually be tested end to end.
    if (adminUser) {
      let registration: typeof workshopRegistrations.$inferSelect
      try {
        [registration] = await db.insert(workshopRegistrations).values({
          workshopId: workshop.id,
          userId,
          userName: name,
          userEmail,
          stage,
          sector,
          status: "confirmed",
        }).returning()
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
          return NextResponse.json({ error: "You already have a registration for this workshop" }, { status: 409 })
        }
        throw err
      }

      const { meetLink } = await finalizeWorkshopRegistration(registration, workshop, { sendEmail: false })

      return NextResponse.json({
        skipPayment: true,
        registrationId: registration.id,
        meetLink,
      })
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: workshop.price,
      currency: "INR",
      receipt: `workshop_${Date.now()}`,
    })

    let registration: { id: string }
    try {
      [registration] = await db.insert(workshopRegistrations).values({
        workshopId: workshop.id,
        userId,
        userName: name,
        userEmail,
        stage,
        sector,
        razorpayOrderId: order.id,
        status: "pending",
      }).returning({ id: workshopRegistrations.id })
    } catch (err: unknown) {
      // Two concurrent submits can both pass the select-based check above -
      // the partial unique index on (workshop_id, user_email) is the real guard.
      if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
        return NextResponse.json({ error: "You already have a registration for this workshop" }, { status: 409 })
      }
      throw err
    }

    return NextResponse.json({
      orderId: order.id,
      amount: workshop.price,
      keyId: process.env.RAZORPAY_KEY_ID,
      registrationId: registration.id,
    })
  } catch (err) {
    console.error("workshop create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
