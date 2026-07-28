import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Logo } from "@/components/shared/Logo";

describe("Logo", () => {
  it("renders an img with alt text", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "Vantage Foundation Uganda");
  });

  it("uses unoptimized to bypass next/image optimizer for SVGs", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    // The src should be a direct path, not /_next/image
    const src = img?.getAttribute("src") || "";
    expect(src).toContain("/brand/logos/");
    expect(src).not.toContain("/_next/image");
  });

  it("renders horizontal variant by default", () => {
    const { container } = render(<Logo />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("vantage-logo-horizontal");
  });

  it("renders symbol variant when specified", () => {
    const { container } = render(<Logo variant="symbol" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("vantage-symbol");
  });

  it("renders dark theme variant when specified", () => {
    const { container } = render(<Logo theme="dark" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("vantage-logo-horizontal-light");
  });

  it("includes sr-only text fallback", () => {
    const { container } = render(<Logo />);
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly?.textContent).toBe("Vantage Foundation Uganda");
  });

  it("wraps in a link when href is provided", () => {
    const { container } = render(<Logo href="/" />);
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("aria-label", "Vantage Foundation Uganda");
  });

  it("preserves aspect ratio via style", () => {
    const { container } = render(<Logo height={40} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("height", "40");
    const width = img?.getAttribute("width");
    expect(width).toBeTruthy();
    // Horizontal logo aspect ratio is 1721/914 ≈ 1.88
    expect(Number(width)).toBeGreaterThan(40);
  });
});
