import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { dailyWinEntries, userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { JournalClient } from "./JournalClient"
import { getWallEntries } from "@/lib/journal-wall"
import { clampWallDate } from "@/lib/daily-win-journal"

export const metadata = {
  title: "100 days journal",
  robots: { index: false, follow: false }, // personal page - the public wall is the indexable one
}

export default async function JournalPage() {
  const session = await auth()
  const wallDate = clampWallDate(undefined)

  if (!session?.user?.id) {
    const wallEntries = await getWallEntries(wallDate)
    return (
      <JournalClient
        entries={[]}
        journalDisplayName=""
        accountName=""
        journalVisibility="private"
        wallEntries={wallEntries}
        wallDate={wallDate}
        isSignedIn={false}
      />
    )
  }

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
      isSignedIn={true}
    />
  )
}
