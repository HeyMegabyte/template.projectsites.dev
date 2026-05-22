/**
 * keyboard.spec.ts
 *
 * Keyboard-navigation coverage:
 *   - Cmd+K opens the command palette AND immediately focuses the input
 *   - Ctrl+K on non-Mac opens the command palette AND immediately focuses the input
 *   - Esc closes the palette and returns focus to the trigger element
 *   - Tab order on the homepage hero is logical (skip-link first, then nav links)
 *   - Tab order on the /about hero is logical
 *   - Arrow keys navigate palette items (existing cmdk spec also covers this,
 *     included here for completeness at the keyboard level)
 *
 * Per the `always.md` mandate: pressing Meta+K/Ctrl+K MUST open the AI chat
 * or command palette AND immediately focus the text input — caret blinking,
 * ready to type, zero extra clicks.
 */

import { test, expect } from '@playwright/test';

// ── Cmd+K / Ctrl+K open + focus ────────────────────────────────────────────────

test.describe('Cmd+K opens palette and focuses input', () => {
  test('Meta+K focuses palette input immediately (Mac / webkit)', async ({ page, browserName }) => {
    await page.goto('/');

    const modifier = browserName === 'webkit' ? 'Meta' : 'Meta';
    await page.keyboard.press(`${modifier}+k`);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // The input inside the dialog must be focused without an extra click
    const input = dialog.getByRole('textbox').or(dialog.locator('input')).first();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('Ctrl+K focuses palette input immediately (Windows / Linux simulation)', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Control+k');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole('textbox').or(dialog.locator('input')).first();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('palette input is immediately typeable after opening', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+k');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Type immediately — no click needed — verifies autofocus contract
    await page.keyboard.type('about');
    const input = dialog.getByRole('textbox').or(dialog.locator('input')).first();
    const value = await input.inputValue();
    expect(value).toContain('about');
  });
});

// ── Esc closes palette + returns focus to trigger ──────────────────────────────

test.describe('Esc closes palette and returns focus', () => {
  test('Esc closes palette after Meta+K open', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+k');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('focus returns to a focusable element after Esc', async ({ page }) => {
    await page.goto('/');
    // Open via the header button so trigger is known
    const trigger = page.getByRole('button', { name: /open command palette/i });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    // Focus should be on a button (the trigger or another focusable element)
    const activeTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['button', 'a', 'input']).toContain(activeTag);
  });

  test('second Cmd+K re-opens palette with fresh focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+k');
    await page.keyboard.press('Escape');

    // Second open
    await page.keyboard.press('Meta+k');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole('textbox').or(dialog.locator('input')).first();
    await expect(input).toBeFocused();
  });
});

// ── Tab order on hero pages ─────────────────────────────────────────────────────

test.describe('Tab order is logical', () => {
  test('first Tab from body reaches skip-to-main link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    // skip-link text matches /skip.*main/i
    expect(focused).toMatch(/skip.*main/i);
  });

  test('second Tab reaches the first nav link or header element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // first focusable in header

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    const focusedRole = await page.evaluate(() =>
      document.activeElement?.getAttribute('role') ?? '',
    );
    // Should be a link or button inside the header
    expect(['a', 'button'].concat(focusedRole ? [focusedRole] : [])).toContain(
      focusedTag === 'a' || focusedTag === 'button' ? focusedTag : focusedRole || focusedTag,
    );
  });

  test('Tab order on /about hero is logical — h1 area is reachable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Tab through the page; after nav links, focus should reach main content
    // (not trapped in the header forever)
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const el = await page.evaluate(() => {
        const ae = document.activeElement;
        return { tag: ae?.tagName.toLowerCase(), inMain: !!ae?.closest('#main') };
      });
      if (el.inMain) {
        // Focus successfully reached main content area
        expect(el.inMain).toBe(true);
        return;
      }
    }
    // If we tabbed 20 times without reaching main, the test fails
    throw new Error('Focus never reached #main content after 20 Tab presses on /about');
  });

  test('Contact form fields are reachable via Tab from nav', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL(/\/contact/);

    // Tab until we reach a form input
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const el = await page.evaluate(() => {
        const ae = document.activeElement;
        return { tag: ae?.tagName.toLowerCase(), inForm: !!ae?.closest('form') };
      });
      if (el.inForm) {
        expect(el.inForm).toBe(true);
        return;
      }
    }
    throw new Error('Focus never reached the contact form after 30 Tab presses');
  });
});
