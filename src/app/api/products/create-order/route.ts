import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { getTemplate } from "@/lib/templates-data"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq, and } from "drizzle-orm"
import { digitalProducts } from "@/lib/db/schema"

export async function POST(req: NextRequest) {
  try {
    const { slug, name, email } = await req.json()

    if (!slug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = getTemplate(slug)
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
