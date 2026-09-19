import type { Metadata } from "next"
import Link from "next/link"
import { and, eq, inArray } from "drizzle-orm"
import { GraduationCap } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { getCourse } from "@/lib/courses-data"
import { getUserEnrollment } from "@/lib/course-enrollment"
import { giftCardUrl, giftUrl } from "@/lib/course-gift"
import { cardVersion } from "@/lib/gift-card"
import { GiftLinkActions } from "@/components/GiftLinkActions"
import { ClaimGift } from "./ClaimGift"

type Params = Promise<{ token: string }>

async function loadGift(token: string) {
  const [gift] = await db
    .select()
    .from(courseGifts)
    .where(and(eq(courseGifts.token, token), inArray(courseGifts.status, ["paid", "redeemed"])))
    .limit(1)
  return gift ?? null
}

// The link preview (WhatsApp, iMessage...) shows the personal card itself.
// It's a private link, so it stays out of search results.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { token } = await params
  const gift = await loadGift(token)
  const course = gift ? getCourse(gift.courseSlug) : undefined
  if (!gift || !course) return { title: "Gift", robots: { index: false, follow: false } }

  const title = `A gift for ${gift.recipientName ?? "you"}: ${course.title}`
  return {
    title,
    description: `${gift.purchaserName} has gifted you a course to help you start up.`,
    robots: { index: false, follow: false },
    openGraph: { title, images: [giftCardUrl(token, cardVersion(gift))] },
    twitter: { card: "summary_large_image", images: [giftCardUrl(token, cardVersion(gift))] },
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>gift</span>
        <span className="flex items-center gap-1.5"><GraduationCap size={14} /> school</span>
      </div>
      <div className="px-4 md:px-10 pt-12 md:pt-16 pb-24 max-w-xl mx-auto">{children}</div>
    </div>
  )
}

export default async function GiftPage({ params }: { params: Params }) {
  const { token } = await params
  const [gift, session] = await Promise.all([loadGift(token), auth()])
  const course = gift ? getCourse(gift.courseSlug) : undefined

  if (!gift || !course) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="font-heading text-2xl font-800 text-ink normal-case mb-2">This gift link isn&apos;t valid</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            Check that you copied the whole link. If you think this is a mistake, ask the person who sent it.
          </p>
          <Link href="/school/courses" className="font-sans text-sm font-semibold text-peach-dark hover:underline">
            see the courses →
          </Link>
        </div>
      </Shell>
    )
  }

  const userId = session?.user?.id
  const isBuyer = !!userId && gift.purchaserId === userId
  const claimedByViewer = !!userId && gift.redeemedById === userId
  const alreadyHasAccess = !!userId && !isBuyer && gift.status === "paid" && (await getUserEnrollment(gift.courseSlug, userId))?.status === "paid"
  const cardSrc = giftCardUrl(token, cardVersion(gift), "")

  return (
    <Shell>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cardSrc} alt={`A gift for ${gift.recipientName ?? "you"}`} className="w-full rounded-2xl border border-border shadow-lg mb-10" />

      {gift.status === "redeemed" ? (
        claimedByViewer ? (
          <div className="text-center">
            <h1 className="font-heading text-2xl font-800 text-ink normal-case mb-2">You claimed this gift</h1>
            <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">It&apos;s in your account, ready for {course.launchLabel}.</p>
            <Link href="/my-activity?tab=courses" className="font-sans text-sm font-semibold text-peach-dark hover:underline">
              see it in my activity →
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-heading text-2xl font-800 text-ink normal-case mb-2">This gift has already been claimed</h1>
            <p className="font-sans text-sm text-ink/60 leading-relaxed">Each gift link works once, for one person.</p>
          </div>
        )
      ) : isBuyer ? (
        <div>
          <h1 className="font-heading text-2xl font-800 text-ink normal-case mb-2 text-center">This is the gift you bought</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5 text-center">
            Send the card and this link to {gift.recipientName ?? "the person you're gifting"}. You can edit the card from{" "}
            <Link href="/my-activity?tab=courses" className="font-semibold text-peach-dark hover:underline">my activity</Link> until it&apos;s claimed.
          </p>
          <div className="flex justify-center">
            <GiftLinkActions link={giftUrl(token)} cardUrl={cardSrc} courseTitle={course.title} recipientName={gift.recipientName ?? undefined} />
          </div>
        </div>
      ) : alreadyHasAccess ? (
        <div className="text-center">
          <h1 className="font-heading text-2xl font-800 text-ink normal-case mb-2">You already have access</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
            This gift is meant for someone else, so we haven&apos;t used it. You can pass the link on.
          </p>
          <Link href={`/school/courses/${course.slug}`} className="font-sans text-sm font-semibold text-peach-dark hover:underline">
            view the course →
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-800 text-ink normal-case mb-2 text-center text-balance">
            {gift.purchaserName} gifted you {course.title}
          </h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-7 text-center max-w-md mx-auto">
            A clear path from idea to your first customers, with a mentor beside you. Claim it to get full access, including the free gifts. No payment needed.
          </p>
          <ClaimGift token={token} isSignedIn={!!session?.user} courseSlug={course.slug} launchLabel={course.launchLabel} />
        </div>
      )}
    </Shell>
  )
}
