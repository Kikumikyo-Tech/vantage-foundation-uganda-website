import type { Metadata } from "next";
import { getPublishedMedia } from "@/content/media";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Vantage Foundation Uganda's water, education, health and community programmes.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const images = getPublishedMedia();

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Gallery"
            description="Moments from our boreholes, schools and community programmes across Uganda."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <GalleryGrid images={images} />
        </Container>
      </section>
    </>
  );
}
