# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Home Page >> H12 - home page renders without critical JS errors
- Location: tests/home.spec.ts:84:7

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
    - generic [ref=f1e20]:
      - generic [ref=f1e25]:
        - heading "From your photo to a Timeless Tote" [level=2] [ref=f1e26]
        - paragraph [ref=f1e27]: Every detail is meticulously crafted. Watch your memory transform into wearable art.
      - generic:
        - generic:
          - generic:
            - img "Original Photo"
          - generic:
            - img "Illustrated Artwork"
      - generic [ref=f1e29]:
        - heading "Every memory deserves to be carried." [level=3] [ref=f1e30]
        - link "Create Yours" [ref=f1e31] [cursor=pointer]:
          - /url: /shop
      - generic:
        - generic:
          - generic: Upload Your Photo
          - generic: We Turn It Into Art
          - generic: Printed on Your Tote
    - generic [ref=f1e32]:
      - generic [ref=f1e40]:
        - heading "Bags that speak." [level=1] [ref=f1e41]: Bags thatspeak.
        - paragraph [ref=f1e42]: Customize your best memories into your gift which you can gift to your friends, partner, family.
      - generic [ref=f1e43]:
        - button "Previous Illustration" [ref=f1e44]
        - button "Next Illustration" [ref=f1e47]
    - generic [ref=f1e51]:
      - generic [ref=f1e52]:
        - generic [ref=f1e53]:
          - heading "Carry a little something with you." [level=2] [ref=f1e54]
          - paragraph [ref=f1e55]: Let's customize your tote bag with your personalized image and text.
        - link "Shop Collection →" [ref=f1e56] [cursor=pointer]:
          - /url: /shop
          - text: Shop Collection
          - generic [ref=f1e57]: →
      - generic [ref=f1e58]:
        - link "CUSTOM GHIBLI ART TOTE BAG Bestseller CUSTOM GHIBLI ART TOTE BAG ₹799.00 ₹499.00" [ref=f1e59] [cursor=pointer]:
          - /url: /shop/ghibli-art-tote
          - generic [ref=f1e60]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=f1e62]
            - generic [ref=f1e63]:
              - generic [ref=f1e64]: Bestseller
              - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=f1e65]
              - paragraph [ref=f1e66]:
                - generic [ref=f1e67]: ₹799.00
                - generic [ref=f1e68]: ₹499.00
        - link "CUSTOM GHIBLI TOTE BAG WITH TEXT Bestseller CUSTOM GHIBLI TOTE BAG WITH TEXT ₹749.00 ₹599.00" [ref=f1e69] [cursor=pointer]:
          - /url: /shop/ghibli-text-tote
          - generic [ref=f1e70]:
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=f1e72]
            - generic [ref=f1e73]:
              - generic [ref=f1e74]: Bestseller
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=f1e75]
              - paragraph [ref=f1e76]:
                - generic [ref=f1e77]: ₹749.00
                - generic [ref=f1e78]: ₹599.00
        - link "CUTE EMOJI WITH GHIBLI TOTE Bestseller CUTE EMOJI WITH GHIBLI TOTE ₹719.00 ₹599.00" [ref=f1e79] [cursor=pointer]:
          - /url: /shop/emoji-ghibli-tote
          - generic [ref=f1e80]:
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=f1e82]
            - generic [ref=f1e83]:
              - generic [ref=f1e84]: Bestseller
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=f1e85]
              - paragraph [ref=f1e86]:
                - generic [ref=f1e87]: ₹719.00
                - generic [ref=f1e88]: ₹599.00
        - link "POLAROID TOTE BAG New POLAROID TOTE BAG ₹599.00 ₹499.00" [ref=f1e89] [cursor=pointer]:
          - /url: /shop/polaroid-tote
          - generic [ref=f1e90]:
            - img "POLAROID TOTE BAG" [ref=f1e92]
            - generic [ref=f1e93]:
              - generic [ref=f1e94]: New
              - heading "POLAROID TOTE BAG" [level=3] [ref=f1e95]
              - paragraph [ref=f1e96]:
                - generic [ref=f1e97]: ₹599.00
                - generic [ref=f1e98]: ₹499.00
    - generic [ref=f1e100]:
      - generic [ref=f1e102]:
        - heading "Honest Customer Reviews from Totemood." [level=2] [ref=f1e103]: Honest Customer Reviewsfrom Totemood.
        - paragraph [ref=f1e104]: See what our community is saying about their Totemood experience.
      - generic [ref=f1e105]:
        - generic [ref=f1e107]:
          - generic [ref=f1e108]:
            - img "Customer Review" [ref=f1e110] [cursor=pointer]
            - img "Customer Review" [ref=f1e112] [cursor=pointer]
            - img "Customer Review" [ref=f1e114] [cursor=pointer]
            - img "Customer Review" [ref=f1e116] [cursor=pointer]
            - img "Customer Review" [ref=f1e118] [cursor=pointer]
            - img "Customer Review" [ref=f1e120] [cursor=pointer]
            - img "Customer Review" [ref=f1e122] [cursor=pointer]
          - generic [ref=f1e123]:
            - img "Customer Review" [ref=f1e125] [cursor=pointer]
            - img "Customer Review" [ref=f1e127] [cursor=pointer]
            - img "Customer Review" [ref=f1e129] [cursor=pointer]
            - img "Customer Review" [ref=f1e131] [cursor=pointer]
            - img "Customer Review" [ref=f1e133] [cursor=pointer]
            - img "Customer Review" [ref=f1e135] [cursor=pointer]
            - img "Customer Review" [ref=f1e137] [cursor=pointer]
        - generic [ref=f1e139]:
          - generic [ref=f1e140]:
            - img "Customer Review" [ref=f1e142] [cursor=pointer]
            - img "Customer Review" [ref=f1e144] [cursor=pointer]
            - img "Customer Review" [ref=f1e146] [cursor=pointer]
            - img "Customer Review" [ref=f1e148] [cursor=pointer]
            - img "Customer Review" [ref=f1e150] [cursor=pointer]
            - img "Customer Review" [ref=f1e152] [cursor=pointer]
            - img "Customer Review" [ref=f1e154] [cursor=pointer]
          - generic [ref=f1e155]:
            - img "Customer Review" [ref=f1e157] [cursor=pointer]
            - img "Customer Review" [ref=f1e159] [cursor=pointer]
            - img "Customer Review" [ref=f1e161] [cursor=pointer]
            - img "Customer Review" [ref=f1e163] [cursor=pointer]
            - img "Customer Review" [ref=f1e165] [cursor=pointer]
            - img "Customer Review" [ref=f1e167] [cursor=pointer]
            - img "Customer Review" [ref=f1e169] [cursor=pointer]
        - generic [ref=f1e172]:
          - generic [ref=f1e173]:
            - img "Customer Review" [ref=f1e175] [cursor=pointer]
            - img "Customer Review" [ref=f1e177] [cursor=pointer]
            - img "Customer Review" [ref=f1e179] [cursor=pointer]
            - img "Customer Review" [ref=f1e181] [cursor=pointer]
            - img "Customer Review" [ref=f1e183] [cursor=pointer]
            - img "Customer Review" [ref=f1e185] [cursor=pointer]
            - img "Customer Review" [ref=f1e187] [cursor=pointer]
          - generic [ref=f1e188]:
            - img "Customer Review" [ref=f1e190] [cursor=pointer]
            - img "Customer Review" [ref=f1e192] [cursor=pointer]
            - img "Customer Review" [ref=f1e194] [cursor=pointer]
            - img "Customer Review" [ref=f1e196] [cursor=pointer]
            - img "Customer Review" [ref=f1e198] [cursor=pointer]
            - img "Customer Review" [ref=f1e200] [cursor=pointer]
            - img "Customer Review" [ref=f1e202] [cursor=pointer]
        - generic [ref=f1e205]:
          - generic [ref=f1e206]:
            - img "Customer Review" [ref=f1e208] [cursor=pointer]
            - img "Customer Review" [ref=f1e210] [cursor=pointer]
            - img "Customer Review" [ref=f1e212] [cursor=pointer]
            - img "Customer Review" [ref=f1e214] [cursor=pointer]
            - img "Customer Review" [ref=f1e216] [cursor=pointer]
            - img "Customer Review" [ref=f1e218] [cursor=pointer]
          - generic [ref=f1e219]:
            - img "Customer Review" [ref=f1e221] [cursor=pointer]
            - img "Customer Review" [ref=f1e223] [cursor=pointer]
            - img "Customer Review" [ref=f1e225] [cursor=pointer]
            - img "Customer Review" [ref=f1e227] [cursor=pointer]
            - img "Customer Review" [ref=f1e229] [cursor=pointer]
            - img "Customer Review" [ref=f1e231] [cursor=pointer]
    - generic [ref=f1e234]:
      - generic [ref=f1e235]:
        - generic [ref=f1e236]: Frequently Asked Questions
        - heading "Everything you might want to know." [level=2] [ref=f1e237]
      - generic [ref=f1e238]:
        - generic [ref=f1e239]:
          - button "How long will it take to share the design with the customer?" [ref=f1e240]
          - paragraph [ref=f1e244]: The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.
        - generic [ref=f1e245]:
          - button "Will I get to see the design before it is printed?" [ref=f1e246]
          - paragraph [ref=f1e250]: Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.
        - generic [ref=f1e251]:
          - button "Why don't you offer full Cash on Delivery?" [ref=f1e252]
          - paragraph [ref=f1e256]: Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.
        - generic [ref=f1e257]:
          - button "Why do I need to pay ₹49 while placing the order?" [ref=f1e258]
          - paragraph [ref=f1e262]: We take a ₹49 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.
        - generic [ref=f1e263]:
          - button "Is there any return policy?" [ref=f1e264]
          - paragraph [ref=f1e268]: Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).
        - generic [ref=f1e269]:
          - button "What if I want changes in the design?" [ref=f1e270]
          - paragraph [ref=f1e274]: No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.
        - generic [ref=f1e275]:
          - button "How long will it take to receive my order?" [ref=f1e276]
          - paragraph [ref=f1e280]: Once your design is approved, your order is printed and delivered within 4-6 working days.
    - generic [ref=f1e282]:
      - generic:
        - generic:
          - img "Totemood Product Mockup"
      - generic:
        - heading "TOTE MOOD" [level=2]:
          - generic: TOTE
          - generic: MOOD
      - generic [ref=f1e283]:
        - generic [ref=f1e284]:
          - link "Collections" [ref=f1e285] [cursor=pointer]:
            - /url: /shop
          - link "About" [ref=f1e286] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=f1e287] [cursor=pointer]:
            - /url: /#faq
          - link "Contact" [ref=f1e288] [cursor=pointer]:
            - /url: /contact
        - generic [ref=f1e289]:
          - link "WhatsApp" [ref=f1e290] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=f1e291] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
        - generic [ref=f1e292]: © 2026 Totemood. All rights reserved.
  - contentinfo [ref=f1e293]:
    - generic [ref=f1e294]:
      - generic [ref=f1e295]:
        - generic [ref=f1e296]:
          - link "Totemood" [ref=f1e297] [cursor=pointer]:
            - /url: /
          - paragraph [ref=f1e298]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=f1e299]:
          - generic [ref=f1e300]:
            - heading "Shop" [level=4] [ref=f1e301]
            - link "Collections" [ref=f1e302] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=f1e303] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=f1e304] [cursor=pointer]:
              - /url: /shop
          - generic [ref=f1e305]:
            - heading "Company" [level=4] [ref=f1e306]
            - link "About" [ref=f1e307] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=f1e308] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=f1e309] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=f1e310]:
          - heading "Connect" [level=4] [ref=f1e311]
          - link "WhatsApp" [ref=f1e312] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=f1e315] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=f1e318]:
        - paragraph [ref=f1e319]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=f1e320]: Mumbai, India
  - generic [ref=f1e321]:
    - link "Chat on WhatsApp" [ref=f1e322] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=f1e325] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=f1e328]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Home Page", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await page.waitForLoadState("domcontentloaded");
  7  |   });
  8  | 
  9  |   test("H01 - loads with correct title, landmarks and navbar", async ({ page }) => {
  10 |     await expect(page).toHaveTitle(/Totemood/);
  11 |     await expect(page.locator("header").first()).toBeVisible();
  12 |     await expect(page.locator("main").first()).toBeVisible();
  13 |     await expect(page.locator("footer")).toBeVisible();
  14 |     const logo = page.locator("header a").filter({ hasText: "Totemood" }).first();
  15 |     await expect(logo).toBeVisible();
  16 |     await expect(logo).toHaveClass(/font-script/);
  17 |   });
  18 | 
  19 |   test("H02 - desktop navbar shows all primary links", async ({ page }) => {
  20 |     for (const name of ["Home", "Shop", "Stories", "About", "Contact"]) {
  21 |       await expect(page.locator("nav a").filter({ hasText: name }).first()).toBeVisible();
  22 |     }
  23 |     await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  24 |     await expect(page.locator("button[aria-label='Open menu']")).toBeHidden();
  25 |   });
  26 | 
  27 |   test("H03 - hero section renders with CTA to shop", async ({ page }) => {
  28 |     const cta = page.locator("a[href='/shop']").first();
  29 |     await expect(cta).toBeVisible({ timeout: 10000 });
  30 |     const hero = page.locator("text=/carry|story/i").first();
  31 |     await expect(hero).toBeVisible({ timeout: 10000 });
  32 |   });
  33 | 
  34 |   test("H04 - featured collection shows products with names and prices", async ({ page }) => {
  35 |     await expect(page.locator("text=Carry a little something").first()).toBeVisible({ timeout: 10000 });
  36 |     const cards = page.locator("section a[href^='/shop/']");
  37 |     await expect(cards.first()).toBeVisible({ timeout: 10000 });
  38 |     expect(await cards.count()).toBeGreaterThanOrEqual(1);
  39 |     await expect(page.locator("h3").filter({ hasText: /tote/i }).first()).toBeVisible();
  40 |     await expect(page.locator("text=/₹\\d+/").first()).toBeVisible();
  41 |     const img = page.locator("section a[href^='/shop/'] img").first();
  42 |     await expect(img).toBeVisible();
  43 |     await expect(img).toHaveAttribute("src", /.+/);
  44 |   });
  45 | 
  46 |   test("H05 - FAQ anchor section exists", async ({ page }) => {
  47 |     await expect(page.locator("#faq").or(page.locator("text=/frequently asked|FAQ/i")).first()).toBeVisible({ timeout: 10000 });
  48 |   });
  49 | 
  50 |   test("H06 - footer has social links and collections", async ({ page }) => {
  51 |     await expect(page.locator("footer a[href*='wa.me']").first()).toBeVisible();
  52 |     await expect(page.locator("footer a[href*='instagram.com']").first()).toBeVisible();
  53 |     await expect(page.locator("footer a").filter({ hasText: "Collections" }).first()).toBeVisible();
  54 |     await expect(page.locator("footer").getByText(/©|TOTEMOOD/i).first()).toBeVisible();
  55 |   });
  56 | 
  57 |   test("H07 - clicking Shop navigates to /shop", async ({ page }) => {
  58 |     await page.locator("nav a").filter({ hasText: "Shop" }).first().click();
  59 |     await expect(page).toHaveURL(/\/shop/);
  60 |   });
  61 | 
  62 |   test("H08 - clicking About navigates to /about", async ({ page }) => {
  63 |     await page.locator("nav a").filter({ hasText: "About" }).first().click();
  64 |     await expect(page).toHaveURL(/\/about/);
  65 |   });
  66 | 
  67 |   test("H09 - clicking Contact navigates to /contact", async ({ page }) => {
  68 |     await page.locator("nav a").filter({ hasText: "Contact" }).first().click();
  69 |     await expect(page).toHaveURL(/\/contact/);
  70 |   });
  71 | 
  72 |   test("H10 - logo navigates back to home from /shop", async ({ page }) => {
  73 |     await page.goto("/shop");
  74 |     await page.waitForLoadState("domcontentloaded");
  75 |     await page.locator("header a").filter({ hasText: "Totemood" }).first().click();
  76 |     await expect(page).not.toHaveURL(/\/shop/);
  77 |   });
  78 | 
  79 |   test("H11 - floating WhatsApp and Instagram buttons are visible", async ({ page }) => {
  80 |     await expect(page.locator("div.fixed a[href*='wa.me']").last()).toBeVisible();
  81 |     await expect(page.locator("div.fixed a[href*='instagram.com']").last()).toBeVisible();
  82 |   });
  83 | 
  84 |   test("H12 - home page renders without critical JS errors", async ({ page }) => {
  85 |     const errors: string[] = [];
  86 |     page.on("pageerror", (err) => errors.push(err.message));
  87 |     await page.goto("/");
  88 |     await page.waitForLoadState("domcontentloaded");
  89 |     await page.waitForTimeout(2000);
  90 |     const critical = errors.filter((e) => !/google|favicon|socket/i.test(e));
> 91 |     expect(critical).toHaveLength(0);
     |                      ^ Error: expect(received).toHaveLength(expected)
  92 |   });
  93 | });
  94 | 
```