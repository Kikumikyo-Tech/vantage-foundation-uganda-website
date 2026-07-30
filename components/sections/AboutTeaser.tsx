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
              src="/images/photos/photo-062.webp"
              alt="Young Ugandans take part in a Vantage Foundation community learning activity"
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
              Local leadership. Practical advantages. Lasting change.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Founded in December 2020, Vantage Foundation Uganda is a
              youth-led nonprofit responding to barriers that keep people
              from essential healthcare, practical financial knowledge,
              clean water and dignified household support.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We work with young people, families and vulnerable communities
              in rural districts and urban informal settlements. Community
              participation and youth leadership shape how every programme is
              designed and delivered.
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
