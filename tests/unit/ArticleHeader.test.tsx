import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ArticleHeader } from "@/components/blog/ArticleHeader";

describe("ArticleHeader", () => {
  it("renders one title and semantic, human-readable article metadata", () => {
    const { container } = render(
      <ArticleHeader
        title={'What We Mean When We Say "Advantage"'}
        category="Foundation News"
        summary="A short introduction to the article."
        author="Hillary Turyasingura"
        publishedAt="2026-07-29"
        readingTimeMinutes={5}
      />
    );

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: 'What We Mean When We Say "Advantage"',
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Foundation News")).toBeInTheDocument();
    expect(screen.getByText("Hillary Turyasingura")).toBeInTheDocument();
    expect(screen.getByText("29 July 2026")).toHaveAttribute(
      "datetime",
      "2026-07-29"
    );
    expect(screen.queryByText("2026-07-29")).not.toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("uses an accessible breadcrumb with linked ancestors", () => {
    render(
      <ArticleHeader
        title="A long article title"
        category="Foundation News"
        summary="Summary"
        publishedAt="2026-07-29"
      />
    );

    const breadcrumb = screen.getByRole("navigation", {
      name: "Breadcrumb",
    });
    expect(breadcrumb).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(within(breadcrumb).getByText("A long article title")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });
});
