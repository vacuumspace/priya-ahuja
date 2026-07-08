import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { wellbeingScores } from "@/lib/db/schema"
import {
  computeWellbeingTotal,
  computeWellbeingCategoryScores,
  type Answers,
} from "@/lib/wellbeing-score-data"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { answers } = body as { answers: Answers }

  if (!answers) {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 })
  }

  const totalScore = computeWellbeingTotal(answers)
  const categoryScores = computeWellbeingCategoryScores(answers)

  const [row] = await db
    .insert(wellbeingScores)
    .values({
      userId: session.user.id,
      answers,
      totalScore,
      categoryScores,
    })
    .returning({ id: wellbeingScores.id })

  return NextResponse.json({ id: row.id, totalScore, categoryScores })
}
