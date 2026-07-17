"use client";

import { useActionState } from "react";
import { submitContact, FormState } from "@/app/actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

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
    <form action={formAction} className="space-y-5">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
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
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={5} className="mt-1.5" />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send message"}
      </Button>

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
