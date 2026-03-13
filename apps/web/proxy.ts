import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");

  const url = request.nextUrl;
  const protectedRoutes = ["/profile", "/dashboard/"];

  // If unauthenticated then redirects to "/" on visitng protected routes
  if (
    !refreshToken &&
    protectedRoutes.some((route) => url.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", url));
  }

  // If authenticated then redirects to "/dashboard" on visting auth route
  if (refreshToken && url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/profile", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/profile", "/dashboard"],
};
