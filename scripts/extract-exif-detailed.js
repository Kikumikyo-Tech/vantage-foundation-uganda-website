// Extract detailed EXIF metadata from all photos using exifreader.
// Outputs: scripts/exif-detailed.json with dates, GPS, camera, IPTC keywords.

const fs = require("fs");
const path = require("path");
const ExifReader = require("exifreader");

const PHOTOS_DIR = path.join(__dirname, "..", "vantage photos");
const OUTPUT_FILE = path.join(__dirname, "exif-detailed.json");

async function main() {
  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg"))
    .sort();

  const report = [];
  let gpsCount = 0;
  let dateCount = 0;
  let keywordCount = 0;

  for (const file of files) {
    const filePath = path.join(PHOTOS_DIR, file);
    const entry = { file };

    try {
      const tags = ExifReader.load(filePath, { expanded: true });

      // Date info
      const dateTime =
        tags.DateTimeOriginal?.description ||
        tags.CreateDate?.description ||
        tags.ModifyDate?.description;
      if (dateTime) {
        entry.dateTime = dateTime;
        dateCount++;
      }

      // GPS coordinates
      if (tags.GPSLatitude && tags.GPSLongitude) {
        entry.gps = {
          latitude: tags.GPSLatitude.description,
          longitude: tags.GPSLongitude.description,
        };
        gpsCount++;
      }

      // Camera info
      if (tags.Make?.description) entry.cameraMake = tags.Make.description;
      if (tags.Model?.description) entry.cameraModel = tags.Model.description;
      if (tags.LensModel?.description) entry.lensModel = tags.LensModel.description;

      // Image dimensions
      if (tags.ImageWidth?.description) entry.width = tags.ImageWidth.description;
      if (tags.ImageLength?.description) entry.height = tags.ImageLength.description;

      // IPTC keywords (often used for categorization by photographers)
      if (tags.Keywords) {
        const keywords = Array.isArray(tags.Keywords)
          ? tags.Keywords.map((k) => k.description)
          : [tags.Keywords.description];
        entry.keywords = keywords;
        keywordCount++;
      }

      // IPTC caption
      if (tags.Caption?.description) {
        entry.caption = tags.Caption.description;
      }

      // IPTC location
      if (tags.SubLocation?.description) entry.subLocation = tags.SubLocation.description;
      if (tags.City?.description) entry.city = tags.City.description;
      if (tags.Country?.description) entry.country = tags.Country.description;

      // Software (e.g. "ChatGPT" or image editor)
      if (tags.Software?.description) entry.software = tags.Software.description;
    } catch (err) {
      entry.error = err.message;
    }

    report.push(entry);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  console.log(`Processed ${report.length} photos`);
  console.log(`  With dates: ${dateCount}`);
  console.log(`  With GPS coordinates: ${gpsCount} (CRITICAL: must be stripped)`);
  console.log(`  With IPTC keywords: ${keywordCount}`);

  // Print photos with GPS
  const withGps = report.filter((r) => r.gps);
  if (withGps.length > 0) {
    console.log(`\nPhotos with GPS coordinates (will be stripped):`);
    for (const p of withGps) {
      console.log(`  ${p.file}: ${p.gps.latitude}, ${p.gps.longitude}`);
    }
  }

  // Print photos with keywords (helps categorization)
  const withKeywords = report.filter((r) => r.keywords);
  if (withKeywords.length > 0) {
    console.log(`\nPhotos with IPTC keywords:`);
    for (const p of withKeywords) {
      console.log(`  ${p.file}: ${p.keywords.join(", ")}`);
    }
  }

  // Print date range
  const dated = report.filter((r) => r.dateTime).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  if (dated.length > 0) {
    console.log(`\nDate range: ${dated[0].dateTime} to ${dated[dated.length - 1].dateTime}`);
  }

  // Print captions
  const withCaptions = report.filter((r) => r.caption);
  if (withCaptions.length > 0) {
    console.log(`\nPhotos with IPTC captions:`);
    for (const p of withCaptions) {
      console.log(`  ${p.file}: "${p.caption}"`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
