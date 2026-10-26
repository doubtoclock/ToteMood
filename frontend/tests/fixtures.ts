import { test as base, expect } from "@playwright/test";
import { waitForHydration } from "./utils";

/**
 * Page fixture that waits for app hydration to settle after every goto(),
 * avoiding the transient duplicate-tree window that breaks strict locators.
 */
export const test = base.extend({
  page: async ({ page }, runFixture) => {
    const originalGoto = page.goto.bind(page);
    page.goto = async (...args: Parameters<typeof page.goto>) => {
      const result = await originalGoto(...args);
      await waitForHydration(page).catch(() => {});
      return result;
    };
    await runFixture(page);
  },
});

export { expect };
