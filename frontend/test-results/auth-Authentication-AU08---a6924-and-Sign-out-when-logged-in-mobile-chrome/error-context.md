# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> AU08 - mobile menu shows Account and Sign out when logged in
- Location: tests/auth.spec.ts:82:7

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('button[aria-label=\'Open menu\']')
    - locator resolved to <button aria-label="Open menu" class="hidden ml-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm p-1">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    3 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 500ms

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
      - button "Cart" [ref=e13]
  - main [ref=e17]:
    - generic [ref=e19]:
      - generic [ref=e24]:
        - heading "From your photo to a Timeless Tote" [level=2] [ref=e25]
        - paragraph [ref=e26]: Every detail is meticulously crafted. Watch your memory transform into wearable art.
      - generic:
        - generic:
          - generic:
            - img "Original Photo"
          - generic:
            - img "Illustrated Artwork"
      - generic [ref=e28]:
        - heading "Every memory deserves to be carried." [level=3] [ref=e29]
        - link "Create Yours" [ref=e30] [cursor=pointer]:
          - /url: /shop
    - generic [ref=e31]:
      - generic [ref=e39]:
        - heading "Bags that speak." [level=1] [ref=e40]: Bags thatspeak.
        - paragraph [ref=e41]: Customize your best memories into your gift which you can gift to your friends, partner, family.
      - generic [ref=e42]:
        - button "Previous Illustration" [ref=e43]
        - button "Next Illustration" [ref=e46]
    - generic [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]:
          - heading "Carry a little something with you." [level=2] [ref=e53]
          - paragraph [ref=e54]: Let's customize your tote bag with your personalized image and text.
        - link "Shop Collection →" [ref=e55] [cursor=pointer]:
          - /url: /shop
          - text: Shop Collection
          - generic [ref=e56]: →
      - generic [ref=e57]:
        - link "CUSTOM GHIBLI ART TOTE BAG Bestseller CUSTOM GHIBLI ART TOTE BAG ₹799.00 ₹499.00" [ref=e58] [cursor=pointer]:
          - /url: /shop/ghibli-art-tote
          - generic [ref=e59]:
            - img "CUSTOM GHIBLI ART TOTE BAG" [ref=e61]
            - generic [ref=e62]:
              - generic [ref=e63]: Bestseller
              - heading "CUSTOM GHIBLI ART TOTE BAG" [level=3] [ref=e64]
              - paragraph [ref=e65]:
                - generic [ref=e66]: ₹799.00
                - generic [ref=e67]: ₹499.00
        - link "CUSTOM GHIBLI TOTE BAG WITH TEXT Bestseller CUSTOM GHIBLI TOTE BAG WITH TEXT ₹749.00 ₹599.00" [ref=e68] [cursor=pointer]:
          - /url: /shop/ghibli-text-tote
          - generic [ref=e69]:
            - img "CUSTOM GHIBLI TOTE BAG WITH TEXT" [ref=e71]
            - generic [ref=e72]:
              - generic [ref=e73]: Bestseller
              - heading "CUSTOM GHIBLI TOTE BAG WITH TEXT" [level=3] [ref=e74]
              - paragraph [ref=e75]:
                - generic [ref=e76]: ₹749.00
                - generic [ref=e77]: ₹599.00
        - link "CUTE EMOJI WITH GHIBLI TOTE Bestseller CUTE EMOJI WITH GHIBLI TOTE ₹719.00 ₹599.00" [ref=e78] [cursor=pointer]:
          - /url: /shop/emoji-ghibli-tote
          - generic [ref=e79]:
            - img "CUTE EMOJI WITH GHIBLI TOTE" [ref=e81]
            - generic [ref=e82]:
              - generic [ref=e83]: Bestseller
              - heading "CUTE EMOJI WITH GHIBLI TOTE" [level=3] [ref=e84]
              - paragraph [ref=e85]:
                - generic [ref=e86]: ₹719.00
                - generic [ref=e87]: ₹599.00
        - link "POLAROID TOTE BAG New POLAROID TOTE BAG ₹599.00 ₹499.00" [ref=e88] [cursor=pointer]:
          - /url: /shop/polaroid-tote
          - generic [ref=e89]:
            - img "POLAROID TOTE BAG" [ref=e91]
            - generic [ref=e92]:
              - generic [ref=e93]: New
              - heading "POLAROID TOTE BAG" [level=3] [ref=e94]
              - paragraph [ref=e95]:
                - generic [ref=e96]: ₹599.00
                - generic [ref=e97]: ₹499.00
    - generic [ref=e99]:
      - generic [ref=e101]:
        - heading "Honest Customer Reviews from Totemood." [level=2] [ref=e102]: Honest Customer Reviewsfrom Totemood.
        - paragraph [ref=e103]: See what our community is saying about their Totemood experience.
      - generic [ref=e104]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - img "Customer Review" [ref=e109] [cursor=pointer]
            - img "Customer Review" [ref=e111] [cursor=pointer]
            - img "Customer Review" [ref=e113] [cursor=pointer]
            - img "Customer Review" [ref=e115] [cursor=pointer]
            - img "Customer Review" [ref=e117] [cursor=pointer]
            - img "Customer Review" [ref=e119] [cursor=pointer]
            - img "Customer Review" [ref=e121] [cursor=pointer]
          - generic [ref=e122]:
            - img "Customer Review" [ref=e124] [cursor=pointer]
            - img "Customer Review" [ref=e126] [cursor=pointer]
            - img "Customer Review" [ref=e128] [cursor=pointer]
            - img "Customer Review" [ref=e130] [cursor=pointer]
            - img "Customer Review" [ref=e132] [cursor=pointer]
            - img "Customer Review" [ref=e134] [cursor=pointer]
            - img "Customer Review" [ref=e136] [cursor=pointer]
        - generic [ref=e138]:
          - generic [ref=e139]:
            - img "Customer Review" [ref=e141] [cursor=pointer]
            - img "Customer Review" [ref=e143] [cursor=pointer]
            - img "Customer Review" [ref=e145] [cursor=pointer]
            - img "Customer Review" [ref=e147] [cursor=pointer]
            - img "Customer Review" [ref=e149] [cursor=pointer]
            - img "Customer Review" [ref=e151] [cursor=pointer]
            - img "Customer Review" [ref=e153] [cursor=pointer]
          - generic [ref=e154]:
            - img "Customer Review" [ref=e156] [cursor=pointer]
            - img "Customer Review" [ref=e158] [cursor=pointer]
            - img "Customer Review" [ref=e160] [cursor=pointer]
            - img "Customer Review" [ref=e162] [cursor=pointer]
            - img "Customer Review" [ref=e164] [cursor=pointer]
            - img "Customer Review" [ref=e166] [cursor=pointer]
            - img "Customer Review" [ref=e168] [cursor=pointer]
    - generic [ref=e171]:
      - generic [ref=e172]:
        - generic [ref=e173]: Frequently Asked Questions
        - heading "Everything you might want to know." [level=2] [ref=e174]
      - generic [ref=e175]:
        - generic [ref=e176]:
          - button "How long will it take to share the design with the customer?" [ref=e177]
          - paragraph [ref=e181]: The design will be delivered to your WhatsApp for approval within 6 to 8 hours after ordering.
        - generic [ref=e182]:
          - button "Will I get to see the design before it is printed?" [ref=e183]
          - paragraph [ref=e187]: Absolutely yes. Your design will be shared on WhatsApp for approval. We start printing only after you confirm the final design.
        - generic [ref=e188]:
          - button "Why don't you offer full Cash on Delivery?" [ref=e189]
          - paragraph [ref=e193]: Our products are custom-made for you, we don't offer full COD. A small advance confirms your order and allows us to create and share the design for approval. The balance is paid on the delivery.
        - generic [ref=e194]:
          - button "Why do I need to pay ₹49 while placing the order?" [ref=e195]
          - paragraph [ref=e199]: We take a ₹49 advance because this is a custom-made product. It confirms your order and allows us to create and share the design on WhatsApp for approval. The amount is minus in the final payment that you can pay on delivery.
        - generic [ref=e200]:
          - button "Is there any return policy?" [ref=e201]
          - paragraph [ref=e205]: Customized products are non-returnable. Returns or replacements are only applicable for damaged, defective, or wrong items (with unboxing video proof).
        - generic [ref=e206]:
          - button "What if I want changes in the design?" [ref=e207]
          - paragraph [ref=e211]: No worries at all! You can request minor changes during the WhatsApp approval stage, and we'll update the design before final printing.
        - generic [ref=e212]:
          - button "How long will it take to receive my order?" [ref=e213]
          - paragraph [ref=e217]: Once your design is approved, your order is printed and delivered within 4-6 working days.
    - generic [ref=e219]:
      - generic [ref=e220]:
        - generic:
          - heading "TOTE MOOD" [level=2]:
            - generic: TOTE
            - generic: MOOD
        - img "Totemood Product Mockup" [ref=e222]
      - generic [ref=e223]:
        - generic [ref=e224]:
          - link "Collections" [ref=e225] [cursor=pointer]:
            - /url: /shop
          - link "About" [ref=e226] [cursor=pointer]:
            - /url: /about
          - link "FAQ" [ref=e227] [cursor=pointer]:
            - /url: /#faq
          - link "Contact" [ref=e228] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e229]:
          - link "WhatsApp" [ref=e230] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e231] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
        - generic [ref=e232]: © 2026 Totemood. All rights reserved.
  - contentinfo [ref=e233]:
    - generic [ref=e234]:
      - generic [ref=e235]:
        - generic [ref=e236]:
          - link "Totemood" [ref=e237] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e238]: Personalised canvas tote bags. Every piece tells your story.
        - generic [ref=e239]:
          - generic [ref=e240]:
            - heading "Shop" [level=4] [ref=e241]
            - link "Collections" [ref=e242] [cursor=pointer]:
              - /url: /shop
            - link "Custom Totes" [ref=e243] [cursor=pointer]:
              - /url: /shop
            - link "Bestsellers" [ref=e244] [cursor=pointer]:
              - /url: /shop
          - generic [ref=e245]:
            - heading "Company" [level=4] [ref=e246]
            - link "About" [ref=e247] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e248] [cursor=pointer]:
              - /url: /contact
            - link "FAQ" [ref=e249] [cursor=pointer]:
              - /url: /#faq
        - generic [ref=e250]:
          - heading "Connect" [level=4] [ref=e251]
          - link "WhatsApp" [ref=e252] [cursor=pointer]:
            - /url: https://wa.me/919890842755
          - link "Instagram" [ref=e255] [cursor=pointer]:
            - /url: https://instagram.com/totemood_gifts
      - generic [ref=e258]:
        - paragraph [ref=e259]: © 2026 Totemood. All rights reserved.
        - paragraph [ref=e260]: Mumbai, India
  - generic [ref=e261]:
    - link "Chat on WhatsApp" [ref=e262] [cursor=pointer]:
      - /url: https://wa.me/919890842755
    - link "Follow on Instagram" [ref=e265] [cursor=pointer]:
      - /url: https://instagram.com/totemood_gifts
  - alert [ref=e268]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const SESSION = {
  4  |   email: "test@test.com",
  5  |   firstName: "Test",
  6  |   lastName: "User",
  7  |   phone: "",
  8  |   picture: "",
  9  | };
  10 | 
  11 | async function signInWithStorage(page: import("@playwright/test").Page) {
  12 |   await page.addInitScript(() => {
  13 |     localStorage.setItem("totemood_account_token", "mock-token");
  14 |     localStorage.setItem(
  15 |       "totemood_account_profile",
  16 |       JSON.stringify({ email: "test@test.com", firstName: "Test", lastName: "User", phone: "", picture: "" })
  17 |     );
  18 |   });
  19 | }
  20 | 
  21 | test.describe("Authentication", () => {
  22 |   test("AU01 - account page loads without critical errors", async ({ page }) => {
  23 |     const errors: string[] = [];
  24 |     page.on("pageerror", (err) => errors.push(err.message));
  25 |     await page.goto("/account");
  26 |     await page.waitForLoadState("domcontentloaded");
  27 |     await expect(page).toHaveURL(/\/account/);
  28 |     await expect(page.getByText(/my account/i).first()).toBeVisible({ timeout: 10000 });
  29 |     const critical = errors.filter((e) => !/google|favicon/i.test(e));
  30 |     expect(critical).toHaveLength(0);
  31 |   });
  32 | 
  33 |   test("AU02 - signed-out account page shows Google sign-in area", async ({ page }) => {
  34 |     await page.goto("/account");
  35 |     await page.waitForLoadState("domcontentloaded");
  36 |     await expect(page.getByText(/sign in with google to see your own orders/i)).toBeVisible({ timeout: 10000 });
  37 |   });
  38 | 
  39 |   test("AU03 - GSI client script is loaded on account page", async ({ page }) => {
  40 |     await page.goto("/account");
  41 |     await page.waitForLoadState("domcontentloaded");
  42 |     await expect(page.locator("script[src*='gsi/client']").first()).toBeAttached({ timeout: 10000 });
  43 |   });
  44 | 
  45 |   test("AU04 - signed-out navbar shows Sign in and no logout", async ({ page }, testInfo) => {
  46 |     test.skip(testInfo.project.name === "mobile-chrome", "desktop navbar only");
  47 |     await page.goto("/");
  48 |     await page.waitForLoadState("domcontentloaded");
  49 |     await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 10000 });
  50 |     await expect(page.locator("button[aria-label='Sign out']")).toHaveCount(0);
  51 |   });
  52 | 
  53 |   test("AU05 - signed-in state shows avatar/logout in navbar instantly", async ({ page }, testInfo) => {
  54 |     test.skip(testInfo.project.name === "mobile-chrome", "desktop navbar only");
  55 |     await signInWithStorage(page);
  56 |     await page.goto("/");
  57 |     await page.waitForLoadState("domcontentloaded");
  58 |     await expect(page.locator("button[aria-label='Sign out']")).toBeVisible({ timeout: 10000 });
  59 |     await expect(page.locator("header a[href='/account']").last()).toBeVisible();
  60 |   });
  61 | 
  62 |   test("AU06 - clicking logout clears profile storage", async ({ page }, testInfo) => {
  63 |     test.skip(testInfo.project.name === "mobile-chrome", "desktop navbar only");
  64 |     await signInWithStorage(page);
  65 |     await page.goto("/");
  66 |     await page.waitForLoadState("domcontentloaded");
  67 |     await page.locator("button[aria-label='Sign out']").click();
  68 |     await page.waitForTimeout(500);
  69 |     const profile = await page.evaluate(() => localStorage.getItem("totemood_account_profile"));
  70 |     expect(profile).toBeNull();
  71 |     await expect(page.locator("header a").filter({ hasText: "Sign in" }).first()).toBeVisible({ timeout: 5000 });
  72 |   });
  73 | 
  74 |   test("AU07 - account page flips to signed-in view from seeded session", async ({ page }) => {
  75 |     await signInWithStorage(page);
  76 |     await page.goto("/account");
  77 |     await page.waitForLoadState("domcontentloaded");
  78 |     await expect(page.getByText("Google account").first()).toBeVisible({ timeout: 10000 });
  79 |     await expect(page.getByText(/test@test\.com/).first()).toBeVisible();
  80 |   });
  81 | 
  82 |   test("AU08 - mobile menu shows Account and Sign out when logged in", async ({ page }) => {
  83 |     await signInWithStorage(page);
  84 |     await page.setViewportSize({ width: 390, height: 844 });
  85 |     await page.goto("/");
  86 |     await page.waitForLoadState("domcontentloaded");
> 87 |     await page.locator("button[aria-label='Open menu']").click();
     |                                                          ^ Error: locator.click: Test timeout of 45000ms exceeded.
  88 |     const menu = page.locator("a").filter({ hasText: /^Account$/ }).first();
  89 |     await expect(menu).toBeVisible({ timeout: 5000 });
  90 |     await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  91 |   });
  92 | });
  93 | 
```