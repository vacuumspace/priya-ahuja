import crypto from "crypto"

export function getRazorpayInstance() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require("razorpay")
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")
  return expectedSignature === signature
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex")
  return expectedSignature === signature
}

export function paiseToCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}
