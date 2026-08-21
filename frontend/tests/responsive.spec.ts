import { test, expect, type Locator, type Page } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

async function gotoShopWithProducts(page: Page) {
  await page.goto("/shop");
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("#all-products a[href^='/shop/']")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
}

function gridTrackCount(locator: Locator) {
  return locator.evaluate(
    (el) => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length
  );
}

test.describe("Mobile Navbar (390x844)", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("R01 - desktop nav links are hidden on mobile", async ({ page }) => {
    const desktopNav = page.locator("header nav");
    await expect(desktopNav).toBeHidden();
  });

  test("R02 - hamburger and cart buttons are visible on mobile", async ({ page }) => {
    await expect(page.locator("button[aria-label='Open menu']")).toBeVisible();
    await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  });

  test("R03 - Sign in link is hidden on mobile", async ({ page }) => {
    const signIn = page.locator("header a").filter({ hasText: "Sign in" });
    await expect(signIn).toBeHidden();
  });
});

test.describe("Mobile Menu (390x844)", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("R04 - hamburger opens slide-in drawer anchored to the right edge", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await page.locator("button[aria-label='Open menu']").click();

    const drawer = page.locator("div.fixed.top-0.right-0.bottom-0");
    await expect(drawer).toBeVisible();

    const box = await drawer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(320);
    expect(box!.x + box!.width).toBeGreaterThan(MOBILE_VIEWPORT.width - 48);

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("R05 - close button dismisses the mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await page.locator("button[aria-label='Open menu']").click();
    const drawer = page.locator("div.fixed.top-0.right-0.bottom-0");
    await expect(drawer).toBeVisible();

    await page.locator("button[aria-label='Close menu']").click();
    await expect(drawer).toBeHidden();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe("hidden");
  });
});

test.describe("Shop Grid Responsive", () => {
  test("R06 - shop grid renders a single column on mobile", async ({ page }) => {
    test.use({ viewport: MOBILE_VIEWPORT });
    await gotoShopWithProducts(page);

    const grid = page
      .locator("#all-products div.grid")
      .filter({ has: page.locator("a[href^='/shop/']") })
      .first();
    await expect(grid).toBeVisible();
    expect(await gridTrackCount(grid)).toBe(1);
  });

  test("R07 - shop grid renders four columns on xl desktop viewport", async ({ page }) => {
    test.use({ viewport: DESKTOP_VIEWPORT });
    await gotoShopWithProducts(page);

    const grid = page
      .locator("#all-products div.grid")
      .filter({ has: page.locator("a[href^='/shop/']") })
      .first();
    await expect(grid).toBeVisible();
    expect(await gridTrackCount(grid)).toBe(4);
  });
});

test.describe("Product Page Responsive", () => {
  async function gotoFirstProduct(page: Page) {
    await gotoShopWithProducts(page);
    await page.locator("#all-products a[href^='/shop/']").first().click();
    await page.locator("main h1").waitFor({ state: "visible", timeout: 15000 });
  }

  test("R08 - product gallery and details stack in one column on mobile", async ({ page }) => {
    test.use({ viewport: MOBILE_VIEWPORT });
    await gotoFirstProduct(page);

    const layout = page.locator("main div.grid").filter({ has: page.locator("h1") }).first();
    await expect(layout).toBeVisible();
    expect(await gridTrackCount(layout)).toBe(1);
  });

  test("R09 - product gallery and details sit side by side on desktop", async ({ page }) => {
    test.use({ viewport: DESKTOP_VIEWPORT });
    await gotoFirstProduct(page);

    const layout = page.locator("main div.grid").filter({ has: page.locator("h1") }).first();
    await expect(layout).toBeVisible();
    expect(await gridTrackCount(layout)).toBe(2);
  });
});

test.describe("Footer Responsive", () => {
  test("R10 - footer stacks content vertically on mobile", async ({ page }) => {
    test.use({ viewport: MOBILE_VIEWPORT });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footerLayout = page.locator("footer > div > div").first();
    await expect(footerLayout).toBeVisible();
    await expect(footerLayout).toHaveCSS("flex-direction", "column");
  });

  test("R11 - footer lays content out in a row on desktop", async ({ page }) => {
    test.use({ viewport: DESKTOP_VIEWPORT });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footerLayout = page.locator("footer > div > div").first();
    await expect(footerLayout).toBeVisible();
    await expect(footerLayout).toHaveCSS("flex-direction", "row");
  });
});

test.describe("About Page Responsive", () => {
  test("R12 - about hero stacks on mobile and sits side by side on desktop", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");

    const heroLayout = page.locator("main div.flex").filter({ has: page.locator("h1") }).first();
    await expect(heroLayout).toBeVisible();

    await page.setViewportSize(MOBILE_VIEWPORT);
    await expect(heroLayout).toHaveCSS("flex-direction", "column");

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await expect(heroLayout).toHaveCSS("flex-direction", "row");
  });
});

test.describe("Contact Page Responsive", () => {
  test("R13 - contact layout stacks on mobile and splits into two columns on desktop", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");

    const layout = page.locator("main div.grid").filter({ has: page.locator("h1") }).first();
    await expect(layout).toBeVisible();

    await page.setViewportSize(MOBILE_VIEWPORT);
    expect(await gridTrackCount(layout)).toBe(1);

    await page.setViewportSize(DESKTOP_VIEWPORT);
    expect(await gridTrackCount(layout)).toBe(2);
  });
});

test.describe("Mobile Hamburger Styling", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("R14 - hamburger icon uses the brand accent color", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const hamburger = page.locator("button[aria-label='Open menu']");
    await expect(hamburger).toBeVisible();

    const color = await hamburger.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(181, 94, 91)");
  });
});

test.describe("Mobile Menu Links", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("R15 - mobile menu exposes primary navigation links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await page.locator("button[aria-label='Open menu']").click();

    const drawer = page.locator("div.fixed.top-0.right-0.bottom-0");
    await expect(drawer).toBeVisible();

    for (const name of ["Home", "Shop", "Stories", "About"]) {
      await expect(drawer.getByRole("link", { name, exact: true })).toBeVisible();
    }
    await expect(drawer.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "FAQ", exact: true })).toBeVisible();
  });
});
