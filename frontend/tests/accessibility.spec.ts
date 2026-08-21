import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("A01 - pages use semantic header, nav, main and footer landmarks", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("nav").first()).toBeAttached();
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("A02 - key controls expose accessible names", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("button[aria-label='Open menu']")).toBeVisible();
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await expect(page.locator("button[aria-label*='Add']").first()).toBeAttached();
  });

  test("A03 - shop product images all have non-empty alt text", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const imgs = page.locator("a[href^='/shop/'] img");
    await expect(imgs.first()).toBeVisible({ timeout: 10000 });
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      expect(alt && alt.length > 0).toBeTruthy();
    }
  });
});
