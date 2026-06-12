import { auth, isAdmin } from "@/lib/auth"
import StartupScoreClient from "@/app/(public)/tools/startup-score/StartupScoreClient"

export const metadata = { title: "Startup Fundability Score" }

export default async function FundabilityScorePage() {
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
