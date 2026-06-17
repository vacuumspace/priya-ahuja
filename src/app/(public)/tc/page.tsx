import { Metadata } from "next"

export const metadata: Metadata = { title: "Terms & Conditions" }

export default function TCPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-700 text-ink mb-8">Terms & Conditions</h1>
      <div className="font-sans text-sm text-ink/70 space-y-6 leading-relaxed">
        <p><strong className="text-ink">Last updated:</strong> June 2026</p>

        <section>
          <h2 className="font-semibold text-ink mb-2">Course Enrolment</h2>
          <p>By purchasing a course, you gain lifetime access to that course&apos;s materials for personal, non-commercial learning. Access is tied to your registered account and may not be shared or transferred.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Payments</h2>
          <p>All payments are processed in INR via Razorpay. Course prices are as listed at the time of purchase. We reserve the right to update pricing; changes do not affect existing enrolments.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Refunds</h2>
          <p>Refund requests submitted within 7 days of purchase and before accessing more than 20% of the course content will be considered. Email <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a> with your order details.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Intellectual Property</h2>
          <p>All course content — including videos, materials, frameworks, and exercises — is the intellectual property of Priya Ahuja. You may not reproduce, distribute, or resell any content without written permission.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Conduct</h2>
          <p>Learners are expected to engage with course content in good faith. We reserve the right to revoke access for misuse, including sharing login credentials or distributing course materials.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Disclaimer</h2>
          <p>Course content is for educational purposes only. It does not constitute legal, financial, or professional advice. Outcomes vary based on individual effort and circumstances.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Contact</h2>
          <p>For any questions regarding these terms, write to <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a>.</p>
        </section>

      </div>
    </div>
  )
}
