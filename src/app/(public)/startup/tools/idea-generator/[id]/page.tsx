import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import IdeaGeneratorClient from "./IdeaGeneratorClient"

export const metadata = { title: "Personalised Startup Idea Generator" }

type Props = { params: Promise<{ id: string }> }

export default async function IdeaGeneratorReportPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect("/startup/tools/idea-generator")

  const { id } = await params

  const [row] = await db
    .select()
    .from(ideaGenReports)
    .where(and(eq(ideaGenReports.id, id), eq(ideaGenReports.userId, session.user.id)))
    .limit(1)
  if (!row) notFound()

  return (
    <div className="min-h-screen bg-cream py-8 px-4 md:py-10 md:px-8">
      <IdeaGeneratorClient
        id={row.id}
        status={row.status}
        currentStep={row.currentStep}
        // Answers are only ever sent back to the browser while still editable
        // (status = "answering"). Once locked, they never leave the server again.
        answers={row.status === "answering" ? (row.answers as Record<string, string | string[]>) : {}}
      />
    </div>
  )
}
