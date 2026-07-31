/**
 * Site-wide image placements.
 *
 * This is the single place to change which photo appears in a fixed,
 * page-level slot (homepage hero, homepage about teaser, about-us page,
 * etc.). To swap a photo, change the `src` (and `alt`) below to any
 * published entry from `content/media.ts` (see `public/images/photos/` for
 * the numbered files, photo-001.webp through photo-089.webp) — no other
 * code needs to change.
 *
 * Per-item images (a specific project, story, team member or partner) are
 * NOT listed here — those live next to the rest of that item's content:
 *   - Projects: `heroImage` / `gallery` fields in content/projects.ts
 *   - Stories: `heroImage` field in content/stories.ts
 *   - Team: `photo` field in content/team.ts
 *   - Partners: `logo` field in content/partners.ts
 */

export interface ImagePlacement {
  src: string;
  alt: string;
}

export const imagePlacements = {
  /** Homepage hero — the large image beside the intro headline. */
  homeHero: {
    src: "/images/photos/photo-006.webp",
    alt: "Young people and community members in Uganda",
  },
  /** Homepage "About Vantage" teaser section. */
  homeAboutTeaser: {
    src: "/images/photos/photo-062.webp",
    alt: "Vantage Foundation Uganda community work",
  },
  /** About Us page — story section image. */
  aboutUsStory: {
    src: "/images/photos/photo-066.webp",
    alt: "Vantage Foundation Uganda community work",
  },
} as const satisfies Record<string, ImagePlacement>;
