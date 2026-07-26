/**
 * Broken link checker: scans all internal links in the codebase and
 * verifies they point to valid routes.
 *
 * Run: npm run check-links
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "app");

// Collect all valid routes from the app directory.
async function collectRoutes(dir, basePath = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const routePath = basePath + "/" + entry.name;

    if (entry.isDirectory()) {
      // Skip special directories
      if (entry.name.startsWith("_") || entry.name === "api") continue;
      // Dynamic route [slug]
      if (entry.name.startsWith("[") && entry.name.endsWith("]")) {
        routes.push({ route: basePath + "/*", dynamic: true });
      } else {
        routes.push({ route: "/" + entry.name, dynamic: false });
        routes.push(...(await collectRoutes(fullPath, "/" + entry.name)));
      }
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      routes.push({ route: basePath || "/", dynamic: false });
    } else if (entry.name === "route.ts" || entry.name === "route.tsx") {
      // API or special routes (rss.xml, etc.)
      routes.push({ route: basePath, dynamic: false });
    }
  }

  return routes;
}

// Extract internal links from source files.
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
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      links.push(...(await scanLinks(fullPath)));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = await readFile(fullPath, "utf8");
      for (const pattern of LINK_PATTERNS) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const url = match[1];
          // Only internal links (starting with /)
          if (url.startsWith("/") && !url.startsWith("//")) {
            links.push({ url, file: fullPath });
          }
        }
      }
    }
  }

  return links;
}

async function main() {
  console.log("Collecting routes...");
  const routes = await collectRoutes(APP_DIR);
  const routePaths = routes.map((r) => r.route);

  console.log(`Found ${routes.length} routes.\n`);

  console.log("Scanning for internal links...");
  const links = await scanLinks(ROOT);

  // Deduplicate links
  const uniqueLinks = [...new Map(links.map((l) => [l.url, l])).values()];
  console.log(`Found ${uniqueLinks.length} unique internal links.\n`);

  // Check each link against routes
  const broken = [];
  for (const link of uniqueLinks) {
    const url = link.url.split("?")[0].split("#")[0]; // Strip query and hash
    if (url === "/" || url === "") continue;

    // Check if it matches a static route or a dynamic route pattern
    const matched = routePaths.some((route) => {
      if (route === url) return true;
      // Dynamic route: /projects/* matches /projects/anything
      if (route.endsWith("/*")) {
        const prefix = route.slice(0, -2);
        if (url.startsWith(prefix + "/")) return true;
      }
      return false;
    });

    if (!matched) {
      broken.push(link);
    }
  }

  if (broken.length === 0) {
    console.log("✓ No broken internal links found.");
    process.exit(0);
  }

  console.log(`⚠ Found ${broken.length} potentially broken link(s):\n`);
  for (const link of broken) {
    const relativePath = link.file.replace(ROOT + "\\", "").replace(/\\/g, "/");
    console.log(`  ${link.url} (in ${relativePath})`);
  }

  console.log(`\nNote: Some links may be valid if they're generated dynamically.`);
  process.exit(0); // Exit 0 — informational only
}

main().catch((err) => {
  console.error("Link check failed:", err);
  process.exit(1);
});
