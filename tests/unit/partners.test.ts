import { describe, it, expect, vi } from "vitest";
import { partners, getPublishedPartners } from "@/content/partners";

describe("partners data", () => {
  it("has exactly 2 confirmed partners", () => {
    expect(partners).toHaveLength(2);
  });

  it("does not include placeholder partners", () => {
    for (const p of partners) {
      expect(p.placeholder).not.toBe(true);
      expect(p.name).not.toContain("[");
      expect(p.description).not.toContain("[");
    }
  });

  it("does not use placeholder logo paths", () => {
    for (const p of partners) {
      if (p.logo) {
        expect(p.logo).not.toContain("placeholder");
      }
    }
  });

  it("in production, returns only non-placeholder partners", () => {
    vi.stubEnv("NODE_ENV", "production");
    const published = getPublishedPartners();
    for (const p of published) {
      expect(p.placeholder).not.toBe(true);
    }
    vi.unstubAllEnvs();
  });
});
