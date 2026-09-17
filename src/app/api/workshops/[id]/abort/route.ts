import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshopRegistrations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [registration] = await db.select().from(workshopRegistrations).where(eq(workshopRegistrations.id, id)).limit(1)

  if (!registration || registration.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only abort pending registrations - if payment already went through, ignore
  if (registration.status !== "pending") {
    return NextResponse.json({ ok: true })
  }

  await db.update(workshopRegistrations).set({ status: "cancelled" }).where(eq(workshopRegistrations.id, id))

  return NextResponse.json({ ok: true })
}
