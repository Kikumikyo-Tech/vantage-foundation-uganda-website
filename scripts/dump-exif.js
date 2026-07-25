// Dump all EXIF tags from a single photo to understand the metadata format.
const ExifReader = require("exifreader");
const path = require("path");

const file = path.join(__dirname, "..", "vantage photos", "00AEBEFD-00FD-4CC0-A799-8C3CB8CAEE54.jpg");

const tags = ExifReader.load(file, { expanded: true });
console.log(JSON.stringify(tags, null, 2));
