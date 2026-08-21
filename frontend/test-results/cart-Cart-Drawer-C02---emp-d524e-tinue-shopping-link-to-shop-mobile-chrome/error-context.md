# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C02 - empty cart offers continue shopping link to /shop
- Location: tests/cart.spec.ts:26:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('button[aria-label=\'Cart\']')
    - locator resolved to <button aria-label="Cart" class="relative text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="flex-1 flex justify-end items-center space-x-5 lg:space-x-6">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <a href="/account" class="font-sans text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.2em] font-bold text-primary hover:text-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm px-1 sm:px-2 py-1">Sign in</a> intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="w-full max-w-7xl transition-all duration-500 flex items-center justify-between bg-transparent border-transparent py-4 px-4 md:py-5 md:px-6 lg:px-8">…</div> intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Totemood" [ref=e5] [cursor=pointer]:
        - /url: /
      - navigation [ref=e6]:
        - link "Home" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "Shop" [ref=e8] [cursor=pointer]:
          - /url: /shop
        - link "Stories" [ref=e9] [cursor=pointer]:
          - /url: /#stories
        - link "About" [ref=e10] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=e11] [cursor=pointer]:
          - /url: /contact
      - generic [ref=e12]:
        - link "Sign in" [ref=e13] [cursor=pointer]:
          - /url: /account
        - button "Cart" [ref=e14]
  - main [ref=e18]:
    - generic [ref=e20]:
      - generic [ref=e25]:
        - heading "From your photo to a Timeless Tote" [level=2] [ref=e26]
        - paragraph [ref=e27]: Every detail is meticulously crafted. Watch your memory transform into wearable art.
      - generic:
        - generic:
          - generic:
            - img "Original Photo"
          - generic:
            - img "Illustrated Artwork"
      - generic [ref=e29]:
        - heading "Every memory deserves to be carried." [level=3] [ref=e30]
        - link "Create Yours" [ref=e31] [cursor=pointer]:
          - /url: /shop
    - generic [ref=e32]:
      - generic [ref=e40]:
        - heading "Bags that speak." [level=1] [ref=e41]: Bags thatspeak.
        - paragraph [ref=e42]: Customize your best memories into your gift which you can gift to your friends, partner, family.
      - generic [ref=e43]:
        - button "Previous Illustration" [ref=e44]
        - button "Next Illustration" [ref=e47]
    - generic [ref=e51]:
      - generic [ref=e52]:
        - generic [ref=e53]:
          - heading "Carry a little something with you." [level=2] [ref=e54]
          - paragraph [ref=e55]: Let's customize your tote bag with your personalized image and text.
        - link "Shop Collection →" [ref=e56] [cursor=pointer]:
          - /url: /shop
          - text: Shop Collection
          - generic [ref=e57]: →
      - generic [ref=e58]:
        - link "CUSTOM GHIBLI ART TOTE BAG Bestseller CUSTOM GHIBLI ART TOTE BAG ₹799.00 ₹499.00" [ref=e59] [cursor=pointer]:
          - /url: /shop/ghibli-art-tote
          - generic [ref=e60]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=e62]
            - generic [ref=e63]:
              - generic [ref=e64]: Bestseller
              - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=e65]
              - paragraph [ref=e66]:
                - generic [ref=e67]: ₹799.00
                - generic [ref=e68]: ₹499.00
        - link "CUSTOM GHIBLI TOTE BAG WITH TEXT Bestseller CUSTOM GHIBLI TOTE BAG WITH TEXT ₹749.00 ₹599.00" [ref=e69] [cursor=pointer]:
          - /url: /shop/ghibli-text-tote
          - generic [ref=e70]:
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=e72]
            - generic [ref=e73]:
              - generic [ref=e74]: Bestseller
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=e75]
              - paragraph [ref=e76]:
                - generic [ref=e77]: ₹749.00
                - generic [ref=e78]: ₹599.00
        - link "CUTE EMOJI WITH GHIBLI TOTE Bestseller CUTE EMOJI WITH GHIBLI TOTE ₹719.00 ₹599.00" [ref=e79] [cursor=pointer]:
          - /url: /shop/emoji-ghibli-tote
          - generic [ref=e80]:
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=e82]
            - generic [ref=e83]:
              - generic [ref=e84]: Bestseller
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=e85]
              - paragraph [ref=e86]:
                - generic [ref=e87]: ₹719.00
                - generic [ref=e88]: ₹599.00
        - link "POLAROID TOTE BAG New POLAROID TOTE BAG ₹599.00 ₹499.00" [ref=e89] [cursor=pointer]:
          - /url: /shop/polaroid-tote
          - generic [ref=e90]:
            - img "POLAROID TOTE BAG" [ref=e92]
            - generic [ref=e93]:
              - generic [ref=e94]: New
              - heading "POLAROID TOTE BAG" [level=3] [ref=e95]
              - paragraph [ref=e96]:
                - generic [ref=e97]: ₹599.00
                - generic [ref=e98]: ₹499.00
    - generic [ref=e100]:
      - generic [ref=e102]:
        - heading "Honest Customer Reviews from Totemood." [level=2] [ref=e103]: Honest Customer Reviewsfrom Totemood.
        - paragraph [ref=e104]: See what our community is saying about their Totemood experience.
      - generic [ref=e105]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - img "Customer Review" [ref=e110] [cursor=pointer]
            - img "Customer Review" [ref=e112] [cursor=pointer]
            - img "Customer Review" [ref=e114] [cursor=pointer]
            - img "Customer Review" [ref=e116] [cursor=pointer]
            - img "Customer Review" [ref=e118] [cursor=pointer]
            - img "Customer Review" [ref=e120] [cursor=pointer]
            - img "Customer Review" [ref=e122] [cursor=pointer]
          - generic [ref=e123]:
            - img "Customer Review" [ref=e125] [cursor=pointer]
            - img "Customer Review" [ref=e127] [cursor=pointer]
            - img "Customer Review" [ref=e129] [cursor=pointer]
            - img "Customer Review" [ref=e131] [cursor=pointer]
            - img "Customer Review" [ref=e133] [cursor=pointer]
            - img "Customer Review" [ref=e135] [cursor=pointer]
            - img "Customer Review" [ref=e137] [cursor=pointer]
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img "Customer Review" [ref=e142] [cursor=pointer]
            - img "Customer Review" [ref=e144] [cursor=pointer]
            - img "Customer Review" [ref=e146] [cursor=pointer]
            - img "Customer Review" [ref=e148] [cursor=pointer]
            - img "Customer Review" [ref=e150] [cursor=pointer]
            - img "Customer Review" [ref=e152] [cursor=pointer]
            - img "Customer Review" [ref=e154] [cursor=pointer]
          - generic [ref=e155]:
            - img "Customer Review" [ref=e157] [cursor=pointer]
            - img "Customer Review" [ref=e159] [cursor=pointer]
            - img "Customer Review" [ref=e161] [cursor=pointer]
            - img "Customer Review" [ref=e163] [cursor=pointer]
            - img "Customer Review" [ref=e165] [cursor=pointer]
            - img "Customer Review" [ref=e167] [cursor=pointer]
            - img "Customer Review" [ref=e169] [cursor=pointer]
    - generic [ref=e172]:
      - generic [ref=e173]:
        - generic [ref=e174]: Frequently Asked Questions
        - heading "Everything you might want to know." [level=2] [ref=e175]
      - generic [ref=e176]:
        - generic [ref=e177]:
          - button "How long will it take to share the design with the customer?" [ref=e178]
          - paragraph [ref=e182]: The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.
        - generic [ref=e183]:
          - button "Will I get to see the design before it is printed?" [ref=e184]
          - paragraph [ref=e188]: Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.
        - generic [ref=e189]:
          - button "Why don't you offer full Cash on Delivery?" [ref=e190]
          - paragraph [ref=e194]: Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.
        - generic [ref=e195]:
          - button "Why do I need to pay ₹49 while placing the order?" [ref=e196]
          - paragraph [ref=e200]: We take a ₹49 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.
        - generic [ref=e201]:
          - button "Is there any return policy?" [ref=e202]
          - paragraph [ref=e206]: Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).
        - generic [ref=e207]:
          - button "What if I want changes in the design?" [ref=e208]
          - paragraph [ref=e212]: No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.
        - generic [ref=e213]:
          - button "How long will it take to receive my order?" [ref=e214]
          - paragraph [ref=e218]: Once your design is approved, your order is printed and delivered within 4-6 working days.
    - generic [ref=e220]:
      - generic [ref=e221]:
        - generic:
          - heading "TOTE MOOD" [level=2]:
            - generic: TOTE
            - generic: MOOD
        - img "Totemood Product Mockup" [ref=e223]
      - generic [ref=e224]:
        - generic [ref=e225]:
          - link "Collections" [ref=e226] [cursor=pointer]:
            - /url: /shop
          - link "About" [ref=e227] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=e228] [cursor=pointer]:
            - /url: /#faq
          - link "Contact" [ref=e229] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e230]:
          - link "WhatsApp" [ref=e231] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e232] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
        - generic [ref=e233]: © 2026 Totemood. All rights reserved.
  - contentinfo [ref=e234]:
    - generic [ref=e235]:
      - generic [ref=e236]:
        - generic [ref=e237]:
          - link "Totemood" [ref=e238] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e239]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=e240]:
          - generic [ref=e241]:
            - heading "Shop" [level=4] [ref=e242]
            - link "Collections" [ref=e243] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=e244] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=e245] [cursor=pointer]:
              - /url: /shop
          - generic [ref=e246]:
            - heading "Company" [level=4] [ref=e247]
            - link "About" [ref=e248] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e249] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=e250] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=e251]:
          - heading "Connect" [level=4] [ref=e252]
          - link "WhatsApp" [ref=e253] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e256] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=e259]:
        - paragraph [ref=e260]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=e261]: Mumbai, India
  - generic [ref=e262]:
    - link "Chat on WhatsApp" [ref=e263] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=e266] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=e269]
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
> 27  |     await page.locator("button[aria-label='Cart']").click();
      |                                                     ^ Error: locator.click: Test timeout of 45000ms exceeded.
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