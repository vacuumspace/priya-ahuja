import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const [gift] = await db.select().from(courseGifts).where(eq(courseGifts.id, id)).limit(1)
  if (!gift || gift.purchaserId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only a still-unpaid checkout is cancelled - a paid gift is left alone.
  await db
    .update(courseGifts)
    .set({ status: "cancelled" })
    .where(and(eq(courseGifts.id, id), eq(courseGifts.status, "pending")))

  return NextResponse.json({ ok: true })
}
