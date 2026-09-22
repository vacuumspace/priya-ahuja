import { NextResponse } from "next/server"
import { getWallEntries } from "@/lib/journal-wall"
import { clampWallDate } from "@/lib/daily-win-journal"

// Public - the wall is meant to be browsable without signing in.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = clampWallDate(searchParams.get("date") ?? undefined)
  const entries = await getWallEntries(date)
  return NextResponse.json({ date, entries })
}
