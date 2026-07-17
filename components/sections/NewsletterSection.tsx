import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-primary py-16 text-white md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeader
            title="Stay in the loop"
            description="Subscribe for project updates, stories and opportunities to support our work."
            light
          />
          <div className="mt-8 mx-auto max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
