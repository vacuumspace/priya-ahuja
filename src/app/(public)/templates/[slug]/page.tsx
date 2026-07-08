import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getTemplate } from "@/lib/templates-data"
import { redirect, notFound } from "next/navigation"
import { isNotNull } from "drizzle-orm"
import TemplateViewer from "@/components/templates/TemplateViewer"
import { isAdmin } from "@/lib/auth"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getTemplate(slug)
  if (!template) return {}
  return { title: `${template.title} - Priya Ahuja` }
}

export default async function TemplateViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getTemplate(slug)
  if (!template) notFound()

  const session = await auth()
  const userEmail = session?.user?.email ?? null

  if (!userEmail) {
    redirect(template.category === "fundraise" ? "/fundraise/templates" : template.category === "startup" ? "/startup/templates" : "/templates")
  }

  // Check if user has purchased this template
  const [product] = await db
    .select({ id: digitalProducts.id })
    .from(digitalProducts)
    .where(eq(digitalProducts.slug, slug))
    .limit(1)

  if (!product) notFound()

  if (!isAdmin(userEmail)) {
    const [purchase] = await db
      .select({ downloadToken: purchases.downloadToken })
      .from(purchases)
      .where(and(eq(purchases.userEmail, userEmail), eq(purchases.productId, product.id), isNotNull(purchases.downloadToken)))
      .limit(1)

    if (!purchase?.downloadToken) {
      redirect(template.category === "fundraise" ? "/fundraise/templates" : template.category === "startup" ? "/startup/templates" : "/templates")
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="px-4 md:px-10 pt-10 pb-16 max-w-3xl">
        <a
          href={template.category === "fundraise" ? "/fundraise/templates" : "/startup/templates"}
          className="text-[12px] font-sans text-ink/40 uppercase tracking-[0.18em] hover:text-ink/70 transition-colors mb-6 inline-block"
        >
          ← {template.category} templates
        </a>
        <TemplateViewer template={template} />
      </div>
    </div>
  )
}
