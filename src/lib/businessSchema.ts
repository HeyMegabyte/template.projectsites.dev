export type BusinessClass =
  | 'storefront'
  | 'restaurant'
  | 'medical'
  | 'dental'
  | 'wellness'
  | 'retail'
  | 'salon'
  | 'gym'
  | 'fitness'
  | 'auto-repair'
  | 'local-service'
  | 'real-estate'
  | 'saas'
  | 'portfolio'
  | 'nonprofit'
  | 'legal'
  | 'organization';

// Physically-located businesses → get the LocalBusiness subtype + geo + openingHours +
// priceRange. Every loop vertical except saas/portfolio/organization has a real address,
// so all of them are local (a law firm, clinic, and food bank all have a findable office).
const LOCAL_BUSINESS_CLASSES: ReadonlySet<BusinessClass> = new Set([
  'storefront',
  'restaurant',
  'medical',
  'dental',
  'wellness',
  'retail',
  'salon',
  'gym',
  'fitness',
  'auto-repair',
  'local-service',
  'real-estate',
  'nonprofit',
  'legal',
]);

// Specific Schema.org LocalBusiness subtypes (richer than the generic 'LocalBusiness')
// so Google's rich-results/local-pack shows the right entity. Each is a real schema.org
// type. saas → SoftwareApplication (not local).
const TYPE_OVERRIDES: Partial<Record<BusinessClass, string>> = {
  restaurant:      'Restaurant',
  medical:         'MedicalBusiness',
  dental:          'Dentist',
  wellness:        'HealthAndBeautyBusiness',
  retail:          'Store',
  salon:           'BeautySalon',
  gym:             'ExerciseGym',
  fitness:         'ExerciseGym',
  'auto-repair':   'AutoRepair',
  'local-service': 'HomeAndConstructionBusiness',
  'real-estate':   'RealEstateAgent',
  legal:           'LegalService',
  nonprofit:       'NGO',
  saas:            'SoftwareApplication',
};

export interface BusinessProfile {
  name: string;
  description: string;
  url: string;
  businessClass: BusinessClass;
  logo?: string;
  email?: string;
  phone?: string;
  sameAs?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: string[];
  priceRange?: string;
  founder?: { name: string; jobTitle?: string; sameAs?: string[] };
  foundingDate?: string;
}

export function buildBusinessJsonLd(profile: BusinessProfile): Record<string, unknown> {
  const isLocal = LOCAL_BUSINESS_CLASSES.has(profile.businessClass);
  const type = TYPE_OVERRIDES[profile.businessClass] ?? (isLocal ? 'LocalBusiness' : 'Organization');

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${profile.url}#org`,
    name: profile.name,
    description: profile.description,
    url: profile.url,
  };
  if (profile.logo) base.logo = profile.logo;
  if (profile.email) base.email = profile.email;
  if (profile.phone) base.telephone = profile.phone;
  if (profile.sameAs?.length) base.sameAs = profile.sameAs;
  if (profile.foundingDate) base.foundingDate = profile.foundingDate;
  if (profile.founder) {
    base.founder = {
      '@type': 'Person',
      name: profile.founder.name,
      ...(profile.founder.jobTitle ? { jobTitle: profile.founder.jobTitle } : {}),
      ...(profile.founder.sameAs?.length ? { sameAs: profile.founder.sameAs } : {}),
    };
  }
  if (profile.address) {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: profile.address.streetAddress,
      addressLocality: profile.address.addressLocality,
      addressRegion: profile.address.addressRegion,
      postalCode: profile.address.postalCode,
      addressCountry: profile.address.addressCountry,
    };
  }
  if (isLocal && profile.geo) {
    base.geo = {
      '@type': 'GeoCoordinates',
      latitude: profile.geo.latitude,
      longitude: profile.geo.longitude,
    };
  }
  if (isLocal && profile.openingHours?.length) base.openingHoursSpecification = profile.openingHours;
  if (isLocal && profile.priceRange) base.priceRange = profile.priceRange;
  return base;
}

/**
 * Build the full per-page JSON-LD graph (5+ nodes per always.md).
 * Returns an array so consumers can drop it straight into <JsonLd data={...} />.
 */
export function buildSiteJsonLd(profile: BusinessProfile): Record<string, unknown>[] {
  const organization = buildBusinessJsonLd(profile);

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${profile.url}#website`,
    name: profile.name,
    url: profile.url,
    description: profile.description,
    publisher: { '@id': `${profile.url}#org` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${profile.url}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${profile.url}#webpage`,
    url: profile.url,
    name: profile.name,
    description: profile.description,
    isPartOf: { '@id': `${profile.url}#website` },
    about: { '@id': `${profile.url}#org` },
    inLanguage: 'en-US',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: profile.url },
    ],
  };

  return [organization, website, webpage, breadcrumb];
}

export function isLocalBusinessClass(value: BusinessClass): boolean {
  return LOCAL_BUSINESS_CLASSES.has(value);
}

/**
 * Parse a free-text US address string ("300 S 16th St, Omaha, NE 68102") into the
 * structured `PostalAddress` shape `buildBusinessJsonLd` needs. `brand.business.address`
 * ships as a single string, so without this the LocalBusiness JSON-LD emits NO address —
 * the single biggest local-SEO gap (Google's local pack keys on the structured address).
 *
 * Defensive: returns `undefined` for anything without at least a locality (online-only /
 * placeholder builds → no address node, never a malformed one). Pure.
 *
 * @example parseAddress('300 S 16th St, Omaha, NE 68102')
 * // → { streetAddress: '300 S 16th St', addressLocality: 'Omaha', addressRegion: 'NE', postalCode: '68102', addressCountry: 'US' }
 */
export function parseAddress(raw?: string): BusinessProfile['address'] | undefined {
  if (!raw || typeof raw !== 'string') return undefined;
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return undefined; // need at least "Street, City" or "City, ST ZIP"
  const last = parts[parts.length - 1];
  const stZip = last.match(/^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/); // "NE 68102"
  let addressRegion = '';
  let postalCode = '';
  let localityIdx = parts.length - 1;
  if (stZip) {
    addressRegion = stZip[1].toUpperCase();
    postalCode = stZip[2];
    localityIdx = parts.length - 2;
  } else if (/^[A-Za-z]{2}$/.test(last)) {
    addressRegion = last.toUpperCase();
    localityIdx = parts.length - 2;
  } else if (/^\d{5}(?:-\d{4})?$/.test(last)) {
    postalCode = last;
    localityIdx = parts.length - 2;
  }
  const addressLocality = localityIdx >= 0 ? parts[localityIdx] : '';
  const streetAddress = localityIdx > 0 ? parts.slice(0, localityIdx).join(', ') : '';
  if (!addressLocality && !streetAddress) return undefined;
  return { streetAddress, addressLocality, addressRegion, postalCode, addressCountry: 'US' };
}
