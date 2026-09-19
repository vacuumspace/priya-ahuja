import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { redeemGift } from "@/lib/course-gift"

// Claims a gift link for the signed-in person: they become a normal, fully
// paid student of the course.
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { token } = await req.json()
    if (typeof token !== "string" || !token) {
      return NextResponse.json({ error: "Missing gift link" }, { status: 400 })
    }

    const result = await redeemGift(token, {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || session.user.email.split("@")[0],
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

    return NextResponse.json({ success: true, courseSlug: result.courseSlug })
  } catch (err) {
    console.error("course gift redeem error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
