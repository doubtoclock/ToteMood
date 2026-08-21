import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("N01 - logo uses script font and links home", async ({ page }) => {
    const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/font-script/);
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("N02 - desktop nav has exactly the 5 primary links", async ({ page }) => {
    const links = page.locator("nav a");
    expect(await links.count()).toBe(5);
  });

  test("N03 - navbar is transparent at top and blurred after scroll", async ({ page }) => {
    const inner = page.locator("header > div").first();
    let classes = (await inner.getAttribute("class")) || "";
    expect(classes).toContain("bg-transparent");
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect
      .poll(async () => (await inner.getAttribute("class")) || "", { timeout: 5000 })
      .toContain("backdrop-blur");
    classes = (await inner.getAttribute("class")) || "";
    expect(classes).toContain("rounded-full");
  });

  test("N04 - footer renders with brand, tagline and copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator("a").filter({ hasText: "Totemood" }).first()).toBeVisible();
    await expect(footer.getByText(/© \d{4} TOTEMOOD/i).first()).toBeVisible();
  });

  test("N05 - footer social links open in new tab with correct URLs", async ({ page }) => {
    const wa = page.locator("footer a[href*='wa.me']").first();
    await expect(wa).toBeVisible();
    await expect(wa).toHaveAttribute("target", "_blank");
    const ig = page.locator("footer a[href*='instagram.com/totemood_gifts']").first();
    await expect(ig).toBeVisible();
    await expect(ig).toHaveAttribute("target", "_blank");
  });

  test("N06 - hamburger opens mobile menu with nav links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("button[aria-label='Open menu']").click();
    for (const name of ["Home", "Shop", "About"]) {
      await expect(page.locator("a").filter({ hasText: new RegExp(`^${name}$`) }).last()).toBeVisible({ timeout: 5000 });
    }
  });

  test("N07 - mobile menu closes via X button", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("button[aria-label='Open menu']").click();
    const close = page.locator("button[aria-label='Close menu']");
    await expect(close).toBeVisible({ timeout: 5000 });
    await close.click();
    await expect(close).toBeHidden({ timeout: 3000 });
  });

  test("N08 - mobile menu link navigates and closes menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("button[aria-label='Open menu']").click();
    await page.locator("a").filter({ hasText: /^Shop$/ }).last().click();
    await expect(page).toHaveURL(/\/shop/, { timeout: 10000 });
    await expect(page.locator("button[aria-label='Close menu']")).toBeHidden();
  });
});
