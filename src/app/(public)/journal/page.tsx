import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { dailyWinEntries, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { LogIn } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { JournalClient } from "./JournalClient"
import { getWallEntries } from "@/lib/journal-wall"
import { clampWallDate } from "@/lib/daily-win-journal"

export const metadata = {
  title: "100 days journal",
  robots: { index: false, follow: false }, // personal page - the public wall is the indexable one
}

export default async function JournalPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn size={40} className="text-peach-dark mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-800 text-ink mb-2">sign in to start your 100 days</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            record your daily wins as a founder - free, one line a day, 100 days.
          </p>
          <SignInOptions callbackUrl="/journal" />
        </div>
      </div>
    )
  }

  const wallDate = clampWallDate(undefined)

  const [entries, [profile], wallEntries] = await Promise.all([
    db.select().from(dailyWinEntries).where(eq(dailyWinEntries.userId, session.user.id)),
    db.select().from(userProfiles).where(eq(userProfiles.userId, session.user.id)),
    getWallEntries(wallDate),
  ])

  return (
    <JournalClient
      entries={entries.map((e) => ({ date: e.entryDate, points: e.points, moderationFlagged: e.moderationFlagged }))}
      journalDisplayName={profile?.journalDisplayName ?? ""}
      accountName={session.user.name ?? ""}
      journalVisibility={(profile?.journalVisibility as "public" | "private") ?? "private"}
      wallEntries={wallEntries}
      wallDate={wallDate}
    />
  )
}
