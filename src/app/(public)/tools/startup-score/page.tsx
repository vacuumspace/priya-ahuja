import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import StartupScoreClient from "./StartupScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupScorePage() {
  const session = await auth()
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/tools/startup-score")
  }
  return <StartupScoreClient userEmail={session.user?.email ?? ""} userName={session.user?.name ?? ""} />
}
