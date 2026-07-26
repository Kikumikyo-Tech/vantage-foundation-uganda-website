import type { Metadata } from "next";
import { site } from "@/content/site";
import { whyDonate } from "@/content/donate";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DonationForm } from "@/components/shared/DonationForm";
import { Card } from "@/components/ui/Card";
import { Shield, Heart } from "lucide-react";
import { CopyBankDetails } from "@/components/shared/CopyBankDetails";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Vantage Foundation Uganda through a secure one-time or monthly donation.",
};

export default function DonatePage() {
  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Support our work"
            description="Your donation becomes one more advantage for a young person, family or community."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Why donate?</h2>
              <ul className="mt-6 space-y-4">
                {whyDonate.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Heart className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-xl bg-slate-50 p-6">
                <h3 className="text-lg font-semibold">Bank transfer</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="font-medium">{site.bankDetails.bankName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Account name</dt>
                    <dd className="font-medium">{site.bankDetails.accountName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Account number</dt>
                    <dd className="font-medium">{site.bankDetails.accountNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">SWIFT/BIC</dt>
                    <dd className="font-medium">{site.bankDetails.swiftCode}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <CopyBankDetails />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6">
                <h3 className="text-lg font-semibold text-amber-900">Mobile Money</h3>
                <p className="mt-2 text-sm text-amber-800">{site.mobileMoney}</p>
              </div>

              <div className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 shrink-0 text-primary" />
                <p>
                  We are 100% volunteer-run and committed to financial transparency. Your
                  details will only be used to process your donation and send a receipt.
                </p>
              </div>
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold">Make a donation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details, make the transfer, and include the transaction
                reference if you have one.
              </p>
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                All donations are recorded as <strong>pending</strong> until a Vantage
                administrator verifies the transfer against our official bank statement.
              </div>
              <div className="mt-6">
                <DonationForm />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
