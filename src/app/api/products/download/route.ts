import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { getTemplate } from "@/lib/templates-data"
import { eq, and } from "drizzle-orm"
import { auth, isAdmin } from "@/lib/auth"

// GET /api/products/download?token=xxx&slug=yyy
// Returns template as downloadable HTML (opens correctly in Word/Google Docs)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    const slug = searchParams.get("slug")

    if (!token || !slug) {
      return new NextResponse("Missing token or slug", { status: 400 })
    }

    const template = getTemplate(slug)
    if (!template) {
      return new NextResponse("Product not found", { status: 404 })
    }

    const [product] = await db
      .select({ id: digitalProducts.id })
      .from(digitalProducts)
      .where(eq(digitalProducts.slug, slug))
      .limit(1)

    if (!product) {
      return new NextResponse("Not found", { status: 404 })
    }

    const session = await auth()
    if (!isAdmin(session?.user?.email)) {
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
        return new NextResponse("Invalid or expired access token", { status: 403 })
      }

      if (purchase.tokenExpiresAt && purchase.tokenExpiresAt < new Date()) {
        return new NextResponse("Access token has expired", { status: 403 })
      }
    }

    // Build Word-compatible HTML
    const sectionsHtml = template.sections
      .map(
        (s: { heading: string; body: string }) => `
        <h2 style="font-family:Calibri,sans-serif;font-size:14pt;color:#1a1a1a;margin-top:24pt;margin-bottom:6pt;border-bottom:1px solid #e0d6c5;padding-bottom:4pt;">${escapeHtml(s.heading)}</h2>
        <div style="font-family:Calibri,sans-serif;font-size:11pt;color:#3a3a3a;line-height:1.6;">
          ${markdownToHtml(s.body)}
        </div>`
      )
      .join("\n")

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(template.title)}</title>
  <!--[if gte mso 9]>
  <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom></w:WordDocument></xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, sans-serif; font-size: 11pt; color: #1a1a1a; margin: 48pt; }
    h1 { font-size: 22pt; color: #1a1a1a; margin-bottom: 4pt; }
    h2 { font-size: 14pt; color: #1a1a1a; margin-top: 24pt; margin-bottom: 6pt; border-bottom: 1px solid #e0d6c5; padding-bottom: 4pt; }
    p { margin: 0 0 8pt 0; line-height: 1.6; }
    ul, ol { margin: 8pt 0 8pt 20pt; }
    li { margin-bottom: 4pt; line-height: 1.6; }
    strong { font-weight: 600; }
    hr { border: none; border-top: 1px solid #e0d6c5; margin: 16pt 0; }
    .meta { font-size: 9pt; color: #888; margin-bottom: 24pt; }
  </style>
</head>
<body>
  <h1>${escapeHtml(template.title)}</h1>
  <p class="meta">Downloaded from priyaahuja.in · Priya Ahuja</p>
  <hr />
  ${sectionsHtml}
</body>
</html>`

    const filename = `${slug}-priyaahuja.in.doc`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "application/msword",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error("products/download error:", err)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function markdownToHtml(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("---")) return `<hr />`
      if (line.match(/^\*\*(.+)\*\*$/)) return `<p><strong>${escapeHtml(line.replace(/\*\*/g, ""))}</strong></p>`
      const escaped = escapeHtml(line)
      const bolded = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      if (line.startsWith("- ") || line.match(/^\d+\./)) {
        const item = bolded.replace(/^- /, "").replace(/^\d+\.\s*/, "")
        return `<li>${item}</li>`
      }
      if (line.trim() === "") return `<p>&nbsp;</p>`
      return `<p>${bolded}</p>`
    })
    .join("\n")
}
