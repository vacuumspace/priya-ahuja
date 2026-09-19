import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseEnrollments } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const [enrollment] = await db.select().from(courseEnrollments).where(eq(courseEnrollments.id, id)).limit(1)
  if (!enrollment || enrollment.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only a still-unpaid checkout is cancelled - if the payment already went
  // through, or this was just a balance attempt on a pre-registration, ignore.
  await db
    .update(courseEnrollments)
    .set({ status: "cancelled" })
    .where(and(eq(courseEnrollments.id, id), eq(courseEnrollments.status, "pending")))

  return NextResponse.json({ ok: true })
}
