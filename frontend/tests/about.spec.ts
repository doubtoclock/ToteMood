import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
  });

  test("AB01 - about page loads successfully", async ({ page }) => {
    await expect(page).toHaveURL(/\/about/);
  });

  test("AB02 - page title contains About or Totemood", async ({ page }) => {
    await expect(page).toHaveTitle(/About|Totemood/i);
  });

  // ── Founder Section ────────────────────────────────────────────────
  test("AB03 - 'BUILDING TOTEMOOD' label is visible", async ({ page }) => {
    const label = page.locator("text=BUILDING TOTEMOOD");
    await expect(label).toBeVisible();
  });

  test("AB04 - founder name 'Siya Maurya' heading is visible", async ({ page }) => {
    const name = page.locator("h1").filter({ hasText: "Siya Maurya" });
    await expect(name).toBeVisible();
  });

  test("AB05 - 'BUILDING TOTEMOOD' label has red color", async ({ page }) => {
    const label = page.locator("text=BUILDING TOTEMOOD");
    const classes = await label.getAttribute("class");
    expect(classes).toContain("C25858");
  });

  test("AB06 - founder name uses font-title", async ({ page }) => {
    const name = page.locator("h1").filter({ hasText: "Siya Maurya" });
    const classes = await name.getAttribute("class");
    expect(classes).toContain("font-title");
  });

  // ── Vision Content ─────────────────────────────────────────────────
  test("AB07 - 'My Vision' subheading is visible", async ({ page }) => {
    const vision = page.locator("h2").filter({ hasText: "My Vision" });
    await expect(vision).toBeVisible();
  });

  test("AB08 - vision mentions personalised gifting", async ({ page }) => {
    const text = page.locator("text=/personalised gifting|personalised/i").first();
    await expect(text).toBeVisible();
  });

  test("AB09 - vision has descriptive paragraphs", async ({ page }) => {
    const paragraphs = page.locator("p").filter({ hasText: /love|warmth|connection/i });
    const count = await paragraphs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // ── Images ─────────────────────────────────────────────────────────
  test("AB10 - founder photo (siya.png) is displayed", async ({ page }) => {
    const img = page.locator("img[alt*='Siya'], img[src*='siya']").first();
    await expect(img).toBeVisible();
  });

  test("AB11 - founder photo caption is visible", async ({ page }) => {
    const caption = page.locator("text=The person behind Totemood");
    await expect(caption).toBeVisible();
  });

  // ── Why Totemood Section ───────────────────────────────────────────
  test("AB12 - 'Why Totemood Exists' section heading is visible", async ({ page }) => {
    const heading = page.locator("h2").filter({ hasText: "Why Totemood Exists" });
    await expect(heading).toBeVisible();
  });

  test("AB13 - Why Totemood section has descriptive text", async ({ page }) => {
    const text = page.locator("text=/transaction|generic|meaningful/i").first();
    await expect(text).toBeVisible();
  });

  // ── How It Started Section ─────────────────────────────────────────
  test("AB14 - 'How It Started' section heading is visible", async ({ page }) => {
    const heading = page.locator("h2").filter({ hasText: "How It Started" });
    await expect(heading).toBeVisible();
  });

  test("AB15 - How It Started section has origin story text", async ({ page }) => {
    const text = page.locator("text=/simple desire|hand|desk|passion/i").first();
    await expect(text).toBeVisible();
  });

  // ── CTA Section ────────────────────────────────────────────────────
  test("AB16 - CTA heading 'Check out our bestsellers.' is visible", async ({ page }) => {
    const cta = page.locator("text=Check out our bestsellers.");
    await expect(cta).toBeVisible();
  });

  test("AB17 - CTA has 'Shop our collection' button", async ({ page }) => {
    const btn = page.locator("a").filter({ hasText: /Shop our collection/ }).first();
    await expect(btn).toBeVisible();
  });

  test("AB18 - CTA button links to /shop", async ({ page }) => {
    const btn = page.locator("a").filter({ hasText: /Shop our collection/ }).first();
    const href = await btn.getAttribute("href");
    expect(href).toBe("/shop");
  });

  test("AB19 - CTA button has dark background", async ({ page }) => {
    const btn = page.locator("a").filter({ hasText: /Shop our collection/ }).first();
    const classes = await btn.getAttribute("class");
    expect(classes).toContain("bg-");
  });

  test("AB20 - clicking CTA navigates to shop", async ({ page }) => {
    await page.locator("a").filter({ hasText: /Shop our collection/ }).first().click();
    await expect(page).toHaveURL(/\/shop/);
  });
});
