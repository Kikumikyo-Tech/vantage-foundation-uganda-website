"use client";

import { useState } from "react";

/**
 * Renders hidden honeypot and time-trap fields for bot detection.
 *
 * - "website" and "company_url": honeypot fields that should stay empty.
 *   Bots tend to fill all fields; humans won't see these.
 * - "form_loaded_at": timestamp set when the form mounts. If the form is
 *   submitted within 2 seconds, it's likely a bot.
 *
 * Also includes an optional idempotency token for forms that need
 * duplicate-submission protection (e.g. donation form).
 */
interface HoneypotFieldsProps {
  /** When true, includes a hidden submissionId field for idempotency. */
  withIdempotency?: boolean;
}

export function HoneypotFields({ withIdempotency }: HoneypotFieldsProps) {
  // Generate values once on mount using lazy initializers.
  // This avoids setState-in-effect lint errors and ensures the
  // values are stable across re-renders.
  const [loadedAt] = useState<string>(() => Date.now().toString());
  const [submissionId] = useState<string>(
    () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  );

  return (
    <>
      {/* Honeypot 1: "website" — should be empty */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {/* Honeypot 2: "company_url" — realistic name, should be empty */}
      <input
        type="text"
        name="company_url"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {/* Time-trap: timestamp of form load */}
      <input type="hidden" name="form_loaded_at" value={loadedAt} />
      {/* Idempotency token: unique per form mount */}
      {withIdempotency && (
        <input type="hidden" name="submissionId" value={submissionId} />
      )}
    </>
  );
}
