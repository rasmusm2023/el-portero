import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COMING_SOON =
  process.env.NEXT_PUBLIC_COMING_SOON === "true" ||
  process.env.NEXT_PUBLIC_COMING_SOON === "1";

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
  if (!COMING_SOON) return NextResponse.next();

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
