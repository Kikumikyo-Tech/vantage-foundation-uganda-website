import { test, expect } from "@playwright/test";

test.describe("SEO — meta tags", () => {
  test("homepage has title and description", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Vantage Foundation Uganda/);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
  });

  test("all static pages have unique titles", async ({ page }) => {
    const paths = [
      "/about-us",
      "/contact",
      "/donate",
      "/faq",
      "/get-involved",
      "/impact",
      "/our-work",
      "/projects",
      "/reports-and-accountability",
      "/stories",
      "/privacy",
      "/terms",
      "/safeguarding",
      "/accessibility",
    ];
    const titles: string[] = [];
    for (const path of paths) {
      await page.goto(path);
      const title = await page.title();
      titles.push(title);
    }
    // All titles should be unique.
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  test("all static pages have canonical URLs", async ({ page }) => {
    const paths = [
      "/about-us",
      "/contact",
      "/donate",
      "/faq",
      "/get-involved",
      "/impact",
      "/our-work",
      "/projects",
      "/stories",
      "/privacy",
      "/terms",
      "/safeguarding",
      "/accessibility",
    ];
    for (const path of paths) {
      await page.goto(path);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical).toBeTruthy();
      expect(canonical).toContain(path);
    }
  });

  test("admin pages have noindex", async ({ page }) => {
    await page.goto("/admin/login");
    const metaRobots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(metaRobots).toContain("noindex");
  });

  test("homepage has JSON-LD structured data", async ({ page }) => {
    await page.goto("/");
    const scripts = await page.locator('script[type="application/ld+json"]').count();
    expect(scripts).toBeGreaterThanOrEqual(2); // NGO + WebSite
  });

  test("story page has Article JSON-LD", async ({ page }) => {
    await page.goto("/stories/what-are-we-without-our-dreams");
    const scripts = await page.locator('script[type="application/ld+json"]').count();
    expect(scripts).toBeGreaterThanOrEqual(2); // NGO + WebSite + BreadcrumbList + Article
  });

  test("FAQ page has FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/faq");
    const jsonLdContent = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasFaqSchema = jsonLdContent.some((c) => c.includes("FAQPage"));
    expect(hasFaqSchema).toBe(true);
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible and blocks admin", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain("Disallow: /admin/");
  });
});
