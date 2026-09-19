import type { Metadata } from "next"
import { Fragment } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowDown, ChevronLeft, ChevronDown, ChevronRight, Compass, Rocket, Star, Users, GraduationCap, Gift, Lock, Target } from "lucide-react"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { coursePaise, courseLaunched, courseOfferOpen, getCourse, PHASES, PHASE_OUTCOMES } from "@/lib/courses-data"
import { balanceDuePaise, getSeatsTaken, getUserEnrollment } from "@/lib/course-enrollment"
import { giftPricePaise } from "@/lib/course-gift"
import { CourseCta, CourseProvider, MobileStickyCta, OfferCountdown } from "./CourseClient"
import { GiftProvider, GiftSection, GiftTrigger } from "./GiftCourse"

type Params = Promise<{ slug: string }>

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) return {}
  return {
    title: `${course.title} - Course by Priya Ahuja`,
    description: course.tagline,
    alternates: { canonical: `https://priyaahuja.in/school/courses/${slug}` },
  }
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-[12px] font-sans font-semibold text-peach-dark uppercase tracking-[0.18em] mb-3">{eyebrow}</p>
      <h2 id={id} className="font-heading text-2xl md:text-3xl font-800 text-ink normal-case leading-tight">{title}</h2>
    </div>
  )
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()

  const session = await auth()
  const [enrollment, seatsTaken, scorePriceRow] = await Promise.all([
    session?.user?.id ? getUserEnrollment(course.slug, session.user.id) : Promise.resolve(null),
    getSeatsTaken(course.slug),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_startup_score")).limit(1),
  ])
  // The gift's worth is whatever the tool currently sells for (paise).
  const giftWorthPaise = scorePriceRow[0] ? parseInt(scorePriceRow[0].value, 10) : 49900

  const paise = coursePaise(course)
  const offerOpen = courseOfferOpen(course)
  const launched = courseLaunched(course)
  const seatsLeft = Math.max(0, course.seatCap - seatsTaken)
  const seatPercent = Math.min(100, Math.round((seatsTaken / course.seatCap) * 100))
  const saving = course.listPrice - course.founderPrice
  const balance = course.founderPrice - course.preRegisterPrice

  // A pending row is just an abandoned checkout, not an enrolment.
  const enrolledStatus = enrollment?.status === "preregistered" || enrollment?.status === "paid" ? enrollment.status : null

  const steps = [
    { when: "Now", title: `Pay ${inr(course.preRegisterPrice)}`, note: `locks ${inr(course.founderPrice)}` },
    { when: "11 Oct", title: `Pay ${inr(balance)}`, note: `${inr(course.preRegisterPrice)} is adjusted` },
    { when: "Then", title: "Start learning", note: "lifetime access" },
    { when: "Included", title: "1:1 with Priya", note: "actionable insights on your plan", star: true },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <Link href="/school/courses" className="flex items-center gap-1 hover:text-ink transition-colors">
          <ChevronLeft size={14} /> all courses
        </Link>
        <span className="flex items-center gap-1.5"><GraduationCap size={14} /> school</span>
      </div>

      <div className="px-4 md:px-10 pt-12 md:pt-20 pb-28 md:pb-24 max-w-3xl mx-auto">
        <CourseProvider
          courseSlug={course.slug}
          courseTitle={course.title}
          isSignedIn={!!session?.user}
          isAdmin={isAdmin(session?.user?.email)}
          userName={session?.user?.name ?? ""}
          userEmail={session?.user?.email ?? ""}
          status={enrolledStatus}
          giftCode={enrollment?.status === "paid" ? enrollment.giftCode : null}
          offerOpen={offerOpen}
          launched={launched}
          seatsLeft={seatsLeft}
          preRegisterPaise={paise.preRegister}
          savingPaise={(course.listPrice - course.founderPrice) * 100}
          balancePaise={enrollment && enrolledStatus ? balanceDuePaise(enrollment) : paise.list}
          launchLabel={course.launchLabel}
        >
          <GiftProvider
            courseSlug={course.slug}
            courseTitle={course.title}
            isSignedIn={!!session?.user}
            isAdmin={isAdmin(session?.user?.email)}
            userName={session?.user?.name ?? ""}
            userEmail={session?.user?.email ?? ""}
            pricePaise={giftPricePaise(course, seatsTaken)}
            listPaise={paise.list}
            atFounderPrice={offerOpen && seatsTaken < course.seatCap}
            offerEndsLabel={new Date(course.offerEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" })}
            launchLabel={course.launchLabel}
          >
          {/* Hero */}
          <header className="mb-20">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-7">
              <p className="inline-block text-[12px] font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                {launched ? `launched ${course.launchLabel}` : `launching ${course.launchLabel}`}
              </p>
              {!enrolledStatus && (
                <a
                  href="#offer"
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-peach-dark/40 text-peach-dark hover:bg-peach-dark/10 font-sans font-semibold text-[13px] transition-colors"
                >
                  {offerOpen ? "See the founding offer" : "See the offer"}
                  <ArrowDown size={13} />
                </a>
              )}
              <GiftTrigger variant="hero" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-800 text-ink mb-7 normal-case leading-[1.15] text-balance">{course.title}</h1>
            <p className="font-sans text-lg md:text-xl text-ink/70 leading-relaxed max-w-2xl text-balance">{course.tagline}</p>
            <p className="font-sans text-sm text-ink/50 leading-relaxed max-w-2xl mt-6">{course.audience}</p>
          </header>

          {/* About */}
          <section className="mb-24" aria-labelledby="promise-heading">
            <p className="font-heading text-xl md:text-2xl font-700 text-ink normal-case leading-snug max-w-2xl mb-5 text-balance">{course.lead}</p>
            <div className="flex flex-col gap-5 max-w-2xl mb-20">
              {course.description.split("\n\n").map((para, i) => (
                <p key={i} className="font-sans text-base md:text-lg text-ink/70 leading-relaxed">{para}</p>
              ))}
            </div>
            <SectionHeading id="promise-heading" eyebrow="what you walk away with" title="Clarity, confidence, and a mentor by your side" />
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Compass, title: "Clarity", text: "A clear picture of what to build and how to launch it." },
                { icon: Rocket, title: "Confidence", text: "The confidence to step into the market and talk to real customers." },
                { icon: Users, title: "A mentor", text: "Priya is with you along the way, so you never build alone." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-5">
                  <span className="w-10 h-10 rounded-xl bg-peach-dark/15 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-peach-dark" />
                  </span>
                  <h3 className="font-heading text-lg font-700 text-ink normal-case mb-1.5">{title}</h3>
                  <p className="font-sans text-sm text-ink/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Chapters */}
          <section id="chapters" className="mb-24 scroll-mt-6" aria-labelledby="chapters-heading">
            <SectionHeading id="chapters-heading" eyebrow="what's inside" title="From brainstorming your idea to launching and acquiring first 100 customers" />
            <p className="font-sans text-sm text-ink/60 leading-relaxed -mt-4 mb-10 max-w-xl">
              Each stage ends with something you can use straight away. Open a stage to see what it covers.
            </p>

            <div className="flex flex-col gap-4">
              {PHASES.map((phase) => {
                const chapters = course.chapters.filter((c) => c.phase === phase)
                if (chapters.length === 0) return null
                const first = chapters[0].number
                const last = chapters[chapters.length - 1].number
                return (
                  <details key={phase} className="group bg-card border border-border rounded-2xl overflow-hidden open:border-peach-dark/40 transition-colors">
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-4 md:px-6 py-4 hover:bg-ink/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-peach-dark/30 focus-visible:ring-inset">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-baseline flex-wrap gap-x-3 gap-y-0.5">
                          <p className="flex items-center gap-1.5 text-[12px] font-sans font-semibold text-peach-dark uppercase tracking-[0.18em]">
                            {phase}
                            {phase === "1:1 Live Session" && <Star size={12} className="fill-peach-dark" aria-label="highlight" />}
                          </p>
                          <p className="text-[12px] font-sans text-ink/40">
                            {first === last ? `Chapter ${first}` : `Chapters ${first}-${last}`}
                          </p>
                        </div>
                        <span className="flex items-center gap-1.5 text-[12px] font-sans text-ink/40 flex-shrink-0">
                          <span className="group-open:hidden">view details</span>
                          <span className="hidden group-open:inline">hide</span>
                          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                        </span>
                      </div>
                      <p className="font-sans text-sm text-ink/70 leading-relaxed mt-2">{PHASE_OUTCOMES[phase]}</p>
                      <ul className="group-open:hidden mt-3 flex flex-col gap-1.5">
                        {chapters.map((ch) => (
                          <li key={ch.number} className="flex items-baseline gap-3 font-sans text-sm text-ink/80">
                            <span className="font-mono text-xs text-ink/30 w-6 flex-shrink-0">{String(ch.number).padStart(2, "0")}</span>
                            {ch.title}
                          </li>
                        ))}
                      </ul>
                    </summary>
                    <ol className="divide-y divide-border border-t border-border">
                      {chapters.map((ch) => (
                        <li key={ch.number} className="flex items-start gap-4 px-4 md:px-6 py-5">
                          <span className="font-mono text-xs text-ink/30 pt-1.5 w-6 flex-shrink-0">{String(ch.number).padStart(2, "0")}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-sans font-semibold text-ink/40 uppercase tracking-wider mb-1">{ch.subtitle}</p>
                            <h3 className="font-heading text-lg font-700 text-ink normal-case leading-snug">{ch.title}</h3>
                            <p className="inline-flex items-start gap-1.5 mt-3 rounded-lg bg-peach-dark/10 px-2.5 py-1.5 font-sans text-[13px] text-ink/80 leading-snug">
                              <Target size={13} className="text-peach-dark mt-0.5 flex-shrink-0" />
                              <span><span className="font-semibold text-ink">Takeaway</span> · {ch.takeaway}</span>
                            </p>
                            {ch.session && (
                              <p className="font-sans text-[12px] text-ink/40 mt-3">
                                included, worth {ch.session.worth} ·{" "}
                                {enrolledStatus === "paid" ? (
                                  <Link href={ch.session.bookHref} className="font-semibold text-peach-dark hover:underline">
                                    book your session →
                                  </Link>
                                ) : (
                                  <>
                                    <span className="inline-flex items-center gap-1"><Lock size={11} /> comes with your course access</span>
                                    {" · "}
                                    <Link href={ch.session.bookHref} className="font-semibold text-peach-dark hover:underline">
                                      view booking page →
                                    </Link>
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </details>
                )
              })}
            </div>
          </section>

          {/* Gift */}
          <section className="mb-24" aria-labelledby="gifts-heading">
            <SectionHeading id="gifts-heading" eyebrow="included" title="A free gift on top" />
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 bg-card border border-border rounded-2xl p-5 md:p-6">
              <span className="w-10 h-10 rounded-xl bg-peach-dark/15 flex items-center justify-center flex-shrink-0">
                <Gift size={18} className="text-peach-dark" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-heading text-lg font-700 text-ink normal-case">{course.gift.title}</h3>
                  <span className="font-sans text-[12px] font-semibold text-green-700 bg-green-100 rounded-full px-2.5 py-1">
                    worth {inr(giftWorthPaise / 100)}
                  </span>
                </div>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">{course.gift.description}</p>
                <p className="flex items-center gap-1.5 font-sans text-[12px] text-ink/40 mt-4">
                  {enrolledStatus === "paid" ? (
                    <Link href={course.gift.href} className="font-semibold text-peach-dark hover:underline">use it now →</Link>
                  ) : (
                    <>
                      <Lock size={12} /> comes with your course access
                      <span aria-hidden="true">·</span>
                      <Link href={course.gift.href} className="font-semibold text-peach-dark hover:underline">view the tool →</Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-24" aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading" eyebrow="questions" title="Good to know" />
            <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
              {course.faqs.map((f) => (
                <details key={f.q} className="group open:bg-ink/[0.02]">
                  <summary className="flex items-center justify-between gap-4 px-4 md:px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark/50 focus-visible:ring-inset">
                    <span className="font-sans text-[15px] font-semibold text-ink">{f.q}</span>
                    <ChevronDown size={16} className="text-ink/40 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-4 md:px-6 pb-5 -mt-1 font-sans text-sm text-ink/60 leading-relaxed max-w-xl">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Offer */}
          <section className="bg-peach/30 border border-peach-dark/25 rounded-2xl p-5 md:p-7 scroll-mt-6" id="offer" aria-label="Founding offer">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <p className="text-[12px] font-sans font-semibold text-peach-dark uppercase tracking-[0.18em]">
                founding offer · first {course.seatCap} founders
              </p>
              {offerOpen && (
                <OfferCountdown
                  endsAt={course.offerEndsAt}
                  className="text-[12px] font-sans font-semibold text-peach-dark bg-peach-dark/15 rounded-full px-2.5 py-1"
                />
              )}
            </div>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-6">
              <span className="font-heading text-5xl md:text-6xl font-800 text-ink leading-none">{inr(course.founderPrice)}</span>
              <div className="flex flex-col gap-1 items-start">
                <span className="font-sans text-base text-ink/40 line-through leading-none">{inr(course.listPrice)}</span>
                <span className="font-sans text-xs font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">save {inr(saving)}</span>
              </div>
            </div>

            {offerOpen && !launched && (
              <ol className="grid grid-cols-2 gap-2 sm:flex sm:items-stretch sm:gap-0 mb-6">
                {steps.map((st, i) => (
                  <Fragment key={st.when}>
                    {i > 0 && (
                      <li aria-hidden="true" className="hidden sm:flex items-center px-0.5 md:px-1.5 text-ink/25">
                        <ChevronRight size={12} />
                      </li>
                    )}
                    <li className="sm:flex-1 min-w-0 bg-card/70 border border-border rounded-xl px-3 py-3">
                      <p className="text-[11px] font-sans font-semibold text-ink/40 uppercase tracking-wider mb-1.5">{st.when}</p>
                      <p className="flex items-center gap-1.5 font-sans text-sm font-semibold text-ink leading-snug">
                        {st.title}
                        {st.star && <Star size={12} className="fill-peach-dark text-peach-dark flex-shrink-0" aria-label="highlight" />}
                      </p>
                      <p className="font-sans text-[12px] text-ink/50 leading-snug mt-0.5">{st.note}</p>
                    </li>
                  </Fragment>
                ))}
              </ol>
            )}

            {offerOpen && (
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="font-sans text-[13px] font-semibold text-ink">
                    {seatsLeft > 0 ? `${seatsTaken} of ${course.seatCap} founding seats taken` : "all founding seats are taken"}
                  </p>
                  {seatsLeft > 0 && seatsLeft <= 30 && (
                    <p className="font-sans text-[12px] text-ink/50">{seatsLeft} left</p>
                  )}
                </div>
                <div
                  className="h-2 rounded-full bg-ink/10 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={seatsTaken}
                  aria-valuemin={0}
                  aria-valuemax={course.seatCap}
                  aria-label="Founding seats taken"
                >
                  <div className="h-full rounded-full bg-peach-dark" style={{ width: `${seatPercent}%` }} />
                </div>
              </div>
            )}

            <CourseCta
              fullWidth
              className="min-h-12 h-auto py-2.5 whitespace-normal text-center bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-base rounded-xl"
            />
            <p className="font-sans text-sm text-ink/50 text-center mt-5">This is the beginning of something big.</p>
          </section>

          <GiftSection />

          <MobileStickyCta priceLabel={inr(offerOpen && !launched ? course.founderPrice : course.listPrice)} />
          </GiftProvider>
        </CourseProvider>
      </div>
    </div>
  )
}
