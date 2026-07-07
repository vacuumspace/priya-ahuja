import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bannedIdentities, sessions, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Platform-level ban: blocks sign-in entirely (checked in the NextAuth signIn/session
// callbacks), not just PriyaGPT chat. Deliberate, manual admin action only.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.insert(bannedIdentities).values({
    email: user.email,
    ip: user.lastSeenIp,
    reason: "Banned by admin",
  })

  await db
    .update(users)
    .set({ blocked: true, blockedReason: "Banned by admin", blockedAt: new Date(), blockedBy: "admin_ban" })
    .where(eq(users.id, id))

  // invalidate any active session immediately, don't wait for it to expire
  await db.delete(sessions).where(eq(sessions.userId, id))

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (user.email) {
    await db.delete(bannedIdentities).where(eq(bannedIdentities.email, user.email))
  }
  await db
    .update(users)
    .set({ blocked: false, blockedReason: null, blockedAt: null, blockedBy: null })
    .where(eq(users.id, id))

  return NextResponse.json({ ok: true })
}
