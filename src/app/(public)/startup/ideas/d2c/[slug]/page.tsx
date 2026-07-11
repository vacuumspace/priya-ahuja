import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getD2cIdeaBySlug, D2C_FREE_IDEAS_COUNT } from "@/lib/d2c-startup-ideas-data"
import IdeaArticle from "@/components/IdeaArticle"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const idea = getD2cIdeaBySlug(slug)
  if (!idea) return {}

  const title = `${idea.title} - D2C Startup Idea`
  const description = idea.tagline
  const url = `https://priyaahuja.in/startup/ideas/d2c/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Priya Ahuja`, description, url },
  }
}

export default async function D2cIdeaDetailPage({ params }: Props) {
  const { slug } = await params
  const idea = getD2cIdeaBySlug(slug)
  if (!idea) notFound()

  const session = await auth()
  const userEmail = session?.user?.email ?? null

  const isFree = idea.sno <= D2C_FREE_IDEAS_COUNT

  if (!isFree && !userEmail) {
    redirect(`/signin?callbackUrl=/startup/ideas/d2c/${slug}`)
  }

  return (
    <IdeaArticle
      idea={idea}
      backHref="/startup/ideas/d2c"
      backLabel="back to d2c ideas"
      crumbLeft="startup · d2c ideas 2026"
    />
  )
}
