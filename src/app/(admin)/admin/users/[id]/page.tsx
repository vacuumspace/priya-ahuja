import { db } from "@/lib/db"
import { users, userProfiles, bookings, purchases, services as servicesTable, digitalProducts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2.5 border-b border-border last:border-0">
      <span className="font-sans text-xs text-ink/40 w-40 shrink-0 pt-0.5">{label}</span>
      <span className="font-sans text-sm text-ink break-all">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-card">
        <h2 className="font-heading text-base font-700 text-ink">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  )
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params

  const [user] = await db.select().from(users).where(eq(users.id, id))
  if (!user) notFound()

  const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, id))

  const userBookings = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      serviceTitle: servicesTable.title,
    })
    .from(bookings)
    .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
    .where(eq(bookings.userEmail, user.email))
    .orderBy(desc(bookings.createdAt))
    .limit(10)

  const userPurchases = await db
    .select({
      id: purchases.id,
      createdAt: purchases.createdAt,
      productTitle: digitalProducts.title,
    })
    .from(purchases)
    .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
    .where(eq(purchases.userEmail, user.email))
    .orderBy(desc(purchases.createdAt))
    .limit(10)

  const hasProfile = !!profile

  return (
    <div className="px-10 py-10 max-w-3xl">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 font-sans text-sm text-ink/50 hover:text-ink transition-colors mb-6">
        <ArrowLeft size={14} />
        back to users
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">{user.name ?? user.email}</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{user.email}</p>
        {!hasProfile && (
          <span className="inline-block mt-2 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            no profile set up
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <Section title="account">
          <Row label="user id" value={user.id} />
          <Row label="email" value={user.email} />
          <Row label="name" value={user.name} />
          <Row
            label="joined"
            value={user.createdAt
              ? new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short" }).format(new Date(user.createdAt))
              : undefined}
          />
        </Section>

        {hasProfile && (
          <>
            <Section title="basic info">
              <Row label="phone" value={profile.phone} />
              <Row label="location" value={profile.location} />
              <Row label="website" value={profile.website} />
              <Row label="bio" value={profile.bio} />
            </Section>

            <Section title="business details">
              <Row label="business name" value={profile.businessName} />
              <Row label="type" value={profile.businessType} />
              <Row label="industry" value={profile.industry} />
              <Row label="stage" value={profile.stage} />
              <Row label="description" value={profile.businessDescription} />
              <Row label="business website" value={profile.businessWebsite} />
              <Row label="instagram" value={profile.instagramHandle} />
              <Row label="linkedin" value={profile.linkedinUrl} />
              <Row label="twitter / x" value={profile.twitterHandle} />
            </Section>
          </>
        )}

        {userBookings.length > 0 && (
          <Section title={`connect sessions (${userBookings.length})`}>
            {userBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="font-sans text-sm text-ink">{b.serviceTitle ?? "Session"}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/60">{b.status}</span>
                  <span className="font-sans text-xs text-ink/40">
                    {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(b.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </Section>
        )}

        {userPurchases.length > 0 && (
          <Section title={`purchases (${userPurchases.length})`}>
            {userPurchases.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="font-sans text-sm text-ink">{p.productTitle ?? "Product"}</span>
                <span className="font-sans text-xs text-ink/40">
                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(p.createdAt))}
                </span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}
