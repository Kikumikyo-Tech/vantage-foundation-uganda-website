import "server-only";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { InstagramPostCard } from "@/components/shared/InstagramPostCard";
import { getPopularInstagramPosts } from "@/lib/instagram/client";
import { site } from "@/content/site";

/**
 * "Popular on Instagram" homepage section.
 *
 * Server-side rendered with cached results. Falls back gracefully:
 * 1. Cached API posts (ranked by performance)
 * 2. Manual posts from editorial overrides
 * 3. Follow button only (no grid)
 */
export async function InstagramSection() {
  const feed = await getPopularInstagramPosts();
  const profileUrl = feed.profileUrl || site.socials.instagram || "";
  const username = feed.username || "vantagefoundation";

  // Fallback: no posts at all — show just the follow CTA
  if (feed.posts.length === 0) {
    return (
      <section className="bg-surface py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow="Instagram"
            title="Popular on Instagram"
            description="See the stories, programmes and community moments reaching the most people."
          />
          <div className="mt-8 flex justify-center">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Follow @{username} on Instagram
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Instagram"
          title="Popular on Instagram"
          description="See the stories, programmes and community moments reaching the most people."
        />

        <div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Popular Instagram posts"
        >
          {feed.posts.map((post) => (
            <div key={post.id} role="listitem">
              <InstagramPostCard post={post} />
            </div>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            Follow Vantage Foundation Uganda on Instagram
          </p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            aria-label={`Follow @${username} on Instagram`}
          >
            @{username}
          </a>
        </div>
      </Container>
    </section>
  );
}
