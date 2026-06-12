import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { getTemplate } from "@/lib/templates-data"

const EXTRA_PRODUCTS: Record<string, { slug: string; title: string; description: string; price: number; comingSoon: boolean }> = {
  "angel-investor-list": {
    slug: "angel-investor-list",
    title: "Angel Investor List",
    description: "1400+ angel investors across India — name, city, LinkedIn, and emails.",
    price: 99900,
    comingSoon: false,
  },
  "startup-ideas-2026": {
    slug: "startup-ideas-2026",
    title: "100 Startup Ideas 2026",
    description: "100 curated startup ideas for Indian founders — problem, opportunity, market size, and business model.",
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

    const template = getTemplate(slug) ?? EXTRA_PRODUCTS[slug] ?? null
    if (!template || template.comingSoon) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find or create digital product record
    let [product] = await db
      .select()
      .from(digitalProducts)
      .where(eq(digitalProducts.slug, slug))
      .limit(1)

    if (!product) {
      const [created] = await db
        .insert(digitalProducts)
        .values({
          slug: template.slug,
          title: template.title,
          description: template.description,
          price: template.price,
          isActive: true,
        })
        .returning()
      product = created
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: template.price,
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
      amount: template.price,
      keyId: process.env.RAZORPAY_KEY_ID,
      purchaseId: purchase.id,
      productTitle: template.title,
    })
  } catch (err) {
    console.error("products/create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
