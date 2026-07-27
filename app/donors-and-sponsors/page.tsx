import type { Metadata } from "next";
import { HeartHandshake } from "lucide-react";
import { site } from "@/content/site";
import { getPublishedPartners } from "@/content/partners";
import { getPublishedLogos } from "@/lib/media-public";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { ContactForm } from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Donors & Sponsors",
  description: `Recognizing the individuals, companies and organizations who support ${site.name}, with their consent.`,
  alternates: { canonical: "/donors-and-sponsors" },
};

// Lets an admin recognise a new donor/sponsor via /admin/media without a
// code deploy — refreshes periodically well within the presigned URL TTL.
export const revalidate = 3600;

const categories = [
  { name: "Strategic Partners", description: "Long-term organisational partnerships shaping our direction." },
  { name: "Programme Sponsors", description: "Sustained support for a specific health, education or humanitarian programme." },
  { name: "Project Donors", description: "Funding for a single project, such as a borehole or medical camp." },
  { name: "In-Kind Supporters", description: "Goods, services or expertise donated in place of cash." },
  { name: "Community Partners", description: "Local leaders, organisations and volunteers who make our work possible." },
  { name: "Anonymous Contributors", description: "Donors who choose to support us without public recognition." },
];

export default async function DonorsAndSponsorsPage() {
  // Static partners plus anything an admin has since uploaded and recognised
  // via /admin/media (newest uploads first).
  const uploadedLogos = await getPublishedLogos();
  const recognized = [...uploadedLogos, ...getPublishedPartners()];

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Donors & Sponsors"
            description="Recognizing the individuals, companies, institutions and organizations who make our work possible."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {site.name} is grateful to every donor, sponsor and partner who
              supports our health, education and humanitarian work. This page
              recognises contributors who have given their documented
              consent to be publicly named.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card key={cat.name} className="p-6">
                <h3 className="text-base font-semibold text-primary">{cat.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <SectionHeader
            title="Recognised contributors"
            description="Featured with the documented consent of each contributor."
          />

          {recognized.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recognized.map((partner) => (
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
                </Card>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-md text-center">
              <HeartHandshake className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 text-muted-foreground">
                Partner and donor recognitions will appear here with their
                consent.
              </p>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Recognition policy</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We only publish a donor or sponsor&rsquo;s name, logo, or
                description with their documented, written consent. We never
                publish donation amounts or personal financial details.
                Donors may request removal from this page at any time, and
                may choose to give anonymously and remain unnamed.
              </p>
              <h2 className="mt-10 text-2xl font-bold">Become a sponsor</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                If you or your organisation would like to sponsor a
                programme, support a project, or nominate a contributor for
                recognition, use the form or donate directly below.
              </p>
              <Button href="/donate" size="lg" className="mt-6">
                Donate
              </Button>
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold">Contact us about sponsorship</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us about your organisation and how you&rsquo;d like to
                support our work.
              </p>
              <div className="mt-6">
                <ContactForm defaultSubject="sponsor" />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
