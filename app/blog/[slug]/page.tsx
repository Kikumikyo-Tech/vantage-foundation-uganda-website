import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogSlugs, getPublishedBlogPosts } from "@/content/blog";
import { getDbBlogPostBySlug, getPublishedDbBlogPosts, getDbBlogSlugs } from "@/lib/blog-public";
import { site } from "@/content/site";
import {
  JsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/shared/JsonLd";
import { Markdown } from "@/components/shared/Markdown";
import { ArticleContainer } from "@/components/blog/ArticleContainer";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleShare } from "@/components/blog/ArticleShare";
import { RelatedContent } from "@/components/blog/RelatedContent";
import { SupportCta } from "@/components/blog/SupportCta";

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
  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.summary;
  const image = post.seo?.ogImage || post.heroImage;
  const canonicalUrl = `${site.url}/blog/${slug}`;

  return {
    title,
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: site.name,
      locale: "en_UG",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: image
        ? [
            {
              url: image,
              width: 1600,
              height: 900,
              alt: post.heroImageAlt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
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
  const articleUrl = `${site.url}/blog/${slug}`;
  const quoteIntroduction = post.author
    ? `As founding-team member ${post.author} put it:`
    : undefined;
  const hasPullQuoteIntroduction =
    quoteIntroduction && post.body.includes(`${quoteIntroduction}\n\n>`);
  const articleBody = hasPullQuoteIntroduction
    ? post.body.replace(`${quoteIntroduction}\n\n`, "")
    : post.body;
  const pullQuoteAttribution = hasPullQuoteIntroduction
    ? `${post.author}, founding-team member`
    : undefined;

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
      <JsonLd
        data={buildArticleJsonLd({
          title: post.title,
          description: post.seo?.description || post.summary,
          url: `/blog/${slug}`,
          baseUrl: site.url,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          author: post.author,
          image: post.seo?.ogImage || post.heroImage,
          type: "BlogPosting",
        })}
      />

      <section className="pb-20 pt-10 md:pb-24 md:pt-12 lg:pt-14">
        <article>
          <ArticleContainer width="wide">
            <ArticleHeader
              title={post.title}
              category={post.category}
              summary={post.summary}
              author={post.author}
              publishedAt={post.publishedAt}
              readingTimeMinutes={post.readingTimeMinutes}
            />
            <ArticleHero
              src={post.heroImage}
              alt={post.heroImageAlt ?? post.title}
            />
          </ArticleContainer>

          <ArticleContainer width="reading" className="mt-10 md:mt-12">
            <Markdown
              variant="article"
              pullQuoteAttribution={pullQuoteAttribution}
            >
              {articleBody}
            </Markdown>
            <ArticleShare title={post.title} url={articleUrl} />
          </ArticleContainer>
        </article>

        <SupportCta />
        <RelatedContent posts={related} />
      </section>
    </>
  );
}
