import { Metadata } from "next"

export const metadata: Metadata = { title: "Terms & Conditions" }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-700 text-ink mb-8">Terms & Conditions</h1>
      <div className="font-sans text-sm text-ink/70 space-y-6 leading-relaxed">
        <p><strong className="text-ink">Last updated:</strong> June 2026</p>

        <section>
          <h2 className="font-semibold text-ink mb-2">Services</h2>
          <p>Priya Ahuja offers paid connect session sessions and digital products. All bookings are subject to availability and confirmed via email.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Payments & Refunds</h2>
          <p>All payments are processed via Razorpay in INR. Consultation bookings are non-refundable once confirmed. Digital products are non-refundable after purchase.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Rescheduling</h2>
          <p>Consultation sessions may be rescheduled with at least 24 hours notice by emailing <a href="mailto:hi@priyaahuja.in" className="text-ink underline">hi@priyaahuja.in</a>.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Intellectual Property</h2>
          <p>All content on this site — including blog posts, templates, and tools — is the property of Priya Ahuja and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Limitation of Liability</h2>
          <p>Advice provided is for informational purposes only. Priya Ahuja is not liable for business outcomes resulting from connect sessions.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Contact</h2>
          <p>For any questions, email <a href="mailto:hi@priyaahuja.in" className="text-ink underline">hi@priyaahuja.in</a>.</p>
        </section>
      </div>
    </div>
  )
}
