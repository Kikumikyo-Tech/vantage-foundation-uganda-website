import { NextResponse } from "next/server";
import { refreshInstagramCache } from "@/lib/instagram/client";

/**
 * Cron endpoint to refresh the Instagram cache.
 *
 * Configure an external scheduler (e.g. Vercel Cron) to send a POST request
 * to this endpoint every 6 to 12 hours.
 *
 * Security: requires a CRON_SECRET bearer token if set in env.
 */

export async function POST(request: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const count = await refreshInstagramCache();
    return NextResponse.json({ success: true, count, refreshedAt: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message.slice(0, 200) },
      { status: 502 },
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  return POST(request);
}
