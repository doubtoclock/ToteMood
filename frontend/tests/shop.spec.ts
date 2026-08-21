import { test, expect } from "@playwright/test";

test.describe("Shop Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
  });

  test("S01 - loads with title, main area and free delivery banner", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood|Shop/i);
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("text=Free Delivery to All Customers")).toBeVisible();
  });

  test("S02 - product grid shows at least 5 products", async ({ page }) => {
    const cards = page.locator("a[href^='/shop/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
    const grid = page.locator(".grid").first();
    await expect(grid).toBeVisible();
  });

  test("S03 - product cards show image, name and price", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card.locator("img").first()).toBeVisible();
    const alt = await card.locator("img").first().getAttribute("alt");
    expect(alt).toBeTruthy();
    await expect(page.locator("h3").filter({ hasText: /tote/i }).first()).toBeVisible();
    await expect(page.locator("text=/₹\\d+/").first()).toBeVisible();
  });

  test("S04 - customizable products show Custom badge", async ({ page }) => {
    const badge = page.locator("text=Custom").first();
    await expect(badge).toBeVisible({ timeout: 10000 });
  });

  test("S05 - hover on product card reveals add-to-cart button", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    const btn = page.locator("button[aria-label*='Add']").first();
    await expect(btn).toBeVisible({ timeout: 5000 });
    await expect(btn.locator("svg")).toBeVisible();
  });

  test("S06 - all product links have valid hrefs", async ({ page }) => {
    const links = page.locator("a[href^='/shop/']");
    await expect(links.first()).toBeVisible({ timeout: 10000 });
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/shop\/[\w-]+$/);
    }
  });

  test("S07 - clicking a product opens its detail page", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(href!));
    await page.goBack();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("S08 - adding item from shop hover updates cart badge to 1", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 5000 });
  });

  test("S09 - adding same item twice increments quantity to 2", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    await page.waitForTimeout(400);
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("2", { timeout: 5000 });
  });

  test("S10 - shop page renders without critical JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const critical = errors.filter((e) => !/google|favicon|socket|hydrat/i.test(e));
    expect(critical).toHaveLength(0);
  });
});
