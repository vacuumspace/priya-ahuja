import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshopRegistrations, workshops } from "@/lib/db/schema"
import { eq, desc, and, notInArray } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  await db
    .update(workshopRegistrations)
    .set({ adminSeen: true })
    .where(and(eq(workshopRegistrations.adminSeen, false), notInArray(workshopRegistrations.status, ["cancelled", "pending"])))

  const rows = await db
    .select({
      id: workshopRegistrations.id,
      userName: workshopRegistrations.userName,
      userEmail: workshopRegistrations.userEmail,
      stage: workshopRegistrations.stage,
      sector: workshopRegistrations.sector,
      status: workshopRegistrations.status,
      amountPaid: workshopRegistrations.amountPaid,
      razorpayPaymentId: workshopRegistrations.razorpayPaymentId,
      calendarInviteSent: workshopRegistrations.calendarInviteSent,
      createdAt: workshopRegistrations.createdAt,
      workshopId: workshopRegistrations.workshopId,
      workshopTitle: workshops.title,
    })
    .from(workshopRegistrations)
    .leftJoin(workshops, eq(workshopRegistrations.workshopId, workshops.id))
    .where(notInArray(workshopRegistrations.status, ["pending", "cancelled"]))
    .orderBy(desc(workshopRegistrations.createdAt))

  const serialized = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return Response.json(serialized)
}
