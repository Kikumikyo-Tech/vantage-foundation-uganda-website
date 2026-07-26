import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Vantage Foundation Uganda/);
    // The hero section should have an h1.
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("skip link is present and focusable", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to content/i });
    await expect(skipLink).toBeAttached();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /our work/i }).first().click();
    await expect(page).toHaveURL(/\/our-work/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
