import type { InstagramEditorialOverrides } from "@/types";

/**
 * Editorial overrides for the "Popular on Instagram" section.
 *
 * Vantage staff can control which posts appear by editing this file:
 *
 * - pinnedPostIds:           Instagram media IDs to pin at the top.
 * - hiddenPostIds:           Media IDs to hide from the website.
 * - manualPosts:             Manually selected posts to include.
 * - disableAutoRanking:      When true, only pinned/manual posts are shown.
 * - featuredCampaignPostIds: Posts to badge as "Featured campaign".
 * - safeguardingExcludedIds: Posts excluded for safeguarding reasons
 *                            (children, patients, vulnerable beneficiaries).
 *
 * To find a post's media ID, use the Meta Graph API Explorer or
 * run: GET /{account-id}/media?fields=id,permalink&access_token=...
 *
 * See docs/instagram-integration.md for detailed instructions.
 */
export const instagramOverrides: InstagramEditorialOverrides = {
  pinnedPostIds: [],
  hiddenPostIds: [],
  manualPosts: [],
  disableAutoRanking: false,
  featuredCampaignPostIds: [],
  safeguardingExcludedIds: [],
};

/**
 * Returns the current editorial overrides.
 * Exported as a function so the source can be swapped later (e.g. DB-backed)
 * without changing the client module.
 */
export function getInstagramOverrides(): InstagramEditorialOverrides {
  return instagramOverrides;
}
