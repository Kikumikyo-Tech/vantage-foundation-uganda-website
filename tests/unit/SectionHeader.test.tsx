import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/shared/SectionHeader";

describe("SectionHeader", () => {
  it("renders the title", () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<SectionHeader title="Title" description="A description" />);
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("renders the eyebrow when provided", () => {
    render(<SectionHeader title="Title" eyebrow="Section" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("renders h2 by default", () => {
    render(<SectionHeader title="Heading" />);
    const heading = screen.getByText("Heading");
    expect(heading.tagName).toBe("H2");
  });

  it("renders h1 when level='h1'", () => {
    render(<SectionHeader title="Heading" level="h1" />);
    const heading = screen.getByText("Heading");
    expect(heading.tagName).toBe("H1");
  });

  it("does not render description paragraph when not provided", () => {
    render(<SectionHeader title="Title" />);
    const container = screen.getByText("Title").parentElement;
    const paragraphs = container?.querySelectorAll("p");
    expect(paragraphs?.length ?? 0).toBe(0);
  });
});
