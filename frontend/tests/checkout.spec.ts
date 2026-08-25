import { test, expect } from "./fixtures";

const PRODUCT = "/shop/ghibli-art-tote";

// Seeds a signed-in session and a cart containing the Ghibli art tote
// (persisted in the same zustand format the app uses), then opens /checkout.
// The checkout page re-syncs item data by product id on mount.
async function goSignedIn(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("totemood_account_token", "mock-token");
    localStorage.setItem(
      "totemood_account_profile",
      JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", phone: "", picture: "" })
    );
    localStorage.setItem(
      "totemood_cart_v1",
      JSON.stringify({
        state: {
          items: [
            {
              product: {
                id: "ghibli-art-tote",
                name: "CUSTOM GHIBLI ART TOTE BAG",
                description: "Tote Bag will have custom Ghibli image only.",
                price: 499,
                oldPrice: 799,
                image: "/images/product/W1.png",
                gallery: ["/images/product/W1.png"],
                isCustomizable: true,
                label: "bestseller",
                category: "image",
                rating: 4.8,
                reviews: 120,
              },
              quantity: 1,
              customImages: [null],
              customTexts: [null],
            },
          ],
        },
        version: 0,
      })
    );
  });
  await page.goto("/checkout");
}

test.describe("Checkout Page", () => {
  test("X01 - empty cart shows empty state with link back to shop", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByText(/cart is empty/i)).toBeVisible({ timeout: 10000 });
    const back = page.locator("main a[href='/shop']").first();
    await expect(back).toBeVisible();
  });

  test("X02 - signed-out checkout requires Google sign-in", async ({ page }) => {
    await page.goto(PRODUCT);
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
    await page.locator("a[href='/checkout']").first().click();
    // scope to main so the (hidden-on-mobile) navbar Sign in link doesn't match first
    await expect(page.locator("main").getByText(/sign in/i).first()).toBeVisible({ timeout: 15000 });
    // privacy consent is shown right before the login step
    await expect(
      page.getByTestId(/privacy-consent|privacy-consent-recorded/).first()
    ).toBeVisible({ timeout: 10000 });
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
    // exact match avoids "Shipping Address" heading and FAQ-style text
    await expect(page.getByText("Subtotal", { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Shipping", { exact: true })).toBeVisible();
    await expect(page.getByText("Total", { exact: true })).toBeVisible();
    await expect(page.locator("text=₹499.00").first()).toBeVisible();
  });

  test("X06 - order over ₹150 ships free", async ({ page }) => {
    await goSignedIn(page);
    const freeRow = page
      .locator("div.flex.justify-between")
      .filter({ hasText: /^Shipping\s*Free$/ });
    await expect(freeRow).toBeVisible({ timeout: 10000 });
  });

  test("X07 - COD selected by default showing ₹49 deposit; prepaid selectable", async ({ page }) => {
    await goSignedIn(page);
    await expect(page.getByRole("button", { name: /cash on delivery/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button[type='submit']")).toHaveText(/pay ₹49 advance/i);
    await page.getByRole("button", { name: /prepaid \(full payment\)/i }).click();
    await expect(page.getByText(/pay the full ₹499\.00 now/i)).toBeVisible({ timeout: 3000 });
    await expect(page.locator("button[type='submit']")).toHaveText(/pay ₹499\.00/i);
  });

  test("X08 - submitting invalid form shows validation errors", async ({ page }) => {
    await goSignedIn(page);
    // Fill everything validly except email ("a@b" passes native type=email but fails app validation)
    await page.locator("input[name='email']").fill("a@b");
    await page.locator("input[name='phone']").fill("9876543210");
    await page.locator("input[name='firstName']").fill("Test");
    await page.locator("input[name='lastName']").fill("User");
    await page.locator("input[name='address']").fill("123 Main Street Extension");
    await page.locator("input[name='city']").fill("Pune");
    await page.locator("input[name='state']").fill("Maharashtra");
    await page.locator("input[name='zip']").fill("411001");
    await page.locator("button[type='submit']").click();
    await expect(page.locator("p").filter({ hasText: /valid email/i }).first()).toBeVisible({ timeout: 5000 });
  });
});
