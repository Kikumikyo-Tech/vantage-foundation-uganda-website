// Image processing pipeline:
// 1. Strip ALL metadata (EXIF, IPTC, ICC, XMP) from every photo
// 2. Resize to max 1920px on longest side (preserving aspect ratio)
// 3. Convert to WebP (quality 82) and AVIF (quality 60)
// 4. Save to public/images/photos/ with sequential filenames
// 5. Generate a manifest template (JSON) for human review
//
// Usage: node scripts/process-images.js

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PHOTOS_DIR = path.join(__dirname, "..", "vantage photos");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "photos");
const MANIFEST_FILE = path.join(__dirname, "image-manifest-template.json");

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 60;

async function main() {
  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg"))
    .sort();

  console.log(`Processing ${files.length} photos...`);

  const manifest = [];
  let processed = 0;
  let errors = 0;
  let totalOriginalKB = 0;
  let totalWebpKB = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(PHOTOS_DIR, file);
    const stat = fs.statSync(filePath);
    const originalKB = Math.round(stat.size / 1024);
    totalOriginalKB += originalKB;

    // Sequential filename: photo-001, photo-002, etc.
    const seq = String(i + 1).padStart(3, "0");
    const baseName = `photo-${seq}`;
    const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
    const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);

    try {
      // Get original dimensions
      const meta = await sharp(filePath).metadata();
      const origWidth = meta.width;
      const origHeight = meta.height;

      // Process: strip all metadata, resize, convert to WebP
      const webpResult = await sharp(filePath)
        .rotate() // Auto-rotate based on EXIF orientation
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath);

      // Also produce AVIF for even better compression
      const avifResult = await sharp(filePath)
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif({ quality: AVIF_QUALITY })
        .toFile(avifPath);

      const webpKB = Math.round(webpResult.size / 1024);
      const avifKB = Math.round(avifResult.size / 1024);
      totalWebpKB += webpKB;

      manifest.push({
        id: baseName,
        originalFile: file,
        src: `/images/photos/${baseName}.webp`,
        srcAvif: `/images/photos/${baseName}.avif`,
        alt: "TODO: Describe visible content (no invented names for children)",
        consent: "pending",
        consentNotes: "Requires management verification before publishing",
        published: false,
        width: webpResult.width,
        height: webpResult.height,
        originalWidth: origWidth,
        originalHeight: origHeight,
        originalSizeKB: originalKB,
        webpSizeKB: webpKB,
        avifSizeKB: avifKB,
        compressionRatio: `${((1 - webpKB / originalKB) * 100).toFixed(0)}% smaller`,
        orientation: webpResult.height > webpResult.width ? "portrait" : "landscape",
      });

      processed++;
      if (processed % 10 === 0) {
        console.log(`  Processed ${processed}/${files.length}...`);
      }
    } catch (err) {
      console.error(`  ERROR processing ${file}: ${err.message}`);
      manifest.push({
        id: baseName,
        originalFile: file,
        error: err.message,
      });
      errors++;
    }
  }

  // Write manifest template
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

  console.log(`\nDone!`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Original total: ${(totalOriginalKB / 1024).toFixed(1)} MB`);
  console.log(`  WebP total: ${(totalWebpKB / 1024).toFixed(1)} MB`);
  console.log(`  Space saved: ${((1 - totalWebpKB / totalOriginalKB) * 100).toFixed(0)}%`);
  console.log(`\nManifest template: ${MANIFEST_FILE}`);
  console.log(`Images saved to: ${OUTPUT_DIR}`);
  console.log(`\nAll images have consent="pending" and published=false.`);
  console.log(`A human reviewer must view each photo, write alt text, and verify consent`);
  console.log(`before updating content/media.ts and setting published=true.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
