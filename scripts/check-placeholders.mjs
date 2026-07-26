/**
 * Pre-launch check: scans content/ for placeholder strings and reports them.
 *
 * Placeholders are marked with:
 * - `[...]` or `[Number]` in text fields
 * - `placeholder: true` boolean flag
 * - filenames containing "placeholder"
 * - `[TBD]`, `[TODO]`, `[VERIFY]`
 *
 * Run: npm run check-placeholders
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "content");

const PLACEHOLDER_PATTERNS = [
  /\[\.\.\.\]/g,
  /\[Number\]/gi,
  /\[TBD\]/gi,
  /\[TODO\]/gi,
  /\[VERIFY\]/gi,
  /\[Date\]/gi,
  /\[Name\]/gi,
  /placeholder:\s*true/g,
];

const FILE_PLACEHOLDER_PATTERNS = [/placeholder/i];

async function scanFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const findings = [];

  for (const pattern of PLACEHOLDER_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      findings.push({ pattern: pattern.source, count: matches.length });
    }
  }

  // Check for placeholder image paths
  const imageMatches = content.match(/["'`]([^"'`]*placeholder[^"'`]*)["'`]/g);
  if (imageMatches) {
    findings.push({ pattern: "placeholder image path", count: imageMatches.length });
  }

  return findings;
}

async function scanDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await scanDirectory(fullPath)));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const findings = await scanFile(fullPath);
      if (findings.length > 0) {
        results.push({ file: fullPath, findings });
      }
    }
  }

  return results;
}

async function main() {
  console.log("Scanning content/ for placeholders...\n");

  const results = await scanDirectory(CONTENT_DIR);

  if (results.length === 0) {
    console.log("✓ No placeholders found in content/");
    process.exit(0);
  }

  console.log(`⚠ Found placeholders in ${results.length} file(s):\n`);

  for (const { file, findings } of results) {
    const relativePath = file.replace(process.cwd() + "\\", "").replace(/\\/g, "/");
    console.log(`  ${relativePath}:`);
    for (const f of findings) {
      console.log(`    ${f.pattern}: ${f.count} occurrence(s)`);
    }
  }

  console.log(`\nTotal: ${results.length} file(s) with placeholders.`);
  console.log("Replace all placeholders with verified content before launch.");
  process.exit(0); // Exit 0 so CI doesn't fail — this is informational
}

main().catch((err) => {
  console.error("Placeholder check failed:", err);
  process.exit(1);
});
