import { test, expect } from "@playwright/test";

const SESSION = {
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  phone: "",
  picture: "",
};

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
    await expect(page.getByText(/sign in with google to see your own orders/i)).toBeVisible({ timeout: 10000 });
  });

  test("AU03 - GSI client script is loaded on account page", async ({ page }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("script[src*='gsi/client']").first()).toBeAttached({ timeout: 10000 });
  });

  test("AU04 - signed-out navbar shows Sign in and no logout", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button[aria-label='Sign out']")).toHaveCount(0);
  });

  test("AU05 - signed-in state shows avatar/logout in navbar instantly", async ({ page }) => {
    await signInWithStorage(page);
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("button[aria-label='Sign out']")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("header a[href='/account']").last()).toBeVisible();
  });

  test("AU06 - clicking logout clears profile storage", async ({ page }) => {
    await signInWithStorage(page);
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button[aria-label='Sign out']").click();
    await page.waitForTimeout(500);
    const profile = await page.evaluate(() => localStorage.getItem("totemood_account_profile"));
    expect(profile).toBeNull();
    await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 5000 });
  });

  test("AU07 - account page flips to signed-in view from seeded session", async ({ page }) => {
    await signInWithStorage(page);
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText("Google account").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/test@test\.com/).first()).toBeVisible();
  });

  test("AU08 - mobile menu shows Account and Sign out when logged in", async ({ page }) => {
    await signInWithStorage(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button[aria-label='Open menu']").click();
    const menu = page.locator("a").filter({ hasText: /^Account$/ }).first();
    await expect(menu).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });
});
