import { MediaAsset } from "@/types";

// Media manifest — the single source of truth for all published images.
//
// Each entry records consent status, credit, and contextual metadata so
// editors can verify safeguarding compliance before publishing. Images
// referenced in content/*.ts (heroImage, photo, logo, gallery) should
// have a corresponding entry here.
//
// Until real photos are organised (Phase 2), this manifest is empty.
// When images are added, create one MediaAsset per file with:
//   - A descriptive id (e.g. "kasaale-borehole-opening-2022")
//   - Alt text based on visible content (NO invented names for children)
//   - consent classification (see types/index.ts ConsentClassification)
//   - credit and date where known
//
// See docs/editorial-guidelines.md for the full editorial workflow.

export const mediaAssets: MediaAsset[] = [
  // Example entry (commented out until real images are available):
  // {
  //   id: "kasaale-borehole-opening-2022",
  //   src: "/images/projects/kasaale-borehole-opening.jpg",
  //   alt: "Community members gathered around a newly installed borehole hand pump in Kasaale",
  //   caption: "The Kasaale borehole opening ceremony, 2022.",
  //   credit: "Vantage Foundation Uganda",
  //   date: "2022-06-15",
  //   location: "Kasaale, Uganda",
  //   programme: "water",
  //   projectSlug: "kasaale-deep-borehole",
  //   consent: "group-consent",
  //   consentNotes: "Verbal consent from community water committee chair.",
  //   published: true,
  // },
];

/** Get a media asset by id. */
export function getMediaAsset(id: string): MediaAsset | undefined {
  return mediaAssets.find((m) => m.id === id);
}

/** Get all media assets for a project slug. */
export function getMediaByProject(projectSlug: string): MediaAsset[] {
  return mediaAssets.filter((m) => m.projectSlug === projectSlug);
}

/** Get all media assets for a programme area id. */
export function getMediaByProgramme(programme: string): MediaAsset[] {
  return mediaAssets.filter((m) => m.programme === programme);
}

/** Get all published media assets (filters out unpublished in production). */
export function getPublishedMedia(): MediaAsset[] {
  const isDev = process.env.NODE_ENV === "development";
  return mediaAssets.filter((m) => isDev || m.published !== false);
}
