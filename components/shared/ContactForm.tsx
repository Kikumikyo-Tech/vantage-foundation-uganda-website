"use client";

import { useActionState } from "react";
import { submitContact, FormState } from "@/app/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { HoneypotFields } from "@/components/shared/HoneypotFields";
import { FieldError } from "@/components/shared/FieldError";
import { FormPrivacyNotice } from "@/components/shared/FormPrivacyNotice";

const subjects = [
  { value: "", label: "Select a subject" },
  { value: "general", label: "General inquiry" },
  { value: "volunteer", label: "Volunteering" },
  { value: "partner", label: "Partnership" },
  { value: "sponsor", label: "Sponsorship" },
  { value: "donation", label: "Donation support" },
  { value: "media", label: "Media inquiry" },
];

const initialState: FormState = {
  success: false,
  message: "",
};

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <HoneypotFields />

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          className="mt-1.5"
          aria-invalid={state.fieldErrors?.name ? true : undefined}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
        />
        <FieldError id="name-error" message={state.fieldErrors?.name} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5"
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
        />
        <FieldError id="email-error" message={state.fieldErrors?.email} />
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select
          id="subject"
          name="subject"
          required
          defaultValue={defaultSubject}
          className="mt-1.5"
          aria-invalid={state.fieldErrors?.subject ? true : undefined}
          aria-describedby={state.fieldErrors?.subject ? "subject-error" : undefined}
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <FieldError id="subject-error" message={state.fieldErrors?.subject} />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5"
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={state.fieldErrors?.message} />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send message"}
      </Button>

      <FormPrivacyNotice text="We will only use your details to respond to your enquiry. See our" />

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
