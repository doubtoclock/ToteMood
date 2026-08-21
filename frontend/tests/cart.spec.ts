import { test, expect } from "@playwright/test";

const PRODUCT = "/shop/ghibli-art-tote";
const PRODUCT2 = "/shop/ghibli-text-tote";

async function addToCartFromProduct(page: import("@playwright/test").Page, path = PRODUCT) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
}

test.describe("Cart Drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("C01 - cart icon opens drawer with empty state and close works", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await expect(page.getByText(/your cart/i).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/currently empty/i)).toBeVisible();
    await page.locator("button[aria-label='Close cart']").click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  test("C02 - empty cart offers continue shopping link to /shop", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const link = page.locator("a").filter({ hasText: "Continue Shopping" }).first();
    await expect(link).toBeVisible({ timeout: 5000 });
    await link.click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("C03 - adding product shows name, price, qty, subtotal in drawer", async ({ page }) => {
    await addToCartFromProduct(page);
    await expect(page.locator("[class*='fixed'] h3").filter({ hasText: /tote|polaroid|art/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/^Subtotal$/)).toBeVisible();
    await expect(page.locator("text=₹499.00").first()).toBeVisible();
    await expect(page.locator("[class*='fixed'] button[aria-label^='Increase']").first()).toBeVisible();
  });

  test("C04 - increase then decrease quantity updates count", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("button[aria-label^='Increase']").first().click();
    await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^2$/ }).first()).toBeVisible({ timeout: 3000 });
    await page.locator("button[aria-label^='Decrease']").first().click();
    await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test("C05 - doubling quantity doubles subtotal to ₹998.00", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("button[aria-label^='Increase']").first().click();
    await expect(page.locator("text=₹998.00").first()).toBeVisible({ timeout: 3000 });
  });

  test("C06 - remove button empties cart and clears badge", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("button[aria-label^='Remove']").first().click();
    await expect(page.getByText(/currently empty/i)).toBeVisible({ timeout: 3000 });
    await expect(page.locator("button[aria-label='Cart'] span")).toHaveCount(0);
  });

  test("C07 - badge appears after add and persists across client navigation", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("button[aria-label='Close cart']").click();
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 5000 });
  });

  test("C08 - two different products sum to ₹1098.00", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("button[aria-label='Close cart']").click();
    await addToCartFromProduct(page, PRODUCT2);
    await expect(page.locator("text=₹1098.00").first()).toBeVisible({ timeout: 5000 });
  });

  test("C09 - proceed to checkout navigates to /checkout", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("a[href='/checkout']").first().click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  });

  test("C10 - continue shopping closes drawer", async ({ page }) => {
    await addToCartFromProduct(page);
    await page.locator("a").filter({ hasText: "Continue Shopping" }).last().click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  test("C11 - open drawer blocks body scroll", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  });

  test("C12 - rapid add clicks do not crash app", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
    await btn.click();
    await btn.click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toBeVisible({ timeout: 3000 });
  });
});
