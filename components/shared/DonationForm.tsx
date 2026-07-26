"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitDonor, FormState } from "@/app/actions";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { suggestedAmounts, donationCampaigns } from "@/content/donate";

const initialState: FormState = {
  success: false,
  message: "",
};

export function DonationForm() {
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [custom, setCustom] = useState("");
  const [state, formAction, pending] = useActionState(submitDonor, initialState);

  const displayAmount = custom || amount || "";

  return (
    <form action={formAction} className="space-y-5">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <fieldset>
        <legend>
          <Label>Choose an amount (UGX)</Label>
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {suggestedAmounts.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setAmount(item.value.toString());
                setCustom("");
              }}
              aria-pressed={amount === item.value.toString()}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                amount === item.value.toString()
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="custom-amount">Or enter a custom amount</Label>
        <Input
          id="custom-amount"
          type="number"
          min={1}
          placeholder="Enter amount in UGX"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setAmount("");
          }}
          className="mt-1.5"
        />
      </div>

      <input type="hidden" name="amount" value={displayAmount} />

      <fieldset>
        <legend>
          <Label>Frequency</Label>
        </legend>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setFrequency("one-time")}
            aria-pressed={frequency === "one-time"}
            className={`rounded-lg border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              frequency === "one-time"
                ? "border-primary bg-primary text-white"
                : "border-border bg-white hover:bg-slate-50"
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setFrequency("monthly")}
            aria-pressed={frequency === "monthly"}
            className={`rounded-lg border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              frequency === "monthly"
                ? "border-primary bg-primary text-white"
                : "border-border bg-white hover:bg-slate-50"
            }`}
          >
            Monthly
          </button>
        </div>
      </fieldset>

      <input type="hidden" name="frequency" value={frequency} />

      <div>
        <Label htmlFor="campaign">Support a specific project</Label>
        <Select id="campaign" name="campaign" required className="mt-1.5">
          {donationCampaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="donor-name">Name</Label>
        <Input id="donor-name" name="name" required className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="donor-email">Email</Label>
        <Input
          id="donor-email"
          name="email"
          type="email"
          required
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="donor-phone">Phone (optional)</Label>
        <Input id="donor-phone" name="phone" type="tel" className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="donor-transaction">
          Transaction reference (optional)
        </Label>
        <Input
          id="donor-transaction"
          name="transactionReference"
          placeholder="Bank or Mobile Money transfer reference"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="donor-message">Message (optional)</Label>
        <Input id="donor-message" name="message" className="mt-1.5" />
      </div>

      <Button type="submit" disabled={pending || !displayAmount} className="w-full">
        {pending ? "Submitting..." : "Confirm donation intent"}
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
