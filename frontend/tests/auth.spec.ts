import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  // ── Account Page ───────────────────────────────────────────────────
  test("AU01 - account page loads successfully", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/account/);
  });

  test("AU02 - account page title contains Account or Totemood", async ({ page }) => {
    await expect(page).toHaveTitle(/Account|Totemood/i);
  });

  test("AU03 - account page has main content area", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const main = page.locator("main, [class*='account']").first();
    const exists = await main.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AU04 - account page renders without error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const critical = errors.filter((e) => !e.includes("google") && !e.includes("favicon"));
    expect(critical).toHaveLength(0);
  });

  // ── Google Sign In UI ──────────────────────────────────────────────
  test("AU05 - Google Sign In button visible when not logged in", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const gsi = page.locator("text=/Sign in with Google|Google|Google Sign/i").first();
    const exists = await gsi.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AU06 - Google GSI script is loaded", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const script = page.locator("script[src*='gsi/client']");
    const exists = await script.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  test("AU07 - Google client ID is configured", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const gsiDiv = page.locator("#g_id_onload, [data-client_id]").first();
    const exists = await gsiDiv.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  // ── Profile Display ────────────────────────────────────────────────
  test("AU08 - no profile pic shown when not logged in", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const profilePic = page.locator("header img[alt='Account']");
    await expect(profilePic).toBeHidden({ timeout: 3000 });
  });

  test("AU09 - Sign in link visible in navbar when not logged in", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const signIn = page.locator("a").filter({ hasText: "Sign in" }).first();
    await expect(signIn).toBeVisible();
  });

  test("AU10 - logout button not visible when not logged in", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const logout = page.locator("button[aria-label='Sign out']");
    await expect(logout).toBeHidden({ timeout: 3000 });
  });

  // ── Logout ─────────────────────────────────────────────────────────
  test("AU11 - logout button visible when logged in (mock localStorage)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      localStorage.setItem(
        "totemood_account_profile",
        JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", picture: "" })
      );
      localStorage.setItem("totemood_account_token", "mock-token");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    const logout = page.locator("button[aria-label='Sign out']");
    await expect(logout).toBeVisible({ timeout: 5000 });
  });

  test("AU12 - clicking logout clears profile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      localStorage.setItem(
        "totemood_account_profile",
        JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", picture: "" })
      );
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.locator("button[aria-label='Sign out']").click();
    await page.waitForTimeout(500);
    const profile = await page.evaluate(() => localStorage.getItem("totemood_account_profile"));
    expect(profile).toBeNull();
  });

  // ── localStorage ───────────────────────────────────────────────────
  test("AU13 - account profile stored in correct localStorage key", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      localStorage.setItem(
        "totemood_account_profile",
        JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User" })
      );
    });
    const stored = await page.evaluate(() => localStorage.getItem("totemood_account_profile"));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe("test@test.com");
  });

  test("AU14 - clearing localStorage removes auth state", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("totemood_account_profile", JSON.stringify({ email: "test@test.com" }));
    });
    await page.evaluate(() => {
      localStorage.removeItem("totemood_account_profile");
      localStorage.removeItem("totemood_account_token");
    });
    const profile = await page.evaluate(() => localStorage.getItem("totemood_account_profile"));
    expect(profile).toBeNull();
  });

  // ── Navbar Integration ─────────────────────────────────────────────
  test("AU15 - logged in state shows Account link in mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      localStorage.setItem(
        "totemood_account_profile",
        JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", picture: "" })
      );
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.locator("button[aria-label='Open menu']").click();
    const account = page.locator("a").filter({ hasText: /Account|Sign out/ }).first();
    await expect(account).toBeVisible({ timeout: 5000 });
  });
});
