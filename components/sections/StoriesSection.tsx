import { getPublishedStories } from "@/content/stories";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StoryCard } from "@/components/shared/StoryCard";
import { Button } from "@/components/ui/Button";

export function StoriesSection() {
  const featured = getPublishedStories().slice(0, 3);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Stories"
          title="Voices from our community"
          description="Real reflections from the young people, volunteers and leaders shaping our work."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/stories" variant="outline">
            Read More Stories
          </Button>
        </div>
      </Container>
    </section>
  );
}
