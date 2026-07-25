import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  getOrCreateCsrfToken,
} from "@/lib/csrf";

// Proxy runs before routes are rendered. We use it to:
//   - Set the CSRF cookie for admin pages (double-submit cookie pattern).
//
// In Next.js 16, `middleware.ts` is deprecated and renamed to `proxy.ts`.
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
//
// Note: proxy.ts cannot import from the main app's module graph in all cases.
// The CSRF token generation is self-contained in lib/csrf.ts which has no
// heavy dependencies, so this is safe.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only set CSRF cookie for admin pages and admin API routes.
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const existingCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const token = getOrCreateCsrfToken(existingCookie);

  // Pass the token to the page via a request header so Server Components
  // can read it (they cannot set cookies, only read headers).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSRF_HEADER_NAME, token);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set/refresh the CSRF cookie on the response. Only set it if it doesn't
  // already exist or needs refreshing (avoid setting on every request).
  // Path is "/" so the cookie is sent to both /admin/* pages and /api/admin/* routes.
  if (!existingCookie || existingCookie !== token) {
    response.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day, matches admin session
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
