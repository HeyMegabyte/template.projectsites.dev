/**
 * a11y-breakpoints.spec.ts
 *
 * WCAG 2.2 A/AA at all 6 breakpoints for the two highest-traffic routes:
 *   - / (root — Gallery or Home depending on VITE_TEMPLATE_MODE)
 *   - /gallery
 *
 * Breakpoints: 375 / 390 / 768 / 1024 / 1280 / 1920 (per Emdash mandate)
 *
 * Per test:
 *   - Viewport resized to the target breakpoint
 *   - Zero console errors
 *   - axe-core WCAG 2.2 A/AA (color-contrast disabled — per brand-token tuning note)
 *
 * Tests run in parallel (fullyParallel: true from playwright.config.ts).
 * Each is independent — no shared state.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BREAKPOINTS = [375, 390, 768, 1024, 1280, 1920] as const;
type BP = (typeof BREAKPOINTS)[number];

// Common viewport height (tall enough to load full-page content)
const VIEWPORT_HEIGHT = 900;

async function runA11yCheck(
  page: Parameters<typeof test>[1] extends { page: infer P } ? P : never,
  route: string,
  width: BP,
) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
  await page.goto(route);

  // Wait for content to settle
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(200);

  // Console errors gate
  expect(
    errors,
    `Console errors at ${route} [${width}px]:\n${errors.join('\n')}`,
  ).toHaveLength(0);

  // Axe gate
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .disableRules(['color-contrast'])
    .analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(
        (v) =>
          `  • [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`,
      )
      .join('\n');
    throw new Error(
      `${results.violations.length} axe violation(s) at ${route} [${width}px]:\n${summary}`,
    );
  }
}

// ── / (root) at all 6 breakpoints ─────────────────────────────────────────────

test.describe('/ — axe-clean at 6 breakpoints', () => {
  for (const bp of BREAKPOINTS) {
    test(`/ — ${bp}px`, async ({ page }) => {
      await runA11yCheck(page, '/', bp);
    });
  }
});

// ── /gallery at all 6 breakpoints ─────────────────────────────────────────────

test.describe('/gallery — axe-clean at 6 breakpoints', () => {
  for (const bp of BREAKPOINTS) {
    test(`/gallery — ${bp}px`, async ({ page }) => {
      await runA11yCheck(page, '/gallery', bp);
    });
  }
});

// ── /about at all 6 breakpoints ───────────────────────────────────────────────

test.describe('/about — axe-clean at 6 breakpoints', () => {
  for (const bp of BREAKPOINTS) {
    test(`/about — ${bp}px`, async ({ page }) => {
      await runA11yCheck(page, '/about', bp);
    });
  }
});

// ── /contact at all 6 breakpoints ─────────────────────────────────────────────

test.describe('/contact — axe-clean at 6 breakpoints', () => {
  for (const bp of BREAKPOINTS) {
    test(`/contact — ${bp}px`, async ({ page }) => {
      await runA11yCheck(page, '/contact', bp);
    });
  }
});
