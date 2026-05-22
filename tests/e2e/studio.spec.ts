/**
 * studio.spec.ts
 *
 * Brand Studio (/studio) — live brand-token playground.
 *
 * Covers:
 *   - Hue slider mutates --brand-hue CSS var
 *   - Chroma slider mutates --brand-chroma CSS var
 *   - Font picker updates --font-heading CSS var
 *   - Color-scheme buttons mutate data-theme attribute
 *   - Copy JSON button writes JSON to clipboard
 *   - Navigating away from /studio restores brand (restore-on-unmount)
 *
 * All tests start at / and navigate to /studio via direct goto
 * (no nav link exists for Studio in the default header).
 */

import { test, expect } from '@playwright/test';

test.describe('Brand Studio (/studio)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.goto('/studio');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('hue slider is visible and interactive', async ({ page }) => {
    const hueSlider = page.locator('#hue');
    await expect(hueSlider).toBeVisible();

    // Read initial hue value
    const initialHue = await hueSlider.inputValue();

    // Drag to a new value by filling the input programmatically
    await hueSlider.fill('90');
    await hueSlider.dispatchEvent('input');

    // CSS var should update
    const cssVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-hue').trim(),
    );
    // The CSS var is set as a string; check it's been mutated
    expect(cssVar).toBe('90');

    // The displayed label should reflect the new value
    await expect(page.locator('label[for="hue"]')).toContainText('90');

    // Confirm the initial value was different (slider was interactive)
    expect(initialHue).not.toBe('90');
  });

  test('chroma slider mutates --brand-chroma CSS var', async ({ page }) => {
    const chromaSlider = page.locator('#chroma');
    await expect(chromaSlider).toBeVisible();

    await chromaSlider.fill('0.08');
    await chromaSlider.dispatchEvent('input');

    const cssVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-chroma').trim(),
    );
    expect(cssVar).toBe('0.08');
  });

  test('color-scheme buttons update data-theme attribute', async ({ page }) => {
    // Click "light" mode button
    await page.getByRole('button', { name: 'light' }).click();
    const themeAfterLight = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAfterLight).toBe('light');

    // Click "dark" mode button
    await page.getByRole('button', { name: 'dark' }).click();
    const themeAfterDark = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAfterDark).toBe('dark');

    // Click "auto" mode button
    await page.getByRole('button', { name: 'auto' }).click();
    const themeAfterAuto = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAfterAuto).toBe('auto');
  });

  test('heading font picker changes --font-heading CSS var', async ({ page }) => {
    const headingSelect = page.locator('#heading-font');
    await expect(headingSelect).toBeVisible();

    // Pick a font that differs from the default
    await headingSelect.selectOption('Playfair Display');

    const cssVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim(),
    );
    expect(cssVar).toContain('Playfair Display');
  });

  test('body font picker changes --font-body CSS var', async ({ page }) => {
    const bodySelect = page.locator('#body-font');
    await expect(bodySelect).toBeVisible();

    await bodySelect.selectOption('Lora');

    const cssVar = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim(),
    );
    expect(cssVar).toContain('Lora');
  });

  test('Copy JSON button writes valid JSON to clipboard', async ({ page, context }) => {
    // Grant clipboard-read permission so we can inspect the clipboard
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyBtn = page.getByRole('button', { name: /copy json/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // Button should show "Copied" feedback
    await expect(page.getByRole('button', { name: /copied/i })).toBeVisible();

    // Read clipboard and verify it's valid JSON with expected shape
    const clipText = await page.evaluate(() => navigator.clipboard.readText());
    let parsed: Record<string, unknown>;
    expect(() => { parsed = JSON.parse(clipText); }).not.toThrow();
    // Verify the exported JSON has expected top-level keys
    expect(parsed!).toHaveProperty('color');
    expect(parsed!).toHaveProperty('font');
    expect(parsed!).toHaveProperty('colorScheme');
  });

  test('restore-on-unmount: navigating away resets brand CSS vars', async ({ page }) => {
    // Mutate hue to something unusual
    const hueSlider = page.locator('#hue');
    await hueSlider.fill('333');
    await hueSlider.dispatchEvent('input');

    const mutatedHue = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-hue').trim(),
    );
    expect(mutatedHue).toBe('333');

    // Navigate away — the useEffect cleanup calls applyBrand()
    await page.getByRole('link', { name: 'Home' }).first().click();
    await expect(page).toHaveURL(/^\//);

    // --brand-hue should be restored to the brand default (not 333)
    const restoredHue = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-hue').trim(),
    );
    expect(restoredHue).not.toBe('333');
  });

  test('zero console errors on /studio', async ({ page }) => {
    const errors: string[] = [];
    // Re-mount with error listener (beforeEach already loaded page)
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    // Interact with sliders to exercise the useEffect branches
    await page.locator('#hue').fill('180');
    await page.locator('#hue').dispatchEvent('input');
    await page.locator('#chroma').fill('0.15');
    await page.locator('#chroma').dispatchEvent('input');
    await page.waitForTimeout(300);
    expect(errors, `Console errors on /studio:\n${errors.join('\n')}`).toHaveLength(0);
  });
});
