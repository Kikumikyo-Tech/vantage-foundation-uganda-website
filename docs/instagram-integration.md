# Instagram Integration — Popular on Instagram

## Overview

The "Popular on Instagram" section displays Vantage Foundation Uganda's
highest-performing Instagram posts on the homepage, ranked by reach and
engagement rather than recency alone.

## Architecture

```
content/instagram-overrides.ts   Editorial controls (pin, hide, manual posts)
lib/instagram/scoring.ts         Ranking, normalisation, scoring logic
lib/instagram/client.ts          Meta Graph API client, caching, fallback
app/api/instagram/refresh/route.ts  Cron endpoint for scheduled refresh
components/sections/InstagramSection.tsx  Homepage section
components/shared/InstagramPostCard.tsx   Individual post card
```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived access token from Meta Graph API |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Numeric Instagram Business Account ID |
| `INSTAGRAM_USERNAME` | Instagram username without @ (default: vantagefoundation) |
| `INSTAGRAM_PROFILE_URL` | Full profile URL (default: site.socials.instagram) |
| `CRON_SECRET` | Optional secret to protect the refresh endpoint |

All variables are server-only and never exposed to the client.

## Meta Account Configuration

### 1. Convert to a Professional Account

The Instagram account must be a **Business** or **Creator** account:

1. Open Instagram > Settings > Account type and tools
2. Switch to a Professional account
3. Connect to a Facebook Page

### 2. Get an Access Token

1. Go to the [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Create a Meta App if you don't have one
3. Add the `instagram_basic` and `pages_show_list` permissions
4. Generate a user access token
5. Exchange for a long-lived token (60 days) via the API
6. Use the token to get the IG Business Account ID

### 3. Get the Business Account ID

```
GET /me/accounts?fields=instagram_business_account
```

The response contains the `instagram_business_account.id` which is your
`INSTAGRAM_BUSINESS_ACCOUNT_ID`.

### 4. Token Renewal

Long-lived tokens expire after 60 days. To renew:

1. Make a GET request to the token refresh endpoint before expiry
2. Or set up a scheduled job to refresh the token automatically

## How Scoring Works

Posts are ranked using a configurable weighted model:

| Metric | Weight | Description |
|--------|--------|-------------|
| Reach / unique viewers | 50% | Best available: reach, impressions, or views |
| Shares | 20% | Post shares |
| Saves | 15% | Post saves |
| Meaningful interactions | 10% | Likes + comments |
| Freshness | 5% | Linear decay over 90 days |

### Normalisation

Each metric is min-max normalised to 0-1 across all eligible posts before
scoring. This ensures fair comparison between different media types (images,
Reels, carousels) without directly comparing raw values.

### Eligibility

Posts older than 90 days are excluded. The freshness component provides
a linear decay from 1 (new) to 0 (90 days old).

## How to Pin or Exclude Posts

Edit `content/instagram-overrides.ts`:

```typescript
export const instagramOverrides: InstagramEditorialOverrides = {
  // Pin these posts to the top (by Instagram media ID)
  pinnedPostIds: ["178414..."],

  // Hide these posts from the website
  hiddenPostIds: ["178415..."],

  // Manually add posts (useful when API is unavailable)
  manualPosts: [
    {
      id: "manual-1",
      mediaType: "IMAGE",
      mediaUrl: "https://example.com/photo.jpg",
      permalink: "https://instagram.com/p/abc123",
      caption: "Caption text",
      timestamp: "2026-01-15T10:00:00+0000",
    },
  ],

  // Disable automatic ranking (show only pinned/manual posts)
  disableAutoRanking: false,

  // Badge posts as featured campaign
  featuredCampaignPostIds: ["178416..."],

  // Exclude posts for safeguarding reasons
  safeguardingExcludedIds: ["178417..."],
};
```

### Finding a Post's Media ID

Use the Graph API Explorer:

```
GET /{business-account-id}/media?fields=id,permalink&access_token=...
```

Match the permalink to find the ID for the post you want to pin or hide.

## Safeguarding Exclusions

Posts involving children, patients, or vulnerable beneficiaries can be
excluded by adding their media IDs to `safeguardingExcludedIds`. This is
separate from `hiddenPostIds` to distinguish safeguarding decisions from
editorial preferences.

**Only public-facing content appropriate for the website should be displayed.**
The automatic ranking does NOT display every high-performing post — editorial
review is required.

## Refresh Schedule

The Instagram cache refreshes via a cron endpoint:

```
POST /api/instagram/refresh
Authorization: Bearer <CRON_SECRET>  (if CRON_SECRET is set)
```

Configure a scheduler (Vercel Cron, GitHub Actions, etc.) to hit this endpoint
every 6-12 hours.

### Vercel Cron Example

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/instagram/refresh",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Fallback Behaviour

When the Instagram API is unavailable:

1. Display the last successfully cached posts (stale cache)
2. If no cache exists, display manually configured posts
3. If neither is available, hide the post grid and show only the follow button

No broken cards or technical error messages are shown to visitors.

## Disabling the Integration

To safely disable the Instagram section:

1. Set `disableAutoRanking: true` in `content/instagram-overrides.ts`
2. Clear `manualPosts` array
3. The section will show only the follow button

Alternatively, remove `<InstagramSection />` from `app/page.tsx`.

## Analytics

The section supports privacy-conscious analytics through:

- Post card links include `data-programme-category` attributes
- The follow button includes `data-action="instagram-follow"`
- No private Instagram performance metrics are exposed in the browser

To track interactions, add event listeners in your analytics provider:

```javascript
document.querySelectorAll('[data-action="instagram-follow"]')
  .forEach(el => el.addEventListener('click', trackFollow));
```
