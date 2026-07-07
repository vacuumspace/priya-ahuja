import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, priyaGptMessages, users } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db
    .select({
      id: priyaGptSessions.id,
      userId: priyaGptSessions.userId,
      userName: users.name,
      userEmail: users.email,
      startedAt: priyaGptSessions.startedAt,
      expiresAt: priyaGptSessions.expiresAt,
      rating: priyaGptSessions.rating,
      messageCount: sql<number>`count(${priyaGptMessages.id})`,
      blocked: users.priyaGptBlocked,
      blockedReason: users.priyaGptBlockedReason,
      blockedBy: users.priyaGptBlockedBy,
    })
    .from(priyaGptSessions)
    .leftJoin(users, eq(priyaGptSessions.userId, users.id))
    .leftJoin(priyaGptMessages, eq(priyaGptMessages.sessionId, priyaGptSessions.id))
    .groupBy(priyaGptSessions.id, users.name, users.email, priyaGptSessions.rating, users.priyaGptBlocked, users.priyaGptBlockedReason, users.priyaGptBlockedBy)
    .orderBy(desc(priyaGptSessions.startedAt))

  return Response.json({
    sessions: rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      startedAt: r.startedAt.toISOString(),
      expiresAt: r.expiresAt.toISOString(),
      rating: r.rating,
      messageCount: Number(r.messageCount),
      blocked: r.blocked ?? false,
      blockedReason: r.blockedReason,
      blockedBy: r.blockedBy,
    })),
  })
}
