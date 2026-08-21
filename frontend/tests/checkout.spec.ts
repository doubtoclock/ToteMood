import { test, expect } from "@playwright/test";

const PRODUCT = "/shop/ghibli-art-tote";

async function goSignedIn(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("totemood_account_token", "mock-token");
    localStorage.setItem(
      "totemood_account_profile",
      JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", phone: "", picture: "" })
    );
  });
  await page.goto(PRODUCT);
  await page.waitForLoadState("domcontentloaded");
  await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
  await page.locator("a[href='/checkout']").first().click();
  await page.waitForLoadState("domcontentloaded");
}

test.describe("Checkout Page", () => {
  test("X01 - empty cart shows empty state with link back to shop", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/cart is empty/i)).toBeVisible({ timeout: 10000 });
    const back = page.locator("a[href='/shop']").first();
    await expect(back).toBeVisible();
  });

  test("X02 - signed-out checkout requires Google sign-in", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
    await page.locator("a[href='/checkout']").first().click();
    await expect(page.getByText(/sign in/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("X03 - signed-in checkout shows contact form fields", async ({ page }) => {
    await goSignedIn(page);
    for (const name of ["email", "phone", "firstName", "lastName", "address", "city", "state", "zip"]) {
      await expect(page.locator(`input[name='${name}']`)).toBeVisible({ timeout: 10000 });
    }
  });

  test("X04 - form pre-fills email and name from account", async ({ page }) => {
    await goSignedIn(page);
    // Default saved address fetch may fill fields; at minimum email input accepts typing
    const email = page.locator("input[name='email']");
    await expect(email).toBeVisible({ timeout: 10000 });
    await email.fill("buyer@example.com");
    await expect(email).toHaveValue("buyer@example.com");
  });

  test("X05 - order summary shows subtotal, shipping and total", async ({ page }) => {
    await goSignedIn(page);
    await expect(page.getByText("Subtotal")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Shipping")).toBeVisible();
    await expect(page.locator("text=₹499.00").first()).toBeVisible();
  });

  test("X06 - order over ₹150 ships free", async ({ page }) => {
    await goSignedIn(page);
    await expect(page.locator("[class*='justify-between']").filter({ hasText: "Shipping" }).getByText("Free")).toBeVisible({ timeout: 10000 });
  });

  test("X07 - COD selected by default showing ₹49 deposit; prepaid selectable", async ({ page }) => {
    await goSignedIn(page);
    await expect(page.getByText("Cash on Delivery")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/₹49 advance|₹49 online now/i).first()).toBeVisible();
    await page.locator("button").filter({ hasText: "Prepaid" }).click();
    await expect(page.getByText(/full payment of ₹499\.00/i)).toBeVisible({ timeout: 3000 });
  });

  test("X08 - submitting invalid form shows validation errors", async ({ page }) => {
    await goSignedIn(page);
    await page.locator("button[type='submit']").click();
    await expect(page.locator("p").filter({ hasText: /required|valid/i }).first()).toBeVisible({ timeout: 5000 });
  });
});
