import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedContent } from "@/components/blog/RelatedContent";
import type { BlogPost } from "@/types";

const relatedPost: BlogPost = {
  id: "related",
  slug: "related",
  title: "A related article",
  category: "Foundation News",
  summary: "Related summary",
  body: "Related body",
  publishedAt: "2026-07-28",
  published: true,
};

describe("RelatedContent", () => {
  it("shows only the stories link when there are no related posts", () => {
    render(<RelatedContent posts={[]} />);

    expect(
      screen.queryByRole("heading", { name: "Related posts" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all stories/i })).toHaveAttribute(
      "href",
      "/stories"
    );
  });

  it("shows related cards and omits the empty-state link", () => {
    render(<RelatedContent posts={[relatedPost]} />);

    expect(
      screen.getByRole("heading", { name: "Related posts" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "A related article" })
    ).toHaveAttribute("href", "/blog/related");
    expect(
      screen.queryByRole("link", { name: /View all stories/i })
    ).not.toBeInTheDocument();
  });
});
