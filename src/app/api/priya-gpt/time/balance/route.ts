import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getMinutesBalance } from "@/lib/priya-gpt-time"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const minutes = await getMinutesBalance(session.user.id)
  return NextResponse.json({ minutes })
}
