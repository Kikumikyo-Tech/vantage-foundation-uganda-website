import { describe, it, expect } from "vitest";
import {
  normalise,
  getReachValue,
  getInteractionValue,
  getFreshnessScore,
  isPostEligible,
  computeScore,
  rankPosts,
  applyEditorialOverrides,
  truncateCaption,
  getMediaTypeLabel,
  DEFAULT_SCORE_WEIGHTS,
} from "@/lib/instagram/scoring";
import type { InstagramPost } from "@/types";

function makePost(
  id: string,
  overrides: Partial<InstagramPost> = {},
): InstagramPost {
  return {
    id,
    mediaType: "IMAGE",
    mediaUrl: "https://example.com/img.jpg",
    permalink: "https://instagram.com/p/test",
    caption: "Test caption",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    username: "vantagefoundation",
    metrics: {},
    ...overrides,
  };
}

describe("normalise", () => {
  it("normalises values to 0-1 range", () => {
    const result = normalise([0, 50, 100]);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0.5);
    expect(result[2]).toBe(1);
  });

  it("returns 0.5 for all when values are equal", () => {
    const result = normalise([42, 42, 42]);
    expect(result).toEqual([0.5, 0.5, 0.5]);
  });

  it("returns empty array for empty input", () => {
    expect(normalise([])).toEqual([]);
  });
});

describe("getReachValue", () => {
  it("prefers reach", () => {
    expect(getReachValue({ reach: 100, impressions: 200, views: 300 })).toBe(100);
  });

  it("falls back to impressions", () => {
    expect(getReachValue({ impressions: 200, views: 300 })).toBe(200);
  });

  it("falls back to views for Reels", () => {
    expect(getReachValue({ views: 300 })).toBe(300);
  });

  it("returns 0 when no metrics available", () => {
    expect(getReachValue({})).toBe(0);
  });

  it("returns 0 when reach is 0", () => {
    expect(getReachValue({ reach: 0, impressions: 0, views: 0 })).toBe(0);
  });
});

describe("getInteractionValue", () => {
  it("sums likes and comments", () => {
    expect(getInteractionValue({ likes: 10, comments: 5 })).toBe(15);
  });

  it("handles missing metrics", () => {
    expect(getInteractionValue({})).toBe(0);
    expect(getInteractionValue({ likes: 10 })).toBe(10);
  });
});

describe("getFreshnessScore", () => {
  it("returns 1 for future posts", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(getFreshnessScore(future)).toBe(1);
  });

  it("returns 0 for posts older than max age", () => {
    const old = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    expect(getFreshnessScore(old)).toBe(0);
  });

  it("returns between 0 and 1 for recent posts", () => {
    const recent = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const score = getFreshnessScore(recent);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});

describe("isPostEligible", () => {
  it("returns true for recent posts", () => {
    const post = makePost("1", { timestamp: new Date().toISOString() });
    expect(isPostEligible(post)).toBe(true);
  });

  it("returns false for posts older than 90 days", () => {
    const post = makePost("1", {
      timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    });
    expect(isPostEligible(post)).toBe(false);
  });
});

describe("computeScore", () => {
  it("computes weighted sum correctly", () => {
    const score = computeScore(
      { reach: 1, shares: 0.5, saves: 0.3, interactions: 0.2, freshness: 0.8 },
      DEFAULT_SCORE_WEIGHTS,
    );
    const expected =
      1 * 0.5 + 0.5 * 0.2 + 0.3 * 0.15 + 0.2 * 0.1 + 0.8 * 0.05;
    expect(score).toBeCloseTo(expected, 5);
  });
});

describe("rankPosts", () => {
  it("ranks by composite score descending", () => {
    const posts = [
      makePost("low", { metrics: { reach: 100, likes: 5 } }),
      makePost("high", { metrics: { reach: 5000, likes: 200 } }),
      makePost("mid", { metrics: { reach: 1000, likes: 50 } }),
    ];

    const ranked = rankPosts(posts);
    expect(ranked[0].id).toBe("high");
    expect(ranked[1].id).toBe("mid");
    expect(ranked[2].id).toBe("low");
  });

  it("filters out posts older than 90 days", () => {
    const posts = [
      makePost("recent", { metrics: { reach: 100 } }),
      makePost("old", {
        timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: { reach: 10000 },
      }),
    ];

    const ranked = rankPosts(posts);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe("recent");
  });

  it("handles posts with missing metrics", () => {
    const posts = [
      makePost("no-metrics", { metrics: {} }),
      makePost("with-metrics", { metrics: { reach: 1000, likes: 50 } }),
    ];

    const ranked = rankPosts(posts);
    expect(ranked).toHaveLength(2);
    expect(ranked[0].id).toBe("with-metrics");
  });

  it("handles empty input", () => {
    expect(rankPosts([])).toEqual([]);
  });

  it("assigns score to each post", () => {
    const posts = [makePost("1", { metrics: { reach: 100 } })];
    const ranked = rankPosts(posts);
    expect(ranked[0].score).toBeDefined();
    expect(typeof ranked[0].score).toBe("number");
  });
});

describe("applyEditorialOverrides", () => {
  it("hides posts in hiddenPostIds", () => {
    const posts = [
      makePost("1", { score: 0.9 }),
      makePost("2", { score: 0.8 }),
      makePost("3", { score: 0.7 }),
    ];

    const result = applyEditorialOverrides(posts, { hiddenPostIds: ["2"] }, 6);
    expect(result.find((p) => p.id === "2")).toBeUndefined();
  });

  it("pins posts to the front", () => {
    const posts = [
      makePost("a", { score: 0.9 }),
      makePost("b", { score: 0.8 }),
      makePost("c", { score: 0.7 }),
    ];

    const result = applyEditorialOverrides(posts, { pinnedPostIds: ["c"] }, 6);
    expect(result[0].id).toBe("c");
    expect(result[0].pinned).toBe(true);
  });

  it("respects maxPosts limit", () => {
    const posts = Array.from({ length: 10 }, (_, i) =>
      makePost(`${i}`, { score: 1 - i * 0.1 }),
    );

    const result = applyEditorialOverrides(posts, {}, 4);
    expect(result).toHaveLength(4);
  });

  it("fills remaining slots with auto-ranked after pinned", () => {
    const posts = [
      makePost("a", { score: 0.9 }),
      makePost("b", { score: 0.8 }),
      makePost("c", { score: 0.7 }),
      makePost("d", { score: 0.6 }),
    ];

    const result = applyEditorialOverrides(posts, { pinnedPostIds: ["d"] }, 3);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("d");
    expect(result[1].id).toBe("a");
  });

  it("excludes safeguarding posts", () => {
    const posts = [
      makePost("safe", { score: 0.9 }),
      makePost("unsafe", { score: 0.8 }),
    ];

    const result = applyEditorialOverrides(
      posts,
      { safeguardingExcludedIds: ["unsafe"] },
      6,
    );
    expect(result.find((p) => p.id === "unsafe")).toBeUndefined();
  });

  it("deduplicates by post ID", () => {
    const posts = [
      makePost("dup", { score: 0.9 }),
      makePost("dup", { score: 0.8 }),
    ];

    const result = applyEditorialOverrides(posts, {}, 6);
    expect(result).toHaveLength(1);
  });
});

describe("truncateCaption", () => {
  it("returns full caption when under limit", () => {
    expect(truncateCaption("Short caption", 120)).toBe("Short caption");
  });

  it("truncates and adds ellipsis", () => {
    const long = "A".repeat(200);
    const result = truncateCaption(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith("…")).toBe(true);
  });

  it("truncates at word boundary when possible", () => {
    const long = "Hello world this is a test caption that needs truncation";
    const result = truncateCaption(long, 20);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toContain("\n");
  });
});

describe("getMediaTypeLabel", () => {
  it("returns human-readable labels", () => {
    expect(getMediaTypeLabel("IMAGE")).toBe("Photo");
    expect(getMediaTypeLabel("VIDEO")).toBe("Video");
    expect(getMediaTypeLabel("REEL")).toBe("Reel");
    expect(getMediaTypeLabel("CAROUSEL_ALBUM")).toBe("Carousel");
  });
});
