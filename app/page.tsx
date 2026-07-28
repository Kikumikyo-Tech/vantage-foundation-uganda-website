import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { AreasOfWork } from "@/components/sections/AreasOfWork";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { FeaturedImpactStory } from "@/components/sections/FeaturedImpactStory";
import { UgandaReachMap } from "@/components/sections/UgandaReachMap";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Vantage Foundation Uganda | Health, Education and Community Impact",
  description:
    "Vantage Foundation Uganda is a youth-led nonprofit improving access to health, education, clean water and humanitarian support in underserved Ugandan communities.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ImpactSection />
      <AreasOfWork />
      <FeaturedProjects />
      <FeaturedImpactStory />
      <UgandaReachMap />
      <InstagramSection />
      <PartnersSection />
      <FinalCta />
      <NewsletterSection />
    </>
  );
}
