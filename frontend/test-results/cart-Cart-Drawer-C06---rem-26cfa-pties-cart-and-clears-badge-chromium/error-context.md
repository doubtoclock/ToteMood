# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart Drawer >> C06 - remove button empties cart and clears badge
- Location: tests/cart.spec.ts:56:7

# Error details

```
Error: Channel closed
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('button[aria-label^=\'Remove\']').first()

```

```
Error: browserContext.close: Target page, context or browser has been closed
```