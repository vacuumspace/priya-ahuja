import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupIdeaScores } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import IdeaScoreResultClient from "./IdeaScoreResultClient"
import type { OptionValue } from "@/lib/startup-idea-score-data"

type Props = { params: Promise<{ id: string }> }

export default async function IdeaScoreDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect("/my-activity")

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

  if (!row) notFound()

  return (
    <div className="min-h-screen bg-cream py-6 px-4 md:py-8 md:px-8">
      <IdeaScoreResultClient
        id={row.id}
        totalScore={row.totalScore}
        pillarScores={row.pillarScores as Record<number, { earned: number; max: number }>}
        answers={row.answers as Record<number, OptionValue>}
      />
    </div>
  )
}
