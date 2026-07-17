import { partners } from "@/content/partners";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";

export function PartnersSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Partners"
          title="Collaborators and supporters"
          description="We work with partners who share our belief in community-led, sustainable impact."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.name} className="flex flex-col items-center p-6 text-center">
              <div className="relative h-16 w-32">
                <ImageOrPlaceholder
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  containerClassName="h-full w-full"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{partner.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
