import type { Page } from "@playwright/test";

/**
 * Waits for the app to finish hydrating.
 *
 * During the React/Next.js hydration window the prerendered tree and the
 * hydrated tree coexist briefly (duplicate <template>/<main> nodes), which
 * breaks strict-mode locators and can stall dispatched clicks.
 */
export async function waitForHydration(page: Page, timeout = 15000): Promise<void> {
  await page.waitForFunction(
    () =>
      document.querySelectorAll("template").length === 0 &&
      document.querySelectorAll("main").length <= 1,
    null,
    { timeout }
  );
}

export function isMobileViewport(page: import("@playwright/test").Page): boolean {
  return (page.viewportSize()?.width ?? 1280) < 768;
}

// Backend the deployment-under-test talks to. When testing the production
// site, seed logins must go to the production backend or tokens won't verify.
const testBaseUrl = process.env.PLAYWRIGHT_BASE_URL || "";
export const TEST_API_BASE = process.env.PLAYWRIGHT_API_URL || (
  testBaseUrl.includes("totemood.com") || testBaseUrl.includes("mywire.org")
    ? "https://totewood-backend.onrender.com"
    : "http://localhost:4010"
);
