# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility >> A02 - key controls expose accessible names
- Location: tests/accessibility.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('button[aria-label=\'Open menu\']')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button[aria-label=\'Open menu\']')
    7 × locator resolved to <button aria-label="Open menu" class="hidden ml-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1">…</button>
      - unexpected value "hidden"

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
- main:
  - heading "From your photo to a Timeless Tote" [level=2]
  - paragraph: Every detail is meticulously crafted. Watch your memory transform into wearable art.
  - img "Original Photo"
  - img "Illustrated Artwork"
  - heading "Every memory deserves to be carried." [level=3]
  - link "Create Yours":
    - /url: /shop
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
  - heading "TOTE MOOD" [level=2]
  - img "Totemood Product Mockup"
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
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Accessibility", () => {
  4  |   test("A01 - pages use semantic header, nav, main and footer landmarks", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await page.waitForLoadState("domcontentloaded");
  7  |     await expect(page.locator("header").first()).toBeVisible();
  8  |     await expect(page.locator("nav").first()).toBeAttached();
  9  |     await expect(page.locator("main").first()).toBeVisible();
  10 |     await expect(page.locator("footer")).toBeVisible();
  11 |   });
  12 | 
  13 |   test("A02 - key controls expose accessible names", async ({ page }) => {
  14 |     await page.goto("/");
  15 |     await page.waitForLoadState("domcontentloaded");
  16 |     await expect(page.locator("button[aria-label='Cart']")).toBeVisible();
  17 |     await page.setViewportSize({ width: 390, height: 844 });
> 18 |     await expect(page.locator("button[aria-label='Open menu']")).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  19 |     await page.goto("/shop");
  20 |     await page.waitForLoadState("domcontentloaded");
  21 |     const card = page.locator("a[href^='/shop/']").first();
  22 |     await card.hover();
  23 |     await expect(page.locator("button[aria-label*='Add']").first()).toBeAttached();
  24 |   });
  25 | 
  26 |   test("A03 - shop product images all have non-empty alt text", async ({ page }) => {
  27 |     await page.goto("/shop");
  28 |     await page.waitForLoadState("domcontentloaded");
  29 |     const imgs = page.locator("a[href^='/shop/'] img");
  30 |     await expect(imgs.first()).toBeVisible({ timeout: 10000 });
  31 |     const count = await imgs.count();
  32 |     for (let i = 0; i < count; i++) {
  33 |       const alt = await imgs.nth(i).getAttribute("alt");
  34 |       expect(alt && alt.length > 0).toBeTruthy();
  35 |     }
  36 |   });
  37 | });
  38 | 
```