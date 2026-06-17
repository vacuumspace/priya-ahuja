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
    default: "Priya Ahuja - Business Educator",
    template: "%s | Priya Ahuja",
  },
  description:
    "Corporate Development at Groww. Helping founders with fundraising readiness, investor storytelling, and startup strategy.",
  keywords: ["fundraising", "startup strategy", "investor pitch", "term sheet", "VC career", "India startup"],
  authors: [{ name: "Priya Ahuja" }],
  creator: "Priya Ahuja",
  twitter: {
    card: "summary_large_image",
    title: "Priya Ahuja - Business Educator",
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
    title: "Priya Ahuja - Business Educator",
    description:
      "Corporate Development at Groww. Helping founders with fundraising readiness, investor storytelling, and startup strategy.",
    images: [{ url: "/priyadp.jpeg", width: 1200, height: 630, alt: "Priya Ahuja" }],
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
      </head>
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers><Analytics /></body>
    </html>
  )
}
