import { auth, isAdmin } from "@/lib/auth"
import StartupScoreClient from "./StartupScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupScorePage() {
  const session = await auth()
  const email = session?.user?.email ?? null
  return (
    <StartupScoreClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
    />
  )
}
