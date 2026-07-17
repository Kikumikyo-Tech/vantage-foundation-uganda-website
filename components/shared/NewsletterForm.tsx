"use client";

import { useActionState } from "react";
import { submitNewsletter, FormState } from "@/app/actions";
import { Button } from "@/components/ui/Button";

const initialState: FormState = {
  success: false,
  message: "",
};

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(submitNewsletter, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex items-start gap-2">
        <input
          id="newsletter-consent"
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="newsletter-consent" className="text-xs text-muted-foreground">
          I agree to receive updates from Vantage Foundation Uganda.
        </label>
      </div>
      <Button type="submit" disabled={pending} size="sm" className="w-full">
        {pending ? "Subscribing..." : "Subscribe"}
      </Button>
      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs ${state.success ? "text-green-700" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
