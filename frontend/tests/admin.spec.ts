import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("domcontentloaded");
  });

  test("AD01 - admin page loads without site navbar or footer", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("header").first()).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
  });

  test("AD02 - dashboard shows stat cards for revenue, orders and products", async ({ page }) => {
    await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/total orders/i).first()).toBeVisible();
    await expect(page.getByText(/active products/i).first()).toBeVisible();
  });

  test("AD03 - admin has Dashboard, Orders and Products tabs", async ({ page }) => {
    for (const tab of ["Dashboard", "Orders", "Products"]) {
      await expect(page.locator("button, a").filter({ hasText: new RegExp(`^${tab}$`, "i") }).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("AD04 - switching to Orders tab shows orders view with CSV export", async ({ page }) => {
    await page.locator("button, a").filter({ hasText: /^orders$/i }).first().click();
    await expect(page.getByText(/export csv|csv/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("AD05 - switching to Products tab shows product management", async ({ page }) => {
    await page.locator("button, a").filter({ hasText: /^products$/i }).first().click();
    await expect(
      page.locator("button, a").filter({ hasText: /add|new|create/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("AD06 - dashboard renders revenue chart area", async ({ page }) => {
    const chart = page.locator(".recharts-wrapper, .recharts-responsive-container, svg[class*='recharts']").first();
    await expect(chart).toBeVisible({ timeout: 15000 });
  });

  test("AD07 - admin tabs are navigable back and forth", async ({ page }) => {
    const ordersTab = page.locator("button, a").filter({ hasText: /^orders$/i }).first();
    const dashTab = page.locator("button, a").filter({ hasText: /^dashboard$/i }).first();
    await ordersTab.click();
    await expect(page.getByText(/export csv|csv/i).first()).toBeVisible({ timeout: 15000 });
    await dashTab.click();
    await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 15000 });
  });
});
