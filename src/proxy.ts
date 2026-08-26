import { NextRequest, NextResponse } from "next/server"

const MAINTENANCE_HOSTS = new Set(["www.priyaahuja.in", "priyaahuja.in"])
const TEMP_HOST = "priya.priyaahuja.in"

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? ""
  const { pathname } = request.nextUrl

  if (MAINTENANCE_HOSTS.has(hostname) && pathname !== "/maintenance") {
    const url = request.nextUrl.clone()
    url.pathname = "/maintenance"
    const response = NextResponse.rewrite(url)
    response.headers.set("x-pathname", pathname)
    return response
  }

  if (hostname === TEMP_HOST && pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "content-type": "text/plain" },
    })
  }

  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)
  if (hostname === TEMP_HOST) {
    response.headers.set("x-robots-tag", "noindex, nofollow, noarchive")
  }
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
