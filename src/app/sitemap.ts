import { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { posts } from "@/lib/blog-data"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in"
const NOW = new Date().toISOString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeServices = await db
    .select({ slug: services.slug, updatedAt: services.createdAt })
    .from(services)
    .where(eq(services.isActive, true))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly", lastModified: NOW },
    { url: `${BASE_URL}/connect`, priority: 0.9, changeFrequency: "weekly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/angel-investors`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/tools/fundability-score`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/tools/pitch-deck-analyser`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/startup/tools/idea-score`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/startup/ideas`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/startup/ideas/tech`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/startup/ideas/d2c`, priority: 0.8, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: "weekly", lastModified: NOW },
    { url: `${BASE_URL}/startup/templates`, priority: 0.7, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/templates`, priority: 0.7, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/startup/blog`, priority: 0.6, changeFrequency: "weekly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/blog`, priority: 0.6, changeFrequency: "weekly", lastModified: NOW },
    { url: `${BASE_URL}/startup/tools`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/fundraise/tools`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/services/accounting`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/services/incorporation`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/services/branding`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/services/tech`, priority: 0.6, changeFrequency: "monthly", lastModified: NOW },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: "yearly", lastModified: NOW },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: "yearly", lastModified: NOW },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: post.date ? new Date(post.date).toISOString() : NOW,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = activeServices.map(({ slug }) => ({
    url: `${BASE_URL}/connect/${slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: NOW,
  }))

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes]
}
