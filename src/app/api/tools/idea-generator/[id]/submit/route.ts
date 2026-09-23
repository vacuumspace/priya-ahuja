import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { generateIdeaGenReport, randomRevealMinutes } from "@/lib/idea-generator"
import { IDEA_GEN_QUESTIONS, type IdeaGenAnswers } from "@/lib/idea-generator-questions"

// Guards against double-triggering the same report's generation twice within
// this running process (e.g. a second poll-driven retry while the first
// call's promise is still in flight). Doesn't survive a process restart -
// if the server restarts mid-generation, a later /submit call on the same
// row will legitimately kick off a fresh run.
const inFlight = new Set<string>()

async function runGeneration(id: string, answers: IdeaGenAnswers) {
  inFlight.add(id)
  try {
    const report = await generateIdeaGenReport(answers)
    await db.update(ideaGenReports).set({ status: "ready", report, generationError: null }).where(eq(ideaGenReports.id, id))
  } catch (err) {
    console.error(`idea-generator report ${id} failed:`, err)
    await db.update(ideaGenReports).set({ generationError: err instanceof Error ? err.message : "generation failed" }).where(eq(ideaGenReports.id, id))
  } finally {
    inFlight.delete(id)
  }
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const requiredMissing = IDEA_GEN_QUESTIONS.some((q) => {
      if (q.optional) return false
      const v = (row.answers as Record<string, unknown>)[q.id]
      return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)
    })
    if (requiredMissing) {
      return NextResponse.json({ error: "Please answer all required questions" }, { status: 400 })
    }

    const revealAt = new Date(Date.now() + randomRevealMinutes() * 60_000)
    await db.update(ideaGenReports).set({ status: "locked", submittedAt: new Date(), revealAt }).where(eq(ideaGenReports.id, id))
    void runGeneration(id, row.answers as IdeaGenAnswers)
    return NextResponse.json({ ok: true })
  }

  if (row.status === "locked" && !row.report && !inFlight.has(id)) {
    // Retry path - generation failed or was lost to a process restart.
    void runGeneration(id, row.answers as IdeaGenAnswers)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
