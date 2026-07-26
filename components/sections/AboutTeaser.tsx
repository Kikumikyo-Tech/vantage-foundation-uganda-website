import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";

export function AboutTeaser() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <ImageOrPlaceholder
              src="/images/placeholder-about.jpg"
              alt="Vantage Foundation Uganda community work"
              fill
              preset="half"
              containerClassName="h-full w-full"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              About Vantage
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              We are a work in progress that holds a candle for those younger than us.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Founded in December 2020, Vantage Foundation Uganda is a youth-led nonprofit
              that uplifts underserved communities through curated, sustainable and
              holistic projects in health, education, humanitarian aid and water, sanitation
              and hygiene.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We primarily serve young people, families and vulnerable populations in rural
              Ugandan communities and urban informal settlements — the places often
              overlooked by traditional interventions.
            </p>
            <Button href="/about-us" className="mt-8" variant="outline">
              Read Our Story
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
