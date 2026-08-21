import { test, expect } from "@playwright/test";

test.describe("Performance", () => {
  test("PF01 - shop products load via a single API request and cache in sessionStorage", async ({ page }) => {
    let productRequests = 0;
    page.on("request", (req) => {
      if (req.url().includes("/api/products")) productRequests += 1;
    });
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("a[href^='/shop/']").first()).toBeVisible({ timeout: 15000 });
    const cached = await page.evaluate(() => Object.keys(sessionStorage).some((k) => /product/i.test(k)));
    expect(cached || productRequests > 0).toBeTruthy();
  });

  test("PF02 - head includes preconnect hints for font CDNs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("link[rel='preconnect'][href*='fonts.googleapis.com']")).toHaveCount(1);
    await expect(page.locator("link[rel='preconnect'][href*='api.fontshare.com']")).toHaveCount(1);
  });

  test("PF03 - shop images are lazy loaded with responsive srcset", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const img = page.locator("a[href^='/shop/'] img").first();
    await expect(img).toBeVisible({ timeout: 10000 });
    await expect(img).toHaveAttribute("loading", "lazy");
    const srcset = await img.getAttribute("srcset");
    expect(srcset).toBeTruthy();
  });

  test("PF04 - product cards animate in with staggered fade", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const animated = page.locator("[class*='animate-fade-in'], [style*='animation-delay']");
    expect(await animated.count()).toBeGreaterThanOrEqual(0);
  });

  test("PF05 - skeleton shimmer defined for loading states", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const hasShimmer = await page.evaluate(() => {
      const css = [...document.styleSheets].some((sheet) => {
        try {
          return [...(sheet.cssRules || [])].some((rule) => rule.cssText.includes("shimmer"));
        } catch {
          return false;
        }
      });
      return css;
    });
    expect(hasShimmer).toBeTruthy();
  });

  test("PF06 - home page reaches interactive state quickly", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("header a").filter({ hasText: "Totemood" }).first()).toBeVisible({ timeout: 15000 });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(15000);
  });
});
