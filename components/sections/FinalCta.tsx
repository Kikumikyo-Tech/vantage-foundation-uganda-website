import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="bg-navy py-16 text-white md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Help us create one more advantage
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            Your support expands access to healthcare, education, clean water
            and humanitarian support for communities that need it most.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/donate" size="lg">
              Donate Now
            </Button>
            <Button
              href="/get-involved"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Get Involved
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
