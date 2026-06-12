import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [row] = await db
    .select({
      id: startupScores.id,
      totalScore: startupScores.totalScore,
      pillarScores: startupScores.pillarScores,
      answers: startupScores.answers,
    })
    .from(startupScores)
    .where(and(eq(startupScores.id, id), eq(startupScores.userId, session.user.id)))
    .limit(1)

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(row)
}
