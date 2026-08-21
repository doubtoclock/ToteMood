# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C03 - adding product shows name, price, qty, subtotal in drawer
- Location: tests/cart.spec.ts:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[class*=\'fixed\'] button[aria-label^=\'Increase\']').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[class*=\'fixed\'] button[aria-label^=\'Increase\']').first()

```

```yaml
- banner:
  - link "Totemood":
    - /url: /
  - navigation:
    - link "Home":
      - /url: /
    - link "Shop":
      - /url: /shop
    - link "Stories":
      - /url: /#stories
    - link "About":
      - /url: /about
    - link "Contact":
      - /url: /contact
  - link "Sign in":
    - /url: /account
  - button "Cart": "1"
- heading "Your Cart" [level=2]
- text: 1 item
- button
- img "CUSTOM GHIBLI ART TOTE BAG"
- heading "CUSTOM GHIBLI ART TOTE BAG" [level=3]
- text: Bestseller
- button
- button
- text: "1"
- button
- text: ₹499.00 Subtotal ₹499.00
- paragraph: Shipping and taxes calculated at checkout.
- link "Proceed to checkout →":
  - /url: /checkout
  - button "Proceed to checkout →"
- button "Continue Shopping"
- main:
  - link "Get a free sample preview on WhatsApp. WhatsApp us on +91 98908 42755":
    - /url: https://wa.me/919890842755?text=Hi%20Totemood!%20I%27d%20like%20a%20free%20sample%20preview%20please.
    - img
    - text: Get a free sample preview on WhatsApp. WhatsApp us on +91 98908 42755
  - img "CUSTOM GHIBLI ART TOTE BAG"
  - button "Thumbnail 1":
    - img "Thumbnail 1"
  - button "Thumbnail 2":
    - img "Thumbnail 2"
  - button "Thumbnail 3":
    - img "Thumbnail 3"
  - button "Thumbnail 4":
    - img "Thumbnail 4"
  - paragraph: Bestseller
  - heading "CUSTOM GHIBLI ART TOTE BAG" [level=1]
  - text: ₹499.00 ₹799.00 142 reviews
  - paragraph: Tote Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.
  - heading "Free Customisation Included" [level=4]
  - paragraph: Add your image and text during checkout.
  - heading "Dispatches in 24-48 hours" [level=4]
  - paragraph: Free shipping on all orders.
  - button "Customize & Add to Cart"
  - button "Buy Now"
  - paragraph: Secure payment. We use industry standard encryption.
  - heading "Premium Quality" [level=3]
  - paragraph: 300 GSM cotton canvas, built for lasting strength and everyday use.
  - heading "Durable print" [level=3]
  - paragraph: Premium DTF printing designed to stay vibrant, even after gentle hand washing.
  - heading "Your Design, Your Approval" [level=3]
  - paragraph: Create your design your way, we'll share it with you on WhatsApp for approval before we start printing.
  - heading "Customer Reviews" [level=2]
  - text: 4.9 / 5 (128 reviews)
  - heading "\"Incredible print quality!\"" [level=3]
  - paragraph: I was worried the print might fade after a few washes, but it looks exactly like the day I bought it. The canvas is thick and feels very premium.
  - text: Sarah J. August 12, 2026
  - heading "\"Best everyday tote ever!\"" [level=3]
  - paragraph: This fits my 15-inch laptop, a water bottle, and all my chargers without losing its shape. The strap length is perfect for wearing over a jacket.
  - text: Michael T. July 28, 2026
  - heading "\"A wonderful gift\"" [level=3]
  - paragraph: I got this customized for my sister's birthday and she absolutely loved it. The packaging was beautiful and it arrived exactly on time.
  - text: Emily R. July 15, 2026
  - heading "Frequently Asked Questions" [level=2]
  - button "How long does shipping take?"
  - paragraph: Standard shipping takes 5-7 business days. Expedited options are available at checkout.
  - button "Can I return a customized tote?"
  - paragraph: Customized items are made specifically for you and cannot be returned unless there is a manufacturing defect.
  - button "What are the care instructions?"
  - paragraph: Spot clean with a damp cloth and mild soap. Do not machine wash or tumble dry as it may damage the custom print.
  - heading "Related Products" [level=2]
  - button
  - button
  - link "CUSTOM GHIBLI TOTE BAG WITH TEXT CUSTOM GHIBLI TOTE BAG WITH TEXT (215) ₹599.00 ₹749.00":
    - /url: /shop/ghibli-text-tote
    - img "CUSTOM GHIBLI TOTE BAG WITH TEXT"
    - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3]
    - text: (215) ₹599.00 ₹749.00
  - link "CUTE EMOJI WITH GHIBLI TOTE CUTE EMOJI WITH GHIBLI TOTE (89) ₹599.00 ₹719.00":
    - /url: /shop/emoji-ghibli-tote
    - img "CUTE EMOJI WITH GHIBLI TOTE"
    - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3]
    - text: (89) ₹599.00 ₹719.00
  - link "POLAROID TOTE BAG POLAROID TOTE BAG (34) ₹499.00 ₹599.00":
    - /url: /shop/polaroid-tote
    - img "POLAROID TOTE BAG"
    - heading "POLAROID TOTE BAG" [level=3]
    - text: (34) ₹499.00 ₹599.00
  - link "ANY DESIGN TOTE BAG ANY DESIGN TOTE BAG (76) ₹499.00 ₹599.00":
    - /url: /shop/any-design-tote
    - img "ANY DESIGN TOTE BAG"
    - heading "ANY DESIGN TOTE BAG" [level=3]
    - text: (76) ₹499.00 ₹599.00
- contentinfo:
  - link "Totemood":
    - /url: /
  - paragraph: Personalised canvas tote bags. Every piece tells your story.
  - heading "Shop" [level=4]
  - link "Collections":
    - /url: /shop
  - link "Custom Totes":
    - /url: /shop
  - link "Bestsellers":
    - /url: /shop
  - heading "Company" [level=4]
  - link "About":
    - /url: /about
  - link "Contact":
    - /url: /contact
  - link "FAQ":
    - /url: /#faq
  - heading "Connect" [level=4]
  - link "WhatsApp":
    - /url: https://wa.me/919890842755
    - img
    - text: WhatsApp
  - link "Instagram":
    - /url: https://instagram.com/totemood_gifts
    - img
    - text: Instagram
  - paragraph: © 2026 Totemood. All rights reserved.
  - paragraph: Mumbai, India
- link "Chat on WhatsApp":
  - /url: https://wa.me/919890842755
  - img
- link "Follow on Instagram":
  - /url: https://instagram.com/totemood_gifts
  - img
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const PRODUCT = "/shop/ghibli-art-tote";
  4   | const PRODUCT2 = "/shop/ghibli-text-tote";
  5   | 
  6   | async function addToCartFromProduct(page: import("@playwright/test").Page, path = PRODUCT) {
  7   |   await page.goto(path);
  8   |   await page.waitForLoadState("domcontentloaded");
  9   |   await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
  10  | }
  11  | 
  12  | test.describe("Cart Drawer", () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto("/");
  15  |     await page.waitForLoadState("domcontentloaded");
  16  |   });
  17  | 
  18  |   test("C01 - cart icon opens drawer with empty state and close works", async ({ page }) => {
  19  |     await page.locator("button[aria-label='Cart']").click();
  20  |     await expect(page.getByText(/your cart/i).first()).toBeVisible({ timeout: 5000 });
  21  |     await expect(page.getByText(/currently empty/i)).toBeVisible();
  22  |     await page.locator("button[aria-label='Close cart']").click();
  23  |     await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  24  |   });
  25  | 
  26  |   test("C02 - empty cart offers continue shopping link to /shop", async ({ page }) => {
  27  |     await page.locator("button[aria-label='Cart']").click();
  28  |     const link = page.locator("a").filter({ hasText: "Continue Shopping" }).first();
  29  |     await expect(link).toBeVisible({ timeout: 5000 });
  30  |     await link.click();
  31  |     await expect(page).toHaveURL(/\/shop/);
  32  |   });
  33  | 
  34  |   test("C03 - adding product shows name, price, qty, subtotal in drawer", async ({ page }) => {
  35  |     await addToCartFromProduct(page);
  36  |     await expect(page.locator("[class*='fixed'] h3").filter({ hasText: /tote|polaroid|art/i }).first()).toBeVisible({ timeout: 5000 });
  37  |     await expect(page.getByText(/^Subtotal$/)).toBeVisible();
  38  |     await expect(page.locator("text=₹499.00").first()).toBeVisible();
> 39  |     await expect(page.locator("[class*='fixed'] button[aria-label^='Increase']").first()).toBeVisible();
      |                                                                                           ^ Error: expect(locator).toBeVisible() failed
  40  |   });
  41  | 
  42  |   test("C04 - increase then decrease quantity updates count", async ({ page }) => {
  43  |     await addToCartFromProduct(page);
  44  |     await page.locator("button[aria-label^='Increase']").first().click();
  45  |     await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^2$/ }).first()).toBeVisible({ timeout: 3000 });
  46  |     await page.locator("button[aria-label^='Decrease']").first().click();
  47  |     await expect(page.locator("[class*='fixed'] span").filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  48  |   });
  49  | 
  50  |   test("C05 - doubling quantity doubles subtotal to ₹998.00", async ({ page }) => {
  51  |     await addToCartFromProduct(page);
  52  |     await page.locator("button[aria-label^='Increase']").first().click();
  53  |     await expect(page.locator("text=₹998.00").first()).toBeVisible({ timeout: 3000 });
  54  |   });
  55  | 
  56  |   test("C06 - remove button empties cart and clears badge", async ({ page }) => {
  57  |     await addToCartFromProduct(page);
  58  |     await page.locator("button[aria-label^='Remove']").first().click();
  59  |     await expect(page.getByText(/currently empty/i)).toBeVisible({ timeout: 3000 });
  60  |     await expect(page.locator("button[aria-label='Cart'] span")).toHaveCount(0);
  61  |   });
  62  | 
  63  |   test("C07 - badge appears after add and persists across client navigation", async ({ page }) => {
  64  |     await addToCartFromProduct(page);
  65  |     await page.locator("button[aria-label='Close cart']").click();
  66  |     await page.goto("/about");
  67  |     await page.waitForLoadState("domcontentloaded");
  68  |     const badge = page.locator("button[aria-label='Cart'] span");
  69  |     await expect(badge).toHaveText("1", { timeout: 5000 });
  70  |   });
  71  | 
  72  |   test("C08 - two different products sum to ₹1098.00", async ({ page }) => {
  73  |     await addToCartFromProduct(page);
  74  |     await page.locator("button[aria-label='Close cart']").click();
  75  |     await addToCartFromProduct(page, PRODUCT2);
  76  |     await expect(page.locator("text=₹1098.00").first()).toBeVisible({ timeout: 5000 });
  77  |   });
  78  | 
  79  |   test("C09 - proceed to checkout navigates to /checkout", async ({ page }) => {
  80  |     await addToCartFromProduct(page);
  81  |     await page.locator("a[href='/checkout']").first().click();
  82  |     await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });
  83  |   });
  84  | 
  85  |   test("C10 - continue shopping closes drawer", async ({ page }) => {
  86  |     await addToCartFromProduct(page);
  87  |     await page.locator("a").filter({ hasText: "Continue Shopping" }).last().click();
  88  |     await expect(page.locator("button[aria-label='Close cart']")).toBeHidden({ timeout: 3000 });
  89  |   });
  90  | 
  91  |   test("C11 - open drawer blocks body scroll", async ({ page }) => {
  92  |     await page.locator("button[aria-label='Cart']").click();
  93  |     await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  94  |   });
  95  | 
  96  |   test("C12 - rapid add clicks do not crash app", async ({ page }) => {
  97  |     await page.goto(PRODUCT);
  98  |     await page.waitForLoadState("domcontentloaded");
  99  |     const btn = page.locator("button").filter({ hasText: "Customize & Add to Cart" });
  100 |     await btn.click();
  101 |     await btn.click();
  102 |     const badge = page.locator("button[aria-label='Cart'] span");
  103 |     await expect(badge).toBeVisible({ timeout: 3000 });
  104 |   });
  105 | });
  106 | 
```