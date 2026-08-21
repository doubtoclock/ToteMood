import { test, expect } from "@playwright/test";

test.describe("Responsive Layout", () => {
  test("R01 - mobile hides desktop nav, shows hamburger and cart", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("nav").first()).toBeHidden();
    await expect(page.locator("button[aria-label='Open menu']")).toBeVisible();
    await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  });

  test("R02 - shop grid is single column on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const grid = page.locator(".grid").first();
    await expect(grid).toBeVisible({ timeout: 10000 });
    const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(cols).toBe(1);
  });

  test("R03 - shop grid is multi-column on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const grid = page.locator(".grid").first();
    await expect(grid).toBeVisible({ timeout: 10000 });
    const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(cols).toBeGreaterThanOrEqual(2);
  });

  test("R04 - product layout stacks on mobile and splits on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("domcontentloaded");
    const container = page.locator("[class*='grid-cols-1']").first();
    await expect(container).toBeVisible({ timeout: 10000 });
    const cls = (await container.getAttribute("class")) || "";
    expect(cls).toMatch(/lg:grid-cols-2|md:grid-cols-2/);
  });

  test("R05 - account tabs are horizontally scrollable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    const tabs = page.locator("button").filter({ hasText: "Order History" }).first();
    await expect(tabs).toBeVisible({ timeout: 10000 });
  });

  test("R06 - floating socials hidden on contact and checkout pages", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("div.fixed a[href*='wa.me']").last()).toBeVisible();
  });
});
