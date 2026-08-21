import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("H01 - loads with correct title, landmarks and navbar", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood/);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/font-script/);
  });

  test("H02 - desktop navbar shows all primary links", async ({ page }) => {
    for (const name of ["Home", "Shop", "Stories", "About", "Contact"]) {
      await expect(page.locator("nav a").filter({ hasText: name }).first()).toBeVisible();
    }
    await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
    await expect(page.locator("button[aria-label='Open menu']")).toBeHidden();
  });

  test("H03 - hero section renders with CTA to shop", async ({ page }) => {
    const cta = page.locator("a[href='/shop']").first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    const hero = page.locator("text=/carry|story/i").first();
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test("H04 - featured collection shows products with names and prices", async ({ page }) => {
    await expect(page.locator("text=Carry a little something").first()).toBeVisible({ timeout: 10000 });
    const cards = page.locator("section a[href^='/shop/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
    await expect(page.locator("h3").filter({ hasText: /tote/i }).first()).toBeVisible();
    await expect(page.locator("text=/₹\\d+/").first()).toBeVisible();
    const img = page.locator("section a[href^='/shop/'] img").first();
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("src", /.+/);
  });

  test("H05 - FAQ anchor section exists", async ({ page }) => {
    await expect(page.locator("#faq").or(page.locator("text=/frequently asked|FAQ/i")).first()).toBeVisible({ timeout: 10000 });
  });

  test("H06 - footer has social links and collections", async ({ page }) => {
    await expect(page.locator("footer a[href*='wa.me']").first()).toBeVisible();
    await expect(page.locator("footer a[href*='instagram.com']").first()).toBeVisible();
    await expect(page.locator("footer a").filter({ hasText: "Collections" }).first()).toBeVisible();
    await expect(page.locator("footer").getByText(/©|TOTEMOOD/i).first()).toBeVisible();
  });

  test("H07 - clicking Shop navigates to /shop", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "Shop" }).first().click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("H08 - clicking About navigates to /about", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("H09 - clicking Contact navigates to /contact", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "Contact" }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("H10 - logo navigates back to home from /shop", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    await page.locator("header a").filter({ hasText: "Totemood" }).first().click();
    await expect(page).not.toHaveURL(/\/shop/);
  });

  test("H11 - floating WhatsApp and Instagram buttons are visible", async ({ page }) => {
    await expect(page.locator("div.fixed a[href*='wa.me']").last()).toBeVisible();
    await expect(page.locator("div.fixed a[href*='instagram.com']").last()).toBeVisible();
  });

  test("H12 - home page renders without critical JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    const critical = errors.filter((e) => !/google|favicon|socket/i.test(e));
    expect(critical).toHaveLength(0);
  });
});
