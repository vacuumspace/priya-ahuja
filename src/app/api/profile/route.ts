import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userProfiles, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))

  return NextResponse.json({ profile: profile ?? null })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  const allowed = [
    "phone", "bio", "location", "website",
    "businessName", "businessType", "industry", "stage",
    "businessDescription", "businessWebsite",
    "instagramHandle", "linkedinUrl", "twitterHandle",
  ] as const

  const data: Record<string, string | null> = {}
  for (const key of allowed) {
    if (key in body) {
      const val = body[key]
      data[key] = typeof val === "string" && val.trim() !== "" ? val.trim() : null
    }
  }

  await db
    .insert(userProfiles)
    .values({ userId: session.user.id, ...data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...data, updatedAt: new Date() },
    })

  return NextResponse.json({ ok: true })
}
