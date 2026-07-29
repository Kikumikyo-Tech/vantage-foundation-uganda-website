import { expect, test } from "@playwright/test";

const articlePath = "/blog/what-we-mean-when-we-say-advantage";
const viewports = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

test.describe("Blog article editorial layout", () => {
  test("uses the intended semantic article structure and content", async ({
    page,
  }) => {
    await page.goto(articlePath);

    await expect(page.locator("main article")).toHaveCount(1);
    await expect(page.locator("main article h1")).toHaveCount(1);
    await expect(page.locator("main article blockquote")).toContainText(
      "Advantage isn't about driving the latest cars"
    );
    await expect(page.locator("main article blockquote cite")).toContainText(
      "Hillary Turyasingura"
    );
    await expect(
      page.locator('time[datetime="2026-07-29"]')
    ).toHaveText("29 July 2026");
    await expect(page.getByText("2026-07-29", { exact: true })).toHaveCount(0);
    await expect(
      page.getByRole("img", {
        name: /Hillary Turyasingura stands on a green hillside/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /View all stories/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Related posts" })
    ).toHaveCount(0);

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
      await page.goto(articlePath);

      const measurements = await page.evaluate(() => {
        const article = document.querySelector("main article");
        const heading = article?.querySelector("h1");
        const hero = document.querySelector(
          '[data-testid="article-hero"]'
        );
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
      expect(measurements.bodyFontSize).toBeGreaterThanOrEqual(17);
      expect(measurements.smallestShareTarget).toBeGreaterThanOrEqual(44);

      if (viewport.width < 640) {
        expect(measurements.heroHeight).toBeGreaterThanOrEqual(240);
        expect(measurements.heroHeight).toBeLessThanOrEqual(300);
      } else {
        expect(measurements.heroHeight).toBeLessThanOrEqual(585);
      }
    });
  }
});
