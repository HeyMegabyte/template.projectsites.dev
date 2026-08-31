import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Pricing as PricingSection, FAQ, CTASection, Comparison, type PricingTier, type FAQItem } from '@/components/sections';
import { brand } from '@/brand';

const tiers: PricingTier[] = [
  { id: 'starter', name: '{TIER_1_NAME}', description: '{TIER_1_DESC}', monthly: 49,  yearly: 470,  features: ['{TIER_1_F1}', '{TIER_1_F2}', '{TIER_1_F3}', '{TIER_1_F4}'] },
  { id: 'pro',     name: '{TIER_2_NAME}', description: '{TIER_2_DESC}', monthly: 149, yearly: 1430, features: ['{TIER_2_F1}', '{TIER_2_F2}', '{TIER_2_F3}', '{TIER_2_F4}', '{TIER_2_F5}'], featured: true, badge: 'Most Popular' },
  { id: 'ent',     name: '{TIER_3_NAME}', description: '{TIER_3_DESC}', monthly: 499, yearly: 4790, features: ['{TIER_3_F1}', '{TIER_3_F2}', '{TIER_3_F3}', '{TIER_3_F4}', '{TIER_3_F5}', '{TIER_3_F6}'] },
];

const compare = {
  columns: tiers.map((t) => t.name),
  rows: [
    { feature: '{COMPARE_1_FEATURE}', values: [true,  true,  true]  as const },
    { feature: '{COMPARE_2_FEATURE}', values: [false, true,  true]  as const },
    { feature: '{COMPARE_3_FEATURE}', values: ['—',   '10 GB','Unlimited'] as const },
    { feature: '{COMPARE_4_FEATURE}', values: [false, 'partial', true] as const },
    { feature: '{COMPARE_5_FEATURE}', values: [false, false, true]  as const },
  ],
};

const faqs: FAQItem[] = [
  { question: '{PRICING_FAQ_1_Q}', answer: '{PRICING_FAQ_1_A}' },
  { question: '{PRICING_FAQ_2_Q}', answer: '{PRICING_FAQ_2_A}' },
  { question: '{PRICING_FAQ_3_Q}', answer: '{PRICING_FAQ_3_A}' },
];

export default function Pricing() {
  useSEO({
    title: 'Pricing {BUSINESS_NAME} — {SEO_TAGLINE}',
    description: `{PRICING_META_DESCRIPTION}`,
  });

  return (
    <>
      <Breadcrumbs baseUrl={brand.business.url} />
      <PricingSection
        tiers={tiers}
        headline="{PRICING_HEADLINE}"
        description="{PRICING_SUBHEADLINE}"
        as="h1"
      />
      <Comparison
        columns={compare.columns}
        rows={compare.rows.map((r) => ({ ...r, values: [...r.values] }))}
        eyebrow="Compare"
        headline="What's included"
        highlightColumn={1}
      />
      <FAQ items={faqs} headline="Pricing questions" />
      <CTASection
        eyebrow="Still deciding?"
        headline="Talk to us — pick the right plan together"
        primary={{ label: 'Book a 15-min call', href: '/contact' }}
        secondary={{ label: 'Start free trial',  href: '/contact?intent=trial' }}
      />
    </>
  );
}
