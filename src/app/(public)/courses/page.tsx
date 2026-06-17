import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { courses } from "@/lib/courses-data"
import CourseCard from "@/components/courses/CourseCard"

export default async function CoursesPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  const purchasedSlugs = new Set<string>()
  if (userEmail) {
    const rows = await db
      .select({ slug: digitalProducts.slug })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(purchases.userEmail, userEmail))
    for (const row of rows) {
      if (row.slug) purchasedSlugs.add(row.slug)
    }
  }

  const available = courses.filter((c) => !c.comingSoon).length

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>courses</span>
        <span>{available} available</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Learn</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          build the skills
          <br />
          that matter.
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          practical business courses for founders and operators — no fluff, no theory for its own sake. learn what you can apply this week.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              isAuthenticated={!!userEmail}
              isPurchased={purchasedSlugs.has(course.slug)}
              userEmail={userEmail ?? undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
