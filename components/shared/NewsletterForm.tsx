"use client";

import { useActionState } from "react";
import { submitNewsletter, FormState } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { HoneypotFields } from "@/components/shared/HoneypotFields";
import { FieldError } from "@/components/shared/FieldError";
import { FormPrivacyNotice } from "@/components/shared/FormPrivacyNotice";

const initialState: FormState = {
  success: false,
  message: "",
};

interface NewsletterFormProps {
  /**
   * Use light text colors when rendered on a dark background (e.g.
   * bg-primary). Defaults to false (dark text on light backgrounds).
   */
  light?: boolean;
}

export function NewsletterForm({ light = false }: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(submitNewsletter, initialState);

  return (
    <form action={formAction} className="space-y-3" noValidate>
      <HoneypotFields />
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        aria-invalid={state.fieldErrors?.email ? true : undefined}
        aria-describedby={state.fieldErrors?.email ? "newsletter-email-error" : undefined}
      />
      <FieldError id="newsletter-email-error" message={state.fieldErrors?.email} />
      <div className="flex items-start gap-2">
        <input
          id="newsletter-consent"
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          aria-invalid={state.fieldErrors?.consent ? true : undefined}
          aria-describedby={state.fieldErrors?.consent ? "newsletter-consent-error" : undefined}
        />
        <label
          htmlFor="newsletter-consent"
          className={`text-xs ${light ? "text-white/90" : "text-muted-foreground"}`}
        >
          I agree to receive updates from Vantage Foundation Uganda.
        </label>
      </div>
      <FieldError id="newsletter-consent-error" message={state.fieldErrors?.consent} />
      <Button type="submit" disabled={pending} size="sm" className="w-full">
        {pending ? "Subscribing..." : "Subscribe"}
      </Button>
      <FormPrivacyNotice text="You can unsubscribe at any time. See our" light={light} />
      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs ${
            state.success
              ? light
                ? "text-success-bg"
                : "text-success"
              : light
                ? "text-destructive-bg"
                : "text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
