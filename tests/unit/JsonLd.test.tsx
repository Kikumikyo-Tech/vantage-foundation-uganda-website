import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildArticleJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
  buildNgoJsonLd,
} from "@/components/shared/JsonLd";

describe("JsonLd component", () => {
  it("renders a script tag with application/ld+json type", () => {
    const { container } = render(<JsonLd data={{ "@type": "Test" }} />);
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("type", "application/ld+json");
  });

  it("serializes the data as JSON in the script content", () => {
    const { container } = render(
      <JsonLd data={{ "@type": "Organization", name: "Test" }} />
    );
    const script = container.querySelector("script");
    const parsed = JSON.parse(script?.textContent || "{}");
    expect(parsed["@type"]).toBe("Organization");
    expect(parsed.name).toBe("Test");
  });

  it("escapes < characters to prevent XSS", () => {
    const { container } = render(
      <JsonLd data={{ name: "<script>alert(1)</script>" }} />
    );
    const script = container.querySelector("script");
    expect(script?.textContent).not.toContain("<script>");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("builds a BreadcrumbList with correct positions", () => {
    const result = buildBreadcrumbJsonLd(
      [
        { label: "Home", url: "/" },
        { label: "Projects", url: "/projects" },
        { label: "Test", url: "/projects/test" },
      ],
      "https://example.com"
    );
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[2].position).toBe(3);
    expect(result.itemListElement[0].item).toBe("https://example.com/");
  });
});

describe("buildArticleJsonLd", () => {
  it("builds an Article with all fields", () => {
    const result = buildArticleJsonLd({
      title: "Test Article",
      description: "A test",
      url: "/stories/test",
      baseUrl: "https://example.com",
      datePublished: "2024-01-01",
      author: "Jane Doe",
      image: "/images/test.jpg",
    });
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Test Article");
    expect(result.datePublished).toBe("2024-01-01");
    expect(result.author?.name).toBe("Jane Doe");
    expect(result.publisher["@type"]).toBe("Organization");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("builds a WebSite with SearchAction", () => {
    const result = buildWebSiteJsonLd("https://example.com", "Test Site");
    expect(result["@type"]).toBe("WebSite");
    expect(result.name).toBe("Test Site");
    expect(result.potentialAction["@type"]).toBe("SearchAction");
  });
});

describe("buildFaqJsonLd", () => {
  it("builds an FAQPage with all questions", () => {
    const result = buildFaqJsonLd([
      { question: "What is this?", answer: "A test" },
      { question: "Why?", answer: "Because" },
    ]);
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toHaveLength(2);
    expect(result.mainEntity[0]["@type"]).toBe("Question");
    expect(result.mainEntity[0].name).toBe("What is this?");
    expect(result.mainEntity[0].acceptedAnswer.text).toBe("A test");
  });
});

describe("buildNgoJsonLd", () => {
  it("builds an NGO with address", () => {
    const result = buildNgoJsonLd({
      name: "Test NGO",
      legalName: "Test NGO Ltd",
      url: "https://example.com",
      email: "test@example.com",
      telephone: "+256 123",
      address: "123 Main St",
      city: "Kampala",
      country: "Uganda",
      description: "A test NGO",
    });
    expect(result["@type"]).toBe("NGO");
    expect(result.name).toBe("Test NGO");
    expect(result.address["@type"]).toBe("PostalAddress");
    expect(result.address.addressLocality).toBe("Kampala");
  });
});
