"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { site } from "@/content/site";

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
  amount: z.string().min(1, "Please select or enter an amount"),
  frequency: z.enum(["one-time", "monthly"]),
  campaign: z.string().min(1, "Please select a campaign"),
  message: z.string().optional(),
  website: z.string().optional(), // honeypot
});

export type FormState = {
  success: boolean;
  message: string;
};

async function sendEmail(subject: string, body: string) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) return false;

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
  const raw = Object.fromEntries(formData);

  if (raw.website) {
    return { success: true, message: "Thank you. We will be in touch soon." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const body = formatBody(parsed.data);
  const emailSent = await sendEmail(`Contact form: ${parsed.data.subject}`, body);

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
  const raw = Object.fromEntries(formData);

  if (raw.website) {
    return { success: true, message: "Thank you for subscribing." };
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const body = formatBody(parsed.data);
  const emailSent = await sendEmail("Newsletter signup", body);

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
  const raw = Object.fromEntries(formData);

  if (raw.website) {
    return { success: true, message: "Thank you for your donation intent." };
  }

  const parsed = donorSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(". "),
    };
  }

  const body = formatBody(parsed.data);
  const emailSent = await sendEmail("Donation intent", body);

  return {
    success: true,
    message: emailSent
      ? "Thank you. We have received your donation details and will follow up with payment instructions."
      : `Thank you. Please use the payment instructions on this page or email ${site.contact.email}.`,
  };
}
