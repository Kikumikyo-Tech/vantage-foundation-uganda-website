import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { impactStats, outputs, outcomes, longTermGoals, regions, sdgs } from "@/content/impact";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ImpactSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Impact"
          title="Measurable impact, meaningful change"
          description="We track both numbers and stories to understand what works and what still needs to be done."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {impactStats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} note={stat.note} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-primary">Outputs</h3>
            <p className="mt-2 text-sm text-muted-foreground">What we have delivered.</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {outputs.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-primary">Outcomes</h3>
            <p className="mt-2 text-sm text-muted-foreground">The changes we see.</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-primary">Long-term goals</h3>
            <p className="mt-2 text-sm text-muted-foreground">The future we are building.</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {longTermGoals.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold">Geographic reach</h3>
            <p className="mt-2 text-muted-foreground">
              We identify districts and communities often overlooked by larger international NGOs.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {regions.map((region) => (
                <span
                  key={region}
                  className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold">Sustainable Development Goals</h3>
            <p className="mt-2 text-muted-foreground">
              Our work contributes to the following SDGs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {sdgs.map((goal) => (
                <span
                  key={goal}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white"
                  title={`SDG ${goal}`}
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/impact">See Full Impact Report</Button>
        </div>
      </Container>
    </section>
  );
}
