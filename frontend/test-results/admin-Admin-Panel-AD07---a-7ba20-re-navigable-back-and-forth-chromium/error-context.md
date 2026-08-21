# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Panel >> AD07 - admin tabs are navigable back and forth
- Location: tests/admin.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/export csv|csv/i).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText(/export csv|csv/i).first()

```

```yaml
- alert
- complementary:
  - link "ToteMood":
    - /url: /
  - paragraph: Admin Panel
  - navigation:
    - link "Dashboard":
      - /url: /admin
    - link "Products":
      - /url: /admin/products
    - link "Orders":
      - /url: /admin/orders
  - button "Sign Out"
- main:
  - heading "Orders" [level=1]
  - paragraph: Manage incoming orders, customer details, and custom image uploads.
  - table:
    - rowgroup:
      - row "Order ID Customer Status Date Total Actions":
        - columnheader "Order ID"
        - columnheader "Customer"
        - columnheader "Status"
        - columnheader "Date"
        - columnheader "Total"
        - columnheader "Actions"
    - rowgroup:
      - row "No orders found.":
        - cell "No orders found."
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin Panel", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.addInitScript(() => localStorage.setItem("totemood_admin_auth", "true"));
  6  |     await page.goto("/admin");
  7  |     await page.waitForLoadState("domcontentloaded");
  8  |   });
  9  | 
  10 |   test("AD01 - admin page loads without site navbar or footer", async ({ page }) => {
  11 |     await expect(page).toHaveURL(/\/admin/);
  12 |     await expect(page.locator("header").first()).toHaveCount(0);
  13 |     await expect(page.locator("footer")).toHaveCount(0);
  14 |   });
  15 | 
  16 |   test("AD02 - dashboard shows stat cards for revenue, orders and products", async ({ page }) => {
  17 |     await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 15000 });
  18 |     await expect(page.getByText(/total orders/i).first()).toBeVisible();
  19 |     await expect(page.getByText(/active products/i).first()).toBeVisible();
  20 |   });
  21 | 
  22 |   test("AD03 - admin has Dashboard, Orders and Products tabs", async ({ page }) => {
  23 |     for (const tab of ["Dashboard", "Orders", "Products"]) {
  24 |       await expect(page.locator("button, a").filter({ hasText: new RegExp(`^${tab}$`, "i") }).first()).toBeVisible({ timeout: 10000 });
  25 |     }
  26 |   });
  27 | 
  28 |   test("AD04 - switching to Orders tab shows orders view with CSV export", async ({ page }) => {
  29 |     await page.locator("button, a").filter({ hasText: /^orders$/i }).first().click();
  30 |     await expect(page.getByText(/export csv|csv/i).first()).toBeVisible({ timeout: 15000 });
  31 |   });
  32 | 
  33 |   test("AD05 - switching to Products tab shows product management", async ({ page }) => {
  34 |     await page.locator("button, a").filter({ hasText: /^products$/i }).first().click();
  35 |     await expect(
  36 |       page.locator("button, a").filter({ hasText: /add|new|create/i }).first()
  37 |     ).toBeVisible({ timeout: 15000 });
  38 |   });
  39 | 
  40 |   test("AD06 - dashboard renders revenue chart area", async ({ page }) => {
  41 |     const chart = page.locator(".recharts-wrapper, .recharts-responsive-container, svg[class*='recharts']").first();
  42 |     await expect(chart).toBeVisible({ timeout: 15000 });
  43 |   });
  44 | 
  45 |   test("AD07 - admin tabs are navigable back and forth", async ({ page }) => {
  46 |     const ordersTab = page.locator("button, a").filter({ hasText: /^orders$/i }).first();
  47 |     const dashTab = page.locator("button, a").filter({ hasText: /^dashboard$/i }).first();
  48 |     await ordersTab.click();
> 49 |     await expect(page.getByText(/export csv|csv/i).first()).toBeVisible({ timeout: 15000 });
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  50 |     await dashTab.click();
  51 |     await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 15000 });
  52 |   });
  53 | });
  54 | 
```