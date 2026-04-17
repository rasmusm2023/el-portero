import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Old `/menu` hub removed; send guests to home menu cards. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/menu") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.hash = "menus";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: "/menu",
};
