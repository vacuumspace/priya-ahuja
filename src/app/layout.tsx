import type { Metadata } from "next"
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
    default: "Priya Ahuja - Fundraising & Strategy for Founders",
    template: "%s | Priya Ahuja",
  },
  description:
    "Corporate Development at Groww. Helping founders with fundraising readiness, investor storytelling, and startup strategy.",
  keywords: ["fundraising", "startup strategy", "investor pitch", "term sheet", "VC career", "India startup"],
  authors: [{ name: "Priya Ahuja" }],
  creator: "Priya Ahuja",
  twitter: {
    card: "summary_large_image",
    title: "Priya Ahuja - Fundraising & Strategy for Founders",
    description:
      "Corporate Development at Groww. Helping founders with fundraising readiness, investor storytelling, and startup strategy.",
  },
  icons: {
    icon: "/priyadp.jpeg",
    apple: "/priyadp.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Priya Ahuja",
    title: "Priya Ahuja - Fundraising & Strategy for Founders",
    description:
      "Corporate Development at Groww. Helping founders with fundraising readiness, investor storytelling, and startup strategy.",
    images: [{ url: "/priyadp.jpeg", width: 1200, height: 630, alt: "Priya Ahuja" }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers><Analytics /></body>
    </html>
  )
}
