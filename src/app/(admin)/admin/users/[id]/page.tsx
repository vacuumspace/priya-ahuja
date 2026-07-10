import { db } from "@/lib/db"
import { users, userProfiles, bookings, purchases, services as servicesTable, digitalProducts, priyaGptTimeBalances, priyaGptTimeTransactions, pitchDeckAnalyses, startupScores, startupIdeaScores } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UserDetailClient from "./UserDetailClient"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params

  const [user] = await db.select().from(users).where(eq(users.id, id))
  if (!user) notFound()

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, id))

  const [userBookings, userPurchases, [priyaGptBalanceRow], priyaGptTxns, userPitchDecks, userFundScores, userIdeaScores] = await Promise.all([
    db
      .select({ id: bookings.id, status: bookings.status, createdAt: bookings.createdAt, serviceTitle: servicesTable.title })
      .from(bookings)
      .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
      .where(eq(bookings.userEmail, user.email))
      .orderBy(desc(bookings.createdAt)),

    db
      .select({ id: purchases.id, createdAt: purchases.createdAt, productTitle: digitalProducts.title })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(purchases.userEmail, user.email))
      .orderBy(desc(purchases.createdAt)),

    db.select().from(priyaGptTimeBalances).where(eq(priyaGptTimeBalances.userId, id)).limit(1),

    db.select().from(priyaGptTimeTransactions).where(eq(priyaGptTimeTransactions.userId, id)).orderBy(desc(priyaGptTimeTransactions.createdAt)),

    db
      .select({ id: pitchDeckAnalyses.id, fileName: pitchDeckAnalyses.fileName, totalScore: pitchDeckAnalyses.totalScore, isPaid: pitchDeckAnalyses.isPaid, amountPaid: pitchDeckAnalyses.amountPaid, createdAt: pitchDeckAnalyses.createdAt })
      .from(pitchDeckAnalyses)
      .where(eq(pitchDeckAnalyses.userId, id))
      .orderBy(desc(pitchDeckAnalyses.createdAt)),

    db
      .select({ id: startupScores.id, totalScore: startupScores.totalScore, isPaid: startupScores.isPaid, createdAt: startupScores.createdAt })
      .from(startupScores)
      .where(eq(startupScores.userId, id))
      .orderBy(desc(startupScores.createdAt)),

    db
      .select({ id: startupIdeaScores.id, totalScore: startupIdeaScores.totalScore, isPaid: startupIdeaScores.isPaid, createdAt: startupIdeaScores.createdAt })
      .from(startupIdeaScores)
      .where(eq(startupIdeaScores.userId, id))
      .orderBy(desc(startupIdeaScores.createdAt)),
  ])

  return (
    <div className="px-10 py-10 max-w-3xl">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 font-sans text-sm text-ink/50 hover:text-ink transition-colors mb-6">
        <ArrowLeft size={14} />
        back to users
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">{user.name ?? user.email}</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{user.email}</p>
      </div>

      <UserDetailClient
        user={{ id: user.id, email: user.email, name: user.name ?? null, createdAt: user.createdAt ?? null }}
        profile={profile ?? null}
        bookings={userBookings.map((b) => ({ ...b, createdAt: new Date(b.createdAt) }))}
        purchases={userPurchases.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))}
        priyaGptMinutes={priyaGptBalanceRow?.minutesRemaining ?? 0}
        priyaGptTransactions={priyaGptTxns.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }))}
        pitchDecks={userPitchDecks.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }))}
        fundScores={userFundScores.map((s) => ({ ...s, createdAt: new Date(s.createdAt) }))}
        ideaScores={userIdeaScores.map((s) => ({ ...s, createdAt: new Date(s.createdAt) }))}
      />
    </div>
  )
}
