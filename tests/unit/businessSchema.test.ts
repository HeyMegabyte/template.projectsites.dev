/**
 * Tests the JSON-LD graph builder in `src/lib/businessSchema.ts`.
 */
import { describe, it, expect } from 'vitest';
import { buildBusinessJsonLd, buildSiteJsonLd, isLocalBusinessClass, parseAddress } from '@/lib/businessSchema';

const baseProfile = {
  name: 'Acme Inc.',
  description: 'We make widgets.',
  url: 'https://acme.example',
  businessClass: 'saas' as const,
  email: 'hello@acme.example',
};

describe('buildBusinessJsonLd', () => {
  it('emits SoftwareApplication for saas businessClass', () => {
    const json = buildBusinessJsonLd(baseProfile);
    expect(json['@type']).toBe('SoftwareApplication');
    expect(json['@context']).toBe('https://schema.org');
    expect(json.name).toBe('Acme Inc.');
  });

  it('emits Restaurant for restaurant businessClass with full local fields', () => {
    const json = buildBusinessJsonLd({
      ...baseProfile,
      businessClass: 'restaurant',
      address: { streetAddress: '123 Main', addressLocality: 'Anchorage', addressRegion: 'AK', postalCode: '99501', addressCountry: 'US' },
      geo: { latitude: 61.2, longitude: -149.9 },
      openingHours: ['Tu-Su 06:00-15:00'],
      priceRange: '$',
    });
    expect(json['@type']).toBe('Restaurant');
    expect(json.geo).toEqual(expect.objectContaining({ '@type': 'GeoCoordinates' }));
    expect(json.openingHoursSpecification).toBeDefined();
    expect(json.priceRange).toBe('$');
  });

  it('omits geo + openingHours for non-local businesses', () => {
    const json = buildBusinessJsonLd({
      ...baseProfile,
      businessClass: 'saas',
      geo: { latitude: 0, longitude: 0 },
      openingHours: ['Mo-Fr 09:00-17:00'],
      priceRange: '$$',
    });
    expect(json.geo).toBeUndefined();
    expect(json.openingHoursSpecification).toBeUndefined();
    expect(json.priceRange).toBeUndefined();
  });

  it('includes founder Person sub-object when provided', () => {
    const json = buildBusinessJsonLd({
      ...baseProfile,
      founder: { name: 'Jane Doe', jobTitle: 'CEO', sameAs: ['https://x.com/jane'] },
    });
    expect((json.founder as Record<string, unknown>)['@type']).toBe('Person');
    expect((json.founder as Record<string, unknown>).name).toBe('Jane Doe');
    expect((json.founder as Record<string, unknown>).jobTitle).toBe('CEO');
  });

  it('maps every loop vertical to its specific LocalBusiness subtype', () => {
    const cases: Record<string, string> = {
      dental: 'Dentist',
      medical: 'MedicalBusiness',
      wellness: 'HealthAndBeautyBusiness',
      'local-service': 'HomeAndConstructionBusiness',
      'real-estate': 'RealEstateAgent',
      fitness: 'ExerciseGym',
      restaurant: 'Restaurant',
      legal: 'LegalService',
      nonprofit: 'NGO',
    };
    for (const [cls, type] of Object.entries(cases)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(buildBusinessJsonLd({ ...baseProfile, businessClass: cls as any })['@type']).toBe(type);
    }
  });

  it('treats dental/wellness/local-service/real-estate/fitness/legal/nonprofit as LOCAL (geo emits)', () => {
    for (const cls of ['dental', 'wellness', 'local-service', 'real-estate', 'fitness', 'legal', 'nonprofit'] as const) {
      const json = buildBusinessJsonLd({ ...baseProfile, businessClass: cls, geo: { latitude: 1, longitude: 2 } });
      expect(json.geo, `${cls} should be local`).toBeDefined();
    }
  });
});

describe('parseAddress', () => {
  it('parses "Street, City, ST ZIP" into a structured PostalAddress', () => {
    expect(parseAddress('300 S 16th St, Omaha, NE 68102')).toEqual({
      streetAddress: '300 S 16th St', addressLocality: 'Omaha', addressRegion: 'NE', postalCode: '68102', addressCountry: 'US',
    });
  });
  it('handles a partial "Street, City" (no state/zip)', () => {
    expect(parseAddress('123 Main St, Springfield')).toEqual({
      streetAddress: '123 Main St', addressLocality: 'Springfield', addressRegion: '', postalCode: '', addressCountry: 'US',
    });
  });
  it('returns undefined for online-only / empty / single-token', () => {
    expect(parseAddress('Online')).toBeUndefined();
    expect(parseAddress('')).toBeUndefined();
    expect(parseAddress(undefined)).toBeUndefined();
  });
});

describe('buildSiteJsonLd', () => {
  it('returns at least 4 JSON-LD nodes', () => {
    const graph = buildSiteJsonLd(baseProfile);
    expect(graph.length).toBeGreaterThanOrEqual(4);
  });

  it('includes Organization + WebSite + WebPage + BreadcrumbList types', () => {
    const graph = buildSiteJsonLd(baseProfile);
    const types = graph.map((n) => n['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('WebPage');
    expect(types).toContain('BreadcrumbList');
  });

  it('WebSite has SearchAction potentialAction', () => {
    const graph = buildSiteJsonLd(baseProfile);
    const website = graph.find((n) => n['@type'] === 'WebSite');
    expect(website?.potentialAction).toBeDefined();
  });
});

describe('isLocalBusinessClass', () => {
  it.each([
    ['storefront',   true],
    ['restaurant',   true],
    ['medical',      true],
    ['dental',       true],
    ['wellness',     true],
    ['retail',       true],
    ['salon',        true],
    ['gym',          true],
    ['fitness',      true],
    ['auto-repair',  true],
    ['local-service', true],
    ['real-estate',  true],
    // legal + nonprofit have a findable office → local (get address/geo/openingHours),
    // matching how Google surfaces law firms + food banks in the local pack.
    ['nonprofit',    true],
    ['legal',        true],
    ['saas',         false],
    ['portfolio',    false],
    ['organization', false],
  ] as const)('%s → %s', (cls, expected) => {
    expect(isLocalBusinessClass(cls)).toBe(expected);
  });
});
