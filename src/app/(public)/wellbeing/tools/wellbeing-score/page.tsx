import { auth } from "@/lib/auth"
import WellbeingScoreClient from "./WellbeingScoreClient"

export const metadata = { title: "Founder Wellbeing Scorecard" }

export default async function WellbeingScorePage() {
  const session = await auth()
  const email = session?.user?.email ?? null
  return <WellbeingScoreClient userEmail={email} />
}
