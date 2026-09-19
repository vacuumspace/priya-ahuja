import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { cardVersion, tidy, tidyMessage, validateCardMessage, validateCardName } from "@/lib/gift-card"
import { giftCardUrl } from "@/lib/course-gift"

// Edits what is printed on the gift card - allowed by the buyer until the
// receiver claims the gift. After that the card is locked.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { id } = await params
    const [gift] = await db.select().from(courseGifts).where(eq(courseGifts.id, id)).limit(1)
    if (!gift || gift.purchaserId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (gift.status === "redeemed") {
      return NextResponse.json({ error: "This gift has been claimed, so its card can't be changed" }, { status: 409 })
    }
    if (gift.status !== "paid") {
      return NextResponse.json({ error: "This gift isn't ready yet" }, { status: 409 })
    }

    const { fromName, recipientName, message } = await req.json()
    const from = tidy(fromName)
    const recipient = tidy(recipientName)
    const note = tidyMessage(message)
    const problem =
      validateCardName(from, "your name") ?? validateCardName(recipient, "the name of the person you're gifting") ?? validateCardMessage(note)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    // The status check in the WHERE keeps a claim that lands mid-edit from being overwritten.
    const [updated] = await db
      .update(courseGifts)
      .set({ purchaserName: from, recipientName: recipient, message: note || null })
      .where(and(eq(courseGifts.id, id), eq(courseGifts.status, "paid")))
      .returning()
    if (!updated) {
      return NextResponse.json({ error: "This gift has been claimed, so its card can't be changed" }, { status: 409 })
    }

    const version = cardVersion(updated)
    return NextResponse.json({
      success: true,
      recipientName: updated.recipientName,
      message: updated.message,
      purchaserName: updated.purchaserName,
      version,
      cardUrl: giftCardUrl(updated.token, version, ""),
    })
  } catch (err) {
    console.error("course gift edit error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
