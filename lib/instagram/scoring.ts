import "server-only";

import type {
  InstagramPost,
  InstagramMetrics,
  InstagramScoreWeights,
  InstagramMediaType,
} from "@/types";

/**
 * Default scoring weights as specified in the brief:
 *   Reach / unique viewers: 50%
 *   Shares:                  20%
 *   Saves:                   15%
 *   Meaningful interactions: 10%
 *   Freshness:                5%
 */
export const DEFAULT_SCORE_WEIGHTS: InstagramScoreWeights = {
  reach: 0.5,
  shares: 0.2,
  saves: 0.15,
  interactions: 0.1,
  freshness: 0.05,
};

/** Maximum age in days for a post to be considered eligible. */
export const MAX_POST_AGE_DAYS = 90;

/** Posts older than this are penalised in freshness scoring. */
export const FRESHNESS_WINDOW_DAYS = 60;

/**
 * Normalises a metric value to a 0–1 range using min-max normalisation
 * across the provided posts. If all values are equal or missing, returns 0.5
 * for all (neutral — doesn't penalise or reward).
 */
export function normalise(
  values: number[],
): number[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) return values.map(() => 0.5);

  return values.map((v) => (v - min) / (max - min));
}

/**
 * Returns the best available "reach" metric for a post.
 * Falls back to impressions, then views (for Reels), then 0.
 */
export function getReachValue(metrics: InstagramMetrics): number {
  if (metrics.reach != null && metrics.reach > 0) return metrics.reach;
  if (metrics.impressions != null && metrics.impressions > 0) return metrics.impressions;
  if (metrics.views != null && metrics.views > 0) return metrics.views;
  return 0;
}

/**
 * Returns "meaningful interactions" — likes + comments.
 * This is a proxy for engagement quality beyond passive viewing.
 */
export function getInteractionValue(metrics: InstagramMetrics): number {
  return (metrics.likes ?? 0) + (metrics.comments ?? 0);
}

/**
 * Returns the shares value, defaulting to 0 when unavailable.
 */
export function getSharesValue(metrics: InstagramMetrics): number {
  return metrics.shares ?? 0;
}

/**
 * Returns the saves value, defaulting to 0 when unavailable.
 */
export function getSavesValue(metrics: InstagramMetrics): number {
  return metrics.saves ?? 0;
}

/**
 * Calculates a freshness score (0–1) based on post age.
 * Posts within FRESHNESS_WINDOW_DAYS get a score close to 1.
 * Posts older than MAX_POST_AGE_DAYS get 0.
 */
export function getFreshnessScore(timestamp: string, now: Date = new Date()): number {
  const postDate = new Date(timestamp);
  const ageDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);

  if (ageDays <= 0) return 1;
  if (ageDays >= MAX_POST_AGE_DAYS) return 0;

  // Linear decay from 1 (brand new) to 0 (MAX_POST_AGE_DAYS old)
  return 1 - ageDays / MAX_POST_AGE_DAYS;
}

/**
 * Determines whether a post is eligible for display based on age.
 */
export function isPostEligible(post: InstagramPost, now: Date = new Date()): boolean {
  const postDate = new Date(post.timestamp);
  const ageDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  return ageDays <= MAX_POST_AGE_DAYS;
}

/**
 * Computes a composite score for a single post given normalised component scores.
 * Does NOT normalise — caller must pass pre-normalised 0–1 values.
 */
export function computeScore(
  components: {
    reach: number;
    shares: number;
    saves: number;
    interactions: number;
    freshness: number;
  },
  weights: InstagramScoreWeights = DEFAULT_SCORE_WEIGHTS,
): number {
  return (
    components.reach * weights.reach +
    components.shares * weights.shares +
    components.saves * weights.saves +
    components.interactions * weights.interactions +
    components.freshness * weights.freshness
  );
}

/**
 * Scores and ranks posts by the configured weighting model.
 *
 * Process:
 * 1. Filter out posts older than MAX_POST_AGE_DAYS.
 * 2. Extract raw metric values for each normalisation group.
 * 3. Normalise each group to 0–1 (min-max).
 * 4. Compute composite score using weighted sum.
 * 5. Sort descending by score.
 *
 * Missing metrics are treated as 0 and handled gracefully — normalisation
 * ensures posts with partial data are not unfairly penalised relative to
 * the available data range.
 */
export function rankPosts(
  posts: InstagramPost[],
  weights: InstagramScoreWeights = DEFAULT_SCORE_WEIGHTS,
  now: Date = new Date(),
): InstagramPost[] {
  const eligible = posts.filter((p) => isPostEligible(p, now));

  if (eligible.length === 0) return [];

  // Extract raw values for normalisation
  const reachValues = eligible.map((p) => getReachValue(p.metrics));
  const sharesValues = eligible.map((p) => getSharesValue(p.metrics));
  const savesValues = eligible.map((p) => getSavesValue(p.metrics));
  const interactionValues = eligible.map((p) => getInteractionValue(p.metrics));
  const freshnessValues = eligible.map((p) => getFreshnessScore(p.timestamp, now));

  // Normalise each group
  const reachNorm = normalise(reachValues);
  const sharesNorm = normalise(sharesValues);
  const savesNorm = normalise(savesValues);
  const interactionsNorm = normalise(interactionValues);

  // Score each post
  const scored = eligible.map((post, i) => {
    const score = computeScore(
      {
        reach: reachNorm[i],
        shares: sharesNorm[i],
        saves: savesNorm[i],
        interactions: interactionsNorm[i],
        freshness: freshnessValues[i],
      },
      weights,
    );
    return { ...post, score };
  });

  // Sort by score descending
  return scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

/**
 * Applies editorial overrides to the ranked post list:
 * - Removes hidden posts and safeguarding-excluded posts.
 * - Pins specified posts to the front.
 * - Fills remaining slots with auto-ranked posts.
 * - Deduplicates by post ID.
 * - Limits to maxPosts.
 */
export function applyEditorialOverrides(
  rankedPosts: InstagramPost[],
  overrides: {
    pinnedPostIds?: string[];
    hiddenPostIds?: string[];
    safeguardingExcludedIds?: string[];
  },
  maxPosts: number = 6,
): InstagramPost[] {
  const hiddenIds = new Set([
    ...(overrides.hiddenPostIds ?? []),
    ...(overrides.safeguardingExcludedIds ?? []),
  ]);
  const pinnedIds = new Set(overrides.pinnedPostIds ?? []);

  // Filter out hidden/excluded
  const visible = rankedPosts.filter((p) => !hiddenIds.has(p.id));

  // Separate pinned from auto-ranked
  const pinned: InstagramPost[] = [];
  const auto: InstagramPost[] = [];

  for (const post of visible) {
    if (pinnedIds.has(post.id)) {
      pinned.push({ ...post, pinned: true });
    } else {
      auto.push(post);
    }
  }

  // If a pinned ID wasn't in the API results, we still reserve its slot
  // (the caller can merge manual posts separately).
  const pinnedCount = pinnedIds.size;
  const autoSlots = Math.max(0, maxPosts - pinnedCount);
  const selectedAuto = auto.slice(0, autoSlots);

  // Pinned first, then auto-ranked
  const result = [...pinned, ...selectedAuto];

  // Deduplicate by ID (in case manual posts overlap)
  const seen = new Set<string>();
  return result.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

/**
 * Truncates a caption to a maximum length, ensuring we don't cut mid-word.
 * Appends an ellipsis if truncated.
 */
export function truncateCaption(caption: string, maxLength: number = 120): string {
  if (caption.length <= maxLength) return caption;

  const truncated = caption.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + "…";
  }

  return truncated + "…";
}

/**
 * Returns a human-readable media-type label for accessibility and display.
 */
export function getMediaTypeLabel(mediaType: InstagramMediaType): string {
  switch (mediaType) {
    case "REEL":
      return "Reel";
    case "VIDEO":
      return "Video";
    case "CAROUSEL_ALBUM":
      return "Carousel";
    case "IMAGE":
    default:
      return "Photo";
  }
}
