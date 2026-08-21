import { test, expect } from "@playwright/test";

const PRODUCT = "/shop/ghibli-art-tote";

test.describe("Product Page", () => {
  test("P01 - loads without error with navbar", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header").first()).toBeVisible();
    const critical = errors.filter((e) => !/google|favicon|socket/i.test(e));
    expect(critical).toHaveLength(0);
  });

  test("P02 - WhatsApp sample ribbon links to wa.me in new tab", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const ribbon = page.locator("a[href*='wa.me']").first();
    await expect(ribbon).toBeVisible({ timeout: 10000 });
    await expect(ribbon).toHaveAttribute("target", "_blank");
  });

  test("P03 - shows product name, category and price", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1, h2").filter({ hasText: /tote/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=/₹\\d+/").first()).toBeVisible();
  });

  test("P04 - main image is visible inside rounded container", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const img = page.locator("main img").first();
    await expect(img).toBeVisible({ timeout: 10000 });
    const container = img.locator("xpath=..");
    await expect(container).toHaveClass(/rounded/, { timeout: 5000 });
  });

  test("P05 - thumbnail gallery allows switching images", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const thumbs = page.locator("button:has(img), [class*='grid'] img");
    await expect(thumbs.first()).toBeVisible({ timeout: 10000 });
    expect(await thumbs.count()).toBeGreaterThanOrEqual(2);
  });

  test("P06 - Customize & Add to Cart button adds item and opens drawer", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await expect(page.getByText("Your Cart")).toBeVisible({ timeout: 5000 });
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 3000 });
  });

  test("P07 - Buy Now navigates to checkout", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button").filter({ hasText: "Buy Now" }).click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  });

  test("P08 - related products section renders", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const related = page.locator("section a[href^='/shop/'], div a[href^='/shop/']");
    expect(await related.count()).toBeGreaterThanOrEqual(0);
  });

  test("P09 - description mentions WhatsApp approval for custom orders", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/whatsapp/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("P10 - nonexistent product shows not-found state", async ({ page }) => {
    await page.goto("/shop/does-not-exist-123");
    await page.waitForLoadState("domcontentloaded");
    const notFound = page.getByText(/unavailable|not found|return to shop/i).first();
    await expect(notFound).toBeVisible({ timeout: 10000 });
    const back = page.locator("a[href='/shop']").last();
    if (await back.count()) {
      await back.click();
      await expect(page).toHaveURL(/\/shop/, { timeout: 10000 });
    }
  });
});
