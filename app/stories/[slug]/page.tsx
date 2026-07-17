import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoryBySlug, getStorySlugs, stories } from "@/content/stories";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/Badge";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { StoryCard } from "@/components/shared/StoryCard";
import { Markdown } from "@/components/shared/Markdown";

export async function generateStaticParams() {
  return getStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = stories
    .filter((s) => s.slug !== story.slug && s.category === story.category)
    .slice(0, 3);

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="accent">{story.category}</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {story.title}
            </h1>
            <p className="mt-4 text-lg text-white/90">{story.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/80">
              {story.author && <span>By {story.author}</span>}
              {story.role && <span>{story.role}</span>}
              {story.date && <span>{story.date}</span>}
              {story.location && <span>{story.location}</span>}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          {story.heroImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <ImageOrPlaceholder
                src={story.heroImage}
                alt={story.title}
                fill
                priority
                containerClassName="h-full w-full"
              />
            </div>
          )}

          <article className="mx-auto mt-12 max-w-3xl">
            <Markdown>{story.body}</Markdown>
          </article>

          {relatedStories.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold">More stories</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedStories.map((s) => (
                  <StoryCard key={s.slug} story={s} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
