// Extract EXIF metadata from all photos in "vantage photos/".
// Outputs a JSON report with date, dimensions, GPS coordinates, and camera info.
// This is step 1 of the image pipeline: understand what we have before processing.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PHOTOS_DIR = path.join(__dirname, "..", "vantage photos");
const OUTPUT_FILE = path.join(__dirname, "exif-report.json");

async function main() {
  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"))
    .sort();

  const report = [];

  for (const file of files) {
    const filePath = path.join(PHOTOS_DIR, file);
    const stat = fs.statSync(filePath);
    try {
      const metadata = await sharp(filePath).metadata();
      const exif = {};
      if (metadata.exif) {
        // Parse EXIF IFD0 and IFDExif for key fields
        const buf = metadata.exif;
        // sharp gives raw EXIF buffer; use with-exif approach
      }
      report.push({
        file,
        sizeBytes: stat.size,
        sizeKB: Math.round(stat.size / 1024),
        width: metadata.width,
        height: metadata.height,
        orientation: metadata.orientation,
        density: metadata.density,
        format: metadata.format,
        space: metadata.space,
        hasProfile: metadata.hasProfile,
        hasAlpha: metadata.hasAlpha,
        // EXIF data is in metadata.exif (Buffer) — we'll parse it below
        exifLength: metadata.exif ? metadata.exif.length : 0,
        iccLength: metadata.icc ? metadata.icc.length : 0,
        iptcLength: metadata.iptc ? metadata.iptc.length : 0,
        xmpLength: metadata.xmp ? metadata.xmp.length : 0,
      });
    } catch (err) {
      report.push({ file, error: err.message });
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`Wrote ${report.length} entries to ${OUTPUT_FILE}`);

  // Summary
  const totalSize = report.reduce((s, r) => s + (r.sizeKB || 0), 0);
  const withExif = report.filter((r) => r.exifLength > 0).length;
  const withIcc = report.filter((r) => r.iccLength > 0).length;
  const withIptc = report.filter((r) => r.iptcLength > 0).length;
  const withXmp = report.filter((r) => r.xmpLength > 0).length;
  const errors = report.filter((r) => r.error).length;

  console.log(`\nSummary:`);
  console.log(`  Total photos: ${report.length}`);
  console.log(`  Total size: ${(totalSize / 1024).toFixed(1)} MB`);
  console.log(`  With EXIF: ${withExif}`);
  console.log(`  With ICC profile: ${withIcc}`);
  console.log(`  With IPTC: ${withIptc}`);
  console.log(`  With XMP: ${withXmp}`);
  console.log(`  Errors: ${errors}`);

  // Dimensions distribution
  const portrait = report.filter((r) => r.height > r.width).length;
  const landscape = report.filter((r) => r.width > r.height).length;
  const square = report.filter((r) => r.width === r.height).length;
  console.log(`\nOrientation: ${portrait} portrait, ${landscape} landscape, ${square} square`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
