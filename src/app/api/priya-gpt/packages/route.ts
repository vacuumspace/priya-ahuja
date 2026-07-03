import { NextResponse } from "next/server"
import { getTimePackages } from "@/lib/priya-gpt-packages"

// public: pricing info shown to signed-out visitors too
export async function GET() {
  const packages = await getTimePackages()
  return NextResponse.json({ packages })
}
