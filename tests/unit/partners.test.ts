import { describe, it, expect, vi } from "vitest";
import { partners, getPublishedPartners } from "@/content/partners";

describe("partners data", () => {
  it("has exactly 4 confirmed partners", () => {
    expect(partners).toHaveLength(4);
  });

  it("contains only named, described, verified relationships", () => {
    for (const p of partners) {
      expect(p.name).not.toContain("[");
      expect(p.description).not.toContain("[");
      expect(p.relationshipType).toBeTruthy();
      expect(p.url).toMatch(/^https:\/\//);
    }
  });

  it("does not use placeholder logo paths", () => {
    for (const p of partners) {
      if (p.logo) {
        expect(p.logo).not.toContain("placeholder");
      }
    }
  });

  it("returns the verified partner list in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const published = getPublishedPartners();
    expect(published).toEqual(partners);
    vi.unstubAllEnvs();
  });
});
