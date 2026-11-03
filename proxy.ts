import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic guard only. The real check lives in the private layout and
 * in the /books/[id] page, both of which wait for `useSession()` to finish
 * loading before redirecting. That is what keeps a reload from ever
 * bouncing a signed-in reader back to /login.
 */
const PRIVATE_PREFIXES = [
  "/add-book",
  "/my-books",
  "/my-borrows",
  "/profile",
];

function isPrivateRoute(pathname: string) {
  if (pathname.startsWith("/books/")) return true;
  return PRIVATE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPrivateRoute(pathname)) {
    return NextResponse.next();
  }

  if (!getSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/profile/:path*",
    "/books/:path*",
  ],
};
