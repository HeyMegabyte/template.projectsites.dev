/**
 * Applied output — src/pages/Home.tsx for Anchor Plumbing.
 */
import { Wrench, Droplet, Zap, Home as HomeIcon, Phone, Calendar, Shield, ClipboardCheck } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { useSEO } from '@/hooks/useSEO';
import { brand, featureOn } from '@/brand';
import { buildSiteJsonLd } from '@/lib/businessSchema';

import {
  HeroSplit,
  Stats,
  FeatureSplit,
  ProcessSteps,
  LogoCloud,
  CaseStudyGrid,
  FAQ,
  CTASection,
  type Stat,
  type FAQItem,
  type ProcessStep,
  type Logo,
  type CaseStudy,
} from '@/components/sections';

import { ServiceCards, StickyPhoneCTA, TrustBadges } from '@/components/local';

const stats: Stat[] = [
  { value: 23,    suffix: 'yr', label: 'In business' },
  { value: 5000,  suffix: '+',  label: 'Anchorage homes served' },
  { value: 60,    suffix: 'm',  label: 'Emergency dispatch', caption: 'In Anchorage during business hours' },
  { value: 4.9,   suffix: '/5', label: 'Google rating', caption: '412 reviews' },
];

const process: ProcessStep[] = [
  { title: 'Call',           description: 'Pick up the phone — we answer 24/7. After-hours forward to the on-call plumber. Dispatch within 60 minutes in Anchorage.', icon: <Phone size={20} /> },
  { title: 'Free estimate',  description: 'We come to you. Inspect the issue. Give you a written quote on the spot. No estimate fee within 25 miles of downtown Anchorage.', icon: <ClipboardCheck size={20} /> },
  { title: 'Work begins',    description: 'Most jobs same-day if you call before noon. We protect your floors, work clean, and explain what we\'re doing as we go.', icon: <Wrench size={20} /> },
  { title: 'Warranty',       description: '2-year warranty on all labor. Manufacturer warranty on parts (1–10 years depending on the fixture). Warranty terms printed on your invoice.', icon: <Shield size={20} /> },
];

const certs: Logo[] = [
  { name: 'Alaska License #12345' }, { name: 'BBB A+ Rating' },
  { name: 'Angi Top Pro 2024' },     { name: '$2M Liability Insured' },
  { name: 'Bonded · Workers Comp' }, { name: 'EPA Lead-Safe Certified' },
];

const recent: CaseStudy[] = [
  {
    slug: 'sand-lake-sewer',
    title: 'Sand Lake — Trenchless sewer replacement, one day',
    client: 'Sand Lake homeowner',
    industry: 'Sewer · Repair',
    summary: 'Replaced 75 feet of 90-year-old clay sewer line with PEX. Used trenchless boring — no yard damage. Homeowner had hot showers by 7pm.',
    cover: '/work/sewer-job.jpg',
    metrics: [
      { value: '1 day',  label: 'Total project' },
      { value: '0',      label: 'Yard damage' },
      { value: '$8,400', label: 'Total cost' },
    ],
  },
  {
    slug: 'eagle-river-emergency',
    title: 'Eagle River — Frozen pipe burst, 11pm Sunday',
    client: 'Eagle River homeowner',
    industry: 'Emergency · Burst pipe',
    summary: 'Pipe burst at 11pm Sunday. Our on-call plumber arrived in 90 minutes. Shut off main, repaired pipe section, restored water by 2am.',
    cover: '/work/burst-pipe.jpg',
    metrics: [
      { value: '90m',    label: 'Dispatch time' },
      { value: '$1,250', label: 'Total cost' },
      { value: '3h',     label: 'Repair time' },
    ],
  },
];

const faqs: FAQItem[] = [
  { question: 'What area do you serve?',            answer: 'All of Anchorage, Eagle River, Chugiak, Wasilla, and Palmer. Free estimates within 25 miles of downtown Anchorage. Beyond 25 miles, $50 trip fee — credited back if you hire us.' },
  { question: 'Do you offer 24/7 emergency service?', answer: 'Yes. Call (907) 555-0100 anytime — after-hours calls forward to our on-call plumber. Emergency dispatch within 60 minutes in Anchorage. Outside Anchorage: 90 minutes typical.' },
  { question: 'Are you licensed and insured?',      answer: 'Yes. Alaska plumbing license #12345 (active since 2003). $2M general liability insurance + workers compensation. License + insurance certificates available on request — we email them before any job.' },
  { question: 'Do you offer warranties?',           answer: '2-year warranty on all labor — written into your invoice. Manufacturer warranty on parts (typically 1–10 years). If something we installed fails within 2 years, we come back and fix it. No charge.' },
  { question: 'How quickly can you come out?',      answer: 'Same-day for non-emergency calls scheduled before noon. Emergency dispatch within 60 minutes in Anchorage during business hours. After-hours: 90 minutes typical. Call (907) 555-0100 to schedule.' },
  { question: 'Do you offer free estimates?',       answer: 'Yes — within 25 miles of downtown Anchorage. Most estimates take 30–60 minutes. We give you a written quote on the spot. Beyond 25 miles, $50 trip fee — credited back if you hire us.' },
  { question: 'What payment methods do you accept?',answer: 'Cash, check, all major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay. Payment plans through Wisetack for jobs over $1,500 — apply at the time of service.' },
  { question: 'Do you work with home warranty companies?', answer: 'Yes — we accept American Home Shield, Choice Home Warranty, First American, and others. Call (907) 555-0100 with your warranty company name + claim number; we handle the paperwork.' },
];

export default function Home() {
  useSEO({
    title: 'Anchor Plumbing — 24/7 Anchorage AK · Licensed + Insured',
    description: brand.business.description,
  });

  return (
    <>
      <JsonLd data={buildSiteJsonLd({
        name: brand.business.name,
        description: brand.business.description,
        url: brand.business.url,
        businessClass: 'storefront',
        email: brand.business.email,
        phone: brand.business.phone,
        address: {
          streetAddress: '5678 C Street',
          addressLocality: 'Anchorage',
          addressRegion: 'AK',
          postalCode: '99503',
          addressCountry: 'US',
        },
        geo: { latitude: 61.2017, longitude: -149.8908 },
        openingHours: ['Mo-Sa 08:00-18:00'],
        priceRange: '$$',
      })} />

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Plumber',
        '@id': `${brand.business.url}#org`,
        name: brand.business.name,
        url: brand.business.url,
        telephone: brand.business.phone,
        priceRange: '$$',
        areaServed: [
          { '@type': 'City', name: 'Anchorage', containedInPlace: { '@type': 'State', name: 'Alaska' } },
          { '@type': 'City', name: 'Eagle River' },
          { '@type': 'City', name: 'Chugiak' },
          { '@type': 'City', name: 'Wasilla' },
          { '@type': 'City', name: 'Palmer' },
        ],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '412', bestRating: '5' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Plumbing services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Drain cleaning' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water heater repair + replacement' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pipe burst + leak repair' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bathroom remodel' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sewer line replacement' } },
          ],
        },
      }} />

      {featureOn('hero') && (
        <HeroSplit
          eyebrow="24/7 emergency · Anchorage"
          headline="Plumbing done right. The first time."
          subheadline="Family-owned since 2003. Licensed Alaska plumber #12345. Same-day service. 24/7 emergency line. Free estimates within 25 miles."
          primary={{ label: 'Call (907) 555-0100', href: 'tel:+19075550100' }}
          secondary={{ label: 'Request a quote', href: '/contact' }}
          image={{ src: '/team-truck.jpg', alt: 'Three plumbers in uniform standing in front of the Anchor Plumbing truck' }}
          trustBadges={[
            { icon: 'star',  label: '4.9 / 5 Google · 412 reviews' },
            { icon: 'shield',label: 'Alaska License #12345 · $2M Insured' },
            { icon: 'award', label: 'BBB A+ · Angi Top Pro 2024' },
          ]}
        />
      )}

      <TrustBadges
        rating={4.9}
        reviewCount={412}
        badges={[
          { icon: 'shield', label: 'Licensed' },
          { icon: 'shield', label: 'Insured ($2M)' },
          { icon: 'shield', label: 'Bonded' },
          { icon: 'award',  label: 'BBB A+' },
          { icon: 'award',  label: 'Angi Top Pro' },
          { icon: 'award',  label: 'EPA Lead-Safe' },
        ]}
      />

      {featureOn('services') && (
        <ServiceCards
          heading="What we fix"
          services={[
            { name: 'Drain cleaning',      description: 'Clogs, blockages, sewer lines. Same-day service. Camera inspection available.', price: 'from $149' },
            { name: 'Water heater',        description: 'Tank + tankless repair or replacement. 24-hour emergency service available.',   price: 'from $290' },
            { name: 'Pipe burst + leaks',  description: 'Emergency response. We dry out the affected area and repair the wall, not just the pipe.', price: '24/7' },
            { name: 'Bathroom remodel',    description: 'Full bath renovations. Fixed quote upfront. Typical job 2–4 weeks.',             price: 'quote' },
          ]}
        />
      )}

      {featureOn('stats') && (
        <Stats eyebrow="By the numbers" stats={stats} />
      )}

      {featureOn('process') && (
        <ProcessSteps
          eyebrow="How it works"
          headline="Four steps from your call to clean water"
          steps={process}
        />
      )}

      <FeatureSplit
        eyebrow="About"
        headline="Family-owned since 2003. Same family. Same trucks."
        description="Started by Tom Cooper in 2003 with one truck and one apprentice. Now four plumbers, three trucks, and 5,000+ Anchorage homes served. Same family. Same standards. Same warranty."
        bullets={[
          'Alaska Bar license #12345 (active since 2003)',
          '$2M general liability + workers comp insurance',
          'BBB A+ rating · Angi Top Pro 2024',
          'EPA Lead-Safe certified for older Anchorage homes',
        ]}
        cta={{ label: 'Meet the team', href: '/about' }}
        image={{ src: '/cooper-family.jpg', alt: 'The Cooper family — three generations of plumbers — in front of the Anchor Plumbing warehouse' }}
        imagePosition="left"
      />

      {featureOn('caseStudies') && (
        <CaseStudyGrid eyebrow="Recent work" headline="Anchorage homes we\'ve helped" studies={recent} />
      )}

      {featureOn('logoCloud') && (
        <LogoCloud eyebrow="Certifications + insurance" logos={certs} variant="grid" />
      )}

      {featureOn('faq') && (
        <FAQ eyebrow="Questions" headline="What homeowners ask first" items={faqs} />
      )}

      {featureOn('cta') && (
        <CTASection
          eyebrow="Need a plumber?"
          headline="Call now — we answer 24/7."
          description="No phone tree. No call center. Real plumber on the other end. Emergency dispatch within 60 minutes in Anchorage."
          primary={{ label: 'Call (907) 555-0100', href: 'tel:+19075550100' }}
          secondary={{ label: 'Request a quote', href: '/contact' }}
          tone="emphatic"
        />
      )}

      <StickyPhoneCTA phone="+19075550100" label="Call now" />
    </>
  );
}
