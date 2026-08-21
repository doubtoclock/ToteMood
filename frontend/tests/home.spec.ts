import { test, expect } from "@playwright/test";

const BASE = "/";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
  });

  // ── Page Load & Meta ──────────────────────────────────────────────
  test("H01 - page loads successfully", async ({ page }) => {
    await expect(page).toHaveURL(/totemood/);
  });

  test("H02 - page has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood/);
  });

  test("H03 - main element exists", async ({ page }) => {
    const main = page.locator("main").first();
    await expect(main).toBeVisible();
  });

  test("H04 - navbar is visible on load", async ({ page }) => {
    const navbar = page.locator("header").first();
    await expect(navbar).toBeVisible();
  });

  test("H05 - navbar logo shows 'Totemood' in script font", async ({ page }) => {
    const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveClass(/font-script/);
  });

  test("H06 - navbar has Home link", async ({ page }) => {
    const homeLink = page.locator("nav a").filter({ hasText: "Home" });
    await expect(homeLink).toBeVisible();
  });

  test("H07 - navbar has Shop link", async ({ page }) => {
    const shopLink = page.locator("nav a").filter({ hasText: "Shop" });
    await expect(shopLink).toBeVisible();
  });

  test("H08 - navbar has Stories link", async ({ page }) => {
    const storiesLink = page.locator("nav a").filter({ hasText: "Stories" });
    await expect(storiesLink).toBeVisible();
  });

  test("H09 - navbar has About link", async ({ page }) => {
    const aboutLink = page.locator("nav a").filter({ hasText: "About" });
    await expect(aboutLink).toBeVisible();
  });

  test("H10 - navbar has Contact link", async ({ page }) => {
    const contactLink = page.locator("nav a").filter({ hasText: "Contact" });
    await expect(contactLink).toBeVisible();
  });

  test("H11 - navbar cart icon exists", async ({ page }) => {
    const cartBtn = page.locator("button[aria-label='Cart']");
    await expect(cartBtn).toBeVisible();
  });

  test("H12 - navbar cart badge is hidden when cart empty", async ({ page }) => {
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveCount(0);
  });

  test("H13 - mobile hamburger menu is hidden on desktop", async ({ page }) => {
    const menuBtn = page.locator("button[aria-label='Open menu']");
    await expect(menuBtn).toBeHidden();
  });

  // ── MomentsWeCarry ────────────────────────────────────────────────
  test("H14 - MomentsWeCarry section renders", async ({ page }) => {
    const section = page.locator("section").first();
    await expect(section).toBeVisible();
  });

  test("H15 - MomentsWeCarry has 3D canvas or image content", async ({ page }) => {
    const hasCanvas = await page.locator("canvas").count();
    const hasImage = await page.locator("section").first().locator("img").count();
    expect(hasCanvas + hasImage).toBeGreaterThan(0);
  });

  // ── Hero ──────────────────────────────────────────────────────────
  test("H16 - Hero section is visible", async ({ page }) => {
    const heroText = page.locator("text=Carry your story").or(page.locator("text=carry your story")).or(page.locator("text=story")).first();
    await expect(heroText).toBeVisible({ timeout: 10000 });
  });

  test("H17 - Hero has a CTA button linking to shop", async ({ page }) => {
    const cta = page.locator("a[href='/shop']").first();
    await expect(cta).toBeVisible();
  });

  // ── Featured Collection ───────────────────────────────────────────
  test("H18 - Featured collection heading exists", async ({ page }) => {
    const heading = page.locator("text=Carry a little something").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("H19 - Featured collection shows products", async ({ page }) => {
    const productCards = page.locator("section a[href^='/shop/']");
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("H20 - Featured collection product images load", async ({ page }) => {
    const images = page.locator("section img[alt]");
    const first = images.first();
    await expect(first).toBeVisible();
    const src = await first.getAttribute("src");
    expect(src).toBeTruthy();
  });

  test("H21 - Featured collection 'Shop Collection' link exists", async ({ page }) => {
    const link = page.locator("text=Shop Collection").first();
    await expect(link).toBeVisible();
  });

  test("H22 - Featured collection product names are visible", async ({ page }) => {
    const names = page.locator("h3").filter({ hasText: /tote/i });
    const count = await names.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("H23 - Featured collection product prices are visible", async ({ page }) => {
    const prices = page.locator("text=/₹\\d+/");
    const count = await prices.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // ── Customer Stories ──────────────────────────────────────────────
  test("H24 - Customer stories section renders", async ({ page }) => {
    const section = page.locator("text=Customer Stories").or(page.locator("text=stories")).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  // ── FAQ Section ───────────────────────────────────────────────────
  test("H25 - FAQ section exists", async ({ page }) => {
    const faq = page.locator("#faq").or(page.locator("text=Frequently Asked")).or(page.locator("text=FAQ")).first();
    await expect(faq).toBeVisible({ timeout: 10000 });
  });

  // ── ProductMockup / Footer-like Section ───────────────────────────
  test("H26 - ProductMockup section exists", async ({ page }) => {
    const section = page.locator("text=Own your moments").or(page.locator("text=Your Moments")).or(page.locator("text=moments")).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  // ── Footer ────────────────────────────────────────────────────────
  test("H27 - Footer is visible", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("H28 - Footer has WhatsApp link", async ({ page }) => {
    const wa = page.locator("footer a[href*='wa.me']");
    await expect(wa).toBeVisible();
  });

  test("H29 - Footer has Instagram link", async ({ page }) => {
    const ig = page.locator("footer a[href*='instagram.com']");
    await expect(ig).toBeVisible();
  });

  test("H30 - Footer has 'Collections' link (not Shop)", async ({ page }) => {
    const collections = page.locator("footer a").filter({ hasText: "Collections" });
    await expect(collections).toBeVisible();
  });

  // ── Navigation ────────────────────────────────────────────────────
  test("H31 - clicking Shop link navigates to /shop", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "Shop" }).first().click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("H32 - clicking About link navigates to /about", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "About" }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("H33 - clicking Contact link navigates to /contact", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "Contact" }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("H34 - clicking Home link stays on home page", async ({ page }) => {
    await page.locator("nav a").filter({ hasText: "Home" }).first().click();
    await expect(page).toHaveURL(/totemood/);
  });

  test("H35 - clicking logo navigates to home", async ({ page }) => {
    await page.goto("/shop");
    await page.locator("header a").filter({ hasText: "Totemood" }).first().click();
    await expect(page).toHaveURL(/totemood.*\/?$/);
  });

  // ── Scroll Behavior ───────────────────────────────────────────────
  test("H36 - navbar becomes opaque/scrolled on scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(600);
    const navbar = page.locator("header > div").first();
    const classes = await navbar.getAttribute("class");
    expect(classes).toContain("backdrop-blur");
  });

  // ── Floating Socials ──────────────────────────────────────────────
  test("H37 - Floating WhatsApp button is visible on home", async ({ page }) => {
    const wa = page.locator("a[href*='wa.me']").last();
    await expect(wa).toBeVisible();
  });

  test("H38 - Floating Instagram button is visible on home", async ({ page }) => {
    const ig = page.locator("a[href*='instagram.com/totemood_gifts']").last();
    await expect(ig).toBeVisible();
  });

  // ── Images & Assets ───────────────────────────────────────────────
  test("H39 - no broken images on home page", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const natural = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(natural).toBeGreaterThan(0);
    }
  });

  test("H40 - page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    const critical = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("google") && !e.includes("socket")
    );
    expect(critical).toHaveLength(0);
  });
});
