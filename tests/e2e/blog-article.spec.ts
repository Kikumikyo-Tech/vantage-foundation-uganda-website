import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

/**
 * Blog posts are published from the admin dashboard into `blog_posts`; the
 * static `content/blog.ts` manifest is normally empty. So this suite cannot
 * pin itself to a slug — an earlier version hardcoded the "advantage"
 * reflection, which was later moved to /stories, leaving the whole file
 * failing against a 404. Resolve a post from the listing instead, and skip
 * when the blog genuinely has none.
 */
async function resolveArticlePath(page: Page): Promise<string | null> {
  await page.goto("/blog");
  const links = page.locator('main a[href^="/blog/"]');
  if ((await links.count()) === 0) return null;
  return links.first().getAttribute("href");
}

test.describe("Blog article editorial layout", () => {
  test("uses the intended semantic article structure", async ({ page }) => {
    const articlePath = await resolveArticlePath(page);
    test.skip(!articlePath, "No published blog post to exercise the template.");

    await page.goto(articlePath!);

    await expect(page.locator("main article")).toHaveCount(1);
    await expect(page.locator("main article h1")).toHaveCount(1);
    await expect(page.locator('[data-testid="article-hero"]')).toBeVisible();
    await expect(page.locator(".article-prose")).toBeVisible();

    // Dates render human-readable, never as a raw ISO string.
    const isoText = await page
      .locator("main")
      .getByText(/^\d{4}-\d{2}-\d{2}$/, { exact: true })
      .count();
    expect(isoText).toBe(0);

    const semanticOrderIsCorrect = await page.evaluate(() => {
      const main = document.querySelector("body > main");
      const globalFooter = document.querySelector("body > footer");
      const article = main?.querySelector("article");
      return Boolean(
        main &&
          article &&
          globalFooter &&
          main.compareDocumentPosition(globalFooter) &
            Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
    expect(semanticOrderIsCorrect).toBe(true);
  });

  for (const viewport of viewports) {
    test(`${viewport.width}px has no overflow and preserves editorial sizing`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      const articlePath = await resolveArticlePath(page);
      test.skip(!articlePath, "No published blog post to exercise the template.");

      await page.goto(articlePath!);

      const measurements = await page.evaluate(() => {
        const article = document.querySelector("main article");
        const heading = article?.querySelector("h1");
        const hero = document.querySelector('[data-testid="article-hero"]');
        const body = document.querySelector(".article-prose");
        const shareControls = Array.from(
          document.querySelectorAll(
            "main article footer a, main article footer button"
          )
        );
        const headingRect = heading?.getBoundingClientRect();
        const heroRect = hero?.getBoundingClientRect();
        const bodyRect = body?.getBoundingClientRect();

        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          headingLeft: headingRect?.left ?? -1,
          headingRight: headingRect?.right ?? Number.MAX_VALUE,
          heroWidth: heroRect?.width ?? 0,
          heroHeight: heroRect?.height ?? 0,
          bodyWidth: bodyRect?.width ?? 0,
          bodyFontSize: body
            ? Number.parseFloat(getComputedStyle(body).fontSize)
            : 0,
          smallestShareTarget: Math.min(
            ...shareControls.map(
              (control) => control.getBoundingClientRect().height
            )
          ),
        };
      });

      expect(measurements.scrollWidth).toBeLessThanOrEqual(
        measurements.clientWidth
      );
      expect(measurements.headingLeft).toBeGreaterThanOrEqual(18);
      expect(measurements.headingRight).toBeLessThanOrEqual(viewport.width - 18);
      expect(measurements.heroWidth).toBeLessThanOrEqual(1040);
      expect(measurements.bodyWidth).toBeLessThanOrEqual(760);
    });
  }
});
