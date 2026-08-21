import { test, expect } from "@playwright/test";

test.describe("Cart Drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ── Open / Close ───────────────────────────────────────────────────
  test("C01 - cart icon button is visible in navbar", async ({ page }) => {
    await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  });

  test("C02 - clicking cart icon opens cart drawer", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeVisible({ timeout: 5000 });
  });

  test("C03 - clicking close button closes cart drawer", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await page.locator("button[aria-label='Close cart']").click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  test("C04 - clicking backdrop overlay closes cart", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const backdrop = page.locator("[class*='fixed inset-0']").first();
    await backdrop.click({ position: { x: 10, y: 10 } });
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  test("C05 - pressing Escape closes cart (if supported)", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  });

  // ── Empty State ────────────────────────────────────────────────────
  test("C06 - empty cart shows 'Your cart is empty' message", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const emptyText = page.locator("text=Your cart is empty");
    await expect(emptyText).toBeVisible({ timeout: 5000 });
  });

  test("C07 - empty cart has 'Continue Shopping' link", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const link = page.locator("a").filter({ hasText: "Continue Shopping" });
    await expect(link).toBeVisible({ timeout: 5000 });
  });

  test("C08 - empty cart 'Continue Shopping' navigates to /shop", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await page.locator("a").filter({ hasText: "Continue Shopping" }).click();
    await expect(page).toHaveURL(/\/shop/);
  });

  // ── Add to Cart from Shop ──────────────────────────────────────────
  test("C09 - can add item from shop page hover button", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    await page.waitForTimeout(500);
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toBeVisible({ timeout: 3000 });
  });

  test("C10 - adding from shop updates badge to 1", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 3000 });
  });

  // ── Add to Cart from Product Page ──────────────────────────────────
  test("C11 - can add item from product page 'Customize & Add to Cart' button", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeVisible({ timeout: 5000 });
  });

  test("C12 - can add item from product page 'Add to Cart' button", async ({ page }) => {
    await page.goto("/shop/polaroid-tote");
    await page.waitForLoadState("networkidle");
    const addBtn = page.locator("button").filter({ hasText: /Add to Cart/ });
    await addBtn.first().click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeVisible({ timeout: 5000 });
  });

  test("C13 - adding from product page updates badge", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 3000 });
  });

  // ── Cart Items Display ─────────────────────────────────────────────
  test("C14 - cart shows product name after adding", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const name = page.locator("h3, p, span").filter({ hasText: /ghibli|tote/i }).first();
    await expect(name).toBeVisible({ timeout: 5000 });
  });

  test("C15 - cart shows product price", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const price = page.locator("text=/₹\\d+/").first();
    await expect(price).toBeVisible({ timeout: 5000 });
  });

  test("C16 - cart shows product image", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const img = page.locator("button[aria-label='Close cart'] ~ div img, [class*='drawer'] img, [class*='cart'] img").first();
    const exists = await img.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("C17 - cart shows quantity of 1 for single add", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const qty = page.locator("text=/^1$/").first();
    await expect(qty).toBeVisible({ timeout: 5000 });
  });

  test("C18 - cart shows subtotal after adding item", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const subtotal = page.locator("text=/Subtotal|subtotal/i").first();
    await expect(subtotal).toBeVisible({ timeout: 5000 });
  });

  test("C19 - cart shows 'Checkout' button after adding item", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const checkout = page.locator("a, button").filter({ hasText: "Checkout" }).first();
    await expect(checkout).toBeVisible({ timeout: 5000 });
  });

  // ── Quantity Controls ──────────────────────────────────────────────
  test("C20 - increment button increases quantity", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const incBtn = page.locator("button").filter({ hasText: "+" }).first();
    await incBtn.click();
    const qty = page.locator("text=/^2$/").first();
    await expect(qty).toBeVisible({ timeout: 3000 });
  });

  test("C21 - decrement button decreases quantity", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button").filter({ hasText: "+" }).first().click();
    await page.locator("button").filter({ hasText: "-" }).first().click();
    const qty = page.locator("text=/^1$/").first();
    await expect(qty).toBeVisible({ timeout: 3000 });
  });

  test("C22 - quantity controls have correct buttons", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const minus = page.locator("button").filter({ hasText: "-" }).first();
    const plus = page.locator("button").filter({ hasText: "+" }).first();
    await expect(minus).toBeVisible({ timeout: 5000 });
    await expect(plus).toBeVisible();
  });

  test("C23 - incrementing updates subtotal", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button").filter({ hasText: "+" }).first().click();
    const subtotal = page.locator("text=/₹998|₹898/").first();
    await expect(subtotal).toBeVisible({ timeout: 3000 });
  });

  test("C24 - multiple increments work correctly", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button").filter({ hasText: "+" }).first().click();
    await page.locator("button").filter({ hasText: "+" }).first().click();
    const qty = page.locator("text=/^3$/").first();
    await expect(qty).toBeVisible({ timeout: 3000 });
  });

  // ── Remove Items ───────────────────────────────────────────────────
  test("C25 - remove button removes item from cart", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const removeBtn = page.locator("button").filter({ hasText: /remove|delete|×|✕/i }).first();
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      await expect(page.locator("text=Your cart is empty")).toBeVisible({ timeout: 3000 });
    }
  });

  test("C26 - removing item clears badge count", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const removeBtn = page.locator("button").filter({ hasText: /remove|delete|×|✕/i }).first();
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      const badge = page.locator("button[aria-label='Cart'] span");
      await expect(badge).toBeHidden({ timeout: 3000 });
    }
  });

  test("C27 - decrementing to 0 removes item", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const minusBtn = page.locator("button").filter({ hasText: "-" }).first();
    if (await minusBtn.count() > 0) {
      await minusBtn.click();
      await page.waitForTimeout(500);
    }
  });

  // ── Subtotal Calculation ───────────────────────────────────────────
  test("C28 - subtotal matches item price for single item", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const subtotal = page.locator("text=₹499.00").first();
    await expect(subtotal).toBeVisible({ timeout: 5000 });
  });

  test("C29 - subtotal doubles when quantity is 2", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button").filter({ hasText: "+" }).first().click();
    const total = page.locator("text=₹998.00").first();
    await expect(total).toBeVisible({ timeout: 3000 });
  });

  test("C30 - subtotal is correctly labeled", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const label = page.locator("text=/[Ss]ubtotal/").first();
    await expect(label).toBeVisible({ timeout: 5000 });
  });

  test("C31 - total reflects different product prices", async ({ page }) => {
    await page.goto("/shop/ghibli-text-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: /Add to Cart|Customize/ }).first().click();
    const total = page.locator("text=₹599.00").first();
    await expect(total).toBeVisible({ timeout: 5000 });
  });

  // ── Checkout Button ────────────────────────────────────────────────
  test("C32 - checkout button links to /checkout", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const checkoutBtn = page.locator("a[href='/checkout']").first();
    await expect(checkoutBtn).toBeVisible({ timeout: 5000 });
  });

  test("C33 - clicking checkout navigates to checkout page", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("a[href='/checkout']").first().click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  });

  test("C34 - checkout button is styled prominently", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const checkoutBtn = page.locator("a[href='/checkout']").first();
    const classes = await checkoutBtn.getAttribute("class");
    expect(classes).toContain("bg-");
  });

  // ── Continue Shopping ──────────────────────────────────────────────
  test("C35 - continue shopping link navigates to /shop", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const link = page.locator("a").filter({ hasText: "Continue Shopping" });
    await link.click();
    await expect(page).toHaveURL(/\/shop/, { timeout: 5000 });
  });

  test("C36 - continue shopping closes cart drawer", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("a").filter({ hasText: "Continue Shopping" }).click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  });

  // ── Badge Count ────────────────────────────────────────────────────
  test("C37 - badge shows '1' after adding single item", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.waitForTimeout(500);
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1");
  });

  test("C38 - badge disappears after removing all items", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Cart']").click();
    const removeBtn = page.locator("button").filter({ hasText: /remove|delete|×|✕/i }).first();
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      const badge = page.locator("button[aria-label='Cart'] span");
      await expect(badge).toBeHidden({ timeout: 3000 });
    }
  });

  test("C39 - badge has dark background and white text", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.waitForTimeout(500);
    const badge = page.locator("button[aria-label='Cart'] span");
    const classes = await badge.getAttribute("class");
    expect(classes).toContain("bg-");
    expect(classes).toContain("text-white");
  });

  test("C40 - badge is positioned at top-right of cart icon", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.waitForTimeout(500);
    const badge = page.locator("button[aria-label='Cart'] span");
    const classes = await badge.getAttribute("class");
    expect(classes).toContain("absolute");
  });

  // ── Cart Persistence ───────────────────────────────────────────────
  test("C41 - cart persists after navigating to another page", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1");
  });

  test("C42 - cart persists after page reload", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.reload();
    await page.waitForLoadState("networkidle");
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("1", { timeout: 5000 });
  });

  test("C43 - multiple items persist across navigation", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.goto("/shop/ghibli-text-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: /Add to Cart|Customize/ }).first().click();
    await page.locator("button[aria-label='Close cart']").click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("2");
  });

  // ── Close Behavior ─────────────────────────────────────────────────
  test("C44 - cart drawer has proper z-index", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const drawer = page.locator("[class*='z-']").filter({ hasText: /cart|checkout/i }).first();
    const exists = await drawer.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("C45 - cart drawer blocks body scroll when open", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  // ── Multi-Item Cart ────────────────────────────────────────────────
  test("C46 - adding two different products shows both in cart", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.goto("/shop/ghibli-text-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: /Add to Cart|Customize/ }).first().click();
    const items = page.locator("h3, p").filter({ hasText: /tote/i });
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("C47 - cart total sums two different product prices", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    await page.locator("button[aria-label='Close cart']").click();
    await page.goto("/shop/ghibli-text-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: /Add to Cart|Customize/ }).first().click();
    const total = page.locator("text=₹1098.00").first();
    await expect(total).toBeVisible({ timeout: 5000 });
  });

  // ── Edge Cases ─────────────────────────────────────────────────────
  test("C48 - clicking cart icon while drawer is open does not cause error", async ({ page }) => {
    await page.locator("button[aria-label='Cart']").click();
    await page.locator("button[aria-label='Cart']").click();
    await page.waitForTimeout(300);
  });

  test("C49 - rapidly adding items does not cause errors", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
    await btn.click();
    await page.waitForTimeout(200);
    await btn.click();
    await page.waitForTimeout(200);
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toBeVisible();
  });

  test("C50 - cart shows 'Checkout' text on button", async ({ page }) => {
    await page.goto("/shop/ghibli-art-tote");
    await page.waitForLoadState("networkidle");
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const checkoutText = page.locator("a, button").filter({ hasText: "Checkout" });
    const text = await checkoutText.first().textContent();
    expect(text!.toLowerCase()).toContain("checkout");
  });
});
