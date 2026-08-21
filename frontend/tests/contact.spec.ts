import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
  });

  test("CT01 - loads with get-in-touch heading and main area", async ({ page }) => {
    await expect(page).toHaveTitle(/Totemood|Contact/i);
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.getByText(/get in touch|hear from you/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("CT02 - WhatsApp and email contact cards are clickable links", async ({ page }) => {
    const wa = page.locator("a[href*='wa.me']").first();
    await expect(wa).toBeVisible({ timeout: 10000 });
    await expect(wa).toHaveAttribute("target", "_blank");
    const mail = page.locator("a[href^='mailto:']").first();
    await expect(mail).toBeVisible();
  });

  test("CT03 - message form has all required fields with labels", async ({ page }) => {
    const inputs = page.locator("main input, main textarea");
    expect(await inputs.count()).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < (await inputs.count()); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      if (!id) continue;
      await expect(page.locator(`label[for='${id}']`).first()).toBeVisible();
    }
  });

  test("CT04 - subject dropdown offers expected options", async ({ page }) => {
    const select = page.locator("select").first();
    await expect(select).toBeVisible({ timeout: 10000 });
    const options = await select.locator("option").allTextContents();
    expect(options.length).toBeGreaterThanOrEqual(3);
  });

  test("CT05 - send message button visible with reply-time note", async ({ page }) => {
    await expect(page.locator("button").filter({ hasText: /send/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/reply within/i).first()).toBeVisible();
  });
});
