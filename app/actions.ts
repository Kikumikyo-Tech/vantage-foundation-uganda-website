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
  website: z.string().optional(), // honeypot
});

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  consent: z.enum(["on"], { message: "Please consent to receive updates" }),
  website: z.string().optional(), // honeypot
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
  website: z.string().optional(), // honeypot
});

export type FormState = {
  success: boolean;
  message: string;
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

async function sendEmail(subject: string, body: string): Promise<boolean> {
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

    await transporter.sendMail({
      from: process.env.SMTP_FROM || site.contact.email,
      to: site.contact.email,
      subject,
      text: body,
    });
    return true;
  } catch (err) {
    // Log the SMTP failure for the operator without exposing PII.
    // The error message from nodemailer may contain connection details but
    // not email body content; we log the message for debugging.
    const errMsg = err instanceof Error ? err.message : String(err);
    logError("email_send_failed", {
      smtp_host: smtpHost,
      subject,
      error: errMsg.substring(0, 200),
    });
    return false;
  }
}

function formatBody(data: Record<string, unknown>) {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
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

  if (raw.website) {
    // Honeypot triggered — silently succeed without processing.
    logWarn("contact_honeypot", {});
    return { success: true, message: "Thank you. We will be in touch soon." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("contact_validation_failed", {
      issues: parsed.error.issues.length,
    });
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const body = formatBody(parsed.data);
  const emailSent = await sendEmail(`Contact form: ${parsed.data.subject}`, body);

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

  if (raw.website) {
    logWarn("newsletter_honeypot", {});
    return { success: true, message: "Thank you for subscribing." };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("newsletter_validation_failed", {
      issues: parsed.error.issues.length,
    });
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const body = formatBody(parsed.data);
  const emailSent = await sendEmail("Newsletter signup", body);

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

  if (raw.website) {
    logWarn("donor_honeypot", {});
    return { success: true, message: "Thank you for your donation intent." };
  }

  const parsed = donorSchema.safeParse(raw);
  if (!parsed.success) {
    logWarn("donor_validation_failed", {
      issues: parsed.error.issues.length,
    });
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
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

    const body = formatBody(parsed.data);
    await sendEmail("Donation intent received", body);

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

    const body = formatBody(parsed.data);
    const emailSent = await sendEmail("Donation intent", body);

    logInfo("donation_fallback_email", { email_sent: emailSent });

    return {
      success: emailSent,
      message: emailSent
        ? "Thank you. We received your donation details and will follow up with payment instructions."
        : "We could not save your donation details. Please use the payment instructions on this page or contact us directly.",
    };
  }
}
