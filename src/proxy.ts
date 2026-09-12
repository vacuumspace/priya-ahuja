import { NextRequest, NextResponse } from "next/server"

const RETIRED_HOST = "priya.priyaahuja.in"

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""

  if (hostname === RETIRED_HOST) {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    url.hostname = "priyaahuja.in"
    url.port = ""
    return NextResponse.redirect(url, 308)
  }

  const response = NextResponse.next()
  response.headers.set("x-pathname", request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
