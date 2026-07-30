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
          title="Verified relationships"
          description="Each relationship is described narrowly so a banking service, in-kind contribution or programme collaboration is never overstated."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.name} className="flex flex-col items-center p-6 text-center">
              {partner.logo ? (
                <div className="relative h-16 w-32">
                  <ImageOrPlaceholder
                    src={partner.logo}
                    alt={partner.logoAlt ?? `${partner.name} logo`}
                    fill
                    preset="card"
                    containerClassName="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex min-h-16 items-center justify-center rounded-lg border border-border bg-surface px-5">
                  <span className="text-lg font-semibold text-foreground">{partner.name}</span>
                </div>
              )}
              {partner.logo && (
                <h3 className="mt-4 text-lg font-semibold">{partner.name}</h3>
              )}
              {partner.relationshipType && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  {partner.relationshipType}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
              {partner.url && (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Visit official website
                </a>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
