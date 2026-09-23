import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { STAGE_LABELS, type IdeaGenReportData } from "@/lib/idea-generator"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  const [row] = await db
    .select()
    .from(ideaGenReports)
    .where(and(eq(ideaGenReports.id, id), eq(ideaGenReports.userId, session.user.id)))
    .limit(1)
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (row.status === "answering") {
    return NextResponse.json({ status: "answering" })
  }

  const isReady = row.status === "ready" && !!row.report
  const submittedAt = row.submittedAt ? new Date(row.submittedAt).getTime() : Date.now()
  const revealAt = row.revealAt ? new Date(row.revealAt).getTime() : submittedAt
  const now = Date.now()
  const target = Math.max(revealAt - submittedAt, 1)
  const elapsed = now - submittedAt

  // Progress bar is purely time-paced against the random reveal target -
  // decoupled from whether the real report is actually done generating yet.
  const progressPct = Math.min(99, Math.round((elapsed / target) * 100))
  const overdue = now > revealAt + 15 * 60_000 // 15 min grace past target with nothing to show

  if (isReady && now >= revealAt) {
    return NextResponse.json({
      status: "ready",
      progressPct: 100,
      report: row.report as IdeaGenReportData,
    })
  }

  if (row.generationError && overdue) {
    return NextResponse.json({ status: "failed", progressPct })
  }

  // progressPct stays purely time-paced even after the real report is
  // done (isReady) - it must never leak how fast Gemini actually finished.
  const stageIdx = Math.min(STAGE_LABELS.length - 1, Math.floor((progressPct / 100) * STAGE_LABELS.length))

  return NextResponse.json({
    status: "processing",
    progressPct,
    stageLabel: STAGE_LABELS[stageIdx],
  })
}
