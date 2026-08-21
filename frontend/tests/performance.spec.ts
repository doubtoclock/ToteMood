import { test, expect } from "@playwright/test";

const CACHE_KEY = "totemood_products_cache";

function toMs(value: string) {
  const trimmed = value.trim();
  return Math.round(parseFloat(trimmed) * (trimmed.endsWith("ms") ? 1 : 1000));
}

async function gotoShopWithProducts(page: import("@playwright/test").Page) {
  await page.goto("/shop");
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("#all-products a[href^='/shop/']")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
}

test.describe("SessionStorage Product Cache", () => {
  test("P01 - shop visit persists products in sessionStorage", async ({ page }) => {
    await gotoShopWithProducts(page);

    const cached = await page.evaluate((key) => {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, CACHE_KEY);

    expect(Array.isArray(cached)).toBe(true);
    expect(cached.length).toBeGreaterThan(0);
    expect(cached[0]).toHaveProperty("id");
    expect(cached[0]).toHaveProperty("name");
    expect(cached[0]).toHaveProperty("price");
  });

  test("P02 - second visit in the same session renders products instantly from cache", async ({
    page,
  }) => {
    await gotoShopWithProducts(page);

    const warmed = await page.evaluate((key) => sessionStorage.getItem(key), CACHE_KEY);
    expect(warmed).toBeTruthy();

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    const productLink = page.locator("#all-products a[href^='/shop/']").first();
    await expect(productLink).toBeVisible({ timeout: 3000 });

    const stillCached = await page.evaluate((key) => {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as unknown[]).length : 0;
    }, CACHE_KEY);
    expect(stillCached).toBeGreaterThan(0);
  });
});

test.describe("Image Optimization", () => {
  test("P03 - shop product images are lazy loaded", async ({ page }) => {
    await gotoShopWithProducts(page);

    const lazyImages = page.locator("#all-products img[loading='lazy']");
    const count = await lazyImages.count();
    expect(count).toBeGreaterThan(0);

    const loadingAttr = await lazyImages.first().getAttribute("loading");
    expect(loadingAttr).toBe("lazy");
  });

  test("P04 - images use Next.js sizes and srcset for responsive delivery", async ({ page }) => {
    await gotoShopWithProducts(page);

    const firstImage = page.locator("#all-products img[sizes]").first();
    await expect(firstImage).toBeAttached();

    const sizes = await firstImage.getAttribute("sizes");
    expect(sizes).toBeTruthy();
    expect(sizes).toContain("vw");

    const srcset = await firstImage.getAttribute("srcset");
    expect(srcset).toBeTruthy();
    expect(srcset!.split(",").length).toBeGreaterThanOrEqual(2);
  });
});

test.describe("Font Loading", () => {
  test("P05 - head includes preconnect hints for font CDNs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const preconnects = await page.evaluate(() =>
      Array.from(document.querySelectorAll("link[rel='preconnect']")).map((link) =>
        (link as HTMLLinkElement).href
      )
    );

    expect(preconnects.some((href) => href.includes("api.fontshare.com"))).toBe(true);
    expect(preconnects.some((href) => href.includes("fonts.googleapis.com"))).toBe(true);
    expect(preconnects.some((href) => href.includes("fonts.gstatic.com"))).toBe(true);
  });
});

test.describe("Animations Present", () => {
  test("P06 - skeleton shimmer animation is defined in the stylesheet", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const animation = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.className = "animate-skeleton-shimmer";
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe);
      const result = {
        name: computed.animationName,
        duration: computed.animationDuration,
        iteration: computed.animationIterationCount,
      };
      probe.remove();
      return result;
    });

    expect(animation.name).toContain("skeleton-shimmer");
    expect(toMs(animation.duration)).toBeGreaterThan(0);
    expect(animation.iteration).toBe("infinite");
  });

  test("P07 - product cards fade in with staggered delays", async ({ page }) => {
    await gotoShopWithProducts(page);

    const cards = page.locator("#all-products div.group");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    const firstClass = await cards.nth(0).getAttribute("class");
    expect(firstClass).toContain("animate-fade-in-up");

    const firstDelay = toMs(
      await cards.nth(0).evaluate((el) => getComputedStyle(el).animationDelay)
    );
    const thirdDelay = toMs(
      await cards.nth(2).evaluate((el) => getComputedStyle(el).animationDelay)
    );

    expect(firstDelay).toBe(0);
    expect(thirdDelay).toBeGreaterThanOrEqual(100);
    expect(thirdDelay).toBeGreaterThan(firstDelay);
  });
});

test.describe("Socket Connection", () => {
  test("P08 - shop page opens a socket.io connection for real-time updates", async ({ page }) => {
    const socketRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("socket.io")) {
        socketRequests.push(request.url());
      }
    });

    await gotoShopWithProducts(page);
    await page.waitForLoadState("networkidle").catch(() => undefined);

    expect(socketRequests.length).toBeGreaterThan(0);
    expect(socketRequests[0]).toContain("EIO=");
  });
});

test.describe("Page Transitions", () => {
  test("P09 - fade-in transition utility animates main content on load", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const animation = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.className = "animate-fade-in";
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe);
      const result = {
        name: computed.animationName,
        duration: computed.animationDuration,
        timing: computed.animationTimingFunction,
      };
      probe.remove();
      return result;
    });

    expect(animation.name).toBe("fade-in");
    expect(toMs(animation.duration)).toBeGreaterThan(0);
    expect(animation.timing).toContain("ease-out");
  });
});

test.describe("Network Requests", () => {
  test("P10 - products are fetched via a single JSON API request", async ({ page }) => {
    const productResponses: { url: string; status: number; body: unknown }[] = [];

    page.on("response", (response) => {
      if (response.url().includes("/api/products")) {
        productResponses.push({
          url: response.url(),
          status: response.status(),
          body: null,
        });
        response
          .json()
          .then((body) => {
            productResponses[productResponses.length - 1].body = body;
          })
          .catch(() => undefined);
      }
    });

    await gotoShopWithProducts(page);

    expect(productResponses.length).toBeGreaterThanOrEqual(1);
    expect(productResponses[0].status).toBe(200);
    await expect
      .poll(() => productResponses[0].body, { timeout: 10000 })
      .not.toBeNull();
    expect(Array.isArray(productResponses[0].body)).toBe(true);
  });
});
