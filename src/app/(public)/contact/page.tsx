import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Priya Ahuja for startup and fundraising advisory, investor introductions, or service inquiries.",
  alternates: { canonical: "https://priyaahuja.in/contact" },
  openGraph: {
    title: "Contact Priya Ahuja",
    description: "Get in touch with Priya Ahuja for startup and fundraising advisory, investor introductions, or service inquiries.",
    url: "https://priyaahuja.in/contact",
  },
}

export default async function ContactPage() {
  const session = await auth()
  return (
    <ContactForm
      defaultName={session?.user?.name ?? ""}
      defaultEmail={session?.user?.email ?? ""}
    />
  )
}
