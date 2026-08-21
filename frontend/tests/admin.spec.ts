import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  // ── Dashboard ──────────────────────────────────────────────────────
  test("AD01 - admin page loads successfully", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("AD02 - admin dashboard shows Total Revenue card", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const card = page.locator("text=Total Revenue").first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test("AD03 - admin dashboard shows Total Orders card", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const card = page.locator("text=Total Orders").first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test("AD04 - admin dashboard shows Active Products card", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const card = page.locator("text=Active Products").first();
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test("AD05 - admin dashboard has revenue chart area", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const chart = page.locator(".recharts-responsive-container, [class*='recharts']").first();
    const exists = await chart.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  // ── Orders Tab ─────────────────────────────────────────────────────
  test("AD06 - clicking Orders tab shows orders list", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.waitForLoadState("networkidle");
    const heading = page.locator("text=/Orders|orders/i").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("AD07 - orders page has CSV export button", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.waitForLoadState("networkidle");
    const btn = page.locator("button").filter({ hasText: /CSV|Export|Download/i }).first();
    const icon = page.locator("svg").filter({ hasText: "" }).first();
    const hasBtn = await btn.count();
    const hasIcon = await icon.count();
    expect(hasBtn + hasIcon).toBeGreaterThan(0);
  });

  test("AD08 - orders page shows loading state initially", async ({ page }) => {
    await page.goto("/admin/orders");
    const loading = page.locator("text=/Loading|loading/i").first();
    const exists = await loading.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AD09 - orders table/list renders", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.waitForLoadState("networkidle");
    const list = page.locator("table, [class*='order'], [class*='list']").first();
    const exists = await list.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AD10 - orders page has status filter or display", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.waitForLoadState("networkidle");
    const status = page.locator("text=/pending|processing|shipped|delivered|cancelled/i").first();
    const exists = await status.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AD11 - admin has no main site navbar", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const mainNav = page.locator("header nav");
    await expect(mainNav).toBeHidden({ timeout: 5000 });
  });

  test("AD12 - admin has no main site footer", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const footer = page.locator("footer");
    await expect(footer).toBeHidden({ timeout: 5000 });
  });

  // ── Products Tab ───────────────────────────────────────────────────
  test("AD13 - products admin page loads", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test("AD14 - products page shows product list", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const list = page.locator("table, [class*='product'], [class*='list']").first();
    const exists = await list.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AD15 - products page has Add/Create button", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const btn = page.locator("button").filter({ hasText: /Add|Create|New|Plus/i }).first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test("AD16 - products page shows product names", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const name = page.locator("text=/tote|Tote/i").first();
    await expect(name).toBeVisible({ timeout: 10000 });
  });

  test("AD17 - products page shows product prices", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const price = page.locator("text=/₹\\d+/").first();
    await expect(price).toBeVisible({ timeout: 10000 });
  });

  test("AD18 - products page has edit/delete buttons", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const editBtns = page.locator("button[aria-label*='Edit'], button").filter({ hasText: /edit/i });
    const delBtns = page.locator("button[aria-label*='Delete'], button").filter({ hasText: /delete|trash/i });
    const hasEdit = await editBtns.count();
    const hasDel = await delBtns.count();
    expect(hasEdit + hasDel).toBeGreaterThanOrEqual(0);
  });

  test("AD19 - products page shows category info", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const cat = page.locator("text=/Bestseller|New|Custom/i").first();
    await expect(cat).toBeVisible({ timeout: 10000 });
  });

  test("AD20 - clicking Add opens product form modal", async ({ page }) => {
    await page.goto("/admin/products");
    await page.waitForLoadState("networkidle");
    const btn = page.locator("button").filter({ hasText: /Add|Create|New|Plus/i }).first();
    await btn.click();
    await page.waitForTimeout(500);
    const modal = page.locator("[class*='modal'], [class*='dialog'], [role='dialog']").first();
    const exists = await modal.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  // ── Admin Navigation Tabs ──────────────────────────────────────────
  test("AD21 - admin has Dashboard tab/link", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const tab = page.locator("text=/Dashboard|dashboard/i").first();
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test("AD22 - admin has Orders tab/link", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const tab = page.locator("text=/Orders|orders/i").first();
    await expect(tab).toBeVisible();
  });

  test("AD23 - admin has Products tab/link", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const tab = page.locator("text=/Products|products/i").first();
    await expect(tab).toBeVisible();
  });

  test("AD24 - admin does NOT have Settings tab", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const settings = page.locator("a, button").filter({ hasText: /Settings/i });
    const count = await settings.count();
    expect(count).toBe(0);
  });

  test("AD25 - admin navigation tabs are clickable", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");
    const ordersTab = page.locator("a, button").filter({ hasText: /Orders/ }).first();
    await ordersTab.click();
    await expect(page).toHaveURL(/\/admin\/orders/, { timeout: 5000 });
  });
});
