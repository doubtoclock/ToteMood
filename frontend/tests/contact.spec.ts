import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
  });

  test("CT01 - contact page loads successfully", async ({ page }) => {
    await expect(page).toHaveURL(/\/contact/);
  });

  test("CT02 - page title contains Contact or Totemood", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact|Totemood/i);
  });

  // ── Contact Info Section ───────────────────────────────────────────
  test("CT03 - 'WE'D LOVE TO HEAR FROM YOU' label is visible", async ({ page }) => {
    const label = page.locator("text=WE'D LOVE TO HEAR FROM YOU");
    await expect(label).toBeVisible();
  });

  test("CT04 - 'Get in Touch' heading is visible", async ({ page }) => {
    const heading = page.locator("h1").filter({ hasText: "Get in Touch" });
    await expect(heading).toBeVisible();
  });

  test("CT05 - WhatsApp contact card is visible", async ({ page }) => {
    const card = page.locator("text=WhatsApp").first();
    await expect(card).toBeVisible();
  });

  test("CT06 - WhatsApp phone number is clickable", async ({ page }) => {
    const phone = page.locator("a").filter({ hasText: "+91 98908 42755" }).first();
    await expect(phone).toBeVisible();
    const href = await phone.getAttribute("href");
    expect(href).toContain("wa.me/919890842755");
  });

  test("CT07 - WhatsApp link opens in new tab", async ({ page }) => {
    const phone = page.locator("a").filter({ hasText: "+91 98908 42755" }).first();
    const target = await phone.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("CT08 - Email contact card is visible", async ({ page }) => {
    const card = page.locator("text=Email").first();
    await expect(card).toBeVisible();
  });

  test("CT09 - email address is clickable mailto link", async ({ page }) => {
    const email = page.locator("a[href='mailto:totemood21@gmail.com']");
    await expect(email).toBeVisible();
  });

  test("CT10 - Instagram contact card is visible", async ({ page }) => {
    const card = page.locator("text=@totemood_gifts").first();
    await expect(card).toBeVisible();
  });

  test("CT11 - Instagram link opens in new tab", async ({ page }) => {
    const ig = page.locator("a").filter({ hasText: "@totemood_gifts" }).first();
    const target = await ig.getAttribute("target");
    expect(target).toBe("_blank");
  });

  // ── Contact Form ───────────────────────────────────────────────────
  test("CT12 - 'Send a Message' form heading is visible", async ({ page }) => {
    const heading = page.locator("h2").filter({ hasText: "Send a Message" });
    await expect(heading).toBeVisible();
  });

  test("CT13 - first name input field exists", async ({ page }) => {
    const input = page.locator("#firstName, input[placeholder='Jane']");
    await expect(input.first()).toBeVisible();
  });

  test("CT14 - last name input field exists", async ({ page }) => {
    const input = page.locator("#lastName, input[placeholder='Doe']");
    await expect(input.first()).toBeVisible();
  });

  test("CT15 - email input field exists", async ({ page }) => {
    const input = page.locator("#email, input[placeholder*='example']");
    await expect(input.first()).toBeVisible();
  });

  test("CT16 - subject dropdown has all options", async ({ page }) => {
    const options = ["Order Inquiry", "Customisation", "Shipping", "Product Question", "Collaboration", "Other"];
    for (const opt of options) {
      const option = page.locator("option").filter({ hasText: opt });
      await expect(option).toBeAttached();
    }
  });

  test("CT17 - message textarea exists", async ({ page }) => {
    const textarea = page.locator("#message, textarea");
    await expect(textarea.first()).toBeVisible();
  });

  test("CT18 - 'Send message' button is visible", async ({ page }) => {
    const btn = page.locator("button").filter({ hasText: /Send message/ }).first();
    await expect(btn).toBeVisible();
  });

  test("CT19 - form has 'We usually reply within 1 business day' text", async ({ page }) => {
    const text = page.locator("text=/usually reply within/i");
    await expect(text).toBeVisible();
  });

  test("CT20 - contact page has Mumbai location text", async ({ page }) => {
    const text = page.locator("text=/Mumbai, India/i").first();
    await expect(text).toBeVisible();
  });
});
