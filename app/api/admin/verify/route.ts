import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { updateDonationStatus } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrf } from "@/lib/csrf";
import { logInfo, logWarn, logError } from "@/lib/logger";

const validStatuses = ["pending", "verified", "rejected"] as const;

const verifySchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(validStatuses),
  adminNotes: z.string().optional().default(""),
  csrf_token: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("vantage_admin")?.value;

  if (adminCookie !== process.env.ADMIN_SECRET || !process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 302);
  }

  // Rate limit status changes: 20 per minute per admin IP.
  const ip = getClientIp(request.headers);
  if (!rateLimit({ key: `admin-verify:${ip}`, limit: 20, windowMs: 60_000 })) {
    logWarn("verify_rate_limited", { ip });
    return NextResponse.redirect(
      new URL("/admin/donations?error=rate-limited", request.url),
      303
    );
  }

  const formData = await request.formData();

  // CSRF validation (double-submit cookie).
  if (!validateCsrf(cookieStore, formData)) {
    logWarn("verify_csrf_failed", {});
    return NextResponse.redirect(
      new URL("/admin/donations?error=csrf", request.url),
      303
    );
  }

  const parsed = verifySchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: (formData.get("adminNotes") as string) || "",
  });

  if (!parsed.success) {
    logWarn("verify_validation_failed", {
      issues: parsed.error.issues.length,
    });
    return NextResponse.redirect(
      new URL("/admin/donations?error=invalid", request.url),
      303
    );
  }

  const { id, status, adminNotes } = parsed.data;

  try {
    await updateDonationStatus(id, status, adminNotes);
    logInfo("donation_status_updated", { id, status });
    return NextResponse.redirect(
      new URL("/admin/donations?updated=1", request.url),
      303
    );
  } catch (err) {
    logError("donation_update_failed", {
      id,
      status,
      error: (err instanceof Error ? err.message : String(err)).substring(0, 200),
    });
    return NextResponse.redirect(
      new URL("/admin/donations?error=db", request.url),
      303
    );
  }
}
