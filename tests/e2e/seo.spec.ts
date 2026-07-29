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

  test("blog article has complete BlogPosting metadata and JSON-LD", async ({
    page,
  }) => {
    const path = "/blog/what-we-mean-when-we-say-advantage";
    await page.goto(path);

    await expect(page).toHaveTitle(/What We Mean When We Say "Advantage"/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.vantagefoundationuganda.com${path}`
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article"
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /what-we-mean-advantage-hero\.webp/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );

    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const blogPosting = schemas
      .map((schema) => JSON.parse(schema))
      .find((schema) => schema["@type"] === "BlogPosting");

    expect(blogPosting).toMatchObject({
      headline: 'What We Mean When We Say "Advantage"',
      datePublished: "2026-07-29",
      dateModified: "2026-07-29",
      author: {
        "@type": "Person",
        name: "Hillary Turyasingura",
      },
      publisher: {
        "@type": "Organization",
        name: "Vantage Foundation Uganda",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.vantagefoundationuganda.com${path}`,
      },
    });
    expect(blogPosting.image).toContain(
      "/images/blog/what-we-mean-advantage-hero.webp"
    );
  });

  test("FAQ page has FAQPage JSON-LD", async ({ page }) => {
    await page.goto("/faq");
    const jsonLdContent = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasFaqSchema = jsonLdContent.some((c) => c.includes("FAQPage"));
    expect(hasFaqSchema).toBe(true);
  });

  test("homepage has OG image meta tag", async ({ page }) => {
    await page.goto("/");
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBeTruthy();
  });

  test("homepage has Twitter card meta tag", async ({ page }) => {
    await page.goto("/");
    const twitterCard = await page
      .locator('meta[name="twitter:card"]')
      .getAttribute("content");
    expect(twitterCard).toBe("summary_large_image");
  });

  test("homepage has Organization with logo in JSON-LD", async ({ page }) => {
    await page.goto("/");
    const jsonLdContent = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasOrgWithLogo = jsonLdContent.some(
      (c) => c.includes("Organization") && c.includes("logo")
    );
    expect(hasOrgWithLogo).toBe(true);
  });

  test("homepage has sameAs social links in JSON-LD", async ({ page }) => {
    await page.goto("/");
    const jsonLdContent = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const hasSameAs = jsonLdContent.some(
      (c) => c.includes("sameAs") && c.includes("instagram")
    );
    expect(hasSameAs).toBe(true);
  });

  test("web-app manifest is accessible", async ({ page }) => {
    const response = await page.goto("/manifest.webmanifest");
    expect(response?.status()).toBe(200);
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
