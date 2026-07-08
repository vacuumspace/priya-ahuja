import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { getTemplate } from "@/lib/templates-data"

const EXTRA_PRODUCTS: Record<string, { slug: string; title: string; description: string; price: number; comingSoon: boolean }> = {
  "angel-investor-list": {
    slug: "angel-investor-list",
    title: "Angel Investor List",
    description: "1400+ angel investors across India - name, city, LinkedIn, and emails.",
    price: 99900,
    comingSoon: false,
  },
  "early-stage-vc-list": {
    slug: "early-stage-vc-list",
    title: "Early Stage VC List",
    description: "Early stage VC firms actively investing in Indian startups - partner names, LinkedIn, and direct contact.",
    price: 499900,
    comingSoon: false,
  },
  "family-offices-list": {
    slug: "family-offices-list",
    title: "Family Offices List",
    description: "Family offices investing in Indian startups - office details and team contacts with direct emails.",
    price: 299900,
    comingSoon: false,
  },
  "incubators-list": {
    slug: "incubators-list",
    title: "Incubator & Accelerator List",
    description: "Indian incubators and accelerators - program details and team contacts with direct emails.",
    price: 99900,
    comingSoon: false,
  },
  "startup-ideas-2026": {
    slug: "startup-ideas-2026",
    title: "100 Startup Ideas 2026",
    description: "100 curated startup ideas for Indian founders - problem, opportunity, market size, and business model.",
    price: 99900,
    comingSoon: false,
  },
}
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq, and } from "drizzle-orm"
import { digitalProducts } from "@/lib/db/schema"

export async function POST(req: NextRequest) {
  try {
    const { slug, name, email } = await req.json()

    if (!slug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const template = getTemplate(slug) ?? EXTRA_PRODUCTS[slug] ?? null
    if (!template || template.comingSoon) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // If product already exists in DB, use its price (admin may have changed it)
    const existing = await db.select().from(digitalProducts).where(eq(digitalProducts.slug, template.slug)).limit(1)
    const [product] = existing.length > 0
      ? existing
      : await db
          .insert(digitalProducts)
          .values({
            slug: template.slug,
            title: template.title,
            description: template.description,
            price: template.price,
            isActive: true,
          })
          .returning()

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: product.price,
      currency: "INR",
      receipt: `product_${Date.now()}`,
    })

    const [purchase] = await db
      .insert(purchases)
      .values({
        productId: product.id,
        userEmail: email,
        userName: name,
        razorpayOrderId: order.id,
      })
      .returning({ id: purchases.id })

    return NextResponse.json({
      orderId: order.id,
      amount: product.price,
      keyId: process.env.RAZORPAY_KEY_ID,
      purchaseId: purchase.id,
      productTitle: template.title,
    })
  } catch (err) {
    console.error("products/create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
