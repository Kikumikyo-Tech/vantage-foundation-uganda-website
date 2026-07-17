import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateDonationStatus } from "@/lib/db";

const validStatuses = ["pending", "verified", "rejected"] as const;
type ValidStatus = (typeof validStatuses)[number];

function isValidStatus(value: string): value is ValidStatus {
  return (validStatuses as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("vantage_admin")?.value;

  if (adminCookie !== process.env.ADMIN_SECRET || !process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 302);
  }

  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const status = formData.get("status") as string;
  const adminNotes = (formData.get("adminNotes") as string) || "";

  if (!Number.isFinite(id) || !isValidStatus(status)) {
    return NextResponse.redirect(
      new URL("/admin/donations?error=invalid", request.url),
      303
    );
  }

  try {
    await updateDonationStatus(id, status, adminNotes);
    return NextResponse.redirect(
      new URL("/admin/donations?updated=1", request.url),
      303
    );
  } catch {
    return NextResponse.redirect(
      new URL("/admin/donations?error=db", request.url),
      303
    );
  }
}
