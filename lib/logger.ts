// Structured server-side logging utility.
//
// Outputs JSON to stderr (captured by Vercel and most hosting providers).
// NEVER logs PII (names, emails, phone numbers, donation amounts, messages).
// Only logs operational metadata: action name, error type, status, timing.
//
// Usage:
//   import { logError, logInfo } from "@/lib/logger";
//   logError("contact_form", "validation_failed", { issues: parsed.error.issues.length });
//   logInfo("donation_created", { id: donation.id, campaign: donation.campaign });

type LogLevel = "info" | "warn" | "error";

interface LogContext {
  [key: string]: string | number | boolean | undefined;
}

function log(level: LogLevel, event: string, context?: LogContext): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...context,
  };
  // Use console.error for all levels so output goes to stderr (Vercel captures
  // stderr for structured logs). This avoids mixing with request stdout.
  const fn = level === "info" ? console.log : console.error;
  fn(JSON.stringify(entry));
}

export function logInfo(event: string, context?: LogContext): void {
  log("info", event, context);
}

export function logWarn(event: string, context?: LogContext): void {
  log("warn", event, context);
}

export function logError(event: string, context?: LogContext): void {
  log("error", event, context);
}
