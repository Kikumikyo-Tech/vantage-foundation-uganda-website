import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_URL,
  resolveSiteUrl,
} from "@/lib/site-url";

describe("resolveSiteUrl", () => {
  it("uses the confirmed production domain when no value is configured", () => {
    expect(resolveSiteUrl("")).toBe(DEFAULT_SITE_URL);
  });

  it("normalizes a valid configured origin", () => {
    expect(resolveSiteUrl("https://preview.example.com/path/")).toBe(
      "https://preview.example.com"
    );
  });

  it("rejects the malformed production value instead of emitting broken metadata", () => {
    expect(
      resolveSiteUrl("https://http//vantagefoundationuganda.com/")
    ).toBe(DEFAULT_SITE_URL);
  });

  it("rejects non-web protocols and invalid URL strings", () => {
    expect(resolveSiteUrl("javascript:alert(1)")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("not a URL")).toBe(DEFAULT_SITE_URL);
  });
});
