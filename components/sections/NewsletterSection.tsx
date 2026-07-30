import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { BrandPattern } from "@/components/shared/BrandPattern";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-white md:py-24">
      <BrandPattern variant="waves" color="var(--bright-aqua)" opacity={0.1} />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader
            title="Stay in the loop"
            description="Subscribe for project updates, stories and opportunities to support our work."
            light
          />
          <div className="mt-8 mx-auto max-w-md">
            <NewsletterForm light />
          </div>
        </div>
      </Container>
    </section>
  );
}