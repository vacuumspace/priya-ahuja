import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseEnrollments, services as servicesTable } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { checkReferralCode } from "@/lib/workshop-referral"
import { COURSE_GIFT_SERVICE_SLUG } from "@/lib/courses-data"

// Tells the booking form whether the signed-in user has a free brainstorm
// session waiting from a fully paid course, so it can apply it without them
// typing a code. redeem-gift re-runs the same check - this is only a preview.
export async function GET(req: NextRequest) {
  const session = await auth()
  const serviceSlug = req.nextUrl.searchParams.get("serviceSlug")
  if (!session?.user?.id || serviceSlug !== COURSE_GIFT_SERVICE_SLUG) {
    return NextResponse.json({ giftCode: null })
  }

  const [enrollment] = await db
    .select({ giftCode: courseEnrollments.giftCode })
    .from(courseEnrollments)
    .where(and(eq(courseEnrollments.userId, session.user.id), eq(courseEnrollments.status, "paid")))
    .limit(1)
  if (!enrollment?.giftCode) return NextResponse.json({ giftCode: null })

  const [service] = await db
    .select({ price: servicesTable.price })
    .from(servicesTable)
    .where(eq(servicesTable.slug, serviceSlug))
    .limit(1)
  if (!service) return NextResponse.json({ giftCode: null })

  // Already used, or otherwise not valid any more -> nothing to apply.
  const check = await checkReferralCode(enrollment.giftCode, { slug: serviceSlug, price: service.price })
  return NextResponse.json({ giftCode: check.ok ? enrollment.giftCode : null })
}
