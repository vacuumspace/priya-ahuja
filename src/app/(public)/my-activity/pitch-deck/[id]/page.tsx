import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pitchDeckAnalyses } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import PitchDeckReportPageClient from "./PitchDeckReportPageClient"
import type { PitchDeckReport } from "@/lib/pitch-deck-report"

export const metadata = { title: "Pitch Deck Analysis Report" }

type Props = { params: Promise<{ id: string }> }

export default async function PitchDeckReportPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect("/my-activity")

  const { id } = await params

  const [row] = await db
    .select({
      id: pitchDeckAnalyses.id,
      fileName: pitchDeckAnalyses.fileName,
      report: pitchDeckAnalyses.report,
    })
    .from(pitchDeckAnalyses)
    .where(and(eq(pitchDeckAnalyses.id, id), eq(pitchDeckAnalyses.userId, session.user.id)))
    .limit(1)

  if (!row) notFound()

  return (
    <div className="min-h-screen bg-cream py-6 px-4 md:py-8 md:px-8">
      <PitchDeckReportPageClient report={row.report as PitchDeckReport} fileName={row.fileName} />
    </div>
  )
}
