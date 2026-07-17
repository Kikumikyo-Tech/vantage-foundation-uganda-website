import type { Metadata } from "next";
import { stories } from "@/content/stories";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StoryCard } from "@/components/shared/StoryCard";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Read community stories, project updates and reflections from Vantage Foundation Uganda.",
};

export default function StoriesPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            title="Stories"
            description="Community voices, project updates and moments of impact."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
