import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { addMinutes } from "@/lib/priya-gpt-time"
import { getTimePackages } from "@/lib/priya-gpt-packages"

// admin-only: credit a configured package's minutes without going through Razorpay
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { minutes } = (await req.json()) as { minutes: number }
    const packages = await getTimePackages()
    const pkg = packages.find((p) => p.minutes === minutes)
    if (!pkg) {
      return NextResponse.json({ error: "Unknown package" }, { status: 400 })
    }

    const newBalance = await addMinutes(session.user.id, pkg.minutes, { reason: "admin_grant" })

    return NextResponse.json({ minutesRemaining: newBalance })
  } catch (err) {
    console.error("priya-gpt admin-grant error:", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 })
  }
}
