import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogSlugs, getPublishedBlogPosts } from "@/content/blog";
import { getDbBlogPostBySlug, getPublishedDbBlogPosts, getDbBlogSlugs } from "@/lib/blog-public";
import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/Badge";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { Markdown } from "@/components/shared/Markdown";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/Button";
import { createPublicMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const dbSlugs = await getDbBlogSlugs();
  return [...dbSlugs, ...getBlogSlugs()].map((slug) => ({ slug }));
}

// Lets an admin publish a post via /admin/blog without a code deploy —
// refreshes periodically well within the presigned hero-image URL TTL.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getDbBlogPostBySlug(slug)) ?? getBlogPostBySlug(slug);
  if (!post) return {};
  return createPublicMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.summary,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    image: post.seo?.ogImage || post.heroImage,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getDbBlogPostBySlug(slug)) ?? getBlogPostBySlug(slug);

  if (!post || (process.env.NODE_ENV === "production" && post.published === false)) {
    notFound();
  }

  const allPublished = [...(await getPublishedDbBlogPosts()), ...getPublishedBlogPosts()];
  const related = allPublished
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          [
            { label: "Home", url: "/" },
            { label: "Blog", url: "/blog" },
            { label: post.title, url: `/blog/${slug}` },
          ],
          site.url
        )}
      />

      <section className="py-12 md:py-16">
        <Container>
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <div className="max-w-3xl">
            <Badge variant="accent">{post.category}</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {post.author && <span>{post.author}</span>}
              <span>{post.publishedAt}</span>
              {post.readingTimeMinutes && <span>{post.readingTimeMinutes} min read</span>}
            </div>
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <ImageOrPlaceholder
              src={post.heroImage}
              alt={post.heroImageAlt ?? post.title}
              fill
              preload
              preset="detailHero"
              containerClassName="h-full w-full"
            />
          </div>

          <div className="mt-8 max-w-3xl">
            <Markdown>{post.body}</Markdown>
          </div>

          <div className="mt-12 rounded-xl bg-primary p-8 text-white">
            <h2 className="text-2xl font-bold">Support this work</h2>
            <p className="mt-2 text-white/90">
              Your contribution helps us expand our health, education and
              humanitarian programmes.
            </p>
            <Button href="/donate" variant="secondary" className="mt-6">
              Donate now
            </Button>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold">Related posts</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
