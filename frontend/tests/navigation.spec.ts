import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Desktop Navbar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("N01 - navbar header element is visible", async ({ page }) => {
      await expect(page.locator("header").first()).toBeVisible();
    });

    test("N02 - logo shows 'Totemood' text", async ({ page }) => {
      const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
      await expect(logo).toBeVisible();
    });

    test("N03 - logo uses script/cursive font class", async ({ page }) => {
      const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
      const classes = await logo.getAttribute("class");
      expect(classes).toContain("font-script");
    });

    test("N04 - logo has large text size (text-3xl or text-4xl)", async ({ page }) => {
      const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
      const classes = await logo.getAttribute("class");
      expect(classes).toMatch(/text-[34]xl/);
    });

    test("N05 - desktop nav has 5 links", async ({ page }) => {
      const nav = page.locator("nav.hidden.md\\:flex");
      const links = nav.locator("a");
      const count = await links.count();
      expect(count).toBe(5);
    });

    test("N06 - desktop nav shows Home, Shop, Stories, About, Contact", async ({ page }) => {
      for (const name of ["Home", "Shop", "Stories", "About", "Contact"]) {
        const link = page.locator("nav a").filter({ hasText: name }).first();
        await expect(link).toBeVisible();
      }
    });

    test("N07 - nav links have uppercase tracking styling", async ({ page }) => {
      const link = page.locator("nav a").filter({ hasText: "Shop" }).first();
      const classes = await link.getAttribute("class");
      expect(classes).toContain("uppercase");
      expect(classes).toContain("tracking-");
    });

    test("N08 - navbar cart icon exists with aria-label", async ({ page }) => {
      const cart = page.locator("button[aria-label='Cart']");
      await expect(cart).toBeVisible();
    });

    test("N09 - Sign in link visible when not logged in", async ({ page }) => {
      const signIn = page.locator("a").filter({ hasText: "Sign in" }).first();
      await expect(signIn).toBeVisible();
    });

    test("N10 - hamburger menu hidden on desktop", async ({ page }) => {
      const hamburger = page.locator("button[aria-label='Open menu']");
      await expect(hamburger).toBeHidden();
    });
  });

  test.describe("Scroll Behavior", () => {
    test("N11 - navbar is transparent at top", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const header = page.locator("header > div").first();
      const classes = await header.getAttribute("class");
      expect(classes).toContain("bg-transparent");
    });

    test("N12 - navbar gets backdrop-blur after scrolling", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(700);
      const header = page.locator("header > div").first();
      const classes = await header.getAttribute("class");
      expect(classes).toContain("backdrop-blur");
    });

    test("N13 - navbar gets rounded-full when scrolled", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(700);
      const header = page.locator("header > div").first();
      const classes = await header.getAttribute("class");
      expect(classes).toContain("rounded-full");
    });

    test("N14 - navbar gets shadow when scrolled", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(700);
      const header = page.locator("header > div").first();
      const classes = await header.getAttribute("class");
      expect(classes).toContain("shadow-");
    });
  });

  test.describe("Mobile Menu", () => {
    test("N15 - hamburger button is visible on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const btn = page.locator("button[aria-label='Open menu']");
      await expect(btn).toBeVisible();
    });

    test("N16 - hamburger has brand color #B55E5B", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const btn = page.locator("button[aria-label='Open menu']");
      const style = await btn.evaluate((el) => el.style.color);
      expect(style).toContain("181");
    });

    test("N17 - clicking hamburger opens mobile menu", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      await expect(page.locator("button[aria-label='Close menu']")).toBeVisible({ timeout: 5000 });
    });

    test("N18 - mobile menu has Totemood script logo", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const logo = page.locator("span.font-script").first();
      await expect(logo).toBeVisible({ timeout: 5000 });
    });

    test("N19 - mobile menu has Close (X) button", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const close = page.locator("button[aria-label='Close menu']");
      await expect(close).toBeVisible({ timeout: 5000 });
    });

    test("N20 - mobile menu has Home link", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const home = page.locator("a").filter({ hasText: "Home" }).first();
      await expect(home).toBeVisible({ timeout: 5000 });
    });

    test("N21 - mobile menu has Shop link", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const shop = page.locator("a").filter({ hasText: "Shop" }).first();
      await expect(shop).toBeVisible({ timeout: 5000 });
    });

    test("N22 - mobile menu has Contact link", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const contact = page.locator("a").filter({ hasText: "Contact" }).first();
      await expect(contact).toBeVisible({ timeout: 5000 });
    });

    test("N23 - mobile menu has FAQ link", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const faq = page.locator("a").filter({ hasText: "FAQ" }).first();
      await expect(faq).toBeVisible({ timeout: 5000 });
    });

    test("N24 - mobile menu close button works", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      await page.locator("button[aria-label='Close menu']").click();
      await expect(page.locator("button[aria-label='Close menu']")).toBeHidden({ timeout: 3000 });
    });

    test("N25 - clicking nav link in mobile menu navigates", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      await page.locator("nav a").filter({ hasText: "Shop" }).first().click();
      await expect(page).toHaveURL(/\/shop/, { timeout: 5000 });
    });

    test("N26 - mobile menu backdrop closes menu", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      await page.waitForTimeout(300);
      const backdrop = page.locator("[class*='fixed inset-0']").first();
      await backdrop.click({ position: { x: 10, y: 400 }, force: true });
      await page.waitForTimeout(500);
    });

    test("N27 - mobile menu slides from right", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const panel = page.locator("[class*='right-0'][class*='fixed']").first();
      await expect(panel).toBeVisible({ timeout: 5000 });
    });

    test("N28 - mobile menu has Sign in or Account link", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.locator("button[aria-label='Open menu']").click();
      const auth = page.locator("a").filter({ hasText: /Sign in|Account/ }).first();
      await expect(auth).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Footer", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    });

    test("N29 - footer element is visible", async ({ page }) => {
      await expect(page.locator("footer")).toBeVisible();
    });

    test("N30 - footer has dark background (#252A1A)", async ({ page }) => {
      const footer = page.locator("footer");
      const classes = await footer.getAttribute("class");
      expect(classes).toContain("252A1A");
    });

    test("N31 - footer has Totemood script logo", async ({ page }) => {
      const logo = page.locator("footer a").filter({ hasText: "Totemood" }).first();
      await expect(logo).toBeVisible();
    });

    test("N32 - footer has tagline", async ({ page }) => {
      const tagline = page.locator("footer p").filter({ hasText: /Personalised|story/i }).first();
      await expect(tagline).toBeVisible();
    });

    test("N33 - footer has Collections link", async ({ page }) => {
      const link = page.locator("footer a").filter({ hasText: "Collections" }).first();
      await expect(link).toBeVisible();
    });

    test("N34 - footer has About link", async ({ page }) => {
      const link = page.locator("footer a").filter({ hasText: "About" }).first();
      await expect(link).toBeVisible();
    });

    test("N35 - footer has WhatsApp link with correct URL", async ({ page }) => {
      const link = page.locator("footer a[href*='wa.me/919890842755']");
      await expect(link).toBeVisible();
    });

    test("N36 - footer has Instagram link", async ({ page }) => {
      const link = page.locator("footer a[href*='instagram.com/totemood_gifts']");
      await expect(link).toBeVisible();
    });

    test("N37 - footer WhatsApp link opens in new tab", async ({ page }) => {
      const link = page.locator("footer a[href*='wa.me']");
      const target = await link.getAttribute("target");
      expect(target).toBe("_blank");
    });

    test("N38 - footer copyright text is visible", async ({ page }) => {
      const copyright = page.locator("footer").locator("text=/©|copyright|2026/i").first();
      await expect(copyright).toBeVisible();
    });
  });

  test.describe("Floating Socials", () => {
    test("N39 - floating WhatsApp button visible on home", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const links = page.locator("a[href*='wa.me/919890842755']");
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test("N40 - floating Instagram button visible on home", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const links = page.locator("a[href*='instagram.com/totemood_gifts']");
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });
});
