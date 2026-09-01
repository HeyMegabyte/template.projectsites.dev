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
  openingHours?: Array<string | Record<string, unknown>>;
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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

/** "7am" | "7:30pm" | "12pm" → "HH:MM" (24h), or null when unparseable. */
function to24h(t: string): string | null {
  const m = t.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!m) return null;
  let h = Number(m[1]);
  if (h < 1 || h > 12) return null;
  if (m[3] === 'pm' && h !== 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`;
}

/**
 * Parse the free-text `hours` string ("Wed–Sun 7am–3pm · Closed Mon & Tue") into
 * schema.org `OpeningHoursSpecification` objects for the LocalBusiness JSON-LD — the
 * signal Google shows in the local pack / knowledge panel. Handles the pack format
 * (`·`-separated "DayRange TimeRange" clauses, en-dash or hyphen ranges); SKIPS
 * closed/24-7/by-appointment notes; returns `[]` for anything unparseable (omit, never
 * emit malformed hours — a bad node can void the whole entity). Pure.
 *
 * @example parseHours('Mon–Fri 9am–5pm')
 * // → [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday'..'Friday'], opens: '09:00', closes: '17:00' }]
 */
export function parseHours(raw?: string): Array<Record<string, unknown>> {
  if (!raw || typeof raw !== 'string') return [];
  const out: Array<Record<string, unknown>> = [];
  for (const clause of raw.split(/[·|,;]/).map((c) => c.trim()).filter(Boolean)) {
    if (/closed|24\s*\/\s*7|emergency|appointment|by appt/i.test(clause)) continue;
    const m = clause.match(
      /^([A-Za-z]{3})\s*(?:[–—-]\s*([A-Za-z]{3}))?\s+(\d{1,2}(?::\d{2})?\s*[ap]m)\s*[–—-]\s*(\d{1,2}(?::\d{2})?\s*[ap]m)$/i,
    );
    if (!m) continue;
    const start = DAY_INDEX[m[1].toLowerCase()];
    const end = m[2] ? DAY_INDEX[m[2].toLowerCase()] : start;
    const opens = to24h(m[3]);
    const closes = to24h(m[4]);
    if (start === undefined || end === undefined || !opens || !closes) continue;
    const days: string[] = [];
    for (let i = start, guard = 0; guard < 8; i = (i + 1) % 7, guard++) {
      days.push(DAY_NAMES[i]);
      if (i === end) break;
    }
    out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes });
  }
  return out;
}
