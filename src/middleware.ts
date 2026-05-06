import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { effectiveComingSoonForHost } from "@/config/siteMode";

const STATIC_FILE =
  /\.(?:ico|svg|png|jpe?g|gif|webp|mp4|webm|woff2?|ttf|eot|json|xml|txt|webmanifest)$/i;

function isAllowedWhenComingSoon(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  return STATIC_FILE.test(pathname);
}

export function middleware(request: NextRequest): NextResponse {
  const host = request.headers.get("x-forwarded-host");
  const fallbackHost = request.headers.get("host");
  if (!effectiveComingSoonForHost(host, fallbackHost))
    return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname === "/coming-soon") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isAllowedWhenComingSoon(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
