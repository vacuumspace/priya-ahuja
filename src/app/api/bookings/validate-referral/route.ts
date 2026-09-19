import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { checkReferralCode } from "@/lib/workshop-referral"

// Lets the booking form show the discount as soon as a code is entered.
// create-order re-runs the same check, so this is a preview, not the guard.
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { serviceSlug, referralCode } = await req.json()
    if (!serviceSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [service] = await db
      .select({ price: servicesTable.price, isActive: servicesTable.isActive })
      .from(servicesTable)
      .where(eq(servicesTable.slug, serviceSlug))
      .limit(1)
    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const check = await checkReferralCode(referralCode, service.price)
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 })
    }

    return NextResponse.json({
      code: check.code,
      discountPaise: check.discountPaise,
      payablePaise: service.price - check.discountPaise,
    })
  } catch (err) {
    console.error("validate-referral error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
