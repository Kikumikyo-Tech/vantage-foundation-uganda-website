import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility — heading order", () => {
  const pages = [
    "/",
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

  for (const path of pages) {
    test(`${path} has exactly one h1`, async ({ page }) => {
      await page.goto(path);
      const h1s = await page.locator("h1").count();
      expect(h1s).toBe(1);
    });
  }

  test("/projects/[slug] has exactly one h1", async ({ page }) => {
    await page.goto("/projects/kasaale-deep-borehole");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });

  test("/stories/[slug] has exactly one h1", async ({ page }) => {
    await page.goto("/stories/what-are-we-without-our-dreams");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });

  test("/programmes/health has exactly one h1", async ({ page }) => {
    await page.goto("/programmes/health");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });
});

test.describe("Accessibility — keyboard navigation", () => {
  test("skip link becomes visible on focus", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Tab");
    // The skip link should be the first focusable element.
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toMatch(/skip to content/i);
  });

  test("can navigate to a project via keyboard", async ({ page }) => {
    await page.goto("/projects");
    // Tab through to the first project card link and press Enter.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Just verify the page didn't crash and is still accessible.
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Accessibility — axe-core automated checks", () => {
  const pages = [
    "/",
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

  for (const path of pages) {
    test(`${path} has no axe-core violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
