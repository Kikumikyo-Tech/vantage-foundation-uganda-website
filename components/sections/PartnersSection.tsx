import { getPublishedPartners } from "@/content/partners";
import { getPublishedLogos } from "@/lib/media-public";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";

export async function PartnersSection() {
  // Static partners plus anything an admin has since uploaded and recognised
  // via /admin/media (newest uploads first).
  const uploadedLogos = await getPublishedLogos();
  const partners = [...uploadedLogos, ...getPublishedPartners()];

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
              {partner.logo ? (
                <div className="relative h-16 w-32">
                  <ImageOrPlaceholder
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    preset="card"
                    containerClassName="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex h-16 items-center justify-center">
                  <span className="text-lg font-semibold text-muted-foreground">{partner.name}</span>
                </div>
              )}
              {partner.logo && (
                <h3 className="mt-4 text-lg font-semibold">{partner.name}</h3>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
