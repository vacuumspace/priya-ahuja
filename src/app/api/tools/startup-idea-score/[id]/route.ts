import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupIdeaScores } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [row] = await db
    .select({
      id: startupIdeaScores.id,
      totalScore: startupIdeaScores.totalScore,
      pillarScores: startupIdeaScores.pillarScores,
      answers: startupIdeaScores.answers,
    })
    .from(startupIdeaScores)
    .where(and(eq(startupIdeaScores.id, id), eq(startupIdeaScores.userId, session.user.id)))
    .limit(1)

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(row)
}
