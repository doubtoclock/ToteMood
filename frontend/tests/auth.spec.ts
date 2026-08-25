import { test, expect } from "./fixtures";
import { isMobileViewport } from "./utils";

async function signInWithStorage(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("totemood_account_token", "mock-token");
    localStorage.setItem(
      "totemood_account_profile",
      JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", phone: "", picture: "" })
    );
  });
}

test.describe("Authentication", () => {
  test("AU01 - account page loads without critical errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText(/my account/i).first()).toBeVisible({ timeout: 10000 });
    const critical = errors.filter((e) => !/google|favicon/i.test(e));
    expect(critical).toHaveLength(0);
  });

  test("AU02 - signed-out account page shows Google sign-in area", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    // Page content can briefly render twice during hydration; use first()
    await expect(page.getByText(/sign in with google to see your own orders/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("AU03 - GSI client script is loaded on account page", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("script[src*='gsi/client']").first()).toBeAttached({ timeout: 10000 });
  });

  test("AU04 - signed-out navbar shows Sign in and no logout", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    if (isMobileViewport(page)) {
      // header auth controls live inside the mobile menu
      await page.locator("button[aria-label='Open menu']").click();
      await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible({ timeout: 10000 });
    } else {
      await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 10000 });
    }
    await expect(page.locator("button[aria-label='Sign out']")).toHaveCount(0);
  });

  test("AU05 - signed-in state shows account avatar in navbar instantly", async ({ page }) => {
    test.skip(isMobileViewport(page), "desktop navbar avatar; mobile menu equivalent covered by AU07/AU08");
    await signInWithStorage(page);
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    // Sign out lives on the account page now; the navbar shows an avatar link instead
    await expect(page.locator("header a[aria-label='Account']")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button[aria-label='Sign out']")).toHaveCount(0);
  });

  test("AU06 - logging out from account page clears profile storage", async ({ page }) => {
    await signInWithStorage(page);
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/my account/i).first()).toBeVisible({ timeout: 10000 });
    await page.locator("button").filter({ hasText: /^log out$/i }).first().click();
    const modal = page
      .locator("div.fixed.inset-0")
      .filter({ hasText: /are you sure you want to log out/i });
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: /log out/i }).click();
    await expect.poll(() =>
      page.evaluate(() => localStorage.getItem("totemood_account_profile"))
    ).toBe(null);
    if (isMobileViewport(page)) {
      await page.locator("button[aria-label='Open menu']").click();
      await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible({ timeout: 10000 });
    } else {
      await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("AU07 - account page flips to signed-in view from seeded session", async ({ page }) => {
    await signInWithStorage(page);
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText("Google account").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/test@test\.com/).first()).toBeVisible();
  });

  test("AU08 - mobile menu shows My Account and My Orders when logged in", async ({ page }) => {
    await signInWithStorage(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button[aria-label='Open menu']").click();
    await expect(page.getByRole("link", { name: "My Account" })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("link", { name: "My Orders" })).toBeVisible();
    // Sign out is handled from the account page, not the mobile menu
    await expect(page.getByRole("button", { name: /sign out/i })).toHaveCount(0);
  });
});
