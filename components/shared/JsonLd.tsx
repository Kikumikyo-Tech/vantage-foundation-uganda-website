interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD structured data script tag.
 * Use this to add schema.org structured data to any page for SEO.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Builds a BreadcrumbList schema.org object.
 */
export function buildBreadcrumbJsonLd(
  items: { label: string; url: string }[],
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Builds an Article schema.org object for story pages.
 */
export function buildArticleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  baseUrl: string;
  datePublished?: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: `${args.baseUrl}${args.url}`,
    datePublished: args.datePublished,
    author: args.author ? { "@type": "Person", name: args.author } : undefined,
    image: args.image ? `${args.baseUrl}${args.image}` : undefined,
    publisher: {
      "@type": "Organization",
      name: "Vantage Foundation Uganda",
      url: args.baseUrl,
    },
  };
}

/**
 * Builds a WebSite schema.org object (for the homepage).
 */
export function buildWebSiteJsonLd(baseUrl: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Builds an FAQPage schema.org object for the FAQ page.
 */
export function buildFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Builds a Person schema.org object for a team member / leadership profile.
 */
export function buildPersonJsonLd(args: {
  name: string;
  jobTitle: string;
  worksFor: string;
  description?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: args.name,
    jobTitle: args.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: args.worksFor,
    },
    description: args.description,
    sameAs: args.sameAs && args.sameAs.length > 0 ? args.sameAs : undefined,
  };
}

/**
 * Builds an NGO schema.org object (richer than Organization).
 */
export function buildNgoJsonLd(args: {
  name: string;
  legalName: string;
  url: string;
  email: string;
  telephone: string;
  address: string;
  city: string;
  country: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: args.name,
    alternateName: args.legalName,
    url: args.url,
    email: args.email,
    telephone: args.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: args.address,
      addressLocality: args.city,
      addressCountry: args.country,
    },
    description: args.description,
  };
}
