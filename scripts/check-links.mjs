/**
 * Broken link checker: scans all internal links in the codebase and
 * verifies they point to valid routes or real files in public/.
 *
 * Run: npm run check-links
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "app");
const PUBLIC_DIR = join(ROOT, "public");

const IGNORED_SCAN_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "tests",
  "test-results",
  "playwright-report",
  "coverage",
]);

const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;
const ROUTE_FILE = /^route\.(tsx|ts|js)$/;

/**
 * Collect routes from the app directory.
 *
 * `basePath` must accumulate down the tree — an earlier version passed only
 * the current segment, so nested routes such as app/about-us/team registered
 * as "/team" and every real link to them was reported broken.
 */
async function collectRoutes(dir, basePath = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Private folders (_components) are never routable.
      if (entry.name.startsWith("_")) continue;

      const isGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      const isDynamic = entry.name.startsWith("[") && entry.name.endsWith("]");

      // Route groups contribute no path segment; dynamic segments match
      // anything below their parent.
      const nextBase = isGroup
        ? basePath
        : isDynamic
          ? `${basePath}/*`
          : `${basePath}/${entry.name}`;

      routes.push(...(await collectRoutes(fullPath, nextBase)));
    } else if (PAGE_FILE.test(entry.name) || ROUTE_FILE.test(entry.name)) {
      // Only a page/route file makes a path routable — a bare directory
      // does not.
      routes.push(basePath || "/");
    }
  }

  return routes;
}

/** Every file actually served from public/, as an absolute URL path. */
async function collectPublicFiles(dir, basePath = "") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(
        ...(await collectPublicFiles(fullPath, `${basePath}/${entry.name}`))
      );
    } else {
      files.push(`${basePath}/${entry.name}`);
    }
  }
  return files;
}

const LINK_PATTERNS = [
  /href=["'`]([^"'`]+)["'`]/g,
  /<Link\s+href=["'`]([^"'`]+)["'`]/g,
  /url:\s*["'`]([^"'`]+)["'`]/g,
];

async function scanLinks(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const links = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_SCAN_DIRS.has(entry.name)) continue;
      links.push(...(await scanLinks(fullPath)));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = await readFile(fullPath, "utf8");
      for (const pattern of LINK_PATTERNS) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const url = match[1];
          if (!url.startsWith("/") || url.startsWith("//")) continue;
          // Interpolated hrefs (`/team/${slug}`) resolve at runtime.
          if (url.includes("${")) continue;
          links.push({ url, file: fullPath });
        }
      }
    }
  }

  return links;
}

async function main() {
  console.log("Collecting routes...");
  const routePaths = await collectRoutes(APP_DIR);
  const publicFiles = new Set(await collectPublicFiles(PUBLIC_DIR));

  console.log(
    `Found ${routePaths.length} routes and ${publicFiles.size} public files.\n`
  );

  console.log("Scanning for internal links...");
  const links = await scanLinks(ROOT);

  const uniqueLinks = [...new Map(links.map((l) => [l.url, l])).values()];
  console.log(`Found ${uniqueLinks.length} unique internal links.\n`);

  const broken = [];
  for (const link of uniqueLinks) {
    const url = link.url.split("?")[0].split("#")[0];
    if (url === "/" || url === "") continue;

    if (publicFiles.has(url)) continue;

    const matched = routePaths.some((route) => {
      if (route === url) return true;
      if (route.endsWith("/*")) {
        const prefix = route.slice(0, -2);
        if (url.startsWith(`${prefix}/`)) return true;
      }
      return false;
    });

    if (!matched) broken.push(link);
  }

  if (broken.length === 0) {
    console.log("✓ No broken internal links found.");
    process.exit(0);
  }

  console.log(`⚠ Found ${broken.length} potentially broken link(s):\n`);
  for (const link of broken) {
    const relativePath = link.file
      .replace(ROOT, "")
      .replace(/^[\\/]/, "")
      .replace(/\\/g, "/");
    console.log(`  ${link.url} (in ${relativePath})`);
  }

  console.log(`\nNote: Some links may be valid if they're generated dynamically.`);
  process.exit(0); // Informational only.
}

main().catch((err) => {
  console.error("Link check failed:", err);
  process.exit(1);
});
