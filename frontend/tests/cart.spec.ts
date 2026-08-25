import { test, expect } from "./fixtures";

const PRODUCT = "/shop/ghibli-art-tote";
const PRODUCT2 = "/shop/ghibli-text-tote";

async function addToCartFromProduct(page: import("@playwright/test").Page, path = PRODUCT) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
}

// Closes the drawer via the header Close button
async function closeDrawer(page: import("@playwright/test").Page) {
  const closeBtn = page.locator("button[aria-label='Close cart']");
  await expect(closeBtn).toBeVisible({ timeout: 8000 });
  await closeBtn.click();
  await expect(closeBtn).toBeHidden({ timeout: 5000 });
}

test.describe("Cart Drawer", () => {
  // drawer springs animate for a while; give tests room under parallel load
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("C01 - cart icon opens drawer with empty state and close works", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await expect(page.getByText(/your cart/i).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/currently empty/i)).toBeVisible();
    await closeDrawer(page);
  });

  test("C02 - empty cart offers continue shopping which closes drawer", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    // Empty state's Continue Shopping is a close action now
    const link = page.getByRole("button", { name: "Continue Shopping" });
    const closeBtn = page.locator("button[aria-label='Close cart']");
    await expect(link).toBeVisible({ timeout: 8000 });
    await link.click();
    await expect(closeBtn).toBeHidden({ timeout: 5000 });
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
    await closeDrawer(page);
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 5000 });
  });

  test("C08 - two different products sum to ₹1098.00", async ({ page }) => {
    await addToCartFromProduct(page);
    await closeDrawer(page);
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
    // Footer Continue Shopping is a button that closes the drawer
    await page.getByRole("button", { name: "Continue Shopping" }).click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  test("C11 - open drawer blocks body scroll", async ({ page }) => {
    const cartBtn = page.locator("button[aria-label='Cart']");
    for (let attempt = 0; attempt < 3; attempt++) {
      await cartBtn.click();
      try {
        await expect
          .poll(async () => page.evaluate(() => document.body.style.overflow), { timeout: 6000 })
          .toBe("hidden");
        return;
      } catch (e) {
        if (attempt === 2) throw e;
      }
    }
  });

  test("C12 - repeated add clicks do not crash app", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
    await btn.click();
    // Drawer auto-opens on add; close it and add again
    await closeDrawer(page);
    await btn.click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("2", { timeout: 5000 });
  });
});
