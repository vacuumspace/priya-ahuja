import { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-700 text-ink mb-8">Privacy Policy</h1>
      <div className="font-sans text-sm text-ink/70 space-y-6 leading-relaxed">
        <p><strong className="text-ink">Last updated:</strong> June 2026</p>

        <section>
          <h2 className="font-semibold text-ink mb-2">Information We Collect</h2>
          <p>When you create an account or enrol in a course, we collect your name and email address. This is used solely to manage your enrolment and communicate course-related updates.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">How We Use Your Information</h2>
          <p>Your information is used to process course enrolments, send confirmation and access emails, and provide learner support. We do not sell or share your personal data with third parties.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Payments</h2>
          <p>Course payments are processed securely via Razorpay. We do not store your card or payment details on our servers.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Cookies</h2>
          <p>We use session cookies for authentication only. No advertising or third-party tracking cookies are used.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Data Retention</h2>
          <p>We retain your account information for as long as your account is active. You may request deletion of your data at any time by emailing <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a>.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Contact</h2>
          <p>For any privacy-related queries, write to us at <a href="mailto:team@priyaahuja.in" className="text-ink underline">team@priyaahuja.in</a>.</p>
        </section>

      </div>
    </div>
  )
}
