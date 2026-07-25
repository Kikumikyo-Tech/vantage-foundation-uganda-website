import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (!rateLimit({ key: `admin-login:${ip}`, limit: 5, windowMs: 60_000 })) {
    return NextResponse.redirect(
      new URL("/admin/login?error=rate-limited", request.url),
      302
    );
  }

  const formData = await request.formData();
  const password = (formData.get("password") as string) || "";

  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 302);
  }

  const response = NextResponse.redirect(new URL("/admin/donations", request.url), 302);
  response.cookies.set("vantage_admin", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
