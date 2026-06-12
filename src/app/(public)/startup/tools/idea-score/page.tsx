import { auth, isAdmin } from "@/lib/auth"
import StartupIdeaScoreClient from "./StartupIdeaScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupIdeaScorePage() {
  const session = await auth()
  const email = session?.user?.email ?? null
  return (
    <StartupIdeaScoreClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
    />
  )
}
