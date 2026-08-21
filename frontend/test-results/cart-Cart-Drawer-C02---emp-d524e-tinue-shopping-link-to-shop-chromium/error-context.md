# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C02 - empty cart offers continue shopping link to /shop
- Location: tests/cart.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a').filter({ hasText: 'Continue Shopping' }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a').filter({ hasText: 'Continue Shopping' }).first()

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
  - button "Cart"
- heading "Your Cart" [level=2]
- button
- paragraph: Your cart is currently empty.
- button "Continue Shopping"
- main:
  - heading "From your photo to a Timeless Tote" [level=2]
  - paragraph: Every detail is meticulously crafted. Watch your memory transform into wearable art.
  - img "Original Photo"
  - img "Illustrated Artwork"
  - heading "Every memory deserves to be carried." [level=3]
  - link "Create Yours":
    - /url: /shop
  - text: Upload Your Photo We Turn It Into Art Printed on Your Tote
  - heading "Bags that speak." [level=1]
  - paragraph: Customize your best memories into your gift which you can gift to your friends, partner, family.
  - button "Previous Illustration"
  - button "Next Illustration"
  - heading "Carry a little something with you." [level=2]
  - paragraph: Let's customize your tote bag with your personalized image and text.
  - link "Shop Collection →":
    - /url: /shop
  - link "CUSTOM GHIBLI ART TOTE BAG Bestseller CUSTOM GHIBLI ART TOTE BAG ₹799.00 ₹499.00":
    - /url: /shop/ghibli-art-tote
    - img "CUSTOM GHIBLI ART TOTE BAG"
    - text: Bestseller
    - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3]
    - paragraph: ₹799.00 ₹499.00
  - link "CUSTOM GHIBLI TOTE BAG WITH TEXT Bestseller CUSTOM GHIBLI TOTE BAG WITH TEXT ₹749.00 ₹599.00":
    - /url: /shop/ghibli-text-tote
    - img "CUSTOM GHIBLI TOTE BAG WITH TEXT"
    - text: Bestseller
    - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3]
    - paragraph: ₹749.00 ₹599.00
  - link "CUTE EMOJI WITH GHIBLI TOTE Bestseller CUTE EMOJI WITH GHIBLI TOTE ₹719.00 ₹599.00":
    - /url: /shop/emoji-ghibli-tote
    - img "CUTE EMOJI WITH GHIBLI TOTE"
    - text: Bestseller
    - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3]
    - paragraph: ₹719.00 ₹599.00
  - link "POLAROID TOTE BAG New POLAROID TOTE BAG ₹599.00 ₹499.00":
    - /url: /shop/polaroid-tote
    - img "POLAROID TOTE BAG"
    - text: New
    - heading "POLAROID TOTE BAG" [level=3]
    - paragraph: ₹599.00 ₹499.00
  - heading "Honest Customer Reviews from Totemood." [level=2]
  - paragraph: See what our community is saying about their Totemood experience.
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - img "Customer Review"
  - text: Frequently Asked Questions
  - heading "Everything you might want to know." [level=2]
  - button "How long will it take to share the design with the customer?"
  - paragraph: The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.
  - button "Will I get to see the design before it is printed?"
  - paragraph: Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.
  - button "Why don't you offer full Cash on Delivery?"
  - paragraph: Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.
  - button "Why do I need to pay ₹49 while placing the order?"
  - paragraph: We take a ₹49 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.
  - button "Is there any return policy?"
  - paragraph: Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).
  - button "What if I want changes in the design?"
  - paragraph: No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.
  - button "How long will it take to receive my order?"
  - paragraph: Once your design is approved, your order is printed and delivered within 4-6 working days.
  - img "Totemood Product Mockup"
  - heading "TOTE MOOD" [level=2]
  - link "Collections":
    - /url: /shop
  - link "About":
    - /url: /about
  - link "FAQ":
    - /url: /#faq
  - link "Contact":
    - /url: /contact
  - link "WhatsApp":
    - /url: https://wa.me/919890842755
  - link "Instagram":
    - /url: https://instagram.com/totemood_gifts
  - text: © 2026 Totemood. All rights reserved.
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
> 29  |     await expect(link).toBeVisible({ timeout: 5000 });
      |                        ^ Error: expect(locator).toBeVisible() failed
  30  |     await link.click();
  31  |     await expect(page).toHaveURL(/\/shop/);
  32  |   });
  33  | 
  34  |   test("C03 - adding product shows name, price, qty, subtotal in drawer", async ({ page }) => {
  35  |     await addToCartFromProduct(page);
  36  |     await expect(page.locator("[class*='fixed'] h3").filter({ hasText: /tote|polaroid|art/i }).first()).toBeVisible({ timeout: 5000 });
  37  |     await expect(page.getByText(/^Subtotal$/)).toBeVisible();
  38  |     await expect(page.locator("text=₹499.00").first()).toBeVisible();
  39  |     await expect(page.locator("[class*='fixed'] button[aria-label^='Increase']").first()).toBeVisible();
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