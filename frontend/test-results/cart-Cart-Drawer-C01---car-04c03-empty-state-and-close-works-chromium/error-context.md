# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C01 - cart icon opens drawer with empty state and close works
- Location: tests/cart.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: Channel closed
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('button[aria-label=\'Cart\']')
    - locator resolved to <button aria-label="Cart" class="relative text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1">…</button>

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const PRODUCT = "/shop/ghibli-art-tote";
  4   | const PRODUCT2 = "/shop/ghibli-text-tote";
  5   | 
  6   | async function addToCartFromProduct(page: import("@playwright/test").Page, path = PRODUCT) {
  7   |   await page.goto(path);
  8   |   await page.waitForLoadState("domcontentloaded");
  9   |   await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
  10  | }
  11  | 
  12  | test.describe("Cart Drawer", () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto("/");
  15  |     await page.waitForLoadState("domcontentloaded");
  16  |   });
  17  | 
  18  |   test("C01 - cart icon opens drawer with empty state and close works", async ({ page }) => {
> 19  |     await page.locator("button[aria-label='Cart']").click();
      |                                                     ^ Error: locator.click: Target page, context or browser has been closed
  20  |     await expect(page.getByText(/your cart/i).first()).toBeVisible({ timeout: 5000 });
  21  |     await expect(page.getByText(/currently empty/i)).toBeVisible();
  22  |     await page.locator("button[aria-label='Close cart']").click();
  23  |     await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  24  |   });
  25  | 
  26  |   test("C02 - empty cart offers continue shopping link to /shop", async ({ page }) => {
  27  |     await page.locator("button[aria-label='Cart']").click();
  28  |     const link = page.locator("a").filter({ hasText: "Continue Shopping" }).first();
  29  |     await expect(link).toBeVisible({ timeout: 5000 });
  30  |     await link.click();
  31  |     await expect(page).toHaveURL(/\/shop/);
  32  |   });
  33  | 
  34  |   test("C03 - adding product shows name, price, qty, subtotal in drawer", async ({ page }) => {
  35  |     await addToCartFromProduct(page);
  36  |     await expect(page.locator("[class*='fixed'] h3").filter({ hasText: /tote|polaroid|art/i }).first()).toBeVisible({ timeout: 5000 });
  37  |     await expect(page.getByText(/^Subtotal$/)).toBeVisible();
  38  |     await expect(page.locator("text=₹499.00").first()).toBeVisible();
  39  |     await expect(page.locator("[class*='fixed'] button[aria-label^='Increase']").first()).toBeVisible();
  40  |   });
  41  | 
  42  |   test("C04 - increase then decrease quantity updates count", async ({ page }) => {
  43  |     await addToCartFromProduct(page);
  44  |     await page.locator("button[aria-label^='Increase']").first().click();
  45  |     await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^2$/ }).first()).toBeVisible({ timeout: 3000 });
  46  |     await page.locator("button[aria-label^='Decrease']").first().click();
  47  |     await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  48  |   });
  49  | 
  50  |   test("C05 - doubling quantity doubles subtotal to ₹998.00", async ({ page }) => {
  51  |     await addToCartFromProduct(page);
  52  |     await page.locator("button[aria-label^='Increase']").first().click();
  53  |     await expect(page.locator("text=₹998.00").first()).toBeVisible({ timeout: 3000 });
  54  |   });
  55  | 
  56  |   test("C06 - remove button empties cart and clears badge", async ({ page }) => {
  57  |     await addToCartFromProduct(page);
  58  |     await page.locator("button[aria-label^='Remove']").first().click();
  59  |     await expect(page.getByText(/currently empty/i)).toBeVisible({ timeout: 3000 });
  60  |     await expect(page.locator("button[aria-label='Cart'] span")).toHaveCount(0);
  61  |   });
  62  | 
  63  |   test("C07 - badge appears after add and persists across client navigation", async ({ page }) => {
  64  |     await addToCartFromProduct(page);
  65  |     await page.locator("button[aria-label='Close cart']").click();
  66  |     await page.goto("/about");
  67  |     await page.waitForLoadState("domcontentloaded");
  68  |     const badge = page.locator("button[aria-label='Cart'] span");
  69  |     await expect(badge).toHaveText("1", { timeout: 5000 });
  70  |   });
  71  | 
  72  |   test("C08 - two different products sum to ₹1098.00", async ({ page }) => {
  73  |     await addToCartFromProduct(page);
  74  |     await page.locator("button[aria-label='Close cart']").click();
  75  |     await addToCartFromProduct(page, PRODUCT2);
  76  |     await expect(page.locator("text=₹1098.00").first()).toBeVisible({ timeout: 5000 });
  77  |   });
  78  | 
  79  |   test("C09 - proceed to checkout navigates to /checkout", async ({ page }) => {
  80  |     await addToCartFromProduct(page);
  81  |     await page.locator("a[href='/checkout']").first().click();
  82  |     await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  83  |   });
  84  | 
  85  |   test("C10 - continue shopping closes drawer", async ({ page }) => {
  86  |     await addToCartFromProduct(page);
  87  |     await page.locator("a").filter({ hasText: "Continue Shopping" }).last().click();
  88  |     await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  89  |   });
  90  | 
  91  |   test("C11 - open drawer blocks body scroll", async ({ page }) => {
  92  |     await page.locator("button[aria-label='Cart']").click();
  93  |     await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  94  |   });
  95  | 
  96  |   test("C12 - rapid add clicks do not crash app", async ({ page }) => {
  97  |     await page.goto(PRODUCT);
  98  |     await page.waitForLoadState("domcontentloaded");
  99  |     const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
  100 |     await btn.click();
  101 |     await btn.click();
  102 |     const badge = page.locator("button[aria-label='Cart'] span");
  103 |     await expect(badge).toBeVisible({ timeout: 3000 });
  104 |   });
  105 | });
  106 | 
```