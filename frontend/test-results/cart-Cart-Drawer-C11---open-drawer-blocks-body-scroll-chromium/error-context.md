# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C11 - open drawer blocks body scroll
- Location: tests/cart.spec.ts:91:7

# Error details

```
Error: Test timeout of 45000ms exceeded
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - button "Cart" [active] [ref=e14]
  - generic [ref=e19]:
    - generic [ref=e20]:
      - heading "Your Cart" [level=2] [ref=e22]
      - button "Close cart" [ref=e23]
    - generic [ref=e28]:
      - paragraph [ref=e32]: Your cart is currently empty.
      - link "Continue Shopping" [ref=e33] [cursor=pointer]:
        - /url: /shop
  - main [ref=e34]:
    - generic [ref=e36]:
      - generic [ref=e41]:
        - heading "From your photo to a Timeless Tote" [level=2] [ref=e42]
        - paragraph [ref=e43]: Every detail is meticulously crafted. Watch your memory transform into wearable art.
      - generic:
        - generic:
          - generic:
            - img "Original Photo"
          - generic:
            - img "Illustrated Artwork"
      - generic [ref=e45]:
        - heading "Every memory deserves to be carried." [level=3] [ref=e46]
        - link "Create Yours" [ref=e47] [cursor=pointer]:
          - /url: /shop
      - generic:
        - generic:
          - generic: Upload Your Photo
          - generic: We Turn It Into Art
          - generic: Printed on Your Tote
    - generic [ref=e48]:
      - generic [ref=e56]:
        - heading "Bags that speak." [level=1] [ref=e57]: Bags thatspeak.
        - paragraph [ref=e58]: Customize your best memories into your gift which you can gift to your friends, partner, family.
      - generic [ref=e59]:
        - button "Previous Illustration" [ref=e60]
        - button "Next Illustration" [ref=e63]
    - generic [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]:
          - heading "Carry a little something with you." [level=2] [ref=e70]
          - paragraph [ref=e71]: Let's customize your tote bag with your personalized image and text.
        - link "Shop Collection →" [ref=e72] [cursor=pointer]:
          - /url: /shop
          - text: Shop Collection
          - generic [ref=e73]: →
      - generic [ref=e74]:
        - link "CUSTOM GHIBLI ART TOTE BAG Bestseller CUSTOM GHIBLI ART TOTE BAG ₹799.00 ₹499.00" [ref=e75] [cursor=pointer]:
          - /url: /shop/ghibli-art-tote
          - generic [ref=e76]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=e78]
            - generic [ref=e79]:
              - generic [ref=e80]: Bestseller
              - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=e81]
              - paragraph [ref=e82]:
                - generic [ref=e83]: ₹799.00
                - generic [ref=e84]: ₹499.00
        - link "CUSTOM GHIBLI TOTE BAG WITH TEXT Bestseller CUSTOM GHIBLI TOTE BAG WITH TEXT ₹749.00 ₹599.00" [ref=e85] [cursor=pointer]:
          - /url: /shop/ghibli-text-tote
          - generic [ref=e86]:
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=e88]
            - generic [ref=e89]:
              - generic [ref=e90]: Bestseller
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=e91]
              - paragraph [ref=e92]:
                - generic [ref=e93]: ₹749.00
                - generic [ref=e94]: ₹599.00
        - link "CUTE EMOJI WITH GHIBLI TOTE Bestseller CUTE EMOJI WITH GHIBLI TOTE ₹719.00 ₹599.00" [ref=e95] [cursor=pointer]:
          - /url: /shop/emoji-ghibli-tote
          - generic [ref=e96]:
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=e98]
            - generic [ref=e99]:
              - generic [ref=e100]: Bestseller
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=e101]
              - paragraph [ref=e102]:
                - generic [ref=e103]: ₹719.00
                - generic [ref=e104]: ₹599.00
        - link "POLAROID TOTE BAG New POLAROID TOTE BAG ₹599.00 ₹499.00" [ref=e105] [cursor=pointer]:
          - /url: /shop/polaroid-tote
          - generic [ref=e106]:
            - img "POLAROID TOTE BAG" [ref=e108]
            - generic [ref=e109]:
              - generic [ref=e110]: New
              - heading "POLAROID TOTE BAG" [level=3] [ref=e111]
              - paragraph [ref=e112]:
                - generic [ref=e113]: ₹599.00
                - generic [ref=e114]: ₹499.00
    - generic [ref=e116]:
      - generic [ref=e118]:
        - heading "Honest Customer Reviews from Totemood." [level=2] [ref=e119]: Honest Customer Reviewsfrom Totemood.
        - paragraph [ref=e120]: See what our community is saying about their Totemood experience.
      - generic [ref=e121]:
        - generic [ref=e123]:
          - generic [ref=e124]:
            - img "Customer Review" [ref=e126] [cursor=pointer]
            - img "Customer Review" [ref=e128] [cursor=pointer]
            - img "Customer Review" [ref=e130] [cursor=pointer]
            - img "Customer Review" [ref=e132] [cursor=pointer]
            - img "Customer Review" [ref=e134] [cursor=pointer]
            - img "Customer Review" [ref=e136] [cursor=pointer]
            - img "Customer Review" [ref=e138] [cursor=pointer]
          - generic [ref=e139]:
            - img "Customer Review" [ref=e141] [cursor=pointer]
            - img "Customer Review" [ref=e143] [cursor=pointer]
            - img "Customer Review" [ref=e145] [cursor=pointer]
            - img "Customer Review" [ref=e147] [cursor=pointer]
            - img "Customer Review" [ref=e149] [cursor=pointer]
            - img "Customer Review" [ref=e151] [cursor=pointer]
            - img "Customer Review" [ref=e153] [cursor=pointer]
        - generic [ref=e155]:
          - generic [ref=e156]:
            - img "Customer Review" [ref=e158] [cursor=pointer]
            - img "Customer Review" [ref=e160] [cursor=pointer]
            - img "Customer Review" [ref=e162] [cursor=pointer]
            - img "Customer Review" [ref=e164] [cursor=pointer]
            - img "Customer Review" [ref=e166] [cursor=pointer]
            - img "Customer Review" [ref=e168] [cursor=pointer]
            - img "Customer Review" [ref=e170] [cursor=pointer]
          - generic [ref=e171]:
            - img "Customer Review" [ref=e173] [cursor=pointer]
            - img "Customer Review" [ref=e175] [cursor=pointer]
            - img "Customer Review" [ref=e177] [cursor=pointer]
            - img "Customer Review" [ref=e179] [cursor=pointer]
            - img "Customer Review" [ref=e181] [cursor=pointer]
            - img "Customer Review" [ref=e183] [cursor=pointer]
            - img "Customer Review" [ref=e185] [cursor=pointer]
        - generic [ref=e188]:
          - generic [ref=e189]:
            - img "Customer Review" [ref=e191] [cursor=pointer]
            - img "Customer Review" [ref=e193] [cursor=pointer]
            - img "Customer Review" [ref=e195] [cursor=pointer]
            - img "Customer Review" [ref=e197] [cursor=pointer]
            - img "Customer Review" [ref=e199] [cursor=pointer]
            - img "Customer Review" [ref=e201] [cursor=pointer]
            - img "Customer Review" [ref=e203] [cursor=pointer]
          - generic [ref=e204]:
            - img "Customer Review" [ref=e206] [cursor=pointer]
            - img "Customer Review" [ref=e208] [cursor=pointer]
            - img "Customer Review" [ref=e210] [cursor=pointer]
            - img "Customer Review" [ref=e212] [cursor=pointer]
            - img "Customer Review" [ref=e214] [cursor=pointer]
            - img "Customer Review" [ref=e216] [cursor=pointer]
            - img "Customer Review" [ref=e218] [cursor=pointer]
        - generic [ref=e221]:
          - generic [ref=e222]:
            - img "Customer Review" [ref=e224] [cursor=pointer]
            - img "Customer Review" [ref=e226] [cursor=pointer]
            - img "Customer Review" [ref=e228] [cursor=pointer]
            - img "Customer Review" [ref=e230] [cursor=pointer]
            - img "Customer Review" [ref=e232] [cursor=pointer]
            - img "Customer Review" [ref=e234] [cursor=pointer]
          - generic [ref=e235]:
            - img "Customer Review" [ref=e237] [cursor=pointer]
            - img "Customer Review" [ref=e239] [cursor=pointer]
            - img "Customer Review" [ref=e241] [cursor=pointer]
            - img "Customer Review" [ref=e243] [cursor=pointer]
            - img "Customer Review" [ref=e245] [cursor=pointer]
            - img "Customer Review" [ref=e247] [cursor=pointer]
    - generic [ref=e250]:
      - generic [ref=e251]:
        - generic [ref=e252]: Frequently Asked Questions
        - heading "Everything you might want to know." [level=2] [ref=e253]
      - generic [ref=e254]:
        - generic [ref=e255]:
          - button "How long will it take to share the design with the customer?" [ref=e256]
          - paragraph [ref=e260]: The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.
        - generic [ref=e261]:
          - button "Will I get to see the design before it is printed?" [ref=e262]
          - paragraph [ref=e266]: Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.
        - generic [ref=e267]:
          - button "Why don't you offer full Cash on Delivery?" [ref=e268]
          - paragraph [ref=e272]: Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.
        - generic [ref=e273]:
          - button "Why do I need to pay ₹49 while placing the order?" [ref=e274]
          - paragraph [ref=e278]: We take a ₹49 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.
        - generic [ref=e279]:
          - button "Is there any return policy?" [ref=e280]
          - paragraph [ref=e284]: Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).
        - generic [ref=e285]:
          - button "What if I want changes in the design?" [ref=e286]
          - paragraph [ref=e290]: No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.
        - generic [ref=e291]:
          - button "How long will it take to receive my order?" [ref=e292]
          - paragraph [ref=e296]: Once your design is approved, your order is printed and delivered within 4-6 working days.
    - generic [ref=e298]:
      - generic:
        - generic:
          - img "Totemood Product Mockup"
      - generic:
        - heading "TOTE MOOD" [level=2]:
          - generic: TOTE
          - generic: MOOD
      - generic [ref=e299]:
        - generic [ref=e300]:
          - link "Collections" [ref=e301] [cursor=pointer]:
            - /url: /shop
          - link "About" [ref=e302] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=e303] [cursor=pointer]:
            - /url: /#faq
          - link "Contact" [ref=e304] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e305]:
          - link "WhatsApp" [ref=e306] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e307] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
        - generic [ref=e308]: © 2026 Totemood. All rights reserved.
  - contentinfo [ref=e309]:
    - generic [ref=e310]:
      - generic [ref=e311]:
        - generic [ref=e312]:
          - link "Totemood" [ref=e313] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e314]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=e315]:
          - generic [ref=e316]:
            - heading "Shop" [level=4] [ref=e317]
            - link "Collections" [ref=e318] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=e319] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=e320] [cursor=pointer]:
              - /url: /shop
          - generic [ref=e321]:
            - heading "Company" [level=4] [ref=e322]
            - link "About" [ref=e323] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e324] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=e325] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=e326]:
          - heading "Connect" [level=4] [ref=e327]
          - link "WhatsApp" [ref=e328] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e331] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=e334]:
        - paragraph [ref=e335]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=e336]: Mumbai, India
  - generic [ref=e337]:
    - link "Chat on WhatsApp" [ref=e338] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=e341] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=e344]
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
> 93  |     await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
      |                                                                                      ^ Error: Test timeout of 45000ms exceeded
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