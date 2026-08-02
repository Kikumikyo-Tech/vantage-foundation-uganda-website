import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { BrandPattern } from "@/components/shared/BrandPattern";
import { SectionDivider } from "@/components/shared/SectionDivider";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <BrandPattern variant="topographic" color="var(--deep-teal)" opacity={0.05} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--deep-teal) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-8 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--ocean-blue) 0%, transparent 70%)" }}
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {site.name}
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Changing the world,{" "}
              <span className="text-primary">one advantage</span> at a time.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {site.name} expands access to healthcare, education, clean water
              and humanitarian support for underserved communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/donate" size="lg">
                Support Our Work
              </Button>
              <Button href="/impact" variant="outline" size="lg">
                Explore Our Impact
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl opacity-20"
              style={{
                background: "linear-gradient(135deg, var(--deep-teal) 0%, var(--ocean-blue) 100%)",
              }}
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
              <ImageOrPlaceholder
                src="/images/photos/photo-006.webp"
                alt="Vantage Foundation Uganda volunteers and community members gather around donated supplies during an outreach event"
                fill
                preload
                preset="splitHero"
                containerClassName="h-full w-full"
              />
            </div>
          </div>
        </div>
      </Container>
      <SectionDivider shape="wave" position="bottom" toColor="var(--surface)" className="absolute bottom-0 left-0 right-0" />
    </section>
  );
}
