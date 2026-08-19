/**
 * Unit tests for the brand-token resolver.
 *
 * Validates:
 *   - DTCG alias substitution ({color.brandHue} → 240)
 *   - Color OKLCH composition
 *   - `applyBrand()` side effects on document.documentElement
 *   - `featureOn()` boolean lookup
 *   - Light mode swap via data-theme
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { brand, applyBrand, featureOn, normalizeUrl } from '@/brand';

describe('brand resolver', () => {
  it('exposes the resolved business identity', () => {
    expect(brand.business).toBeDefined();
    expect(brand.business.name).toBeDefined();
    expect(brand.business.businessClass).toBeDefined();
  });

  it('resolves DTCG aliases in color tokens', () => {
    const primary = brand.color.primary;
    expect(typeof primary).toBe('string');
    // The default primary alias is `oklch(0.62 {color.brandChroma} {color.brandHue})`.
    // After resolution it should be a concrete oklch() string with all three components numeric.
    expect(primary).toMatch(/^oklch\(\s*0\.\d+\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s*\)$/);
  });

  it('resolves nested aliases for shadow-glow', () => {
    expect(brand.shadow.glow).toContain('oklch(');
    // Should NOT contain unresolved curly-brace references
    expect(brand.shadow.glow).not.toMatch(/\{[^}]+\}/);
  });

  it('preserves numeric tokens', () => {
    // brandHue is a number-typed token; resolver returns it as the raw value
    expect(brand.color.brandHue).toBeDefined();
  });

  it('has all 14 feature flags', () => {
    const expectedFlags = [
      'hero', 'bento', 'stats', 'services', 'process', 'testimonials',
      'logoCloud', 'pricing', 'faq', 'blog', 'team', 'caseStudies',
      'newsletter', 'cta',
    ];
    for (const flag of expectedFlags) {
      expect(typeof brand.features[flag]).toBe('boolean');
    }
  });
});

describe('normalizeUrl()', () => {
  it('collapses the double-dot hostname (the journey canonical defect)', () => {
    expect(normalizeUrl('https://urban-fitness..projectsites.dev/')).toBe(
      'https://urban-fitness.projectsites.dev/',
    );
  });

  it('repairs every occurrence, not just the first', () => {
    expect(
      normalizeUrl('https://a..projectsites.dev/x https://b..projectsites.dev/y'),
    ).toBe('https://a.projectsites.dev/x https://b.projectsites.dev/y');
  });

  it('is a no-op on clean URLs', () => {
    expect(normalizeUrl('https://x.projectsites.dev/')).toBe('https://x.projectsites.dev/');
  });

  it('passes through empty strings', () => {
    expect(normalizeUrl('')).toBe('');
  });
});

describe('featureOn()', () => {
  it('returns the boolean value of the named flag', () => {
    expect(typeof featureOn('hero')).toBe('boolean');
    expect(typeof featureOn('pricing')).toBe('boolean');
  });

  it('returns false for unknown flags', () => {
    // @ts-expect-error — intentionally probing an unknown key
    expect(featureOn('nonexistent')).toBe(false);
  });
});

describe('applyBrand()', () => {
  beforeEach(() => {
    // Reset documentElement style + dataset between tests
    document.documentElement.style.cssText = '';
    document.documentElement.dataset.theme = '';
  });

  it('writes the brand-hue CSS variable', () => {
    applyBrand();
    const hue = document.documentElement.style.getPropertyValue('--brand-hue');
    expect(hue).toBeTruthy();
    expect(Number(hue)).toBeGreaterThanOrEqual(0);
    expect(Number(hue)).toBeLessThanOrEqual(360);
  });

  it('writes primary + accent + background color vars', () => {
    applyBrand();
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toMatch(/oklch/);
    expect(document.documentElement.style.getPropertyValue('--color-accent')).toMatch(/oklch/);
    expect(document.documentElement.style.getPropertyValue('--color-background')).toMatch(/oklch/);
    expect(document.documentElement.style.getPropertyValue('--color-text')).toMatch(/oklch/);
  });

  it('writes font-family CSS variables wrapped in quotes', () => {
    applyBrand();
    const heading = document.documentElement.style.getPropertyValue('--font-heading');
    expect(heading).toMatch(/['"][^'"]+['"]/);
  });

  it('writes radius + spacing scales', () => {
    applyBrand();
    expect(document.documentElement.style.getPropertyValue('--radius-md')).toBeTruthy();
    expect(document.documentElement.style.getPropertyValue('--space-4')).toBeTruthy();
  });

  it('sets data-theme to the colorScheme', () => {
    applyBrand();
    expect(['dark', 'light', 'auto', 'light dark']).toContain(
      document.documentElement.dataset.theme,
    );
  });

  it('accepts a custom root element', () => {
    const fake = document.createElement('html');
    applyBrand(fake);
    expect(fake.style.getPropertyValue('--brand-hue')).toBeTruthy();
  });
});
