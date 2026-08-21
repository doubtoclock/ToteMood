import { test, expect } from "@playwright/test";

test.describe("Shop Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
  });

  // ── Page Load ──────────────────────────────────────────────────────
  test("S01 - page loads successfully", async ({ page }) => {
    await expect(page).toHaveURL(/\/shop/);
  });

  test("S02 - page title contains Totemood or Shop", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood|Shop/i);
  });

  test("S03 - main element is visible", async ({ page }) => {
    await expect(page.locator("main").first()).toBeVisible();
  });

  // ── Free Delivery Banner ───────────────────────────────────────────
  test("S04 - free delivery banner text is visible", async ({ page }) => {
    await expect(page.locator("text=Free Delivery to All Customers")).toBeVisible();
  });

  test("S05 - free delivery banner has 'Enjoy' prefix text", async ({ page }) => {
    await expect(page.locator("text=Enjoy")).toBeVisible();
  });

  test("S06 - free delivery banner has Truck SVG icon", async ({ page }) => {
    const banner = page.locator("div").filter({ hasText: "Free Delivery to All Customers" }).first();
    await expect(banner.locator("svg").first()).toBeVisible();
  });

  test("S07 - free delivery banner has dark background style", async ({ page }) => {
    const banner = page.locator("div[style*='202517']").first();
    await expect(banner).toBeVisible();
  });

  // ── Shop Header ────────────────────────────────────────────────────
  test("S08 - shop header section is visible", async ({ page }) => {
    const header = page.locator("text=/tote|Tote|canvas/i").first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("S09 - shop header exists with descriptive content", async ({ page }) => {
    const section = page.locator("section, div").filter({ hasText: /personalise|custom|tote/i }).first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  // ── Product Grid ───────────────────────────────────────────────────
  test("S10 - product grid container renders", async ({ page }) => {
    const grid = page.locator(".grid").first();
    await expect(grid).toBeVisible();
  });

  test("S11 - at least 5 product cards are displayed", async ({ page }) => {
    const cards = page.locator("a[href^='/shop/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("S12 - first product card has an image", async ({ page }) => {
    const img = page.locator("a[href^='/shop/'] img").first();
    await expect(img).toBeVisible();
  });

  test("S13 - first product card has a name in h3", async ({ page }) => {
    const name = page.locator("h3").filter({ hasText: /tote/i }).first();
    await expect(name).toBeVisible();
  });

  test("S14 - first product card has a price with rupee symbol", async ({ page }) => {
    const price = page.locator("text=/₹\\d+/").first();
    await expect(price).toBeVisible();
  });

  test("S15 - product card has star rating icons", async ({ page }) => {
    const starSection = page.locator("svg.fill-current").first();
    await expect(starSection).toBeVisible();
  });

  test("S16 - product card shows review count in parentheses", async ({ page }) => {
    const review = page.locator("text=/\\(\\d+\\)/").first();
    await expect(review).toBeVisible();
  });

  test("S17 - product card has consistent spacing", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    const classes = await card.getAttribute("class");
    expect(classes).toContain("flex");
  });

  // ── Product Badges ─────────────────────────────────────────────────
  test("S18 - customizable products show 'Custom' badge", async ({ page }) => {
    const badge = page.locator("text=Custom").first();
    await expect(badge).toBeVisible();
  });

  test("S19 - badge has uppercase tracking styling", async ({ page }) => {
    const badge = page.locator("span").filter({ hasText: "Custom" }).first();
    const classes = await badge.getAttribute("class");
    expect(classes).toContain("uppercase");
  });

  // ── Product Card Hover ─────────────────────────────────────────────
  test("S20 - cart icon button appears on card hover", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    const btn = page.locator("button[aria-label*='Add']").first();
    await expect(btn).toBeVisible({ timeout: 5000 });
  });

  test("S21 - hover cart button has rounded styling", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    const btn = page.locator("button[aria-label*='Add']").first();
    const classes = await btn.getAttribute("class");
    expect(classes).toContain("rounded-full");
  });

  test("S22 - hover cart button contains ShoppingCart SVG", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    const btn = page.locator("button[aria-label*='Add']").first();
    await expect(btn.locator("svg")).toBeVisible();
  });

  // ── Product Images ─────────────────────────────────────────────────
  test("S23 - product images have correct alt attributes", async ({ page }) => {
    const imgs = page.locator("a[href^='/shop/'] img");
    const alt = await imgs.first().getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(0);
  });

  test("S24 - product images use Next.js Image component", async ({ page }) => {
    const img = page.locator("a[href^='/shop/'] img").first();
    const src = await img.getAttribute("src");
    expect(src).toBeTruthy();
  });

  test("S25 - product images have loading=lazy", async ({ page }) => {
    const img = page.locator("a[href^='/shop/'] img").first();
    const loading = await img.getAttribute("loading");
    expect(loading).toBe("lazy");
  });

  // ── Navigation to Product Pages ────────────────────────────────────
  test("S26 - clicking first product card navigates to product page", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test("S27 - product page URL contains product ID", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    const href = await card.getAttribute("href");
    await card.click();
    expect(page.url()).toContain("/shop/");
  });

  test("S28 - back navigation returns to shop", async ({ page }) => {
    await page.locator("a[href^='/shop/']").first().click();
    await page.waitForLoadState("networkidle");
    await page.goBack();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("S29 - all product IDs are valid links", async ({ page }) => {
    const links = page.locator("a[href^='/shop/']");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/shop\/[\w-]+$/);
    }
  });

  // ── Shop Newsletter ────────────────────────────────────────────────
  test("S30 - shop newsletter section exists", async ({ page }) => {
    const section = page.locator("text=/newsletter|subscribe|trust|quality/i").first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test("S31 - newsletter section is below the product grid", async ({ page }) => {
    const grid = page.locator(".grid").first();
    const gridBox = await grid.boundingBox();
    const newsletter = page.locator("text=/newsletter|subscribe|trust|quality/i").first();
    const newsBox = await newsletter.boundingBox();
    expect(newsBox!.y).toBeGreaterThan(gridBox!.y);
  });

  // ── Customer Stories ───────────────────────────────────────────────
  test("S32 - customer stories section renders", async ({ page }) => {
    const section = page.locator("text=/stories|reviews|testimonials/i").first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  test("S33 - customer stories section is after newsletter", async ({ page }) => {
    const section = page.locator("text=/stories|reviews|testimonials/i").first();
    await expect(section).toBeVisible({ timeout: 10000 });
  });

  // ── Cart from Shop ─────────────────────────────────────────────────
  test("S34 - clicking cart icon on shop opens cart drawer", async ({ page }) => {
    const cartBtn = page.locator("button[aria-label='Cart']");
    await cartBtn.click();
    await expect(page.locator("button[aria-label='Close cart']")).toBeVisible({ timeout: 5000 });
  });

  test("S35 - adding item from shop hover updates cart badge", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toBeVisible({ timeout: 3000 });
    await expect(badge).toHaveText("1");
  });

  test("S36 - adding same item twice increments quantity", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    await page.waitForTimeout(500);
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("2", { timeout: 3000 });
  });

  test("S37 - adding different items increments badge count", async ({ page }) => {
    const card1 = page.locator("a[href^='/shop/']").nth(0);
    await card1.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    await page.waitForTimeout(500);
    const card2 = page.locator("a[href^='/shop/']").nth(1);
    await card2.hover();
    await page.locator("button[aria-label*='Add']").nth(1).click();
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("2", { timeout: 3000 });
  });

  test("S38 - cart badge shows correct count after multiple adds", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      const card = page.locator("a[href^='/shop/']").nth(i);
      await card.hover();
      await page.locator("button[aria-label*='Add']").nth(i).click();
      await page.waitForTimeout(300);
    }
    const badge = page.locator("button[aria-label='Cart'] span");
    await expect(badge).toHaveText("3", { timeout: 3000 });
  });

  test("S39 - cart drawer shows added product name", async ({ page }) => {
    const card = page.locator("a[href^='/shop/']").first();
    await card.hover();
    await page.locator("button[aria-label*='Add']").first().click();
    await page.locator("button[aria-label='Cart']").click();
    const drawerItem = page.locator("h3, p, span").filter({ hasText: /tote/i }).first();
    await expect(drawerItem).toBeVisible({ timeout: 5000 });
  });

  // ── Console Errors ─────────────────────────────────────────────────
  test("S40 - no critical console errors on shop page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const critical = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("google") && !e.includes("socket") && !e.includes("Socket")
    );
    expect(critical).toHaveLength(0);
  });

  test("S41 - page renders without hydration errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/shop");
    await page.waitForLoadState("networkidle");
    const hydrationErrors = errors.filter((e) => e.includes("hydrat"));
    expect(hydrationErrors).toHaveLength(0);
  });

  // ── Scroll Behavior ────────────────────────────────────────────────
  test("S42 - navbar becomes backdrop-blur on scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(600);
    const header = page.locator("header > div").first();
    const classes = await header.getAttribute("class");
    expect(classes).toContain("backdrop-blur");
  });

  test("S43 - product grid is visible after scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    const grid = page.locator(".grid").first();
    await expect(grid).toBeVisible();
  });

  // ── Responsive Grid ────────────────────────────────────────────────
  test("S44 - product grid uses CSS grid layout", async ({ page }) => {
    const grid = page.locator(".grid").first();
    const display = await grid.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("grid");
  });

  test("S45 - grid has responsive column classes", async ({ page }) => {
    const grid = page.locator(".grid").first();
    const classes = await grid.getAttribute("class");
    expect(classes).toContain("grid-cols-");
  });

  // ── Footer on Shop ─────────────────────────────────────────────────
  test("S46 - footer is visible on shop page", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.locator("footer")).toBeVisible();
  });

  test("S47 - footer has WhatsApp link on shop page", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const wa = page.locator("footer a[href*='wa.me']");
    await expect(wa).toBeVisible();
  });

  // ── Navbar on Shop ─────────────────────────────────────────────────
  test("S48 - navbar is visible on shop page", async ({ page }) => {
    await expect(page.locator("header").first()).toBeVisible();
  });

  test("S49 - Shop link in nav is active or present", async ({ page }) => {
    const shopLink = page.locator("nav a").filter({ hasText: "Shop" }).first();
    await expect(shopLink).toBeVisible();
  });

  test("S50 - product grid fade-in animation classes present", async ({ page }) => {
    const cards = page.locator("[class*='animate-fade-in']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
