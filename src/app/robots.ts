import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/profile", "/my-activity", "/signin", "/signout", "/api/", "/work"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
