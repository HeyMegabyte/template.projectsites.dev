import { Shield, Zap, Users, Target, Award, Star, Rocket, Sparkles, MessageSquare } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { SafeSection } from '@/components/SafeSection';
import { useSEO } from '@/hooks/useSEO';
import { brand, featureOn } from '@/brand';
import { buildBusinessJsonLd, type BusinessClass } from '@/lib/businessSchema';

import {
  HeroCenter,
  BentoGrid,
  Stats,
  FeatureSplit,
  ProcessSteps,
  Pricing,
  FAQ,
  LogoCloud,
  CTASection,
  type BentoTile,
  type Stat,
  type PricingTier,
  type FAQItem,
  type ProcessStep,
  type Logo,
} from '@/components/sections';

const bentoTiles: BentoTile[] = [
  { id: 't1', title: '{FEATURE_1_TITLE}', description: '{FEATURE_1_DESCRIPTION}', icon: <Shield size={24} />, span: 'lg', tall: true, accent: true },
  { id: 't2', title: '{FEATURE_2_TITLE}', description: '{FEATURE_2_DESCRIPTION}', icon: <Zap size={24} />, span: 'sm' },
  { id: 't3', title: '{FEATURE_3_TITLE}', description: '{FEATURE_3_DESCRIPTION}', icon: <Users size={24} />, span: 'sm' },
  { id: 't4', title: '{FEATURE_4_TITLE}', description: '{FEATURE_4_DESCRIPTION}', icon: <Target size={24} />, span: 'sm' },
  { id: 't5', title: '{FEATURE_5_TITLE}', description: '{FEATURE_5_DESCRIPTION}', icon: <Award size={24} />, span: 'md' },
  { id: 't6', title: '{FEATURE_6_TITLE}', description: '{FEATURE_6_DESCRIPTION}', icon: <Star size={24} />, span: 'md' },
];

const stats: Stat[] = [
  { value: 500,  suffix: '+', label: '{STAT_1_LABEL}', caption: '{STAT_1_CAPTION}' },
  { value: 98,   suffix: '%', label: '{STAT_2_LABEL}', caption: '{STAT_2_CAPTION}' },
  { value: 24,   suffix: '/7', label: '{STAT_3_LABEL}', caption: '{STAT_3_CAPTION}' },
  { value: 10,   suffix: 'yr',label: '{STAT_4_LABEL}', caption: '{STAT_4_CAPTION}' },
];

const process: ProcessStep[] = [
  { title: '{PROCESS_1_TITLE}', description: '{PROCESS_1_DESCRIPTION}', icon: <MessageSquare size={20} /> },
  { title: '{PROCESS_2_TITLE}', description: '{PROCESS_2_DESCRIPTION}', icon: <Sparkles size={20} /> },
  { title: '{PROCESS_3_TITLE}', description: '{PROCESS_3_DESCRIPTION}', icon: <Rocket size={20} /> },
  { title: '{PROCESS_4_TITLE}', description: '{PROCESS_4_DESCRIPTION}', icon: <Award size={20} /> },
];

const tiers: PricingTier[] = [
  { id: 'starter',    name: '{TIER_1_NAME}',    description: '{TIER_1_DESC}', monthly: 49,  yearly: 470,  features: ['{TIER_1_F1}', '{TIER_1_F2}', '{TIER_1_F3}'] },
  { id: 'pro',        name: '{TIER_2_NAME}',    description: '{TIER_2_DESC}', monthly: 149, yearly: 1430, features: ['{TIER_2_F1}', '{TIER_2_F2}', '{TIER_2_F3}', '{TIER_2_F4}'], featured: true, badge: 'Most Popular' },
  { id: 'enterprise', name: '{TIER_3_NAME}',    description: '{TIER_3_DESC}', monthly: 499, yearly: 4790, features: ['{TIER_3_F1}', '{TIER_3_F2}', '{TIER_3_F3}', '{TIER_3_F4}', '{TIER_3_F5}'] },
];

const faqs: FAQItem[] = [
  { question: '{FAQ_1_Q}', answer: '{FAQ_1_A}' },
  { question: '{FAQ_2_Q}', answer: '{FAQ_2_A}' },
  { question: '{FAQ_3_Q}', answer: '{FAQ_3_A}' },
  { question: '{FAQ_4_Q}', answer: '{FAQ_4_A}' },
];

const logos: Logo[] = [
  { name: '{LOGO_1_NAME}' }, { name: '{LOGO_2_NAME}' }, { name: '{LOGO_3_NAME}' },
  { name: '{LOGO_4_NAME}' }, { name: '{LOGO_5_NAME}' }, { name: '{LOGO_6_NAME}' },
];

export default function Home() {
  useSEO({
    // Trailing " — " on an empty tagline renders as "Cedar Ridge Bakeshop — "
    // (journey 2026-08-19). Only suffix the em-dash when a tagline exists.
    title: brand.business.tagline
      ? `${brand.business.name} — ${brand.business.tagline}`
      : brand.business.name,
    description: brand.business.description,
  });

  return (
    <>
      <JsonLd
        data={buildBusinessJsonLd({
          name: brand.business.name,
          description: brand.business.description,
          url: brand.business.url,
          businessClass: (brand.business.businessClass || 'organization') as BusinessClass,
          email: brand.business.email,
          phone: brand.business.phone,
        })}
      />

      {/*
        Every section is wrapped in <SafeSection> so a render crash in one
        AI-customized section (e.g. `Cannot read properties of undefined
        (reading 'primary')`, an empty `services[0]` lookup, a missing brand
        token) fails soft — that section vanishes while the hero, NAP, every
        sibling section, the header/footer landmarks, and the pre-rendered SEO
        head all keep painting. Never let one bad section blank the whole page.
      */}
      {featureOn('hero') && (
        <SafeSection name="hero">
          <HeroCenter
            eyebrow={brand.business.tagline}
            headline="{HERO_HEADLINE}"
            subheadline="{HERO_SUBHEADLINE}"
            primary={{ label: '{HERO_CTA}', href: '/contact' }}
            secondary={{ label: '{HERO_SECONDARY_CTA}', href: '/services' }}
            trustBadges={[
              { icon: 'star',   label: '{TRUST_BADGE_1}' },
              { icon: 'shield', label: '{TRUST_BADGE_2}' },
              { icon: 'award',  label: '{TRUST_BADGE_3}' },
            ]}
          />
        </SafeSection>
      )}

      {featureOn('logoCloud') && (
        <SafeSection name="logoCloud">
          <LogoCloud logos={logos} eyebrow="Trusted by" />
        </SafeSection>
      )}

      {featureOn('bento') && (
        <SafeSection name="bento">
          <BentoGrid
            eyebrow="Why choose us"
            headline="{FEATURES_HEADLINE}"
            description="{FEATURES_SUBHEADLINE}"
            tiles={bentoTiles}
          />
        </SafeSection>
      )}

      {featureOn('stats') && (
        <SafeSection name="stats">
          <Stats stats={stats} eyebrow="By the numbers" headline="{STATS_HEADLINE}" />
        </SafeSection>
      )}

      <SafeSection name="about">
        <FeatureSplit
          eyebrow="About"
          headline="{ABOUT_HEADLINE}"
          description="{ABOUT_DESCRIPTION}"
          bullets={['{ABOUT_BULLET_1}', '{ABOUT_BULLET_2}', '{ABOUT_BULLET_3}']}
          cta={{ label: 'Learn more', href: '/about' }}
          image={{ src: '{ABOUT_IMAGE_URL}', alt: '{ABOUT_IMAGE_ALT}' }}
        />
      </SafeSection>

      {featureOn('process') && (
        <SafeSection name="process">
          <ProcessSteps
            steps={process}
            headline="{PROCESS_HEADLINE}"
            description="{PROCESS_SUBHEADLINE}"
          />
        </SafeSection>
      )}

      {featureOn('pricing') && (
        <SafeSection name="pricing">
          <Pricing
            tiers={tiers}
            headline="{PRICING_HEADLINE}"
            description="{PRICING_SUBHEADLINE}"
          />
        </SafeSection>
      )}

      {featureOn('faq') && (
        <SafeSection name="faq">
          <FAQ
            items={faqs}
            headline="{FAQ_HEADLINE}"
            description="{FAQ_SUBHEADLINE}"
          />
        </SafeSection>
      )}

      {featureOn('cta') && (
        <SafeSection name="cta">
          <CTASection
            eyebrow="Ready?"
            headline="{CTA_HEADLINE}"
            description="{CTA_DESCRIPTION}"
            primary={{ label: '{CTA_BUTTON}', href: '/contact' }}
            secondary={{ label: 'See pricing', href: '/pricing' }}
          />
        </SafeSection>
      )}
    </>
  );
}
