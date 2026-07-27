"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { site } from "@/content/site";
import { createDonation } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logInfo, logWarn, logError } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(), // honeypot 1
  company_url: z.string().optional(), // honeypot 2 (realistic name)
  form_loaded_at: z.string().optional(), // time-trap
});

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  consent: z.enum(["on"], { message: "Please consent to receive updates" }),
  website: z.string().optional(), // honeypot 1
  company_url: z.string().optional(), // honeypot 2
  form_loaded_at: z.string().optional(), // time-trap
});

const donorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  amount: z.coerce.number().positive("Please select or enter a valid amount"),
  frequency: z.enum(["one-time", "monthly"]),
  campaign: z.string().min(1, "Please select a campaign"),
  transactionReference: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(), // honeypot 1
  company_url: z.string().optional(), // honeypot 2
  form_loaded_at: z.string().optional(), // time-trap
  submissionId: z.string().optional(), // idempotency token
});

export type FormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

// Rate limit for public form submissions: 3 per minute per IP.
const FORM_RATE_LIMIT = 3;
const FORM_RATE_WINDOW_MS = 60_000;

async function checkFormRateLimit(action: string): Promise<boolean> {
  const h = await headers();
  const ip = getClientIp(h);
  return rateLimit({
    key: `form:${action}:${ip}`,
    limit: FORM_RATE_LIMIT,
    windowMs: FORM_RATE_WINDOW_MS,
  });
}

const RATE_LIMITED_MESSAGE =
  "Too many submissions from your location. Please wait a minute and try again.";

// --- Idempotency: track recent submission IDs to prevent duplicate donations ---
// In-memory Set with TTL. Entries expire after 5 minutes.
const IDEMPOTENCY_TTL_MS = 5 * 60_000;
const recentSubmissionIds = new Map<string, number>();

function isDuplicateSubmission(submissionId: string): boolean {
  const now = Date.now();
  // Prune expired entries.
  for (const [id, ts] of recentSubmissionIds) {
    if (now - ts > IDEMPOTENCY_TTL_MS) {
      recentSubmissionIds.delete(id);
    }
  }
  if (recentSubmissionIds.has(submissionId)) {
    return true;
  }
  recentSubmissionIds.set(submissionId, now);
  return false;
}

// --- Honeypot + time-trap check ---
// Returns true if the submission looks like a bot.
function isBotSubmission(raw: Record<string, unknown>): boolean {
  // Honeypot 1: "website" field should be empty.
  if (raw.website) return true;
  // Honeypot 2: "company_url" field should be empty.
  if (raw.company_url) return true;
  // Time-trap: if form_loaded_at is present and submission took < 2 seconds,
  // it's likely a bot (humans take longer to fill forms).
  const loadedAt = raw.form_loaded_at;
  if (loadedAt && typeof loadedAt === "string") {
    const ts = Number(loadedAt);
    if (!Number.isNaN(ts) && Date.now() - ts < 2000) {
      return true;
    }
  }
  return false;
}

// --- SMTP_FROM validation ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getValidatedFromAddress(): string {
  const from = process.env.SMTP_FROM || site.contact.email;
  if (!EMAIL_REGEX.test(from)) {
    logWarn("smtp_from_invalid", { from: from.substring(0, 50) });
    return site.contact.email;
  }
  return from;
}

// --- Email sanitization ---
// Strip control characters and limit length to prevent email header injection.
function sanitiseValue(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .replace(/[\r\n\t]/g, " ") // strip line breaks and tabs
    .replace(/\x00-\x1f/g, " ") // strip control chars
    .substring(0, 1000); // limit length
}

async function sendEmail(
  subject: string,
  body: string,
  html?: string
): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) return false;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = getValidatedFromAddress();
    await transporter.sendMail({
      from,
      to: site.contact.email,
      subject,
      text: body,
      ...(html ? { html } : {}),
    });
    return true;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    logError("email_send_failed", {
      smtp_host: smtpHost,
      subject,
      error: errMsg.substring(0, 200),
    });
    return false;
  }
}

function formatBody(data: Record<string, unknown>): string {
  return Object.entries(data)
    .filter(([key]) => !["website", "company_url", "form_loaded_at", "submissionId"].includes(key))
    .map(([key, value]) => `${key}: ${sanitiseValue(value)}`)
    .join("\n");
}

// --- HTML email template ---
function emailTemplate(title: string, rows: { label: string; value: string }[]): string {
  const tableRows = rows
    .map(
      (r) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;color:#050708;vertical-align:top;">${r.label}</td><td style="padding:4px 0;color:#475569;">${r.value}</td></tr>`
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f7fafa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dce5e5;">
        <tr><td style="background:#008f95;padding:20px 24px;">
          <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;">${title}</h1>
        </td></tr>
        <tr><td style="padding:24px;">
          <p style="margin:0 0 16px;color:#475569;">A new submission was received on the Vantage Foundation Uganda website.</p>
          <table cellpadding="0" cellspacing="0">${tableRows}</table>
          <p style="margin:24px 0 0;color:#475569;font-size:12px;border-top:1px solid #dce5e5;padding-top:16px;">
            This is an automated notification from vantagefoundationuganda.org
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailRows(data: Record<string, unknown>): { label: string; value: string }[] {
  const labelMap: Record<string, string> = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    amount: "Amount",
    frequency: "Frequency",
    campaign: "Campaign",
    transactionReference: "Transaction Reference",
    consent: "Consent",
  };
  return Object.entries(data)
    .filter(([key]) => !["website", "company_url", "form_loaded_at", "submissionId"].includes(key))
    .map(([key, value]) => ({
      label: labelMap[key] || key,
      value: sanitiseValue(value),
    }));
}

export async function submitContact(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const allowed = await checkFormRateLimit("contact");
  if (!allowed) {
    logWarn("contact_rate_limited", {});
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const raw = Object.fromEntries(formData);

  if (isBotSubmission(raw)) {
    logWarn("contact_honeypot", {});
    return { success: true, message: "Thank you. We will be in touch soon." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("contact_validation_failed", {
      issues: parsed.error.issues.length,
    });
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the errors below.",
      fieldErrors,
    };
  }

  const rows = buildEmailRows(parsed.data);
  const body = formatBody(parsed.data);
  const html = emailTemplate(`Contact form: ${parsed.data.subject}`, rows);
  const emailSent = await sendEmail(`Contact form: ${parsed.data.subject}`, body, html);

  logInfo("contact_submitted", {
    email_sent: emailSent,
    subject: parsed.data.subject,
  });

  return {
    success: true,
    message: emailSent
      ? "Thank you. Your message has been sent and we will reply soon."
      : `Thank you. Please also email us directly at ${site.contact.email}.`,
  };
}

export async function submitNewsletter(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const allowed = await checkFormRateLimit("newsletter");
  if (!allowed) {
    logWarn("newsletter_rate_limited", {});
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const raw = Object.fromEntries(formData);

  if (isBotSubmission(raw)) {
    logWarn("newsletter_honeypot", {});
    return { success: true, message: "Thank you for subscribing." };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("newsletter_validation_failed", {
      issues: parsed.error.issues.length,
    });
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the errors below.",
      fieldErrors,
    };
  }

  const rows = buildEmailRows(parsed.data);
  const body = formatBody(parsed.data);
  const html = emailTemplate("Newsletter signup", rows);
  const emailSent = await sendEmail("Newsletter signup", body, html);

  logInfo("newsletter_submitted", { email_sent: emailSent });

  return {
    success: true,
    message: emailSent
      ? "Thank you for subscribing."
      : `Thank you. To confirm, please email ${site.contact.email} with subject 'Subscribe'.`,
  };
}

export async function submitDonor(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const allowed = await checkFormRateLimit("donor");
  if (!allowed) {
    logWarn("donor_rate_limited", {});
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const raw = Object.fromEntries(formData);

  if (isBotSubmission(raw)) {
    logWarn("donor_honeypot", {});
    return { success: true, message: "Thank you for your donation intent." };
  }

  const parsed = donorSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("donor_validation_failed", {
      issues: parsed.error.issues.length,
    });
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the errors below.",
      fieldErrors,
    };
  }

  // Idempotency check: if the same submissionId was seen recently,
  // return success without creating a duplicate record.
  const submissionId = parsed.data.submissionId;
  if (submissionId && isDuplicateSubmission(submissionId)) {
    logWarn("donation_duplicate_submission", { submissionId: submissionId.substring(0, 16) });
    return {
      success: true,
      message:
        "Thank you. Your donation has been recorded as pending. A Vantage administrator will verify the transfer against our bank statement before marking it as successful.",
    };
  }

  try {
    const donation = await createDonation({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
      campaign: parsed.data.campaign,
      transactionReference: parsed.data.transactionReference,
      message: parsed.data.message,
    });

    logInfo("donation_created", {
      id: donation.id,
      campaign: parsed.data.campaign,
      frequency: parsed.data.frequency,
    });

    const rows = buildEmailRows(parsed.data);
    const body = formatBody(parsed.data);
    const html = emailTemplate("Donation intent received", rows);
    await sendEmail("Donation intent received", body, html);

    return {
      success: true,
      message:
        "Thank you. Your donation has been recorded as pending. A Vantage administrator will verify the transfer against our bank statement before marking it as successful.",
    };
  } catch (err) {
    // If the database is not configured, fall back to email only.
    logError("donation_db_failed", {
      error: (err instanceof Error ? err.message : String(err)).substring(0, 200),
      campaign: parsed.data.campaign,
      frequency: parsed.data.frequency,
    });

    const rows = buildEmailRows(parsed.data);
    const body = formatBody(parsed.data);
    const html = emailTemplate("Donation intent", rows);
    const emailSent = await sendEmail("Donation intent", body, html);

    logInfo("donation_fallback_email", { email_sent: emailSent });

    return {
      success: emailSent,
      message: emailSent
        ? "Thank you. We received your donation details and will follow up with payment instructions."
        : "We could not save your donation details. Please use the payment instructions on this page or contact us directly.",
    };
  }
}
