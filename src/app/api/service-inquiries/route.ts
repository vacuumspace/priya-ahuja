import { db } from "@/lib/db"
import { serviceInquiries } from "@/lib/db/schema"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
})

export async function POST(req: Request) {
  const body = await req.json()
  const { type, name, email, phone, budget, projectDescription } = body

  if (!type || !name || !email || !projectDescription) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const [row] = await db
    .insert(serviceInquiries)
    .values({ type, name, email, phone: phone || null, budget: budget || null, projectDescription })
    .returning()

  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/service-inquiries`
  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border:1px solid #e8e8e8;border-radius:12px">
      <p style="font-size:16px;font-weight:700;color:#2D2D2D;margin:0 0 16px">New Service Enquiry</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;color:#555;margin-bottom:20px">
        <tr><td style="padding:6px 0;color:#999;width:100px">Name</td><td style="padding:6px 0;color:#2D2D2D;font-weight:600">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#999">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#FFA07A">${email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#999">Type</td><td style="padding:6px 0;color:#2D2D2D">${type}</td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#999">Phone</td><td style="padding:6px 0;color:#2D2D2D">${phone}</td></tr>` : ""}
        ${budget ? `<tr><td style="padding:6px 0;color:#999">Budget</td><td style="padding:6px 0;color:#2D2D2D">${budget}</td></tr>` : ""}
      </table>
      <p style="font-size:12px;font-weight:700;color:#2D2D2D;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">Project Description</p>
      <div style="background:#fafafa;border:1px solid #efefef;border-radius:8px;padding:16px 20px;margin-bottom:24px;font-size:13px;color:#555;line-height:1.7;white-space:pre-line">${projectDescription}</div>
      <a href="${adminUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">View in Admin →</a>
    </div>
  `

  transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME ?? "Priya Ahuja"}" <${process.env.EMAIL_USER}>`,
    to: adminEmails,
    subject: `New Service Enquiry from ${name} (${type})`,
    html,
  }).catch(console.error)

  return Response.json(row, { status: 201 })
}
