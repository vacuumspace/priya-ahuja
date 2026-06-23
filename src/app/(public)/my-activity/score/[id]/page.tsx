import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import ScoreResultClient from "./ScoreResultClient"
import type { OptionValue } from "@/lib/startup-score-data"

type Props = { params: Promise<{ id: string }> }

export default async function ScoreDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect("/my-activity")

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

  if (!row) notFound()

  return (
    <div className="min-h-screen bg-cream py-6 px-4 md:py-8 md:px-8">
      <ScoreResultClient
        id={row.id}
        totalScore={row.totalScore}
        pillarScores={row.pillarScores as Record<number, { earned: number; max: number }>}
        answers={row.answers as Record<number, OptionValue>}
      />
    </div>
  )
}
