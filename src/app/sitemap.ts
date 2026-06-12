import { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { posts } from "@/lib/blog-data"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeServices = await db
    .select({ slug: services.slug })
    .from(services)
    .where(eq(services.isActive, true))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/connect`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/products`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/tools`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/tools/startup-score`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/templates`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/services/accounting`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/services/incorporation`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/services/branding`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/services/tech`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/fundraise/angel-investors`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/fundraise/blog`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE_URL}/fundraise/tools`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/fundraise/templates`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/startup/blog`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE_URL}/startup/tools`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/startup/templates`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: "yearly" },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = activeServices.map(({ slug }) => ({
    url: `${BASE_URL}/connect/${slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }))

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes]
}
