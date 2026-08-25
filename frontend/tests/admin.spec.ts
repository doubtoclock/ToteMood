import { test, expect } from "./fixtures";
import { ADMIN_PATH, ADMIN_ROUTE } from "../src/lib/admin-route";
import { TEST_API_BASE } from "./utils";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Siya@2904";

// Logs in against the backend and seeds the admin session before the app boots
async function seedAdminSession(page: import("@playwright/test").Page) {
  const res = await page.request.post(`${TEST_API_BASE}/api/admin/login`, {
    data: { password: ADMIN_PASSWORD },
  });
  if (!res.ok()) throw new Error(`Admin login failed: ${res.status()}`);
  const { token } = (await res.json()) as { token: string };
  await page.addInitScript((t) => {
    localStorage.setItem("totemood_admin_auth", "true");
    localStorage.setItem("totemood_admin_token", t);
  }, token);
}

test.describe("Admin Panel", () => {
  // Admin views fetch from a remote database; allow extra room under load
  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await seedAdminSession(page);
    await page.goto(ADMIN_PATH);
    await page.waitForLoadState("domcontentloaded");
  });

  test("AD01 - admin page loads without site navbar or footer", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`\\/${ADMIN_ROUTE}`));
    await expect(page.locator("header").first()).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(page.getByText(/admin login/i)).toHaveCount(0);
  });

  test("AD02 - dashboard shows stat cards for revenue, orders and products", async ({ page }) => {
    await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(/total orders/i).first()).toBeVisible();
    await expect(page.getByText(/active products/i).first()).toBeVisible();
  });

  test("AD03 - admin has Dashboard, Orders and Products tabs", async ({ page }) => {
    const sidebar = page.locator("aside");
    for (const tab of ["Dashboard", "Products", "Orders"]) {
      await expect(sidebar.locator("a").filter({ hasText: new RegExp(`^${tab}$`, "i") }).first()).toBeVisible({ timeout: 20000 });
    }
  });

  test("AD04 - switching to Orders tab shows orders view with CSV export", async ({ page }) => {
    await page.locator("aside a").filter({ hasText: /^orders$/i }).first().click();
    // Orders fetch is large (~20s+ against the live database)
    await expect(page.getByRole("heading", { name: /orders/i }).first()).toBeVisible({ timeout: 75_000 });
    // CSV export is available when there is order data
    await expect(
      page.getByRole("button", { name: /download csv/i }).or(page.getByText(/no orders found/i))
    ).toBeVisible({ timeout: 30_000 });
  });

  test("AD05 - switching to Products tab shows product management", async ({ page }) => {
    await page.locator("aside a").filter({ hasText: /^products$/i }).first().click();
    await expect(page.getByRole("heading", { name: /products/i }).first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: /add product/i })).toBeVisible({ timeout: 30000 });
  });

  test("AD06 - dashboard renders revenue chart area", async ({ page }) => {
    await expect(page.getByText(/revenue over time/i)).toBeVisible({ timeout: 30000 });
    // Chart renders when completed-order data exists, otherwise an empty state is shown
    await expect(
      page.locator(".recharts-wrapper, .recharts-responsive-container, svg[class*='recharts']")
        .or(page.getByText(/no completed orders yet/i))
        .first()
    ).toBeVisible({ timeout: 30000 });
  });

  test("AD07 - admin tabs are navigable back and forth", async ({ page }) => {
    await page.locator("aside a").filter({ hasText: /^orders$/i }).first().click();
    await expect(page.getByRole("heading", { name: /orders/i }).first()).toBeVisible({ timeout: 75_000 });
    await page.locator("aside a").filter({ hasText: /^dashboard$/i }).first().click();
    await expect(page.getByText(/total revenue/i).first()).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Admin Login", () => {
  test("AD08 - wrong password is rejected, correct password grants access", async ({ page }) => {
    await page.goto(ADMIN_PATH);
    await page.waitForLoadState("domcontentloaded");
    const pwInput = page.locator("input[type='password']");
    await expect(pwInput).toBeVisible({ timeout: 10000 });

    await pwInput.fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/incorrect password/i)).toBeVisible({ timeout: 10000 });

    await pwInput.fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.locator("aside")).toBeVisible({ timeout: 15000 });
    // session persists across reloads
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("aside")).toBeVisible({ timeout: 10000 });
  });

  test("AD09 - stale/expired admin token falls back to the login form", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("totemood_admin_auth", "true");
      localStorage.setItem("totemood_admin_token", "invalid.expired.token");
    });
    await page.goto(ADMIN_PATH);
    await page.waitForLoadState("domcontentloaded");
    // the panel must NOT hang on failed data loads — show the login form instead
    await expect(page.locator("input[type='password']")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/session expired/i)).toBeVisible();
  });
});
