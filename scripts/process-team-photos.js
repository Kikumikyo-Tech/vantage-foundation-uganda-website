// Team portrait processing pipeline:
// 1. Strip ALL metadata (EXIF/ICC/XMP) — sharp drops it by default unless
//    .withMetadata() is called.
// 2. Crop to two fixed aspect ratios: 1:1 (cards) and 4:5 (profile pages),
//    gravity "top" so headroom/face stays in frame across mixed source
//    framings.
// 3. Convert to WebP (quality 82) and AVIF (quality 60), matching the
//    convention already used for public/images/photos.
// 4. Save to public/images/team/ with descriptive kebab-case filenames.
//
// No facial features are altered and no portraits are generated — this only
// resizes/crops/re-encodes the real supplied photos.
//
// Usage: node scripts/process-team-photos.js

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(__dirname, "..", "vantage_photos");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "team");

const SQUARE = 800; // 1:1 card crop
const PORTRAIT_W = 800; // 4:5 profile crop
const PORTRAIT_H = 1000;
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 60;

const members = [
  { file: "Dr Nassazi Kauthar Wangi.png", slug: "nassazi-kauthar-wangi" },
  { file: "Dr Turyasingura Hillary A.png", slug: "turyasingura-hillary-a" },
  { file: "Dr Kabagenyi Oliyer Abwooli.png", slug: "kabagenyi-oliyer-abwooli" },
  { file: "Mr Ashabahebwa Humphrey.png", slug: "ashabahebwa-humphrey" },
  { file: "Engineer Omara Godfrey.png", slug: "omara-godfrey" },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { file, slug } of members) {
    const srcPath = path.join(SOURCE_DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing source file: ${file}`);
      continue;
    }

    const base = sharp(srcPath).rotate();

    await base
      .clone()
      .resize({ width: SQUARE, height: SQUARE, fit: "cover", position: "top" })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${slug}-square.webp`));

    await base
      .clone()
      .resize({ width: SQUARE, height: SQUARE, fit: "cover", position: "top" })
      .avif({ quality: AVIF_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${slug}-square.avif`));

    await base
      .clone()
      .resize({ width: PORTRAIT_W, height: PORTRAIT_H, fit: "cover", position: "top" })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${slug}-portrait.webp`));

    await base
      .clone()
      .resize({ width: PORTRAIT_W, height: PORTRAIT_H, fit: "cover", position: "top" })
      .avif({ quality: AVIF_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${slug}-portrait.avif`));

    console.log(`Processed ${file} -> ${slug}-{square,portrait}.{webp,avif}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
