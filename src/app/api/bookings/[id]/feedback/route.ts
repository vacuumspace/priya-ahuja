import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  }

  const { id } = await params
  const { rating, text } = await req.json()

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 })
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (booking.userEmail !== session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (booking.status !== "completed") return NextResponse.json({ error: "Session not completed" }, { status: 400 })

  await db
    .update(bookings)
    .set({ feedbackRating: rating, feedbackText: text || null })
    .where(eq(bookings.id, id))

  return NextResponse.json({ success: true })
}
