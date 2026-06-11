import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  const testerEmail = process.env.TESTER_EMAIL
  const testerPassword = process.env.TESTER_PASSWORD

  if (!testerEmail || !testerPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email, password } = await req.json()

  console.log("env email:", JSON.stringify(testerEmail), "req email:", JSON.stringify(email))
  console.log("env pass:", JSON.stringify(testerPassword), "req pass:", JSON.stringify(password))

  if (email !== testerEmail || password !== testerPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Upsert tester user
  const existing = await db.select().from(users).where(eq(users.id, "tester-user-id")).limit(1)
  if (existing.length === 0) {
    await db.insert(users).values({
      id: "tester-user-id",
      email: testerEmail,
      name: "Tester",
    })
  }

  // Create session
  const sessionToken = randomUUID()
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await db.insert(sessions).values({
    sessionToken,
    userId: "tester-user-id",
    expires,
  })

  const isProduction = process.env.NODE_ENV === "production"
  const cookieName = isProduction ? "__Secure-authjs.session-token" : "authjs.session-token"

  const response = NextResponse.json({ ok: true })
  response.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "lax",
    expires,
  })

  return response
}
