import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores } from "@/lib/db/schema"
import {
  computeTotal,
  computePillarScores,
  getScoreBand,
  type Answers,
} from "@/lib/startup-score-data"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const answers: Answers = body.answers

  const totalScore = computeTotal(answers)
  const pillarScores = computePillarScores(answers)
  const band = getScoreBand(totalScore)

  const [row] = await db
    .insert(startupScores)
    .values({
      userId: session.user.id,
      answers,
      totalScore,
      pillarScores,
      scoreBand: band.label,
    })
    .returning({ id: startupScores.id })

  return NextResponse.json({ id: row.id, totalScore, pillarScores, scoreBand: band.label })
}
