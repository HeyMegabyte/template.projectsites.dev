import { describe, it, expect } from 'vitest';
import {
  isPlaceholder,
  isLeakedPlanText,
  scrubText,
  scrubList,
  hasRealImage,
  scrubImage,
  fitMetaTitle,
} from '@/lib/placeholders';

describe('fitMetaTitle', () => {
  it('clamps a long "{Page} {Name} — {Tagline}" WITHOUT a dangling stop-word', () => {
    // The sub-page overflow case (a long name + long tagline) — must not end on "… for".
    const t = fitMetaTitle('About Meridian Family Medicine — Trusted Primary Care for Every Age', {
      name: 'Meridian Family Medicine',
      tagline: 'Trusted Primary Care for Every Age',
      address: '2000 16th St, Denver, CO 80202',
    });
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).toBe('About Meridian Family Medicine — Trusted Primary Care');
    expect(t).not.toMatch(/\b(for|and|the|of|to|with|in|on|at|or)$/i);
    expect(t).not.toMatch(/[—–·|,;:-]\s*$/);
  });

  it('drops a truncated trailing "<stop-word> <word>" phrase on the homepage title', () => {
    // "… Trusted Primary Care for Every Age" (61) overflows → the cut lands on "… for
    // Every" (Age dropped). "Every" is not a stop-word, so it must drop the whole "for
    // Every" tail, not leave a mid-phrase dangle.
    const t = fitMetaTitle('Meridian Family Medicine — Trusted Primary Care for Every Age', {
      name: 'Meridian Family Medicine',
      tagline: 'Trusted Primary Care for Every Age',
    });
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).toBe('Meridian Family Medicine — Trusted Primary Care');
    expect(t).not.toMatch(/\bfor\s+\w+$/i);
  });

  it('refills a clamp-shortened title with the CITY for local-SEO (no tagline dup)', () => {
    const t = fitMetaTitle('Meridian Family Medicine — Trusted Primary Care for Every Age', {
      name: 'Meridian Family Medicine',
      tagline: 'Trusted Primary Care for Every Age',
      address: '2000 16th St, Denver, CO 80202',
    });
    expect(t).toBe('Meridian Family Medicine — Trusted Primary Care · Denver');
    expect(t.length).toBeGreaterThanOrEqual(50);
    expect(t.length).toBeLessThanOrEqual(60);
  });

  it('skips the city refill when it would exceed 60 (keeps the clean clamp)', () => {
    const t = fitMetaTitle('Meridian Family Medicine — Trusted Primary Care for Every Age', {
      name: 'Meridian Family Medicine',
      tagline: 'Trusted Primary Care for Every Age',
      address: '2000 16th St, San Francisco, CA 94103',
    });
    expect(t).toBe('Meridian Family Medicine — Trusted Primary Care');
  });

  it('drops a truncated subordinate clause ("… When It") on a clamped sub-page title', () => {
    const t = fitMetaTitle('Services Kessler Family Law — Trusted Counsel When It Matters', {
      name: 'Kessler Family Law',
      tagline: 'Trusted Counsel When It Matters',
    });
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).toBe('Services Kessler Family Law — Trusted Counsel');
    expect(t).not.toMatch(/\bwhen\b/i);
  });

  it('keeps a COMPLETE "When …" clause in an in-range title (only clamps strip it)', () => {
    const t = fitMetaTitle('Sunrise Home Care When You Need It Most — Local Team', {
      name: 'Sunrise Home Care',
      tagline: 'Local Team',
    });
    expect(t).toBe('Sunrise Home Care When You Need It Most — Local Team');
  });

  it('never strips a COMPLETE "for X" phrase in an in-range title', () => {
    // Safety: 55 chars (≥50, ≤60) so it takes the non-clamp branch — "Care for Kids"
    // is a real phrase and must survive (the aggressive strip fires ONLY on a clamp).
    const t = fitMetaTitle('Sunrise Home Care for Kids — Trusted Local Nursing Team', {
      name: 'Sunrise Home Care for Kids',
      tagline: 'Trusted Local Nursing Team',
    });
    expect(t).toBe('Sunrise Home Care for Kids — Trusted Local Nursing Team');
  });

  it('leaves an already-clean in-range title untouched', () => {
    const t = fitMetaTitle('About Brightwater Plumbing — Reliable Service, Done Right', {
      name: 'Brightwater Plumbing',
      tagline: 'Reliable Service, Done Right',
    });
    expect(t).toBe('About Brightwater Plumbing — Reliable Service, Done Right');
  });

  it('pads a short title with the tagline, ending on a real word', () => {
    const t = fitMetaTitle('About — Ada Co', { tagline: 'Design that ships fast', address: '9 5th, Austin, TX' });
    expect(t.length).toBeGreaterThanOrEqual(50);
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t).not.toMatch(/[—–·|,;:-]\s*$/);
  });
});

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

  it('flags leaked generation-plan / instruction prose as a placeholder', () => {
    // The exact string that shipped on the 2.2/10 build (truncated mid-word).
    expect(isPlaceholder('Sections: Hero, About our roastery, Services (espresso bar, whol')).toBe(
      true,
    );
    expect(isPlaceholder('# System\nYou are an elite web designer')).toBe(true);
  });
});

describe('isLeakedPlanText', () => {
  it('catches the tells of a leaked section plan / prompt scaffold', () => {
    for (const s of [
      'Sections: Hero, About our roastery, Services (espresso bar, whol',
      'The site will have the following sections: hero, about, contact',
      'Here is the content for the homepage',
      '## User\nBusiness Profile',
      'You are an elite web designer who creates gorgeous sites',
      'As an AI language model, I cannot',
      'This website will include a hero, services, and a contact form',
    ]) {
      expect(isLeakedPlanText(s)).toBe(true);
    }
  });

  it('passes real marketing copy through untouched', () => {
    for (const s of [
      'Small-batch coffee roasted in Asheville since 2009',
      'We serve espresso, pour-over, and whole-bean coffee',
      'Fresh sourdough, baked daily on Pearl Street',
      'Book a consultation with our team',
    ]) {
      expect(isLeakedPlanText(s)).toBe(false);
    }
  });

  it('is false for empty / non-string', () => {
    expect(isLeakedPlanText('')).toBe(false);
    expect(isLeakedPlanText(undefined)).toBe(false);
    expect(isLeakedPlanText(null)).toBe(false);
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

  it('drops leaked plan prose to the fallback (hero never shows the plan)', () => {
    expect(
      scrubText('Sections: Hero, About our roastery, Services (espresso bar, whol', 'Asheville Roasters'),
    ).toBe('Asheville Roasters');
    // No fallback → empties so the caller guard hides the element.
    expect(scrubText('# System\nYou are an elite web designer')).toBe('');
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
