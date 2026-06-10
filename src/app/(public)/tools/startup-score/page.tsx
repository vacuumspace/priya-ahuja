import { auth } from "@/lib/auth"
import StartupScoreClient from "./StartupScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupScorePage() {
  const session = await auth()
  return (
    <StartupScoreClient
      userEmail={session?.user?.email ?? null}
      userName={session?.user?.name ?? ""}
    />
  )
}
