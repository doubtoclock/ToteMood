import { test, expect } from "./fixtures";

test.describe("Privacy Policy", () => {
  test("PV01 - privacy page loads and highlights the photo safety promise", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");
    const highlight = page.getByTestId("photo-safety-highlight");
    await expect(highlight).toBeVisible({ timeout: 10000 });
    await expect(highlight).toContainText(/private and safe/i);
    await expect(highlight).toContainText(/never sent anywhere/i);
    const critical = errors.filter((e) => !/google|favicon/i.test(e));
    expect(critical).toHaveLength(0);
  });

  test("PV02 - policy documents storage locations and third parties", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");
    const main = page.locator("main");
    for (const term of [/localStorage/i, /Supabase/i, /Vercel/i, /Render/i, /Razorpay/i]) {
      await expect(main.getByText(term).first()).toBeVisible({ timeout: 10000 });
    }
    // Deletion option is documented
    await expect(main.getByText(/delete all my data/i).first()).toBeVisible();
  });

  test("PV03 - footer links to the privacy policy", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("footer a[href='/privacy']");
    await expect(link.first()).toBeAttached({ timeout: 10000 });
    await link.first().click();
    await expect(page).toHaveURL(/\/privacy/);
  });
});
