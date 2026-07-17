import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { AreasOfWork } from "@/components/sections/AreasOfWork";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { StoriesSection } from "@/components/sections/StoriesSection";
import { GetInvolvedSection } from "@/components/sections/GetInvolvedSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <AboutTeaser />
      <AreasOfWork />
      <FeaturedProjects />
      <ImpactSection />
      <StoriesSection />
      <GetInvolvedSection />
      <PartnersSection />
      <NewsletterSection />
    </>
  );
}
