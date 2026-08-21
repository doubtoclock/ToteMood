import { test, expect } from "@playwright/test";

test.describe("ARIA Labels", () => {
  test("A01 - cart button exposes aria-label 'Cart'", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const cartButton = page.getByRole("button", { name: "Cart", exact: true });
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveAttribute("aria-label", "Cart");
  });

  test("A02 - hamburger exposes 'Open menu' and reveals 'Close menu' control", async ({
    page,
  }) => {
    test.use({ viewport: { width: 390, height: 844 } });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const hamburger = page.locator("button[aria-label='Open menu']");
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-label", "Open menu");

    await hamburger.click();
    const closeButton = page.locator("button[aria-label='Close menu']");
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toHaveAttribute("aria-label", "Close menu");
  });

  test("A03 - product hover cart buttons are labelled 'Add {name} to cart'", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");

    const firstCard = page.locator("#all-products div.group").first();
    await firstCard.waitFor({ state: "visible", timeout: 15000 });
    await firstCard.hover();

    const productName = (await firstCard.locator("h3").innerText()).trim();
    expect(productName.length).toBeGreaterThan(0);

    const addButton = firstCard.locator("button[type='button']");
    await expect(addButton).toHaveAttribute("aria-label", `Add ${productName} to cart`);
  });
});

test.describe("Image Alt Text", () => {
  test("A04 - all home page images have non-empty alt text", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `image at index ${i} is missing an alt attribute`).not.toBeNull();
      expect(
        alt!.trim().length,
        `image at index ${i} has empty alt text`
      ).toBeGreaterThan(0);
    }
  });

  test("A05 - all shop page images have non-empty alt text", async ({ page }) => {
    await page.goto("/shop");
    await page
      .locator("#all-products a[href^='/shop/']")
      .first()
      .waitFor({ state: "visible", timeout: 15000 });

    const images = page.locator("#all-products img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `product image at index ${i} is missing an alt attribute`).not.toBeNull();
      expect(
        alt!.trim().length,
        `product image at index ${i} has empty alt text`
      ).toBeGreaterThan(0);
    }
  });
});

test.describe("Form Labels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
  });

  test("A06 - every contact form field has a label with matching for/id", async ({ page }) => {
    const fieldIds = ["firstName", "lastName", "email", "subject", "message"];

    for (const id of fieldIds) {
      const label = page.locator(`label[for='${id}']`);
      await expect(label, `label[for='${id}'] should exist`).toBeAttached();

      const control = page.locator(`#${id}`);
      await expect(control, `#${id} control should exist`).toBeAttached();
    }
  });

  test("A07 - contact form fields are reachable by their accessible label names", async ({
    page,
  }) => {
    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
  });
});

test.describe("Focus States", () => {
  test("A08 - navigation links are keyboard focusable via Tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const focusedLinks: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLAnchorElement | null;
        return el ? { tag: el.tagName, href: el.getAttribute("href") } : null;
      });
      if (info?.tag === "A" && info.href) {
        focusedLinks.push(info.href);
      }
    }

    expect(focusedLinks.length).toBeGreaterThanOrEqual(2);
  });

  test("A09 - keyboard focus shows a visible focus ring on interactive elements", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await page.keyboard.press("Tab");

    const focusState = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return { shadow: "", className: "" };
      return {
        shadow: getComputedStyle(el).boxShadow,
        className: el.className,
      };
    });

    expect(focusState.className).toContain("focus-visible:ring");
    expect(focusState.shadow).not.toBe("none");
  });
});

test.describe("Semantic HTML", () => {
  test("A10 - page uses semantic header, nav, main and footer landmarks", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("header nav")).toBeAttached();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    const landmarkCount = await page.evaluate(
      () =>
        document.querySelectorAll("header, nav, main, footer").length
    );
    expect(landmarkCount).toBeGreaterThanOrEqual(4);
  });
});
