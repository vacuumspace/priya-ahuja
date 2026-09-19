import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, PlayCircle, Infinity as InfinityIcon } from "lucide-react"
import { courseLaunched, courseOfferOpen, courses } from "@/lib/courses-data"

export const metadata: Metadata = {
  title: "School - Courses by Priya Ahuja",
  description: "Practical, pre-recorded startup courses by Priya Ahuja - from first idea to first paying customers.",
  alternates: { canonical: "https://priyaahuja.in/school/courses" },
}

export const dynamic = "force-dynamic"

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>school</span>
        <span>{courses.length} {courses.length === 1 ? "course" : "courses"}</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4 flex items-center gap-3">
          <GraduationCap size={36} className="text-peach-dark" />
          courses
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          practical, pre-recorded courses with a clear takeaway at the end of every chapter.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/school/courses/${c.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-peach-dark/50 transition-colors"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-peach/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.thumbnailUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full shadow-sm bg-green-100 text-green-700">
                  {courseLaunched(c) ? "open for enrolment" : courseOfferOpen(c) ? "founding offer open" : "launching soon"}
                </span>
              </div>
              <div className="p-5">
                <p className="font-heading text-lg font-700 text-ink normal-case mb-1 leading-snug">{c.title}</p>
                <p className="font-sans text-[13px] text-ink/50 leading-relaxed mb-3">{c.tagline}</p>
                <div className="flex items-center gap-4 text-[13px] font-sans text-ink/50 mb-3">
                  <span className="flex items-center gap-1.5">
                    <PlayCircle size={12} className="text-peach-dark" />
                    pre-recorded video
                  </span>
                  <span className="flex items-center gap-1.5">
                    <InfinityIcon size={12} className="text-peach-dark" />
                    lifetime access
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-ink">
                    <span className="font-semibold">₹{c.founderPrice.toLocaleString("en-IN")}</span>{" "}
                    <span className="text-ink/40 line-through">₹{c.listPrice.toLocaleString("en-IN")}</span>
                  </span>
                  <span className="text-xs font-sans font-semibold text-peach-dark group-hover:underline">view details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
