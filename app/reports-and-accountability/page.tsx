import type { Metadata } from "next";
import { getPublishedReports } from "@/content/reports";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Reports & Accountability",
  description: "Annual reports, financial statements, project reports and policies from Vantage Foundation Uganda.",
};

export default function ReportsPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            title="Reports & Accountability"
            description="Transparency is how we build trust with communities, donors and partners."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getPublishedReports().map((report) => (
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
                {report.url ? (
                  <Button href={report.url} variant="outline" className="mt-4" size="sm">
                    Download
                  </Button>
                ) : (
                  <span className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Coming soon
                  </span>
                )}
              </Card>
            ))}
          </div>

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
                Vantage Foundation Uganda is governed by a volunteer team and is working
                towards a formal board structure. We publish annual and financial reports to
                demonstrate accountability to our stakeholders.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
