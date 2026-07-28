import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              {site.name}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Changing the world,{" "}
              <span className="text-primary">one advantage</span> at a time.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {site.name} expands access to healthcare, education, clean water
              and humanitarian support for underserved communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/impact" size="lg">
                Explore Our Impact
              </Button>
              <Button href="/donate" variant="outline" size="lg">
                Support Our Work
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <ImageOrPlaceholder
                src="/images/photos/photo-006.webp"
                alt="Young people and community members in Uganda"
                fill
                priority
                preset="hero"
                containerClassName="h-full w-full"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
