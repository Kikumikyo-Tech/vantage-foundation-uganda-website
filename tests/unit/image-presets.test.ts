import { describe, it, expect } from "vitest";
import { imagePresets, DEFAULT_IMAGE_PRESET } from "@/lib/image-presets";
import { BLUR_DATA_URL } from "@/lib/blur-placeholder";

describe("imagePresets", () => {
  it("has all expected presets", () => {
    expect(imagePresets).toHaveProperty("hero");
    expect(imagePresets).toHaveProperty("detailHero");
    expect(imagePresets).toHaveProperty("card");
    expect(imagePresets).toHaveProperty("half");
    expect(imagePresets).toHaveProperty("team");
    expect(imagePresets).toHaveProperty("banner");
  });

  it("each preset is a valid sizes string", () => {
    for (const value of Object.values(imagePresets)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
      // sizes strings should contain "vw" or "px"
      expect(value).toMatch(/(vw|px)/);
    }
  });

  it("hero preset uses 100vw on mobile", () => {
    expect(imagePresets.hero).toContain("100vw");
  });

  it("card preset uses 33vw on desktop", () => {
    expect(imagePresets.card).toContain("33vw");
  });

  it("default preset is card", () => {
    expect(DEFAULT_IMAGE_PRESET).toBe("card");
  });
});

describe("BLUR_DATA_URL", () => {
  it("is a data URL", () => {
    expect(BLUR_DATA_URL).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it("is a non-empty string", () => {
    expect(BLUR_DATA_URL.length).toBeGreaterThan(50);
  });
});
