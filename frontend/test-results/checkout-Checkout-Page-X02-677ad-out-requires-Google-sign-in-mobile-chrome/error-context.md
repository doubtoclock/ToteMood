# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout Page >> X02 - signed-out checkout requires Google sign-in
- Location: tests/checkout.spec.ts:29:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('a[href=\'/checkout\']').first()
    - locator resolved to <a href="/checkout" class="block w-full mb-3">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  61 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="bg-[#FAF9F8] border-t border-[#E8E5DC] px-6 py-6 md:px-8">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

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
        - button "Cart" [ref=e14]:
          - generic [ref=e18]: "1"
  - generic [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Your Cart" [level=2] [ref=e23]
        - generic [ref=e24]: 1 item
      - button "Close cart" [ref=e25]
    - generic [ref=e31]:
      - img "CUSTOM GHIBLI ART TOTE BAG" [ref=e33]
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=e37]
            - generic [ref=e38]: Bestseller
          - button "Remove CUSTOM GHIBLI ART TOTE BAG" [ref=e39]
        - generic [ref=e43]:
          - generic [ref=e44]:
            - button "Decrease CUSTOM GHIBLI ART TOTE BAG quantity" [ref=e45]
            - generic [ref=e47]: "1"
            - button "Increase CUSTOM GHIBLI ART TOTE BAG quantity" [ref=e48]
          - generic [ref=e50]: ₹499.00
    - generic [ref=e51]:
      - generic [ref=e52]:
        - generic [ref=e53]: Subtotal
        - generic [ref=e54]: ₹499.00
      - paragraph [ref=e55]: Shipping and taxes calculated at checkout.
      - link [ref=e56] [cursor=pointer]:
        - /url: /checkout
        - button "Proceed to checkout →" [ref=e57]:
          - text: Proceed to checkout
          - generic [ref=e58]: →
      - button "Continue Shopping" [ref=e59]
  - main [ref=e62]:
    - generic [ref=e63]:
      - generic [ref=e64]:
        - link "Get a free sample preview on WhatsApp. WhatsApp us on +91 98908 42755" [ref=e65] [cursor=pointer]:
          - /url: https://wa.me/919890842755?text=Hi%20Totemood!%20I%27d%20like%20a%20free%20sample%20preview%20please.
        - generic [ref=e72]:
          - generic [ref=e73]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=e76]
            - generic [ref=e77]:
              - button [ref=e78]:
                - img "Thumbnail 1" [ref=e79]
              - button [ref=e80]:
                - img "Thumbnail 2" [ref=e81]
              - button [ref=e82]:
                - img "Thumbnail 3" [ref=e83]
              - button [ref=e84]:
                - img "Thumbnail 4" [ref=e85]
          - generic [ref=e86]:
            - paragraph [ref=e87]: Bestseller
            - heading "CUSTOM GHIBLI ART TOTE BAG" [level=1] [ref=e88]
            - generic [ref=e89]:
              - generic [ref=e90]: ₹499.00
              - generic [ref=e91]: ₹799.00
            - generic [ref=e92]: 142 reviews
            - paragraph [ref=e105]: Tote Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.
            - generic [ref=e106]:
              - generic [ref=e111]:
                - heading "Free Customisation Included" [level=4] [ref=e112]
                - paragraph [ref=e113]: Add your image and text during checkout.
              - generic [ref=e120]:
                - heading "Dispatches in 24-48 hours" [level=4] [ref=e121]
                - paragraph [ref=e122]: Free shipping on all orders.
            - generic [ref=e123]:
              - button "Customize & Add to Cart" [active] [ref=e124]
              - button "Buy Now" [ref=e125]
            - paragraph [ref=e126]: Secure payment. We use industry standard encryption.
      - generic [ref=e129]:
        - generic [ref=e130]:
          - heading "Premium Quality" [level=3] [ref=e135]
          - paragraph [ref=e136]: 300 GSM cotton canvas, built for lasting strength and everyday use.
        - generic [ref=e137]:
          - heading "Durable print" [level=3] [ref=e142]
          - paragraph [ref=e143]: Premium DTF printing designed to stay vibrant, even after gentle hand washing.
        - generic [ref=e144]:
          - heading "Your Design, Your Approval" [level=3] [ref=e149]
          - paragraph [ref=e150]: Create your design your way, we'll share it with you on WhatsApp for approval before we start printing.
      - generic [ref=e152]:
        - generic [ref=e154]:
          - heading "Customer Reviews" [level=2] [ref=e155]
          - generic [ref=e156]:
            - generic [ref=e168]: 4.9 / 5
            - generic [ref=e169]: (128 reviews)
        - generic [ref=e170]:
          - generic [ref=e171]:
            - heading "\"Incredible print quality!\"" [level=3] [ref=e183]
            - paragraph [ref=e184]: I was worried the print might fade after a few washes, but it looks exactly like the day I bought it. The canvas is thick and feels very premium.
            - generic [ref=e186]:
              - generic [ref=e187]: Sarah J.
              - generic [ref=e191]: August 12, 2026
          - generic [ref=e192]:
            - heading "\"Best everyday tote ever!\"" [level=3] [ref=e204]
            - paragraph [ref=e205]: This fits my 15-inch laptop, a water bottle, and all my chargers without losing its shape. The strap length is perfect for wearing over a jacket.
            - generic [ref=e207]:
              - generic [ref=e208]: Michael T.
              - generic [ref=e212]: July 28, 2026
          - generic [ref=e213]:
            - heading "\"A wonderful gift\"" [level=3] [ref=e225]
            - paragraph [ref=e226]: I got this customized for my sister's birthday and she absolutely loved it. The packaging was beautiful and it arrived exactly on time.
            - generic [ref=e228]:
              - generic [ref=e229]: Emily R.
              - generic [ref=e233]: July 15, 2026
      - generic [ref=e235]:
        - heading "Frequently Asked Questions" [level=2] [ref=e236]
        - generic [ref=e237]:
          - generic [ref=e238]:
            - button "How long does shipping take?" [ref=e239]
            - paragraph [ref=e243]: Standard shipping takes 5-7 business days. Expedited options are available at checkout.
          - generic [ref=e244]:
            - button "Can I return a customized tote?" [ref=e245]
            - paragraph [ref=e249]: Customized items are made specifically for you and cannot be returned unless there is a manufacturing defect.
          - generic [ref=e250]:
            - button "What are the care instructions?" [ref=e251]
            - paragraph [ref=e255]: Spot clean with a damp cloth and mild soap. Do not machine wash or tumble dry as it may damage the custom print.
      - generic [ref=e257]:
        - heading "Related Products" [level=2] [ref=e259]
        - generic [ref=e260]:
          - link "CUSTOM GHIBLI TOTE BAG WITH TEXT CUSTOM GHIBLI TOTE BAG WITH TEXT (215) ₹599.00 ₹749.00" [ref=e261] [cursor=pointer]:
            - /url: /shop/ghibli-text-tote
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=e263]
            - generic [ref=e264]:
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=e265]
              - generic [ref=e266]: (215)
              - generic [ref=e279]:
                - generic [ref=e280]: ₹599.00
                - generic [ref=e281]: ₹749.00
          - link "CUTE EMOJI WITH GHIBLI TOTE CUTE EMOJI WITH GHIBLI TOTE (89) ₹599.00 ₹719.00" [ref=e282] [cursor=pointer]:
            - /url: /shop/emoji-ghibli-tote
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=e284]
            - generic [ref=e285]:
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=e286]
              - generic [ref=e287]: (89)
              - generic [ref=e300]:
                - generic [ref=e301]: ₹599.00
                - generic [ref=e302]: ₹719.00
          - link "POLAROID TOTE BAG POLAROID TOTE BAG (34) ₹499.00 ₹599.00" [ref=e303] [cursor=pointer]:
            - /url: /shop/polaroid-tote
            - img "POLAROID TOTE BAG" [ref=e305]
            - generic [ref=e306]:
              - heading "POLAROID TOTE BAG" [level=3] [ref=e307]
              - generic [ref=e308]: (34)
              - generic [ref=e321]:
                - generic [ref=e322]: ₹499.00
                - generic [ref=e323]: ₹599.00
          - link "ANY DESIGN TOTE BAG ANY DESIGN TOTE BAG (76) ₹499.00 ₹599.00" [ref=e324] [cursor=pointer]:
            - /url: /shop/any-design-tote
            - img "ANY DESIGN TOTE BAG" [ref=e326]
            - generic [ref=e327]:
              - heading "ANY DESIGN TOTE BAG" [level=3] [ref=e328]
              - generic [ref=e329]: (76)
              - generic [ref=e342]:
                - generic [ref=e343]: ₹499.00
                - generic [ref=e344]: ₹599.00
  - contentinfo [ref=e345]:
    - generic [ref=e346]:
      - generic [ref=e347]:
        - generic [ref=e348]:
          - link "Totemood" [ref=e349] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e350]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=e351]:
          - generic [ref=e352]:
            - heading "Shop" [level=4] [ref=e353]
            - link "Collections" [ref=e354] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=e355] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=e356] [cursor=pointer]:
              - /url: /shop
          - generic [ref=e357]:
            - heading "Company" [level=4] [ref=e358]
            - link "About" [ref=e359] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e360] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=e361] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=e362]:
          - heading "Connect" [level=4] [ref=e363]
          - link "WhatsApp" [ref=e364] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e367] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=e370]:
        - paragraph [ref=e371]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=e372]: Mumbai, India
  - generic [ref=e373]:
    - link "Chat on WhatsApp" [ref=e374] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=e377] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=e380]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const PRODUCT = "/shop/ghibli-art-tote";
  4  | 
  5  | async function goSignedIn(page: import("@playwright/test").Page) {
  6  |   await page.addInitScript(() => {
  7  |     localStorage.setItem("totemood_account_token", "mock-token");
  8  |     localStorage.setItem(
  9  |       "totemood_account_profile",
  10 |       JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", phone: "", picture: "" })
  11 |     );
  12 |   });
  13 |   await page.goto(PRODUCT);
  14 |   await page.waitForLoadState("domcontentloaded");
  15 |   await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
  16 |   await page.locator("a[href='/checkout']").first().click();
  17 |   await page.waitForLoadState("domcontentloaded");
  18 | }
  19 | 
  20 | test.describe("Checkout Page", () => {
  21 |   test("X01 - empty cart shows empty state with link back to shop", async ({ page }) => {
  22 |     await page.goto("/checkout");
  23 |     await page.waitForLoadState("domcontentloaded");
  24 |     await expect(page.getByText(/cart is empty/i)).toBeVisible({ timeout: 10000 });
  25 |     const back = page.locator("main a[href='/shop']").first();
  26 |     await expect(back).toBeVisible();
  27 |   });
  28 | 
  29 |   test("X02 - signed-out checkout requires Google sign-in", async ({ page }) => {
  30 |     await page.goto(PRODUCT);
  31 |     await page.waitForLoadState("domcontentloaded");
  32 |     await page.locator("button").filter({ hasText: /Add to Cart/ }).first().click();
> 33 |     await page.locator("a[href='/checkout']").first().click();
     |                                                       ^ Error: locator.click: Test timeout of 45000ms exceeded.
  34 |     await expect(page.getByText(/sign in/i).first()).toBeVisible({ timeout: 10000 });
  35 |   });
  36 | 
  37 |   test("X03 - signed-in checkout shows contact form fields", async ({ page }) => {
  38 |     await goSignedIn(page);
  39 |     for (const name of ["email", "phone", "firstName", "lastName", "address", "city", "state", "zip"]) {
  40 |       await expect(page.locator(`input[name='${name}']`)).toBeVisible({ timeout: 10000 });
  41 |     }
  42 |   });
  43 | 
  44 |   test("X04 - form pre-fills email and name from account", async ({ page }) => {
  45 |     await goSignedIn(page);
  46 |     // Default saved address fetch may fill fields; at minimum email input accepts typing
  47 |     const email = page.locator("input[name='email']");
  48 |     await expect(email).toBeVisible({ timeout: 10000 });
  49 |     await email.fill("buyer@example.com");
  50 |     await expect(email).toHaveValue("buyer@example.com");
  51 |   });
  52 | 
  53 |   test("X05 - order summary shows subtotal, shipping and total", async ({ page }) => {
  54 |     await goSignedIn(page);
  55 |     await expect(page.getByText("Subtotal")).toBeVisible({ timeout: 10000 });
  56 |     await expect(page.getByText("Shipping")).toBeVisible();
  57 |     await expect(page.locator("text=₹499.00").first()).toBeVisible();
  58 |   });
  59 | 
  60 |   test("X06 - order over ₹150 ships free", async ({ page }) => {
  61 |     await goSignedIn(page);
  62 |     await expect(page.locator("[class*='justify-between']").filter({ hasText: "Shipping" }).getByText("Free")).toBeVisible({ timeout: 10000 });
  63 |   });
  64 | 
  65 |   test("X07 - COD selected by default showing ₹49 deposit; prepaid selectable", async ({ page }) => {
  66 |     await goSignedIn(page);
  67 |     await expect(page.getByText("Cash on Delivery")).toBeVisible({ timeout: 10000 });
  68 |     await expect(page.getByText(/₹49 advance|₹49 online now/i).first()).toBeVisible();
  69 |     await page.locator("button").filter({ hasText: "Prepaid" }).click();
  70 |     await expect(page.getByText(/full payment of ₹499\.00/i)).toBeVisible({ timeout: 3000 });
  71 |   });
  72 | 
  73 |   test("X08 - submitting invalid form shows validation errors", async ({ page }) => {
  74 |     await goSignedIn(page);
  75 |     await page.locator("button[type='submit']").click();
  76 |     await expect(page.locator("p").filter({ hasText: /required|valid/i }).first()).toBeVisible({ timeout: 5000 });
  77 |   });
  78 | });
  79 | 
```