import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { IDEA_GEN_QUESTIONS } from "@/lib/idea-generator-questions"

type Body = { questionId?: string; value?: string | string[]; step?: number }

// Saves one answer and the current wizard step. Only allowed while the
// report is still in "answering" - once submitted, answers are frozen and
// this route refuses further writes.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const { questionId, value, step } = body
  if (!questionId || !IDEA_GEN_QUESTIONS.some((q) => q.id === questionId)) {
    return NextResponse.json({ error: "Unknown question" }, { status: 400 })
  }

  const [row] = await db
    .select({ id: ideaGenReports.id, status: ideaGenReports.status, answers: ideaGenReports.answers })
    .from(ideaGenReports)
    .where(and(eq(ideaGenReports.id, id), eq(ideaGenReports.userId, session.user.id)))
    .limit(1)
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (row.status !== "answering") {
    return NextResponse.json({ error: "Answers are locked" }, { status: 409 })
  }

  const answers = { ...(row.answers as Record<string, unknown>), [questionId]: value }
  await db
    .update(ideaGenReports)
    .set(typeof step === "number" ? { answers, currentStep: step } : { answers })
    .where(eq(ideaGenReports.id, id))

  return NextResponse.json({ ok: true })
}
