import { site } from "@/content/site";
import { getPublishedImpactStats } from "@/content/impact";
import { Container } from "@/components/shared/Container";
import { StatCard } from "@/components/shared/StatCard";

export function TrustStrip() {
  const trustItems = [
    `Established ${site.founded}`,
    "Youth-led",
    "Uganda-based",
    "Community-centred",
    "Sustainable projects",
  ];

  return (
    <section className="border-y border-border bg-muted py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
          {trustItems.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {getPublishedImpactStats().map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              note={stat.note}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
