import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPartners } from "@/content/partners";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { Building2, HandCoins, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Donors & Sponsors",
  description:
    "Vantage Foundation Uganda gratefully recognises the organisations and individuals whose donations and sponsorship make our work possible.",
  alternates: { canonical: "/our-donors" },
};

const recognitionCategories = [
  {
    icon: Building2,
    title: "Corporate & institutional sponsors",
    description:
      "Companies, banks and institutions that fund a project, campaign or ongoing programme.",
  },
  {
    icon: HandCoins,
    title: "In-kind & programme partners",
    description:
      "Organisations that donate goods, products or technical services directly to our programmes.",
  },
  {
    icon: Users,
    title: "Individual donors",
    description:
      "Individuals who give directly and choose to be publicly acknowledged for their support.",
  },
];

export default function OurDonorsPage() {
  const partners = getPublishedPartners();

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Our Donors & Sponsors"
            description="Every project we run is made possible by people and organisations who believe in our work. We are honoured to recognise them here."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow="Recognition"
            title="How we recognise support"
            description="We welcome donors and sponsors at every level, and recognise support with donor consent."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {recognitionCategories.map((cat) => (
              <Card key={cat.title} className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <cat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow="With gratitude"
            title="Organisations that support our work"
            description="Verified partners, sponsors and in-kind donors who have contributed to our programmes."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <Card key={partner.name} className="flex flex-col items-center p-6 text-center">
                <div className="relative h-16 w-32">
                  <ImageOrPlaceholder
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    preset="card"
                    containerClassName="h-full w-full"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{partner.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
                {partner.url && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Visit {partner.name} ↗
                  </a>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Become a recognised supporter
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              If you or your organisation would like to fund a project, sponsor a campaign, or
              contribute in kind — and be publicly recognised for it — we would love to hear
              from you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/donate" size="lg">
                Donate now
              </Button>
              <Button href="/get-involved#sponsor" variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
                Sponsor a project
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/60">
              Already a donor and want to be listed here?{" "}
              <Link href="/contact" className="underline hover:text-primary-light">
                Get in touch
              </Link>{" "}
              and let us know. See also our{" "}
              <Link href="/reports-and-accountability" className="underline hover:text-primary-light">
                Reports &amp; Accountability
              </Link>{" "}
              page for how funds are used.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
