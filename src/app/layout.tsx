import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Syne } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Providers } from "@/components/Providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: "Priya Ahuja - Startup & Fundraise Consultant",
    template: "%s | Priya Ahuja",
  },
  description:
    "Priya Ahuja is a startup & fundraise consultant at Groww Ventures. Book a 1:1 session for fundraising readiness, investor pitch review, startup strategy, and business model feedback. Trusted by 200+ founders across India.",
  keywords: ["fundraising consultant India", "startup advisor India", "investor pitch review", "fundraise readiness", "startup strategy consultant", "pre-seed fundraising India", "pitch to priya", "angel investor list India", "startup idea validation"],
  authors: [{ name: "Priya Ahuja" }],
  creator: "Priya Ahuja",
  twitter: {
    card: "summary_large_image",
    title: "Priya Ahuja - Startup & Fundraise Consultant",
    description:
      "Book a 1:1 session with Priya Ahuja — startup & fundraise consultant at Groww Ventures. Trusted by 200+ founders across India.",
    creator: "@pitchtopriya",
  },
  icons: {
    icon: "/priyadp.jpeg",
    apple: "/priyadp.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Priya Ahuja",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in",
    title: "Priya Ahuja - Startup & Fundraise Consultant",
    description:
      "Book a 1:1 session with Priya Ahuja — startup & fundraise consultant at Groww Ventures. Trusted by 200+ founders across India.",
    images: [{ url: "/priyadp.jpeg", width: 1200, height: 630, alt: "Priya Ahuja - Startup & Fundraise Consultant" }],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t==null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Priya Ahuja",
              url: "https://www.priyaahuja.in",
              image: "https://www.priyaahuja.in/priyadp.jpeg",
              jobTitle: "Startup & Fundraise Consultant",
              worksFor: {
                "@type": "Organization",
                name: "Groww Ventures",
                url: "https://groww.in",
              },
              description:
                "Startup and fundraise consultant at Groww Ventures. Helping early-stage founders with fundraising readiness, investor pitch review, and startup strategy. 200+ founders advised across India.",
              sameAs: [
                "https://www.linkedin.com/in/ca-priya-harwani/",
                "https://www.instagram.com/pitchtopriya",
              ],
              knowsAbout: [
                "Startup fundraising",
                "Investor pitch decks",
                "Pre-seed and seed stage startups",
                "Venture capital",
                "Business model strategy",
                "Go-to-market strategy",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bangalore",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers><Analytics /></body>
    </html>
  )
}
