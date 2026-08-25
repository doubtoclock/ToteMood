import { test, expect } from "./fixtures";

test.describe("Contact Page", () => {
  // absorb slow page loads when running alongside other specs
  test.setTimeout(60_000);

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
    await expect(wa).toHaveAttribute("href", /wa\.me/);
    const mail = page.locator("a[href^='mailto:']").first();
    await expect(mail).toBeVisible();
  });

  test("CT03 - message form has all required fields with labels", async ({ page }) => {
    for (const id of ["firstName", "lastName", "subject", "message"]) {
      await expect(page.locator(`label[for='${id}']`).first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator(`#${id}`).first()).toBeVisible();
    }
  });

  test("CT04 - subject dropdown offers expected options", async ({ page }) => {
    const select = page.locator("select").first();
    await expect(select).toBeVisible({ timeout: 10000 });
    const options = await select.locator("option").allTextContents();
    expect(options.length).toBeGreaterThanOrEqual(3);
  });

  test("CT05 - generate WhatsApp link button with helper note", async ({ page }) => {
    const gen = page.getByRole("button", { name: /generate whatsapp link/i }).first();
    await expect(gen).toBeVisible({ timeout: 10000 });
    // Disabled until some content is entered
    await expect(gen).toBeDisabled();
    await page.locator("#firstName").fill("Jane");
    await expect(gen).toBeEnabled();
    await gen.click();
    await expect(page.getByRole("button", { name: /open whatsapp/i })).toBeVisible({ timeout: 5000 });
  });
});
