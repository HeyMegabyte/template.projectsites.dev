import { describe, it, expect } from 'vitest';
import {
  isPlaceholder,
  scrubText,
  scrubList,
  hasRealImage,
  scrubImage,
} from '@/lib/placeholders';

describe('isPlaceholder', () => {
  it('detects the exact generation tokens the template ships', () => {
    for (const t of [
      '{ABOUT_HEADLINE}',
      '{ABOUT_DESCRIPTION}',
      '{ABOUT_BULLET_1}',
      '{ABOUT_IMAGE_ALT}',
      '{HERO_SUBHEADLINE}',
      '{TIER_1_NAME}',
      '{FAQ_1_Q}',
      '{ABOUT_STAT_1_VALUE}',
      '{color.brandHue}',
    ]) {
      expect(isPlaceholder(t)).toBe(true);
    }
  });

  it('detects a token embedded in a wrapper (the img-src 404 case)', () => {
    expect(isPlaceholder('https://{ABOUT_IMAGE_URL}')).toBe(true);
    expect(isPlaceholder('— {HERO_HEADLINE} —')).toBe(true);
  });

  it('passes real prose through as NOT a placeholder', () => {
    expect(isPlaceholder('Fresh sourdough, baked daily')).toBe(false);
    expect(isPlaceholder('We fix leaks fast')).toBe(false);
    // Prose with braces but no token-shaped identifier is not a placeholder.
    expect(isPlaceholder('Save {} space')).toBe(false);
  });

  it('treats empty / non-string as NOT a placeholder', () => {
    expect(isPlaceholder('')).toBe(false);
    expect(isPlaceholder('   ')).toBe(false);
    expect(isPlaceholder(undefined)).toBe(false);
    expect(isPlaceholder(null)).toBe(false);
    expect(isPlaceholder(42)).toBe(false);
  });
});

describe('scrubText', () => {
  it('returns empty string for a placeholder (so caller guard hides it)', () => {
    expect(scrubText('{ABOUT_HEADLINE}')).toBe('');
    expect(scrubText('{ABOUT_DESCRIPTION}')).toBe('');
  });

  it('returns the fallback when one is supplied', () => {
    expect(scrubText('{HERO_CTA}', 'Get started')).toBe('Get started');
    expect(scrubText('', 'Learn more')).toBe('Learn more');
    expect(scrubText(undefined, 'Contact us')).toBe('Contact us');
  });

  it('returns trimmed real content untouched', () => {
    expect(scrubText('  Real copy  ')).toBe('Real copy');
    expect(scrubText('Fresh sourdough')).toBe('Fresh sourdough');
  });
});

describe('scrubList', () => {
  it('drops placeholder entries and keeps real ones in order', () => {
    expect(
      scrubList(['Licensed & insured', '{ABOUT_BULLET_2}', 'Same-day quotes']),
    ).toEqual(['Licensed & insured', 'Same-day quotes']);
  });

  it('returns an empty array when every entry is a placeholder', () => {
    expect(scrubList(['{ABOUT_BULLET_1}', '{ABOUT_BULLET_2}', '{ABOUT_BULLET_3}'])).toEqual([]);
  });

  it('tolerates undefined / null / non-arrays', () => {
    expect(scrubList(undefined)).toEqual([]);
    expect(scrubList(null)).toEqual([]);
  });
});

describe('hasRealImage', () => {
  it('is false for the {ABOUT_IMAGE_URL} 404 case + empty', () => {
    expect(hasRealImage('{ABOUT_IMAGE_URL}')).toBe(false);
    expect(hasRealImage('')).toBe(false);
    expect(hasRealImage(undefined)).toBe(false);
  });

  it('is true for a real path/url', () => {
    expect(hasRealImage('/images/team.jpg')).toBe(true);
    expect(hasRealImage('https://cdn.example.com/hero.avif')).toBe(true);
  });
});

describe('scrubImage', () => {
  it('returns undefined for a placeholder src (render no <img>)', () => {
    expect(scrubImage({ src: '{ABOUT_IMAGE_URL}', alt: '{ABOUT_IMAGE_ALT}' })).toBeUndefined();
  });

  it('keeps a real image and scrubs a placeholder alt to the fallback', () => {
    expect(scrubImage({ src: '/team.jpg', alt: '{ABOUT_IMAGE_ALT}' }, 'Our team')).toEqual({
      src: '/team.jpg',
      alt: 'Our team',
    });
  });

  it('keeps a real image with real alt untouched', () => {
    expect(scrubImage({ src: '/team.jpg', alt: 'The founding team' })).toEqual({
      src: '/team.jpg',
      alt: 'The founding team',
    });
  });
});
