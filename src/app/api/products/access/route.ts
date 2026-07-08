import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { getTemplate } from "@/lib/templates-data"
import { eq, and } from "drizzle-orm"
import { auth, isAdmin } from "@/lib/auth"

// GET /api/products/access?token=xxx&slug=yyy
// Returns template content if the token is valid for this product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    const slug = searchParams.get("slug")

    if (!token || !slug) {
      return NextResponse.json({ error: "Missing token or slug" }, { status: 400 })
    }

    const template = getTemplate(slug)
    if (!template) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find digital product
    const [product] = await db
      .select({ id: digitalProducts.id })
      .from(digitalProducts)
      .where(eq(digitalProducts.slug, slug))
      .limit(1)

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const session = await auth()
    if (!isAdmin(session?.user?.email)) {
      // Validate the access token and check expiry
      const [purchase] = await db
        .select({ id: purchases.id, tokenExpiresAt: purchases.tokenExpiresAt })
        .from(purchases)
        .where(
          and(
            eq(purchases.downloadToken, token),
            eq(purchases.productId, product.id)
          )
        )
        .limit(1)

      if (!purchase) {
        return NextResponse.json({ error: "Invalid or expired access token" }, { status: 403 })
      }

      if (purchase.tokenExpiresAt && purchase.tokenExpiresAt < new Date()) {
        return NextResponse.json({ error: "Access token has expired" }, { status: 403 })
      }
    }

    return NextResponse.json({ sections: template.sections })
  } catch (err) {
    console.error("products/access error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products/access - check access by email
export async function POST(req: NextRequest) {
  try {
    const { email, slug } = await req.json()

    if (!email || !slug) {
      return NextResponse.json({ error: "Missing email or slug" }, { status: 400 })
    }

    const template = getTemplate(slug)
    if (!template) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const [product] = await db
      .select({ id: digitalProducts.id })
      .from(digitalProducts)
      .where(eq(digitalProducts.slug, slug))
      .limit(1)

    if (!product) {
      return NextResponse.json({ hasAccess: false })
    }

    if (isAdmin(email)) {
      return NextResponse.json({ hasAccess: true, accessToken: "admin" })
    }

    const [purchase] = await db
      .select({ downloadToken: purchases.downloadToken })
      .from(purchases)
      .where(
        and(
          eq(purchases.userEmail, email),
          eq(purchases.productId, product.id)
        )
      )
      .limit(1)

    if (!purchase?.downloadToken) {
      return NextResponse.json({ hasAccess: false })
    }

    return NextResponse.json({ hasAccess: true, accessToken: purchase.downloadToken })
  } catch (err) {
    console.error("products/access POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
