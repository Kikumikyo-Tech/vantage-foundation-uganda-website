// Generate content/media.ts from the image manifest template.
// All entries have consent="pending" and published=false until human review.

const fs = require("fs");
const path = require("path");

const manifest = require(path.join(__dirname, "image-manifest-template.json"));
const outputFile = path.join(__dirname, "..", "content", "media.ts");

const lines = [
  "import { MediaAsset } from \"@/types\";",
  "",
  "// Media manifest — the single source of truth for all published images.",
  "//",
  "// This file was auto-generated from scripts/process-images.js.",
  "// All 89 photos from \"vantage photos/\" have been processed:",
  "//   - All EXIF/IPTC/ICC metadata stripped (no GPS, no camera info)",
  "//   - Resized to max 1920px and converted to WebP + AVIF",
  "//   - Saved to public/images/photos/ as photo-001.webp through photo-089.webp",
  "//",
  "// ALL entries have consent=\"pending\" and published=false.",
  "// A human reviewer MUST:",
  "//   1. View each photo and write descriptive alt text (no invented names for children)",
  "//   2. Verify consent for all identifiable people featured",
  "//   3. Categorize by programme/project (set programme and projectSlug fields)",
  "//   4. Set consent to \"verified\", \"group-consent\", or \"none\" as appropriate",
  "//   5. Set published=true for photos cleared for public use",
  "//",
  "// See docs/editorial-guidelines.md and docs/safeguarding-and-consent.md",
  "// for the full editorial workflow and consent rules.",
  "",
  "export const mediaAssets: MediaAsset[] = [",
];

for (const entry of manifest) {
  if (entry.error) {
    lines.push(`  // ERROR: ${entry.originalFile}: ${entry.error}`);
    continue;
  }
  lines.push("  {");
  lines.push(`    id: "${entry.id}",`);
  lines.push(`    src: "${entry.src}",`);
  lines.push(`    alt: "${entry.alt}",`);
  lines.push(`    consent: "${entry.consent}",`);
  lines.push(`    consentNotes: "${entry.consentNotes}",`);
  lines.push(`    published: ${entry.published},`);
  lines.push(`    // Dimensions: ${entry.width}x${entry.height} (${entry.orientation})`);
  lines.push(`    // Original: ${entry.originalFile} (${entry.originalSizeKB}KB → WebP ${entry.webpSizeKB}KB, ${entry.compressionRatio})`);
  lines.push(`    // AVIF also available: ${entry.srcAvif}`);
  lines.push("  },");
}

lines.push("];");
lines.push("");
lines.push(`/** Total processed photos: ${manifest.length} (all pending human review) */`);
lines.push("export const totalProcessedPhotos = mediaAssets.length;");
lines.push("");
lines.push("/** Get a media asset by id. */");
lines.push("export function getMediaAsset(id: string): MediaAsset | undefined {");
lines.push("  return mediaAssets.find((m) => m.id === id);");
lines.push("}");
lines.push("");
lines.push("/** Get all media assets for a project slug. */");
lines.push("export function getMediaByProject(projectSlug: string): MediaAsset[] {");
lines.push("  return mediaAssets.filter((m) => m.projectSlug === projectSlug);");
lines.push("}");
lines.push("");
lines.push("/** Get all media assets for a programme area id. */");
lines.push("export function getMediaByProgramme(programme: string): MediaAsset[] {");
lines.push("  return mediaAssets.filter((m) => m.programme === programme);");
lines.push("}");
lines.push("");
lines.push("/** Get all published media assets (filters out unpublished in production). */");
lines.push("export function getPublishedMedia(): MediaAsset[] {");
lines.push("  const isDev = process.env.NODE_ENV === \"development\";");
lines.push("  return mediaAssets.filter((m) => isDev || m.published !== false);");
lines.push("}");
lines.push("");

fs.writeFileSync(outputFile, lines.join("\n"));
console.log(`Wrote ${manifest.length} entries to ${outputFile}`);
console.log(`File size: ${Math.round(fs.statSync(outputFile).size / 1024)}KB`);
