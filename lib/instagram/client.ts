import "server-only";

import type {
  InstagramPost,
  InstagramMediaType,
  InstagramMetrics,
  InstagramFeedResult,
  InstagramManualPost,
} from "@/types";
import { site } from "@/content/site";
import {
  rankPosts,
  applyEditorialOverrides,
} from "@/lib/instagram/scoring";
import { getInstagramOverrides } from "@/content/instagram-overrides";

/**
 * Instagram Graph API client.
 *
 * Uses the Meta Graph API to fetch media from a professional (Business or
 * Creator) Instagram account. Results are cached in-memory with a TTL to
 * avoid hitting the API on every page load. A cron endpoint
 * (/api/instagram/refresh) triggers periodic refreshes.
 *
 * Security: access tokens are read from server-only environment variables
 * and never exposed to the client.
 */

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

/** Cache TTL: 6 hours (matches the minimum recommended refresh schedule). */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

/** API request timeout in milliseconds. */
const API_TIMEOUT_MS = 8_000;

/** Number of posts to fetch from the API (fetch more than needed for ranking). */
const API_FETCH_LIMIT = 25;

/** Maximum posts to display in the section. */
const MAX_DISPLAY_POSTS = 6;

interface CachedFeed {
  posts: InstagramPost[];
  fetchedAt: number;
}

let cachedFeed: CachedFeed | null = null;

function getInstagramEnv() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const username = process.env.INSTAGRAM_USERNAME || "vantagefoundationuganda";
  const profileUrl =
    process.env.INSTAGRAM_PROFILE_URL || site.socials.instagram || "";

  return { token, accountId, username, profileUrl };
}

/**
 * Returns true if the Instagram API credentials are configured.
 */
export function isInstagramConfigured(): boolean {
  const { token, accountId } = getInstagramEnv();
  return Boolean(token && accountId);
}

/**
 * Fetches with a timeout to prevent the homepage from waiting too long.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = API_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Maps a raw API media object to our InstagramPost type.
 * The Meta API returns different metric fields depending on media type.
 */
function mapApiPost(raw: Record<string, unknown>): InstagramPost {
  const mediaType = (raw.media_type as InstagramMediaType) ?? "IMAGE";
  const metrics: InstagramMetrics = {};

  // Reach is available for all media types on business accounts
  if (typeof raw.reach === "number") metrics.reach = raw.reach;
  if (typeof raw.impressions === "number") metrics.impressions = raw.impressions;
  if (typeof raw.likes === "number") metrics.likes = raw.likes;
  if (typeof raw.comments === "number") metrics.comments = raw.comments;
  if (typeof raw.shares === "number") metrics.shares = raw.shares;
  if (typeof raw.saves === "number") metrics.saves = raw.saves;
  if (typeof raw.views === "number") metrics.views = raw.views;
  if (typeof raw.profile_visits === "number") metrics.profileVisits = raw.profile_visits;

  return {
    id: raw.id as string,
    mediaType,
    mediaUrl: (raw.media_url as string) ?? "",
    thumbnailUrl: raw.thumbnail_url as string | undefined,
    permalink: (raw.permalink as string) ?? "",
    caption: (raw.caption as string) ?? "",
    timestamp: (raw.timestamp as string) ?? "",
    username: (raw.username as string) ?? "",
    metrics,
  };
}

/**
 * Fetches recent media from the Instagram Graph API.
 * Returns raw posts (unranked) or throws on error.
 */
async function fetchApiPosts(): Promise<InstagramPost[]> {
  const { token, accountId } = getInstagramEnv();

  if (!token || !accountId) {
    throw new Error("Instagram API credentials not configured");
  }

  // Request fields with metrics. The API returns only supported metrics
  // per media type — missing fields are handled gracefully.
  const fields = [
    "id",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "caption",
    "timestamp",
    "username",
    "reach",
    "impressions",
    "likes",
    "comments",
    "shares",
    "saves",
    "views",
    "profile_visits",
  ].join(",");

  const url = `${GRAPH_API_BASE}/${accountId}/media?fields=${fields}&limit=${API_FETCH_LIMIT}&access_token=${token}`;

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Instagram API error: ${response.status} ${response.statusText} ${body.slice(0, 200)}`,
    );
  }

  const data = await response.json();
  const rawPosts = (data.data as Record<string, unknown>[]) ?? [];

  return rawPosts.map(mapApiPost);
}

/**
 * Converts a manual post (from editorial overrides) to an InstagramPost.
 */
function manualPostToInstagramPost(manual: InstagramManualPost): InstagramPost {
  return {
    id: manual.id,
    mediaType: manual.mediaType,
    mediaUrl: manual.mediaUrl,
    thumbnailUrl: manual.thumbnailUrl,
    permalink: manual.permalink,
    caption: manual.caption,
    timestamp: manual.timestamp,
    username: getInstagramEnv().username,
    metrics: {},
    pinned: true,
    featuredCampaign: manual.featuredCampaign,
    programmeCategory: manual.programmeCategory,
    manuallyAdded: true,
  };
}

/**
 * Returns the cached feed if it's still fresh.
 */
function getCachedFeed(): InstagramPost[] | null {
  if (!cachedFeed) return null;

  const age = Date.now() - cachedFeed.fetchedAt;
  if (age > CACHE_TTL_MS) return null;

  return cachedFeed.posts;
}

/**
 * Stores posts in the in-memory cache.
 */
function setCachedFeed(posts: InstagramPost[]): void {
  cachedFeed = { posts, fetchedAt: Date.now() };
}

/**
 * Gets the cached feed regardless of TTL (for fallback when API is down).
 */
function getStaleCachedFeed(): InstagramPost[] | null {
  return cachedFeed?.posts ?? null;
}

/**
 * Main entry point: returns the final ranked, filtered post list for display.
 *
 * Flow:
 * 1. Try API → cache result → rank → apply overrides
 * 2. On API failure, try stale cache → rank → apply overrides
 * 3. If no cache, try manual posts from editorial overrides
 * 4. If nothing available, return empty result (section hides grid)
 */
export async function getPopularInstagramPosts(): Promise<InstagramFeedResult> {
  const { username, profileUrl } = getInstagramEnv();
  const overrides = getInstagramOverrides();

  // If auto-ranking is disabled and manual posts exist, use only manual posts
  if (overrides.disableAutoRanking && overrides.manualPosts.length > 0) {
    const manualPosts = overrides.manualPosts.map(manualPostToInstagramPost);
    return {
      posts: manualPosts.slice(0, MAX_DISPLAY_POSTS),
      source: "manual",
      fetchedAt: Date.now(),
      profileUrl,
      username,
    };
  }

  // Try fresh cache first
  const cached = getCachedFeed();
  if (cached && cached.length > 0) {
    const ranked = rankPosts(cached);
    const final = applyEditorialOverrides(ranked, overrides, MAX_DISPLAY_POSTS);
    return {
      posts: mergeManualPosts(final, overrides.manualPosts, MAX_DISPLAY_POSTS),
      source: "cache",
      fetchedAt: cachedFeed!.fetchedAt,
      profileUrl,
      username,
    };
  }

  // Try API
  if (isInstagramConfigured()) {
    try {
      const apiPosts = await fetchApiPosts();
      setCachedFeed(apiPosts);

      const ranked = rankPosts(apiPosts);
      const final = applyEditorialOverrides(ranked, overrides, MAX_DISPLAY_POSTS);
      return {
        posts: mergeManualPosts(final, overrides.manualPosts, MAX_DISPLAY_POSTS),
        source: "api",
        fetchedAt: Date.now(),
        profileUrl,
        username,
      };
    } catch {
      // Fall through to stale cache
    }
  }

  // Try stale cache (API was down or not configured)
  const stale = getStaleCachedFeed();
  if (stale && stale.length > 0) {
    const ranked = rankPosts(stale);
    const final = applyEditorialOverrides(ranked, overrides, MAX_DISPLAY_POSTS);
    return {
      posts: mergeManualPosts(final, overrides.manualPosts, MAX_DISPLAY_POSTS),
      source: "cache",
      fetchedAt: cachedFeed!.fetchedAt,
      profileUrl,
      username,
    };
  }

  // Try manual posts only
  if (overrides.manualPosts.length > 0) {
    const manualPosts = overrides.manualPosts.map(manualPostToInstagramPost);
    return {
      posts: manualPosts.slice(0, MAX_DISPLAY_POSTS),
      source: "manual",
      fetchedAt: Date.now(),
      profileUrl,
      username,
    };
  }

  // Nothing available — return empty
  return {
    posts: [],
    source: "empty",
    fetchedAt: Date.now(),
    profileUrl,
    username,
  };
}

/**
 * Merges manual posts into the final list, placing them after pinned API posts
 * but before auto-ranked posts. Deduplicates by ID.
 */
function mergeManualPosts(
  autoPosts: InstagramPost[],
  manualPosts: InstagramManualPost[],
  maxPosts: number,
): InstagramPost[] {
  if (manualPosts.length === 0) return autoPosts.slice(0, maxPosts);

  const manual = manualPosts.map(manualPostToInstagramPost);
  const seen = new Set<string>();

  // Place pinned auto posts first, then manual, then auto
  const pinned = autoPosts.filter((p) => p.pinned);
  const nonPinned = autoPosts.filter((p) => !p.pinned);

  const result = [...pinned, ...manual, ...nonPinned];

  return result
    .filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    })
    .slice(0, maxPosts);
}

/**
 * Forces a refresh of the cache from the API. Called by the cron endpoint.
 * Returns the number of posts fetched, or throws on error.
 */
export async function refreshInstagramCache(): Promise<number> {
  const apiPosts = await fetchApiPosts();
  setCachedFeed(apiPosts);
  return apiPosts.length;
}
