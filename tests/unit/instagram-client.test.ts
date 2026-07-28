import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { InstagramEditorialOverrides, InstagramManualPost } from "@/types";

// Mutable mock state, hoisted so vi.mock can reference it safely.
const mockState = vi.hoisted(() => ({
  overrides: {
    pinnedPostIds: [] as string[],
    hiddenPostIds: [] as string[],
    manualPosts: [] as InstagramManualPost[],
    disableAutoRanking: false,
    featuredCampaignPostIds: [] as string[],
    safeguardingExcludedIds: [] as string[],
  } as InstagramEditorialOverrides,
}));

// Mock the overrides module with a mutable reference so each test can update it
// without needing vi.resetModules(), which interferes with other test files.
vi.mock("@/content/instagram-overrides", () => ({
  getInstagramOverrides: () => mockState.overrides,
  instagramOverrides: mockState.overrides,
}));

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock site config
vi.mock("@/content/site", () => ({
  site: {
    socials: { instagram: "https://www.instagram.com/vantagefoundationuganda/" },
    name: "Vantage Foundation Uganda",
  },
}));

import { getPopularInstagramPosts, isInstagramConfigured } from "@/lib/instagram/client";

describe("Instagram client fallback", () => {
  beforeEach(() => {
    mockState.overrides = {
      pinnedPostIds: [],
      hiddenPostIds: [],
      manualPosts: [],
      disableAutoRanking: false,
      featuredCampaignPostIds: [],
      safeguardingExcludedIds: [],
    };
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns empty result when no API, no cache, no manual posts", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "");
    const result = await getPopularInstagramPosts();
    expect(result.source).toBe("empty");
    expect(result.posts).toHaveLength(0);
    expect(result.profileUrl).toContain("instagram.com");
  });

  it("returns manual posts when auto-ranking is disabled", async () => {
    const manual: InstagramManualPost = {
      id: "manual-1",
      mediaType: "IMAGE",
      mediaUrl: "https://example.com/manual.jpg",
      permalink: "https://instagram.com/p/manual1",
      caption: "Manual post",
      timestamp: new Date().toISOString(),
    };

    mockState.overrides = {
      pinnedPostIds: [],
      hiddenPostIds: [],
      manualPosts: [manual],
      disableAutoRanking: true,
      featuredCampaignPostIds: [],
      safeguardingExcludedIds: [],
    };

    const result = await getPopularInstagramPosts();
    expect(result.source).toBe("manual");
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].id).toBe("manual-1");
    expect(result.posts[0].manuallyAdded).toBe(true);
  });

  it("isInstagramConfigured returns false without credentials", () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "");
    expect(isInstagramConfigured()).toBe(false);
  });

  it("isInstagramConfigured returns true with credentials", () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "test-token");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "123456");
    expect(isInstagramConfigured()).toBe(true);
  });
});
