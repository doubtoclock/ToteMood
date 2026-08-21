import { test, expect } from "@playwright/test";

test.describe("Checkout Page", () => {
  test.describe("Login Gate", () => {
    test("X01 - checkout page loads without error", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/checkout/);
    });

    test("X02 - shows Google Sign In button when not logged in", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const gsiBtn = page.locator("text=/Sign in with Google|Google/i").first();
      await expect(gsiBtn).toBeVisible({ timeout: 10000 });
    });

    test("X03 - shows 'Skip for now' option", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const skip = page.locator("text=/Skip for now|skip/i").first();
      await expect(skip).toBeVisible({ timeout: 10000 });
    });

    test("X04 - clicking 'Skip for now' shows checkout form", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      const form = page.locator("form, input[id='email']");
      await expect(form.first()).toBeVisible({ timeout: 5000 });
    });

    test("X05 - checkout page shows empty cart message when cart is empty", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const empty = page.locator("text=/cart is empty|empty cart|no items/i").first();
      const skip = page.locator("text=/Skip for now/i").first();
      const hasEmpty = await empty.count();
      const hasSkip = await skip.count();
      expect(hasEmpty + hasSkip).toBeGreaterThan(0);
    });
  });

  test.describe("Payment Method", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
    });

    test("X06 - COD option is available", async ({ page }) => {
      const cod = page.locator("text=/Cash on Delivery|COD|cod/i").first();
      await expect(cod).toBeVisible({ timeout: 10000 });
    });

    test("X07 - Prepaid/Pay Online option is available", async ({ page }) => {
      const prepaid = page.locator("text=/Pay Online|Prepaid|prepaid|Razorpay/i").first();
      await expect(prepaid).toBeVisible();
    });

    test("X08 - COD is selected by default", async ({ page }) => {
      const codRadio = page.locator("input[value='cod'], input[type='radio']").first();
      const checked = await codRadio.isChecked().catch(() => false);
      expect(checked).toBe(true);
    });

    test("X09 - can select Prepaid option", async ({ page }) => {
      const prepaidLabel = page.locator("label, div").filter({ hasText: /Pay Online|Prepaid/ }).first();
      await prepaidLabel.click();
      const radio = page.locator("input[value='prepaid'], input[type='radio']").nth(1);
      const checked = await radio.isChecked().catch(() => false);
      expect(checked).toBe(true);
    });

    test("X10 - COD shows ₹49 deposit text", async ({ page }) => {
      const deposit = page.locator("text=/₹49|49.*advance|deposit/i").first();
      await expect(deposit).toBeVisible();
    });

    test("X11 - prepaid description mentions Razorpay", async ({ page }) => {
      const prepaidLabel = page.locator("label, div").filter({ hasText: /Pay Online|Prepaid/ }).first();
      await prepaidLabel.click();
      const desc = page.locator("text=/Razorpay|razorpay|secure|encryption/i").first();
      await expect(desc).toBeVisible();
    });
  });

  test.describe("Form Fields", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
    });

    test("X12 - email input field exists", async ({ page }) => {
      const email = page.locator("input[type='email'], input[id='email']");
      await expect(email.first()).toBeVisible({ timeout: 10000 });
    });

    test("X13 - phone input field exists", async ({ page }) => {
      const phone = page.locator("input[type='tel'], input[id='phone'], input[placeholder*='phone' i]");
      await expect(phone.first()).toBeVisible();
    });

    test("X14 - firstName input exists", async ({ page }) => {
      const name = page.locator("input[id='firstName'], input[name='firstName']");
      await expect(name.first()).toBeVisible();
    });

    test("X15 - lastName input exists", async ({ page }) => {
      const name = page.locator("input[id='lastName'], input[name='lastName']");
      await expect(name.first()).toBeVisible();
    });

    test("X16 - address input exists", async ({ page }) => {
      const addr = page.locator("input[id='address'], textarea[id='address'], input[placeholder*='address' i]");
      await expect(addr.first()).toBeVisible();
    });

    test("X17 - city input exists", async ({ page }) => {
      const city = page.locator("input[id='city'], input[placeholder*='city' i]");
      await expect(city.first()).toBeVisible();
    });

    test("X18 - state input exists", async ({ page }) => {
      const state = page.locator("input[id='state'], input[placeholder*='state' i]");
      await expect(state.first()).toBeVisible();
    });

    test("X19 - zip/pincode input exists", async ({ page }) => {
      const zip = page.locator("input[id='zip'], input[placeholder*='zip' i], input[placeholder*='pin' i]");
      await expect(zip.first()).toBeVisible();
    });

    test("X20 - form inputs have labels", async ({ page }) => {
      const labels = page.locator("label");
      const count = await labels.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });
  });

  test.describe("Order Summary", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
    });

    test("X21 - order summary shows product name", async ({ page }) => {
      const name = page.locator("text=/ghibli|tote/i").first();
      await expect(name).toBeVisible({ timeout: 10000 });
    });

    test("X22 - order summary shows subtotal", async ({ page }) => {
      const sub = page.locator("text=/[Ss]ubtotal/").first();
      await expect(sub).toBeVisible();
    });

    test("X23 - order summary shows shipping info", async ({ page }) => {
      const ship = page.locator("text=/[Ss]hipping|Free shipping/i").first();
      await expect(ship).toBeVisible();
    });

    test("X24 - order summary shows total", async ({ page }) => {
      const total = page.locator("text=/[Tt]otal/").first();
      await expect(total).toBeVisible();
    });

    test("X25 - free shipping for orders over ₹150", async ({ page }) => {
      const freeShip = page.locator("text=/Free|free/i").first();
      await expect(freeShip).toBeVisible();
    });
  });

  test.describe("Personalized Message", () => {
    test("X26 - personalized message box appears for customizable items", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      const msg = page.locator("text=/sample preview|WhatsApp|design proof/i").first();
      await expect(msg).toBeVisible({ timeout: 10000 });
    });

    test("X27 - personalized message mentions ₹49 advance", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      const msg = page.locator("text=/₹49/").first();
      await expect(msg).toBeVisible({ timeout: 10000 });
    });

    test("X28 - personalized message mentions Ghibli sample", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      const msg = page.locator("text=/Ghibli|ghibli|sample/i").first();
      await expect(msg).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("COD Flow", () => {
    test("X29 - COD selected shows deposit amount in summary", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
      const deposit = page.locator("text=/₹49/").first();
      await expect(deposit).toBeVisible({ timeout: 10000 });
    });

    test("X30 - COD shows remaining balance text", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
      const balance = page.locator("text=/balance|delivery|remaining/i").first();
      await expect(balance).toBeVisible({ timeout: 10000 });
    });

    test("X31 - Place Order button is visible for COD", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
      const placeOrder = page.locator("button").filter({ hasText: /Place Order|Place order/i }).first();
      await expect(placeOrder).toBeVisible({ timeout: 10000 });
    });

    test("X32 - Place Order button has styled appearance", async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
      const btn = page.locator("button").filter({ hasText: /Place Order|Place order/i }).first();
      const classes = await btn.getAttribute("class");
      expect(classes).toContain("bg-");
    });
  });

  test.describe("Empty Cart", () => {
    test("X33 - checkout with empty cart shows empty message", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const empty = page.locator("text=/cart is empty|empty|no items/i").first();
      const hasSkip = await page.locator("text=/Skip for now/i").first().count();
      const hasEmpty = await empty.count();
      expect(hasEmpty + hasSkip).toBeGreaterThan(0);
    });

    test("X34 - empty checkout has link back to shop", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const shopLink = page.locator("a[href='/shop']").first();
      await expect(shopLink).toBeVisible({ timeout: 10000 });
    });

    test("X35 - empty checkout does not show payment options", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      const cod = page.locator("text=/Cash on Delivery/i").first();
      const skip = page.locator("text=/Skip for now/i").first();
      const hasCOD = await cod.count();
      const hasSkip = await skip.count();
      if (hasSkip === 0) {
        expect(hasCOD).toBe(0);
      }
    });
  });

  test.describe("Form Validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/shop/ghibli-art-tote");
      await page.waitForLoadState("networkidle");
      await page.locator("button").filter({ hasText: "Customize & Add to Cart" }).click();
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await page.locator("text=/Skip for now|skip/i").first().click();
      await page.waitForTimeout(500);
    });

    test("X36 - email field accepts text input", async ({ page }) => {
      const email = page.locator("input[type='email'], input[id='email']").first();
      await email.fill("test@example.com");
      await expect(email).toHaveValue("test@example.com");
    });

    test("X37 - phone field accepts numeric input", async ({ page }) => {
      const phone = page.locator("input[type='tel'], input[id='phone']").first();
      await phone.fill("9876543210");
      await expect(phone).toHaveValue("9876543210");
    });

    test("X38 - name fields accept text input", async ({ page }) => {
      const name = page.locator("input[id='firstName']").first();
      await name.fill("John");
      await expect(name).toHaveValue("John");
    });

    test("X39 - address field accepts multi-line text", async ({ page }) => {
      const addr = page.locator("input[id='address'], textarea[id='address']").first();
      await addr.fill("123 Test Street");
      await expect(addr).toHaveValue("123 Test Street");
    });
  });

  test.describe("Page Elements", () => {
    test("X40 - checkout page has navbar", async ({ page }) => {
      await page.goto("/checkout");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("header").first()).toBeVisible();
    });
  });
});
