import { Metadata } from "next"

export const metadata: Metadata = { title: "Contact Us" }

export default function ContactsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-700 text-ink mb-8">Contact Us</h1>
      <div className="font-sans text-sm text-ink/70 space-y-6 leading-relaxed">

        <section>
          <h2 className="font-semibold text-ink mb-2">Get in Touch</h2>
          <p>Have a question about a course, need help with your account, or want to know more about what we offer? We&apos;re here to help.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Email</h2>
          <p>For course enquiries, access issues, or general questions, reach us at <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a>. We respond within 1 business day.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Course Support</h2>
          <p>If you&apos;ve purchased a course and are having trouble accessing your content, email us with your registered email address and order details. We&apos;ll get you sorted quickly.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Refunds & Payments</h2>
          <p>For payment-related queries or refund requests, please email us within 7 days of purchase at <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a> with your transaction ID.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Business Hours</h2>
          <p>Monday to Friday, 10am – 6pm IST. Responses outside these hours may be delayed.</p>
        </section>

      </div>
    </div>
  )
}
