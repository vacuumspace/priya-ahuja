import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const visibility: string = body.visibility === "public" ? "public" : "private"
  const journalDisplayName: string | undefined = typeof body.journalDisplayName === "string" ? body.journalDisplayName.trim() : undefined

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, session.user.id))

  const displayName = journalDisplayName || profile?.journalDisplayName
  if (visibility === "public" && !displayName) {
    return NextResponse.json({ error: "Pick a display name before making your journal public." }, { status: 400 })
  }

  const data: { journalVisibility: string; journalDisplayName?: string; updatedAt: Date } = {
    journalVisibility: visibility,
    updatedAt: new Date(),
  }
  if (journalDisplayName) data.journalDisplayName = journalDisplayName

  await db
    .insert(userProfiles)
    .values({ userId: session.user.id, ...data })
    .onConflictDoUpdate({ target: userProfiles.userId, set: data })

  return NextResponse.json({ ok: true, visibility, journalDisplayName: displayName })
}
