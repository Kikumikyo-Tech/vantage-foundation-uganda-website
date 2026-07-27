import type { Metadata } from "next";
import { site } from "@/content/site";
import { Hero } from "@/components/sections/Hero";
import { VideoStory } from "@/components/sections/VideoStory";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { AreasOfWork } from "@/components/sections/AreasOfWork";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { UgandaReachMap } from "@/components/sections/UgandaReachMap";
import { FeaturedImpactStory } from "@/components/sections/FeaturedImpactStory";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { StoriesSection } from "@/components/sections/StoriesSection";
import { GetInvolvedSection } from "@/components/sections/GetInvolvedSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — ${site.tagline}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <VideoStory />
      <TrustStrip />
      <ImpactSection />
      <AreasOfWork />
      <FeaturedProjects />
      <UgandaReachMap />
      <FeaturedImpactStory />
      <AboutTeaser />
      <StoriesSection />
      <BlogTeaser />
      <GetInvolvedSection />
      <PartnersSection />
      <NewsletterSection />
    </>
  );
}
