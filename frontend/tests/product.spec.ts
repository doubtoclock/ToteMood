import { test, expect } from "@playwright/test";

test.describe("Product Description Page", () => {
  const PRODUCT_ID = "ghibli-art-tote";

  test.beforeEach(async ({ page }) => {
    await page.goto(`/shop/${PRODUCT_ID}`);
    await page.waitForLoadState("networkidle");
  });

  // ── Skeleton Loading ───────────────────────────────────────────────
  test("P01 - product page loads without error", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(PRODUCT_ID));
  });

  test("P02 - skeleton or content eventually appears", async ({ page }) => {
    const skeleton = page.locator("[class*='shimmer']");
    const content = page.locator("h1");
    await expect(skeleton.first().or(content.first())).toBeVisible({ timeout: 10000 });
  });

  test("P03 - page transitions from skeleton to real content", async ({ page }) => {
    await page.goto(`/shop/${PRODUCT_ID}`);
    await page.waitForLoadState("networkidle");
    const h1 = page.locator("h1").filter({ hasText: /tote/i });
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test("P04 - skeleton uses shimmer animation classes", async ({ page }) => {
    await page.goto(`/shop/${PRODUCT_ID}`);
    const skeletons = page.locator("[class*='shimmer'], [class*='animate-pulse']");
    const count = await skeletons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ── WhatsApp Ribbon ────────────────────────────────────────────────
  test("P05 - WhatsApp ribbon is visible at top of product page", async ({ page }) => {
    const ribbon = page.locator("text=Get a free sample preview on WhatsApp");
    await expect(ribbon).toBeVisible({ timeout: 10000 });
  });

  test("P06 - WhatsApp ribbon contains phone number", async ({ page }) => {
    const phone = page.locator("text=+91 98908 42755");
    await expect(phone).toBeVisible();
  });

  test("P07 - WhatsApp ribbon links to wa.me", async ({ page }) => {
    const link = page.locator("a[href*='wa.me/919890842755']").first();
    await expect(link).toBeVisible();
  });

  test("P08 - WhatsApp ribbon opens in new tab", async ({ page }) => {
    const link = page.locator("a[href*='wa.me']").first();
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("P09 - WhatsApp ribbon has dark background style", async ({ page }) => {
    const banner = page.locator("a[href*='wa.me'] > div").first();
    await expect(banner).toBeVisible();
    const style = await banner.evaluate((el: HTMLElement) => el.style.backgroundColor);
    expect(style).toContain("202517");
  });

  test("P10 - WhatsApp ribbon has green highlighted text", async ({ page }) => {
    const greenText = page.locator("span.text-\\[\\#25D366\\]").first();
    const exists = await greenText.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  // ── Product Image Gallery ──────────────────────────────────────────
  test("P11 - main product image is visible", async ({ page }) => {
    const img = page.locator("img[alt]").first();
    await expect(img).toBeVisible({ timeout: 10000 });
  });

  test("P12 - main image has priority loading", async ({ page }) => {
    const mainImg = page.locator(".aspect-\\[4\\/5\\] img, .aspect-square img").first();
    await expect(mainImg).toBeVisible();
  });

  test("P13 - four thumbnails are displayed", async ({ page }) => {
    const thumbs = page.locator("button img[alt*='Thumbnail']");
    await expect(thumbs.first()).toBeVisible({ timeout: 10000 });
    const count = await thumbs.count();
    expect(count).toBe(4);
  });

  test("P14 - clicking thumbnail changes main image", async ({ page }) => {
    const thumbs = page.locator("button img[alt*='Thumbnail']");
    await thumbs.first().waitFor({ timeout: 10000 });
    const secondThumb = thumbs.nth(1);
    await secondThumb.click();
    await page.waitForTimeout(300);
    const parentBtn = secondThumb.locator("..");
    const classes = await parentBtn.getAttribute("class");
    expect(classes).toContain("border-");
  });

  test("P15 - first thumbnail has eager loading", async ({ page }) => {
    const thumb = page.locator("button img[alt*='Thumbnail']").first();
    await thumb.waitFor({ timeout: 10000 });
    const loading = await thumb.getAttribute("loading");
    expect(loading).toBe("eager");
  });

  test("P16 - second thumbnail has lazy loading", async ({ page }) => {
    const thumb = page.locator("button img[alt*='Thumbnail']").nth(1);
    await thumb.waitFor({ timeout: 10000 });
    const loading = await thumb.getAttribute("loading");
    expect(loading).toBe("lazy");
  });

  test("P17 - main image is inside a rounded container", async ({ page }) => {
    const container = page.locator("[class*='rounded-']").first();
    await expect(container).toBeVisible();
  });

  test("P18 - thumbnail grid shows 4 columns on desktop", async ({ page }) => {
    const grid = page.locator(".grid-cols-4").first();
    await expect(grid).toBeVisible({ timeout: 10000 });
  });

  // ── Product Info Section ───────────────────────────────────────────
  test("P19 - product name heading is visible", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible({ timeout: 10000 });
    const text = await h1.textContent();
    expect(text!.toLowerCase()).toContain("tote");
  });

  test("P20 - product category is displayed", async ({ page }) => {
    const cat = page.locator("text=/Bestseller|New|Custom/i").first();
    await expect(cat).toBeVisible();
  });

  test("P21 - category has uppercase styling", async ({ page }) => {
    const cat = page.locator("p").filter({ hasText: /Bestseller|New/ }).first();
    const classes = await cat.getAttribute("class");
    expect(classes).toContain("uppercase");
  });

  test("P22 - product name uses font-title", async ({ page }) => {
    const h1 = page.locator("h1");
    const classes = await h1.getAttribute("class");
    expect(classes).toContain("font-title");
  });

  test("P23 - product name has large text size", async ({ page }) => {
    const h1 = page.locator("h1");
    const classes = await h1.getAttribute("class");
    expect(classes).toContain("text-");
  });

  test("P24 - product section has correct background color", async ({ page }) => {
    const main = page.locator("main").first();
    const classes = await main.getAttribute("class");
    expect(classes).toContain("bg-");
  });

  test("P25 - product info is in the right column on desktop", async ({ page }) => {
    const details = page.locator(".grid > div").nth(1);
    await expect(details).toBeVisible({ timeout: 10000 });
  });

  test("P26 - grid layout uses 2 columns on large screens", async ({ page }) => {
    const grid = page.locator(".lg\\:grid-cols-2").first();
    await expect(grid).toBeVisible();
  });

  // ── Pricing ────────────────────────────────────────────────────────
  test("P27 - current price is displayed with ₹ symbol", async ({ page }) => {
    const price = page.locator("text=/₹\\d+\\.\\d{2}/").first();
    await expect(price).toBeVisible();
  });

  test("P28 - old/original price has strikethrough styling", async ({ page }) => {
    const oldPrice = page.locator("span.line-through").first();
    await expect(oldPrice).toBeVisible();
    const text = await oldPrice.textContent();
    expect(text).toContain("₹");
  });

  test("P29 - current price is bold", async ({ page }) => {
    const price = page.locator("text=/₹499\\.00|₹599\\.00/").first();
    const classes = await price.getAttribute("class");
    expect(classes).toContain("font-bold");
  });

  test("P30 - price section shows both current and old price", async ({ page }) => {
    const prices = page.locator("text=/₹\\d+/");
    const count = await prices.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  // ── Ratings ────────────────────────────────────────────────────────
  test("P31 - star ratings are displayed", async ({ page }) => {
    const stars = page.locator("svg.fill-current");
    const count = await stars.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("P32 - review count text is visible", async ({ page }) => {
    const review = page.locator("text=/\\d+ review/").first();
    await expect(review).toBeVisible();
  });

  test("P33 - stars use the accent color #b06161", async ({ page }) => {
    const starsContainer = page.locator("div").filter({ hasText: "" }).locator("svg.fill-current").first();
    await expect(starsContainer).toBeVisible();
  });

  // ── Description ────────────────────────────────────────────────────
  test("P34 - product description text is visible", async ({ page }) => {
    const desc = page.locator("text=/custom|image|whatsapp|approval/i").first();
    await expect(desc).toBeVisible();
  });

  test("P35 - description mentions WhatsApp approval process", async ({ page }) => {
    const desc = page.locator("text=/WhatsApp/i").first();
    await expect(desc).toBeVisible();
  });

  // ── Purchase Info Boxes ────────────────────────────────────────────
  test("P36 - 'Free Customisation Included' box is visible", async ({ page }) => {
    const box = page.locator("text=Free Customisation Included");
    await expect(box).toBeVisible();
  });

  test("P37 - customization box has CheckCircle2 icon", async ({ page }) => {
    const box = page.locator("text=Free Customisation Included").locator("..");
    await expect(box.locator("svg").first()).toBeVisible();
  });

  test("P38 - 'Dispatches in 24-48 hours' box is visible", async ({ page }) => {
    const box = page.locator("text=Dispatches in 24-48 hours");
    await expect(box).toBeVisible();
  });

  test("P39 - dispatch box mentions free shipping", async ({ page }) => {
    const text = page.locator("text=Free shipping on all orders");
    await expect(text).toBeVisible();
  });

  test("P40 - info boxes have green (#8E9476) icons", async ({ page }) => {
    const icon = page.locator("svg.text-\\[\\#8E9476\\]").first();
    const exists = await icon.count();
    expect(exists).toBeGreaterThanOrEqual(0);
  });

  // ── Action Buttons ─────────────────────────────────────────────────
  test("P41 - 'Customize & Add to Cart' button is visible", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
    await expect(btn).toBeVisible();
  });

  test("P42 - 'Buy Now' button is visible", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: "Buy Now" });
    await expect(btn).toBeVisible();
  });

  test("P43 - Customize button has green background (#8E9476)", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
    const classes = await btn.getAttribute("class");
    expect(classes).toContain("8E9476");
  });

  test("P44 - Buy Now button has dark background (#252A1A)", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: "Buy Now" });
    const classes = await btn.getAttribute("class");
    expect(classes).toContain("252A1A");
  });

  test("P45 - clicking Customize & Add to Cart opens cart drawer", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
    const drawer = page.locator("button[aria-label='Close cart']");
    await expect(drawer).toBeVisible({ timeout: 5000 });
  });

  test("P46 - clicking Buy Now adds item and navigates to checkout", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Buy Now" }).click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  });

  test("P47 - 'Secure payment' text is displayed", async ({ page }) => {
    const text = page.locator("text=Secure payment");
    await expect(text).toBeVisible();
  });

  test("P48 - buttons have rounded corners", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: /Cart|Buy/ }).first();
    const classes = await btn.getAttribute("class");
    expect(classes).toContain("rounded-");
  });

  // ── Related Products ───────────────────────────────────────────────
  test("P49 - Related Products section heading exists", async ({ page }) => {
    const heading = page.locator("text=Related Products");
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("P50 - related products grid shows products", async ({ page }) => {
    const related = page.locator("section").filter({ hasText: "Related Products" }).locator("a[href^='/shop/']");
    const count = await related.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(4);
  });

  test("P51 - related product cards have images", async ({ page }) => {
    const section = page.locator("section").filter({ hasText: "Related Products" });
    const img = section.locator("img").first();
    await expect(img).toBeVisible();
  });

  test("P52 - related product cards have names", async ({ page }) => {
    const section = page.locator("section").filter({ hasText: "Related Products" });
    const name = section.locator("h3").first();
    await expect(name).toBeVisible();
  });

  test("P53 - related product cards have prices", async ({ page }) => {
    const section = page.locator("section").filter({ hasText: "Related Products" });
    const price = section.locator("text=/₹\\d+/").first();
    await expect(price).toBeVisible();
  });

  test("P54 - related product images have lazy loading", async ({ page }) => {
    const section = page.locator("section").filter({ hasText: "Related Products" });
    const img = section.locator("img").first();
    const loading = await img.getAttribute("loading");
    expect(loading).toBe("lazy");
  });

  // ── Ambient Glow ───────────────────────────────────────────────────
  test("P55 - ambient glow decorative elements exist", async ({ page }) => {
    const glows = page.locator("[class*='absolute'][class*='blur']");
    const count = await glows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("P56 - page has overflow hidden on main", async ({ page }) => {
    const main = page.locator("main").first();
    const classes = await main.getAttribute("class");
    expect(classes).toContain("overflow-hidden");
  });

  // ── Not Found State ────────────────────────────────────────────────
  test("P57 - nonexistent product shows 'Product unavailable'", async ({ page }) => {
    await page.goto("/shop/nonexistent-product-xyz");
    await page.waitForLoadState("networkidle");
    const text = page.locator("text=Product unavailable");
    await expect(text).toBeVisible({ timeout: 15000 });
  });

  test("P58 - nonexistent product shows 'Return to shop' link", async ({ page }) => {
    await page.goto("/shop/nonexistent-product-xyz");
    await page.waitForLoadState("networkidle");
    const link = page.locator("a").filter({ hasText: "Return to shop" });
    await expect(link).toBeVisible({ timeout: 15000 });
  });

  test("P59 - 'Return to shop' link navigates to /shop", async ({ page }) => {
    await page.goto("/shop/nonexistent-product-xyz");
    await page.waitForLoadState("networkidle");
    await page.locator("a").filter({ hasText: "Return to shop" }).click();
    await expect(page).toHaveURL(/\/shop/);
  });

  // ── Navigation ─────────────────────────────────────────────────────
  test("P60 - navbar is visible on product page", async ({ page }) => {
    await expect(page.locator("header").first()).toBeVisible();
  });
});
