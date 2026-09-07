import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyBrand,
  injectThemeFonts,
  googleFontsHref,
  brand,
  THEME_FONTS_LINK_ID,
} from './brand.ts';

/**
 * Guards the 2026-09-07 fix: a themed site sets `--font-heading: 'Oswald'…` but
 * nothing loaded Oswald, so every generated site's headings fell back to
 * system-ui. `applyBrand()` MUST inject a Google Fonts stylesheet for the ACTIVE
 * brand fonts. If the injection is ever dropped, these fail (not a $10 build).
 */
describe('theme font loading (injectThemeFonts / applyBrand)', () => {
  beforeEach(() => {
    document.getElementById(THEME_FONTS_LINK_ID)?.remove();
    document.querySelectorAll('link[data-test-font]').forEach((n) => n.remove());
  });

  it('injectThemeFonts adds a Google Fonts stylesheet with the googleFontsHref URL', () => {
    injectThemeFonts(document);
    const link = document.getElementById(THEME_FONTS_LINK_ID) as HTMLLinkElement | null;
    expect(link, 'a #ps-theme-fonts <link> must be injected').toBeTruthy();
    expect(link!.rel).toBe('stylesheet');
    expect(link!.getAttribute('href')).toBe(googleFontsHref());
    expect(link!.getAttribute('href')).toContain('fonts.googleapis.com/css2');
  });

  it('loads the ACTIVE heading AND body families (so the theme font actually renders)', () => {
    injectThemeFonts(document);
    const href = document.getElementById(THEME_FONTS_LINK_ID)!.getAttribute('href')!;
    const headFam = encodeURIComponent(brand.font.heading).replace(/%20/g, '+');
    const bodyFam = encodeURIComponent(brand.font.body).replace(/%20/g, '+');
    expect(href, 'heading family must be requested').toContain(`family=${headFam}`);
    expect(href, 'body family must be requested').toContain(`family=${bodyFam}`);
  });

  it('is idempotent — repeated calls keep exactly one link element', () => {
    injectThemeFonts(document);
    injectThemeFonts(document);
    injectThemeFonts(document);
    expect(document.querySelectorAll(`#${THEME_FONTS_LINK_ID}`).length).toBe(1);
  });

  it('applyBrand() wires the injection (regression: vars set but font unloaded)', () => {
    document.getElementById(THEME_FONTS_LINK_ID)?.remove();
    applyBrand(document.documentElement);
    const link = document.getElementById(THEME_FONTS_LINK_ID) as HTMLLinkElement | null;
    expect(link, 'applyBrand must load the theme fonts, not just set CSS vars').toBeTruthy();
    // The var it set and the font it loaded must name the same heading family.
    const cssHeading = document.documentElement.style.getPropertyValue('--font-heading');
    expect(cssHeading).toContain(brand.font.heading);
    expect(link!.getAttribute('href')).toContain(
      encodeURIComponent(brand.font.heading).replace(/%20/g, '+'),
    );
  });

  it('never throws on a document without createElement (pre-React safety)', () => {
    expect(() => injectThemeFonts(undefined as unknown as Document)).not.toThrow();
    expect(() => injectThemeFonts({} as unknown as Document)).not.toThrow();
  });
});
