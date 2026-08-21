# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C08 - two different products sum to ₹1098.00
- Location: tests/cart.spec.ts:72:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('button[aria-label=\'Close cart\']')
    - locator resolved to <button aria-label="Close cart" class="p-2 hover:bg-[#E8E5DC]/50 rounded-full transition-colors text-[#252A1A]">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    61 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="flex items-center justify-between px-6 py-6 md:px-8 border-b border-[#E8E5DC]">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - banner [ref=f1e2]:
    - generic [ref=f1e3]:
      - link "Totemood" [ref=f1e5] [cursor=pointer]:
        - /url: /
      - navigation [ref=f1e6]:
        - link "Home" [ref=f1e7] [cursor=pointer]:
          - /url: /
        - link "Shop" [ref=f1e8] [cursor=pointer]:
          - /url: /shop
        - link "Stories" [ref=f1e9] [cursor=pointer]:
          - /url: /#stories
        - link "About" [ref=f1e10] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=f1e11] [cursor=pointer]:
          - /url: /contact
      - generic [ref=f1e12]:
        - link "Sign in" [ref=f1e13] [cursor=pointer]:
          - /url: /account
        - button "Cart" [ref=f1e14]:
          - generic [ref=f1e18]: "1"
  - generic [ref=f1e20]:
    - generic [ref=f1e21]:
      - generic [ref=f1e22]:
        - heading "Your Cart" [level=2] [ref=f1e23]
        - generic [ref=f1e24]: 1 item
      - button "Close cart" [ref=f1e25]
    - generic [ref=f1e31]:
      - img "CUSTOM GHIBLI ART TOTE BAG" [ref=f1e33]
      - generic [ref=f1e34]:
        - generic [ref=f1e35]:
          - generic [ref=f1e36]:
            - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=f1e37]
            - generic [ref=f1e38]: Bestseller
          - button "Remove CUSTOM GHIBLI ART TOTE BAG" [ref=f1e39]
        - generic [ref=f1e43]:
          - generic [ref=f1e44]:
            - button "Decrease CUSTOM GHIBLI ART TOTE BAG quantity" [ref=f1e45]
            - generic [ref=f1e47]: "1"
            - button "Increase CUSTOM GHIBLI ART TOTE BAG quantity" [ref=f1e48]
          - generic [ref=f1e50]: ₹499.00
    - generic [ref=f1e51]:
      - generic [ref=f1e52]:
        - generic [ref=f1e53]: Subtotal
        - generic [ref=f1e54]: ₹499.00
      - paragraph [ref=f1e55]: Shipping and taxes calculated at checkout.
      - link [ref=f1e56] [cursor=pointer]:
        - /url: /checkout
        - button "Proceed to checkout →" [ref=f1e57]:
          - text: Proceed to checkout
          - generic [ref=f1e58]: →
      - button "Continue Shopping" [ref=f1e59]
  - main [ref=f1e62]:
    - generic [ref=f1e63]:
      - generic [ref=f1e64]:
        - link "Get a free sample preview on WhatsApp. WhatsApp us on +91 98908 42755" [ref=f1e65] [cursor=pointer]:
          - /url: https://wa.me/919890842755?text=Hi%20Totemood!%20I%27d%20like%20a%20free%20sample%20preview%20please.
        - generic [ref=f1e72]:
          - generic [ref=f1e73]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=f1e76]
            - generic [ref=f1e77]:
              - button [ref=f1e78]:
                - img "Thumbnail 1" [ref=f1e79]
              - button [ref=f1e80]:
                - img "Thumbnail 2" [ref=f1e81]
              - button [ref=f1e82]:
                - img "Thumbnail 3" [ref=f1e83]
              - button [ref=f1e84]:
                - img "Thumbnail 4" [ref=f1e85]
          - generic [ref=f1e86]:
            - paragraph [ref=f1e87]: Bestseller
            - heading "CUSTOM GHIBLI ART TOTE BAG" [level=1] [ref=f1e88]
            - generic [ref=f1e89]:
              - generic [ref=f1e90]: ₹499.00
              - generic [ref=f1e91]: ₹799.00
            - generic [ref=f1e92]: 142 reviews
            - paragraph [ref=f1e105]: Tote Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.
            - generic [ref=f1e106]:
              - generic [ref=f1e111]:
                - heading "Free Customisation Included" [level=4] [ref=f1e112]
                - paragraph [ref=f1e113]: Add your image and text during checkout.
              - generic [ref=f1e120]:
                - heading "Dispatches in 24-48 hours" [level=4] [ref=f1e121]
                - paragraph [ref=f1e122]: Free shipping on all orders.
            - generic [ref=f1e123]:
              - button "Customize & Add to Cart" [active] [ref=f1e124]
              - button "Buy Now" [ref=f1e125]
            - paragraph [ref=f1e126]: Secure payment. We use industry standard encryption.
      - generic [ref=f1e129]:
        - generic [ref=f1e130]:
          - heading "Premium Quality" [level=3] [ref=f1e135]
          - paragraph [ref=f1e136]: 300 GSM cotton canvas, built for lasting strength and everyday use.
        - generic [ref=f1e137]:
          - heading "Durable print" [level=3] [ref=f1e142]
          - paragraph [ref=f1e143]: Premium DTF printing designed to stay vibrant, even after gentle hand washing.
        - generic [ref=f1e144]:
          - heading "Your Design, Your Approval" [level=3] [ref=f1e149]
          - paragraph [ref=f1e150]: Create your design your way, we'll share it with you on WhatsApp for approval before we start printing.
      - generic [ref=f1e152]:
        - generic [ref=f1e154]:
          - heading "Customer Reviews" [level=2] [ref=f1e155]
          - generic [ref=f1e156]:
            - generic [ref=f1e168]: 4.9 / 5
            - generic [ref=f1e169]: (128 reviews)
        - generic [ref=f1e170]:
          - generic [ref=f1e171]:
            - heading "\"Incredible print quality!\"" [level=3] [ref=f1e183]
            - paragraph [ref=f1e184]: I was worried the print might fade after a few washes, but it looks exactly like the day I bought it. The canvas is thick and feels very premium.
            - generic [ref=f1e186]:
              - generic [ref=f1e187]: Sarah J.
              - generic [ref=f1e191]: August 12, 2026
          - generic [ref=f1e192]:
            - heading "\"Best everyday tote ever!\"" [level=3] [ref=f1e204]
            - paragraph [ref=f1e205]: This fits my 15-inch laptop, a water bottle, and all my chargers without losing its shape. The strap length is perfect for wearing over a jacket.
            - generic [ref=f1e207]:
              - generic [ref=f1e208]: Michael T.
              - generic [ref=f1e212]: July 28, 2026
          - generic [ref=f1e213]:
            - heading "\"A wonderful gift\"" [level=3] [ref=f1e225]
            - paragraph [ref=f1e226]: I got this customized for my sister's birthday and she absolutely loved it. The packaging was beautiful and it arrived exactly on time.
            - generic [ref=f1e228]:
              - generic [ref=f1e229]: Emily R.
              - generic [ref=f1e233]: July 15, 2026
      - generic [ref=f1e235]:
        - heading "Frequently Asked Questions" [level=2] [ref=f1e236]
        - generic [ref=f1e237]:
          - generic [ref=f1e238]:
            - button "How long does shipping take?" [ref=f1e239]
            - paragraph [ref=f1e243]: Standard shipping takes 5-7 business days. Expedited options are available at checkout.
          - generic [ref=f1e244]:
            - button "Can I return a customized tote?" [ref=f1e245]
            - paragraph [ref=f1e249]: Customized items are made specifically for you and cannot be returned unless there is a manufacturing defect.
          - generic [ref=f1e250]:
            - button "What are the care instructions?" [ref=f1e251]
            - paragraph [ref=f1e255]: Spot clean with a damp cloth and mild soap. Do not machine wash or tumble dry as it may damage the custom print.
      - generic [ref=f1e257]:
        - heading "Related Products" [level=2] [ref=f1e259]
        - generic [ref=f1e260]:
          - link "CUSTOM GHIBLI TOTE BAG WITH TEXT CUSTOM GHIBLI TOTE BAG WITH TEXT (215) ₹599.00 ₹749.00" [ref=f1e261] [cursor=pointer]:
            - /url: /shop/ghibli-text-tote
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=f1e263]
            - generic [ref=f1e264]:
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=f1e265]
              - generic [ref=f1e266]: (215)
              - generic [ref=f1e279]:
                - generic [ref=f1e280]: ₹599.00
                - generic [ref=f1e281]: ₹749.00
          - link "CUTE EMOJI WITH GHIBLI TOTE CUTE EMOJI WITH GHIBLI TOTE (89) ₹599.00 ₹719.00" [ref=f1e282] [cursor=pointer]:
            - /url: /shop/emoji-ghibli-tote
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=f1e284]
            - generic [ref=f1e285]:
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=f1e286]
              - generic [ref=f1e287]: (89)
              - generic [ref=f1e300]:
                - generic [ref=f1e301]: ₹599.00
                - generic [ref=f1e302]: ₹719.00
          - link "POLAROID TOTE BAG POLAROID TOTE BAG (34) ₹499.00 ₹599.00" [ref=f1e303] [cursor=pointer]:
            - /url: /shop/polaroid-tote
            - img "POLAROID TOTE BAG" [ref=f1e305]
            - generic [ref=f1e306]:
              - heading "POLAROID TOTE BAG" [level=3] [ref=f1e307]
              - generic [ref=f1e308]: (34)
              - generic [ref=f1e321]:
                - generic [ref=f1e322]: ₹499.00
                - generic [ref=f1e323]: ₹599.00
          - link "ANY DESIGN TOTE BAG ANY DESIGN TOTE BAG (76) ₹499.00 ₹599.00" [ref=f1e324] [cursor=pointer]:
            - /url: /shop/any-design-tote
            - img "ANY DESIGN TOTE BAG" [ref=f1e326]
            - generic [ref=f1e327]:
              - heading "ANY DESIGN TOTE BAG" [level=3] [ref=f1e328]
              - generic [ref=f1e329]: (76)
              - generic [ref=f1e342]:
                - generic [ref=f1e343]: ₹499.00
                - generic [ref=f1e344]: ₹599.00
  - contentinfo [ref=f1e345]:
    - generic [ref=f1e346]:
      - generic [ref=f1e347]:
        - generic [ref=f1e348]:
          - link "Totemood" [ref=f1e349] [cursor=pointer]:
            - /url: /
          - paragraph [ref=f1e350]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=f1e351]:
          - generic [ref=f1e352]:
            - heading "Shop" [level=4] [ref=f1e353]
            - link "Collections" [ref=f1e354] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=f1e355] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=f1e356] [cursor=pointer]:
              - /url: /shop
          - generic [ref=f1e357]:
            - heading "Company" [level=4] [ref=f1e358]
            - link "About" [ref=f1e359] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=f1e360] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=f1e361] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=f1e362]:
          - heading "Connect" [level=4] [ref=f1e363]
          - link "WhatsApp" [ref=f1e364] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=f1e367] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=f1e370]:
        - paragraph [ref=f1e371]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=f1e372]: Mumbai, India
  - generic [ref=f1e373]:
    - link "Chat on WhatsApp" [ref=f1e374] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=f1e377] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=f1e380]
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
> 74  |     await page.locator("button[aria-label='Close cart']").click();
      |                                                           ^ Error: locator.click: Test timeout of 45000ms exceeded.
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