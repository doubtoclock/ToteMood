# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shop.spec.ts >> Shop Page >> S10 - shop page renders without critical JS errors
- Location: tests/shop.spec.ts:84:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings."]
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
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
        - button "Cart" [ref=f1e14]
  - main [ref=f1e18]:
    - generic [ref=f1e19]: Enjoy Free Delivery to All Customers on every single order!
    - generic [ref=f1e28]:
      - heading "Super Customisable Tote Bags" [level=1] [ref=f1e29]
      - paragraph [ref=f1e30]: Add your photos, words, emojis, and everything that makes it uniquely yours
    - generic [ref=f1e33]:
      - generic [ref=f1e34]:
        - generic [ref=f1e35]:
          - link [ref=f1e36] [cursor=pointer]:
            - /url: /shop/ghibli-art-tote
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=f1e37]
          - generic [ref=f1e38]: Custom
          - button "Add CUSTOM GHIBLI ART TOTE BAG to cart" [ref=f1e39]
        - link "CUSTOM GHIBLI ART TOTE BAG ₹499.00 ₹799.00 (142)" [ref=f1e44] [cursor=pointer]:
          - /url: /shop/ghibli-art-tote
          - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=f1e46]
          - generic [ref=f1e47]:
            - generic [ref=f1e48]: ₹499.00
            - generic [ref=f1e49]: ₹799.00
          - generic [ref=f1e50]: (142)
      - generic [ref=f1e64]:
        - generic [ref=f1e65]:
          - link [ref=f1e66] [cursor=pointer]:
            - /url: /shop/ghibli-text-tote
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=f1e67]
          - generic [ref=f1e68]: Custom
          - button "Add CUSTOM GHIBLI TOTE BAG WITH TEXT to cart" [ref=f1e69]
        - link "CUSTOM GHIBLI TOTE BAG WITH TEXT ₹599.00 ₹749.00 (215)" [ref=f1e74] [cursor=pointer]:
          - /url: /shop/ghibli-text-tote
          - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=f1e76]
          - generic [ref=f1e77]:
            - generic [ref=f1e78]: ₹599.00
            - generic [ref=f1e79]: ₹749.00
          - generic [ref=f1e80]: (215)
      - generic [ref=f1e94]:
        - generic [ref=f1e95]:
          - link [ref=f1e96] [cursor=pointer]:
            - /url: /shop/emoji-ghibli-tote
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=f1e97]
          - generic [ref=f1e98]: Custom
          - button "Add CUTE EMOJI WITH GHIBLI TOTE to cart" [ref=f1e99]
        - link "CUTE EMOJI WITH GHIBLI TOTE ₹599.00 ₹719.00 (89)" [ref=f1e104] [cursor=pointer]:
          - /url: /shop/emoji-ghibli-tote
          - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=f1e106]
          - generic [ref=f1e107]:
            - generic [ref=f1e108]: ₹599.00
            - generic [ref=f1e109]: ₹719.00
          - generic [ref=f1e110]: (89)
      - generic [ref=f1e124]:
        - generic [ref=f1e125]:
          - link [ref=f1e126] [cursor=pointer]:
            - /url: /shop/polaroid-tote
            - img "POLAROID TOTE BAG" [ref=f1e127]
          - generic [ref=f1e128]: Custom
          - button "Add POLAROID TOTE BAG to cart" [ref=f1e129]
        - link "POLAROID TOTE BAG ₹499.00 ₹599.00 (34)" [ref=f1e134] [cursor=pointer]:
          - /url: /shop/polaroid-tote
          - heading "POLAROID TOTE BAG" [level=3] [ref=f1e136]
          - generic [ref=f1e137]:
            - generic [ref=f1e138]: ₹499.00
            - generic [ref=f1e139]: ₹599.00
          - generic [ref=f1e140]: (34)
      - generic [ref=f1e154]:
        - generic [ref=f1e155]:
          - link [ref=f1e156] [cursor=pointer]:
            - /url: /shop/any-design-tote
            - img "ANY DESIGN TOTE BAG" [ref=f1e157]
          - generic [ref=f1e158]: Custom
          - button "Add ANY DESIGN TOTE BAG to cart" [ref=f1e159]
        - link "ANY DESIGN TOTE BAG ₹499.00 ₹599.00 (76)" [ref=f1e164] [cursor=pointer]:
          - /url: /shop/any-design-tote
          - heading "ANY DESIGN TOTE BAG" [level=3] [ref=f1e166]
          - generic [ref=f1e167]:
            - generic [ref=f1e168]: ₹499.00
            - generic [ref=f1e169]: ₹599.00
          - generic [ref=f1e170]: (76)
    - generic [ref=f1e186]:
      - heading "We Have Made 1,000+ Custom Tote Bags" [level=3] [ref=f1e187]
      - generic [ref=f1e188]:
        - generic [ref=f1e189]:
          - generic [ref=f1e192]: 4.9/5 Average Rating
          - generic [ref=f1e193]: From 1,000+ Reviews
        - generic [ref=f1e194]:
          - generic [ref=f1e200]: Fast & Free Shipping
          - generic [ref=f1e201]: To all customers
        - generic [ref=f1e202]:
          - generic [ref=f1e205]: WhatsApp Support
          - generic [ref=f1e206]: Instant assistance
        - generic [ref=f1e207]:
          - generic [ref=f1e211]: Secure & Safe Checkout
          - generic [ref=f1e212]: Your data is protected
    - generic [ref=f1e214]:
      - generic [ref=f1e216]:
        - heading "Honest Customer Reviews from Totemood." [level=2] [ref=f1e217]: Honest Customer Reviewsfrom Totemood.
        - paragraph [ref=f1e218]: See what our community is saying about their Totemood experience.
      - generic [ref=f1e219]:
        - generic [ref=f1e221]:
          - generic [ref=f1e222]:
            - img "Customer Review" [ref=f1e224] [cursor=pointer]
            - img "Customer Review" [ref=f1e226] [cursor=pointer]
            - img "Customer Review" [ref=f1e228] [cursor=pointer]
            - img "Customer Review" [ref=f1e230] [cursor=pointer]
            - img "Customer Review" [ref=f1e232] [cursor=pointer]
            - img "Customer Review" [ref=f1e234] [cursor=pointer]
            - img "Customer Review" [ref=f1e236] [cursor=pointer]
          - generic [ref=f1e237]:
            - img "Customer Review" [ref=f1e239] [cursor=pointer]
            - img "Customer Review" [ref=f1e241] [cursor=pointer]
            - img "Customer Review" [ref=f1e243] [cursor=pointer]
            - img "Customer Review" [ref=f1e245] [cursor=pointer]
            - img "Customer Review" [ref=f1e247] [cursor=pointer]
            - img "Customer Review" [ref=f1e249] [cursor=pointer]
            - img "Customer Review" [ref=f1e251] [cursor=pointer]
        - generic [ref=f1e253]:
          - generic [ref=f1e254]:
            - img "Customer Review" [ref=f1e256] [cursor=pointer]
            - img "Customer Review" [ref=f1e258] [cursor=pointer]
            - img "Customer Review" [ref=f1e260] [cursor=pointer]
            - img "Customer Review" [ref=f1e262] [cursor=pointer]
            - img "Customer Review" [ref=f1e264] [cursor=pointer]
            - img "Customer Review" [ref=f1e266] [cursor=pointer]
            - img "Customer Review" [ref=f1e268] [cursor=pointer]
          - generic [ref=f1e269]:
            - img "Customer Review" [ref=f1e271] [cursor=pointer]
            - img "Customer Review" [ref=f1e273] [cursor=pointer]
            - img "Customer Review" [ref=f1e275] [cursor=pointer]
            - img "Customer Review" [ref=f1e277] [cursor=pointer]
            - img "Customer Review" [ref=f1e279] [cursor=pointer]
            - img "Customer Review" [ref=f1e281] [cursor=pointer]
            - img "Customer Review" [ref=f1e283] [cursor=pointer]
        - generic [ref=f1e286]:
          - generic [ref=f1e287]:
            - img "Customer Review" [ref=f1e289] [cursor=pointer]
            - img "Customer Review" [ref=f1e291] [cursor=pointer]
            - img "Customer Review" [ref=f1e293] [cursor=pointer]
            - img "Customer Review" [ref=f1e295] [cursor=pointer]
            - img "Customer Review" [ref=f1e297] [cursor=pointer]
            - img "Customer Review" [ref=f1e299] [cursor=pointer]
            - img "Customer Review" [ref=f1e301] [cursor=pointer]
          - generic [ref=f1e302]:
            - img "Customer Review" [ref=f1e304] [cursor=pointer]
            - img "Customer Review" [ref=f1e306] [cursor=pointer]
            - img "Customer Review" [ref=f1e308] [cursor=pointer]
            - img "Customer Review" [ref=f1e310] [cursor=pointer]
            - img "Customer Review" [ref=f1e312] [cursor=pointer]
            - img "Customer Review" [ref=f1e314] [cursor=pointer]
            - img "Customer Review" [ref=f1e316] [cursor=pointer]
        - generic [ref=f1e319]:
          - generic [ref=f1e320]:
            - img "Customer Review" [ref=f1e322] [cursor=pointer]
            - img "Customer Review" [ref=f1e324] [cursor=pointer]
            - img "Customer Review" [ref=f1e326] [cursor=pointer]
            - img "Customer Review" [ref=f1e328] [cursor=pointer]
            - img "Customer Review" [ref=f1e330] [cursor=pointer]
            - img "Customer Review" [ref=f1e332] [cursor=pointer]
          - generic [ref=f1e333]:
            - img "Customer Review" [ref=f1e335] [cursor=pointer]
            - img "Customer Review" [ref=f1e337] [cursor=pointer]
            - img "Customer Review" [ref=f1e339] [cursor=pointer]
            - img "Customer Review" [ref=f1e341] [cursor=pointer]
            - img "Customer Review" [ref=f1e343] [cursor=pointer]
            - img "Customer Review" [ref=f1e345] [cursor=pointer]
  - contentinfo [ref=f1e346]:
    - generic [ref=f1e347]:
      - generic [ref=f1e348]:
        - generic [ref=f1e349]:
          - link "Totemood" [ref=f1e350] [cursor=pointer]:
            - /url: /
          - paragraph [ref=f1e351]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=f1e352]:
          - generic [ref=f1e353]:
            - heading "Shop" [level=4] [ref=f1e354]
            - link "Collections" [ref=f1e355] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=f1e356] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=f1e357] [cursor=pointer]:
              - /url: /shop
          - generic [ref=f1e358]:
            - heading "Company" [level=4] [ref=f1e359]
            - link "About" [ref=f1e360] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=f1e361] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=f1e362] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=f1e363]:
          - heading "Connect" [level=4] [ref=f1e364]
          - link "WhatsApp" [ref=f1e365] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=f1e368] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=f1e371]:
        - paragraph [ref=f1e372]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=f1e373]: Mumbai, India
  - generic [ref=f1e374]:
    - link "Chat on WhatsApp" [ref=f1e375] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=f1e378] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=f1e381]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Shop Page", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/shop");
  6  |     await page.waitForLoadState("domcontentloaded");
  7  |   });
  8  | 
  9  |   test("S01 - loads with title, main area and free delivery banner", async ({ page }) => {
  10 |     await expect(page).toHaveTitle(/Totemood|Shop/i);
  11 |     await expect(page.locator("main").first()).toBeVisible();
  12 |     await expect(page.locator("text=Free Delivery to All Customers")).toBeVisible();
  13 |   });
  14 | 
  15 |   test("S02 - product grid shows at least 5 products", async ({ page }) => {
  16 |     const cards = page.locator("a[href^='/shop/']");
  17 |     await expect(cards.first()).toBeVisible({ timeout: 10000 });
  18 |     expect(await cards.count()).toBeGreaterThanOrEqual(5);
  19 |     const grid = page.locator(".grid").first();
  20 |     await expect(grid).toBeVisible();
  21 |   });
  22 | 
  23 |   test("S03 - product cards show image, name and price", async ({ page }) => {
  24 |     const card = page.locator("a[href^='/shop/']").first();
  25 |     await expect(card).toBeVisible({ timeout: 10000 });
  26 |     await expect(card.locator("img").first()).toBeVisible();
  27 |     const alt = await card.locator("img").first().getAttribute("alt");
  28 |     expect(alt).toBeTruthy();
  29 |     await expect(page.locator("h3").filter({ hasText: /tote/i }).first()).toBeVisible();
  30 |     await expect(page.locator("text=/₹\\d+/").first()).toBeVisible();
  31 |   });
  32 | 
  33 |   test("S04 - customizable products show Custom badge", async ({ page }) => {
  34 |     const badge = page.locator("text=Custom").first();
  35 |     await expect(badge).toBeVisible({ timeout: 10000 });
  36 |   });
  37 | 
  38 |   test("S05 - hover on product card reveals add-to-cart button", async ({ page }) => {
  39 |     const card = page.locator("a[href^='/shop/']").first();
  40 |     await card.hover();
  41 |     const btn = page.locator("button[aria-label*='Add']").first();
  42 |     await expect(btn).toBeVisible({ timeout: 5000 });
  43 |     await expect(btn.locator("svg")).toBeVisible();
  44 |   });
  45 | 
  46 |   test("S06 - all product links have valid hrefs", async ({ page }) => {
  47 |     const links = page.locator("a[href^='/shop/']");
  48 |     await expect(links.first()).toBeVisible({ timeout: 10000 });
  49 |     const count = await links.count();
  50 |     for (let i = 0; i < count; i++) {
  51 |       const href = await links.nth(i).getAttribute("href");
  52 |       expect(href).toMatch(/^\/shop\/[\w-]+$/);
  53 |     }
  54 |   });
  55 | 
  56 |   test("S07 - clicking a product opens its detail page", async ({ page }) => {
  57 |     const card = page.locator("a[href^='/shop/']").first();
  58 |     const href = await card.getAttribute("href");
  59 |     await card.click();
  60 |     await expect(page).toHaveURL(new RegExp(href!));
  61 |     await page.goBack();
  62 |     await expect(page).toHaveURL(/\/shop/);
  63 |   });
  64 | 
  65 |   test("S08 - adding item from shop hover updates cart badge to 1", async ({ page }) => {
  66 |     const card = page.locator("a[href^='/shop/']").first();
  67 |     await card.hover();
  68 |     await page.locator("button[aria-label*='Add']").first().click();
  69 |     const badge = page.locator("button[aria-label='Cart'] span");
  70 |     await expect(badge).toHaveText("1", { timeout: 5000 });
  71 |   });
  72 | 
  73 |   test("S09 - adding same item twice increments quantity to 2", async ({ page }) => {
  74 |     const card = page.locator("a[href^='/shop/']").first();
  75 |     await card.hover();
  76 |     await page.locator("button[aria-label*='Add']").first().click();
  77 |     await page.waitForTimeout(400);
  78 |     await card.hover();
  79 |     await page.locator("button[aria-label*='Add']").first().click();
  80 |     const badge = page.locator("button[aria-label='Cart'] span");
  81 |     await expect(badge).toHaveText("2", { timeout: 5000 });
  82 |   });
  83 | 
  84 |   test("S10 - shop page renders without critical JS errors", async ({ page }) => {
  85 |     const errors: string[] = [];
  86 |     page.on("pageerror", (err) => errors.push(err.message));
  87 |     await page.goto("/shop");
  88 |     await page.waitForLoadState("domcontentloaded");
  89 |     await page.waitForTimeout(2000);
  90 |     const critical = errors.filter((e) => !/google|favicon|socket|hydrat/i.test(e));
> 91 |     expect(critical).toHaveLength(0);
     |                      ^ Error: expect(received).toHaveLength(expected)
  92 |   });
  93 | });
  94 | 
```