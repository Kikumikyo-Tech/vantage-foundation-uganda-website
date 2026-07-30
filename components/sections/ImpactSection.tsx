import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { getPublishedImpactStats } from "@/content/impact";
import { Button } from "@/components/ui/Button";

export function ImpactSection() {
  return (
    <section className="bg-surface py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Impact"
          title="Evidence with context"
          description="Each headline figure is tied to the programme, place, reporting period and counting method behind it."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {getPublishedImpactStats().map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground">
            These are programme-team figures and are not presented as
            independently audited results. Supporting public reports will be
            linked as they are approved for publication.
          </p>
          <Button href="/impact">Explore Our Impact</Button>
        </div>
      </Container>
    </section>
  );
}
