interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string;
  opens: string;
  closes: string;
}

interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const CATEGORY_TYPE_MAP: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'CafeOrCoffeeShop',
  bar: 'BarOrPub',
  salon: 'BeautySalon',
  spa: 'DaySpa',
  dentist: 'Dentist',
  doctor: 'Physician',
  hospital: 'Hospital',
  pharmacy: 'Pharmacy',
  gym: 'ExerciseGym',
  hotel: 'Hotel',
  store: 'Store',
  shop: 'Store',
  retail: 'Store',
  auto: 'AutoRepair',
  mechanic: 'AutoRepair',
  law: 'LegalService',
  attorney: 'Attorney',
  plumber: 'Plumber',
  electrician: 'Electrician',
  hvac: 'HVACBusiness',
  realtor: 'RealEstateAgent',
  insurance: 'InsuranceAgency',
  accounting: 'AccountingService',
  veterinary: 'VeterinaryCare',
  pet: 'PetStore',
  florist: 'Florist',
  bakery: 'Bakery',
};

const DAY_MAP: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function parseHoursString(timeStr: string): { opens: string; closes: string } | null {
  if (!timeStr || timeStr.toLowerCase() === 'closed') return null;

  const match = timeStr.match(
    /(\d{1,2}):?(\d{2})?\s*(am|pm)?\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i
  );
  if (!match) return null;

  const to24 = (h: string, m: string | undefined, ampm: string | undefined): string => {
    let hours = parseInt(h, 10);
    const mins = parseInt(m ?? '0', 10);
    if (ampm) {
      const lower = ampm.toLowerCase();
      if (lower === 'pm' && hours !== 12) hours += 12;
      if (lower === 'am' && hours === 12) hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return {
    opens: to24(match[1], match[2], match[3]),
    closes: to24(match[4], match[5], match[6]),
  };
}

export function generateLocalBusinessSchema(
  research: Record<string, unknown>
): Record<string, unknown> {
  const category = String(research.category ?? research.type ?? '').toLowerCase();
  const schemaType = CATEGORY_TYPE_MAP[category] ?? 'LocalBusiness';

  const address: PostalAddress = {
    '@type': 'PostalAddress',
  };
  if (research.streetAddress) address.streetAddress = String(research.streetAddress);
  if (research.city) address.addressLocality = String(research.city);
  if (research.state) address.addressRegion = String(research.state);
  if (research.zip ?? research.postalCode)
    address.postalCode = String(research.zip ?? research.postalCode);
  if (research.country) address.addressCountry = String(research.country);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: research.name ?? research.businessName,
    url: research.url ?? research.website,
  };

  if (Object.keys(address).length > 1) {
    schema.address = address;
  }

  if (research.phone ?? research.telephone) {
    schema.telephone = String(research.phone ?? research.telephone);
  }

  if (research.lat && research.lng) {
    const geo: GeoCoordinates = {
      '@type': 'GeoCoordinates',
      latitude: Number(research.lat),
      longitude: Number(research.lng),
    };
    schema.geo = geo;
  }

  if (research.hours && typeof research.hours === 'object') {
    const hours = research.hours as Record<string, string>;
    const specs: OpeningHoursSpec[] = [];
    for (const [day, time] of Object.entries(hours)) {
      const dayKey = day.toLowerCase();
      const schemaDay = DAY_MAP[dayKey];
      if (!schemaDay) continue;
      const parsed = parseHoursString(time);
      if (!parsed) continue;
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: schemaDay,
        opens: parsed.opens,
        closes: parsed.closes,
      });
    }
    if (specs.length > 0) {
      schema.openingHoursSpecification = specs;
    }
  }

  if (research.image ?? research.images) {
    schema.image = research.image ?? research.images;
  }

  if (research.socialLinks && Array.isArray(research.socialLinks)) {
    schema.sameAs = (research.socialLinks as { url: string }[]).map((s) => s.url);
  } else if (research.sameAs) {
    schema.sameAs = research.sameAs;
  }

  if (research.rating && research.reviewCount) {
    const agg: AggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(research.rating),
      reviewCount: Number(research.reviewCount),
      bestRating: 5,
    };
    schema.aggregateRating = agg;
  }

  if (research.priceRange) schema.priceRange = String(research.priceRange);
  if (research.areaServed) schema.areaServed = research.areaServed;
  if (research.description) schema.description = String(research.description);
  if (research.email) schema.email = String(research.email);

  if (
    (schemaType === 'Restaurant' || schemaType === 'CafeOrCoffeeShop' || schemaType === 'BarOrPub') &&
    research.menuUrl
  ) {
    schema.hasMenu = String(research.menuUrl);
  }

  if (research.paymentAccepted) schema.paymentAccepted = String(research.paymentAccepted);
  if (research.currenciesAccepted) schema.currenciesAccepted = String(research.currenciesAccepted);
  if (research.knowsAbout) schema.knowsAbout = research.knowsAbout;

  return schema;
}

export function generateFAQSchema(
  faqs: FAQItem[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
