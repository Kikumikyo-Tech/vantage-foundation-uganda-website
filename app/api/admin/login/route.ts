import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  rateLimit,
  getClientIp,
  recordFailure,
  isLockedOut,
  clearFailures,
} from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { createSessionToken, sessionCookieName, sessionMaxAge } from "@/lib/session";
import { logWarn, logInfo } from "@/lib/logger";

// Lockout policy: after 5 failed attempts within 15 minutes, lock out for 15 minutes.
const LOCKOUT_MAX_FAILURES = 5;
const LOCKOUT_WINDOW_MS = 15 * 60_000;
const LOCKOUT_DURATION_MS = 15 * 60_000;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const lockoutKey = `admin-login-lockout:${ip}`;

  // Check lockout first (before rate limit, since lockout is stricter).
  const { locked, remainingSeconds } = isLockedOut(lockoutKey);
  if (locked) {
    logWarn("admin_login_locked_out", { ip, remainingSeconds });
    const url = new URL("/admin/login?error=locked", request.url);
    url.searchParams.set("seconds", remainingSeconds.toString());
    return NextResponse.redirect(url, 302);
  }

  // Rate limit: 5 attempts per minute (in addition to lockout).
  if (!rateLimit({ key: `admin-login:${ip}`, limit: 5, windowMs: 60_000 })) {
    logWarn("admin_login_rate_limited", { ip });
    return NextResponse.redirect(
      new URL("/admin/login?error=rate-limited", request.url),
      302
    );
  }

  const formData = await request.formData();
  const cookieStore = await cookies();
  if (!validateCsrf(cookieStore, formData)) {
    logWarn("admin_login_csrf_failed", { ip });
    return NextResponse.redirect(
      new URL("/admin/login?error=csrf", request.url),
      302
    );
  }

  const password = (formData.get("password") as string) || "";

  if (password !== process.env.ADMIN_SECRET || !process.env.ADMIN_SECRET) {
    // Record the failure for lockout tracking.
    recordFailure({
      key: lockoutKey,
      maxFailures: LOCKOUT_MAX_FAILURES,
      lockoutMs: LOCKOUT_DURATION_MS,
      windowMs: LOCKOUT_WINDOW_MS,
    });
    logWarn("admin_login_failed", { ip });
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 302);
  }

  // Successful login — clear any failure history.
  clearFailures(lockoutKey);
  logInfo("admin_login_success", { ip });

  // Issue a signed session token (HMAC of random session ID).
  // The raw ADMIN_SECRET is never stored in the cookie.
  const { token } = createSessionToken();
  const response = NextResponse.redirect(new URL("/admin/donations", request.url), 302);
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: sessionMaxAge,
  });

  return response;
}
