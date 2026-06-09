import { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-heading text-3xl font-700 text-ink mb-8">Privacy Policy</h1>
      <div className="font-sans text-sm text-ink/70 space-y-6 leading-relaxed">
        <p><strong className="text-ink">Last updated:</strong> June 2026</p>

        <section>
          <h2 className="font-semibold text-ink mb-2">Information We Collect</h2>
          <p>When you sign in or book a consultation, we collect your name and email address. We use this solely to manage your bookings and communicate with you.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">How We Use Your Information</h2>
          <p>Your information is used to process bookings, send confirmation emails, and deliver purchased digital products. We do not sell or share your data with third parties.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Payments</h2>
          <p>Payments are processed securely via Razorpay. We do not store your payment details.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Cookies</h2>
          <p>We use session cookies for authentication only. No tracking or advertising cookies are used.</p>
        </section>

        <section>
          <h2 className="font-semibold text-ink mb-2">Contact</h2>
          <p>For any privacy-related questions, email <a href="mailto:priyaahujaoffice@gmail.com" className="text-ink underline">priyaahujaoffice@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
