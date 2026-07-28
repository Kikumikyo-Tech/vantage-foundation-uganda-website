import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";

export function TrustStrip() {
  const trustItems = [
    `Youth-led since ${site.founded}`,
    "Uganda-based",
    "100% volunteer-run",
    "Community-centred",
  ];

  return (
    <section className="border-y border-border bg-surface py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
          {trustItems.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
