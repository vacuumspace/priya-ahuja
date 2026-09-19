import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseEnrollments } from "@/lib/db/schema"
import { verifyPaymentSignature, fetchRazorpayOrder } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { coursePaise, getCourse } from "@/lib/courses-data"
import { balanceDuePaise, confirmCoursePayment } from "@/lib/course-enrollment"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { enrollmentId, stage, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()
    if (!enrollmentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature || (stage !== "preregister" && stage !== "balance")) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const [enrollment] = await db.select().from(courseEnrollments).where(eq(courseEnrollments.id, enrollmentId)).limit(1)
    if (!enrollment) return NextResponse.json({ error: "Enrolment not found" }, { status: 404 })
    if (enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const expectedOrderId = stage === "preregister" ? enrollment.preRegOrderId : enrollment.balanceOrderId
    if (expectedOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 })
    }

    const alreadyRecorded = stage === "preregister" ? enrollment.preRegPaymentId : enrollment.balancePaymentId
    if (alreadyRecorded) {
      return NextResponse.json({ success: true, status: enrollment.status, giftCode: enrollment.giftCode })
    }

    if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      if (stage === "preregister" && enrollment.status === "pending") {
        await db.update(courseEnrollments).set({ status: "cancelled" }).where(eq(courseEnrollments.id, enrollment.id))
      }
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // The order's amount was fixed when it was created and Razorpay charges
    // exactly that, so this just reads back what was actually captured.
    const course = getCourse(enrollment.courseSlug)
    let amountPaid: number
    try {
      amountPaid = (await fetchRazorpayOrder(razorpayOrderId)).amount
    } catch (err) {
      console.error("Razorpay order fetch failed (continuing):", err)
      amountPaid = stage === "preregister"
        ? (course ? coursePaise(course).preRegister : 0)
        : balanceDuePaise(enrollment) || enrollment.lockedPricePaise
    }

    const confirmed = await confirmCoursePayment(enrollment, stage, razorpayPaymentId, amountPaid)
    return NextResponse.json({ success: true, status: confirmed.status, giftCode: confirmed.giftCode })
  } catch (err) {
    console.error("course verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
