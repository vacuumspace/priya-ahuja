import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Manual chat-only block - same effect as the auto-classifier's block (disables PriyaGPT
// chatting), but admin-initiated. Does not touch sign-in/bannedIdentities; see the ban route
// for the platform-wide, sign-in-blocking action.
export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { userId } = await params
  await db
    .update(users)
    .set({ priyaGptBlocked: true, priyaGptBlockedReason: "Blocked by admin", priyaGptBlockedAt: new Date(), priyaGptBlockedBy: "admin" })
    .where(eq(users.id, userId))

  return Response.json({ ok: true })
}
