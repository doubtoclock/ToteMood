# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> Responsive Layout >> R01 - mobile hides desktop nav, shows hamburger and cart
- Location: tests/responsive.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('nav').first()
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" with timeout 5000ms
  - waiting for locator('nav').first()
    2 × locator resolved to <nav class="flex flex-1 justify-center gap-1 sm:gap-3 md:space-x-10 lg:space-x-14">…</nav>
      - unexpected value "visible"

```

```yaml
- navigation:
  - link "Home":
    - /url: /
  - link "Shop":
    - /url: /shop
  - link "Stories":
    - /url: /#stories
  - link "About":
    - /url: /about
  - link "Contact":
    - /url: /contact
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Responsive Layout", () => {
  4  |   test("R01 - mobile hides desktop nav, shows hamburger and cart", async ({ page }) => {
  5  |     await page.setViewportSize({ width: 390, height: 844 });
  6  |     await page.goto("/");
  7  |     await page.waitForLoadState("domcontentloaded");
> 8  |     await expect(page.locator("nav").first()).toBeHidden();
     |                                               ^ Error: expect(locator).toBeHidden() failed
  9  |     await expect(page.locator("button[aria-label='Open menu']")).toBeVisible();
  10 |     await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  11 |   });
  12 | 
  13 |   test("R02 - shop grid is single column on mobile", async ({ page }) => {
  14 |     await page.setViewportSize({ width: 390, height: 844 });
  15 |     await page.goto("/shop");
  16 |     await page.waitForLoadState("domcontentloaded");
  17 |     const grid = page.locator(".grid").first();
  18 |     await expect(grid).toBeVisible({ timeout: 10000 });
  19 |     const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  20 |     expect(cols).toBe(1);
  21 |   });
  22 | 
  23 |   test("R03 - shop grid is multi-column on desktop", async ({ page }) => {
  24 |     await page.setViewportSize({ width: 1280, height: 800 });
  25 |     await page.goto("/shop");
  26 |     await page.waitForLoadState("domcontentloaded");
  27 |     const grid = page.locator(".grid").first();
  28 |     await expect(grid).toBeVisible({ timeout: 10000 });
  29 |     const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  30 |     expect(cols).toBeGreaterThanOrEqual(2);
  31 |   });
  32 | 
  33 |   test("R04 - product layout stacks on mobile and splits on desktop", async ({ page }) => {
  34 |     await page.setViewportSize({ width: 390, height: 844 });
  35 |     await page.goto("/shop/ghibli-art-tote");
  36 |     await page.waitForLoadState("domcontentloaded");
  37 |     const container = page.locator("[class*='grid-cols-1']").first();
  38 |     await expect(container).toBeVisible({ timeout: 10000 });
  39 |     const cls = (await container.getAttribute("class")) || "";
  40 |     expect(cls).toMatch(/lg:grid-cols-2|md:grid-cols-2/);
  41 |   });
  42 | 
  43 |   test("R05 - account tabs are horizontally scrollable on mobile", async ({ page }) => {
  44 |     await page.setViewportSize({ width: 390, height: 844 });
  45 |     await page.goto("/account");
  46 |     await page.waitForLoadState("domcontentloaded");
  47 |     const tabs = page.locator("button").filter({ hasText: "Order History" }).first();
  48 |     await expect(tabs).toBeVisible({ timeout: 10000 });
  49 |   });
  50 | 
  51 |   test("R06 - floating socials hidden on contact and checkout pages", async ({ page }) => {
  52 |     await page.setViewportSize({ width: 1280, height: 800 });
  53 |     await page.goto("/contact");
  54 |     await page.waitForLoadState("domcontentloaded");
  55 |     await page.goto("/");
  56 |     await page.waitForLoadState("domcontentloaded");
  57 |     await expect(page.locator("div.fixed a[href*='wa.me']").last()).toBeVisible();
  58 |   });
  59 | });
  60 | 
```