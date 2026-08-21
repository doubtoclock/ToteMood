import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
  });

  test("AB01 - loads with title and main content", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood|About/i);
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("AB02 - shows founder section with name", async ({ page }) => {
    await expect(page.getByText(/siya maurya/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("AB03 - vision/why sections have descriptive text", async ({ page }) => {
    await expect(page.getByText(/vision|why totemood/i).first()).toBeVisible({ timeout: 10000 });
    const paragraphs = page.locator("main p");
    expect(await paragraphs.count()).toBeGreaterThanOrEqual(3);
  });

  test("AB04 - founder photo is displayed", async ({ page }) => {
    const photo = page.locator("img[alt*='iya' i], img[src*='siya']").first();
    await expect(photo).toBeVisible({ timeout: 10000 });
  });

  test("AB05 - CTA links to shop collection", async ({ page }) => {
    const cta = page.locator("a[href='/shop']").first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    await cta.click();
    await expect(page).toHaveURL(/\/shop/, { timeout: 10000 });
  });
});
