import type { Metadata } from "next";
import { getPublishedReports } from "@/content/reports";
import { getPublishedDocuments } from "@/lib/media-public";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Reports & Accountability",
  description: "Publication status, approved reports, safeguarding information and accountability commitments from Vantage Foundation Uganda.",
  path: "/reports-and-accountability",
});

// Lets an admin publish a new report via /admin/media without a code
// deploy — refreshes periodically well within the presigned URL TTL.
export const revalidate = 3600;

export default async function ReportsPage() {
  // Static reports plus anything an admin has since uploaded via
  // /admin/media (newest uploads first).
  const uploaded = await getPublishedDocuments();
  const reports = [...uploaded, ...getPublishedReports()];

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Reports & Accountability"
            description="Transparency is how we build trust with communities, donors and partners."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          {reports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
              <Card key={report.title} className="flex flex-col p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{report.title}</h3>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {report.type} &middot; {report.date}
                </p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {report.description}
                </p>
                {report.url && (
                  <Button href={report.url} variant="outline" className="mt-4" size="sm">
                    Download
                  </Button>
                )}
              </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto max-w-3xl p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold">Current publication status</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                No annual or financial report is currently approved for public
                download. We do not present unfinished documents as published
                evidence. Approved reports will appear here with their
                reporting period and document type.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/safeguarding" variant="outline">
                  Read Safeguarding Policy
                </Button>
                <Button href="/about-us/team" variant="outline">
                  Meet Our Leadership
                </Button>
                <Button href="/contact">Request Information</Button>
              </div>
            </Card>
          )}

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Safeguarding</h2>
              <p className="mt-4 text-muted-foreground">
                We are committed to protecting children, young people and vulnerable adults.
                Our safeguarding policy sets out how we prevent harm, respond to concerns and
                promote safe practice across all programmes.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Governance</h2>
              <p className="mt-4 text-muted-foreground">
                Vantage Foundation Uganda is led by a published volunteer
                leadership team and is working towards a formal board
                structure. Governance documents and financial reports will be
                added here only after approval for public release.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
