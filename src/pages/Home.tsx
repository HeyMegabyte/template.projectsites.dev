import { Shield, Zap, Users, Target, Award, Star, Rocket, Sparkles, MessageSquare, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { SafeSection } from '@/components/SafeSection';
import { ContactForm } from '@/components/ContactForm';
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

/**
 * Homepage lead-capture + NAP block — the conversion + local-SEO floor every
 * generated site now ships by default.
 *
 * @remarks
 * Root-cause fix (journey 2026-08-22 — site scored 3/10, "zero conversion /
 * local-SEO scaffolding: no NAP, no phone/tel:/mailto:, forms=0, hero CTA had
 * no target"). The template already owned a working `<ContactForm>` (Zod-
 * validated, React 19 `useActionState`, POSTs to `/api/contact/{slug}`) and a
 * NAP-aware `<Footer>`, but the DEFAULT `Home` rendered NEITHER — so a naive
 * generation that only touched the hero shipped a page with no lead form, no
 * click-to-call, and no machine-readable local-business signal on the homepage.
 *
 * This section is 100% additive and self-healing, mirroring the placeholder-
 * scrub / brand self-heal patterns already in the template:
 *   - The lead FORM always renders — a working `/contact`-target conversion
 *     surface exists on the homepage even before any customization.
 *   - Each NAP row (`tel:`, `mailto:`, maps address, hours) renders ONLY when
 *     `brand.business` carries real, non-placeholder data (`brand.ts` `pick()`
 *     already rejects empty + `{TOKEN}`-shaped leaves), so a bare template never
 *     prints an empty "Call " row.
 *   - The visible NAP carries schema.org LocalBusiness microdata
 *     (`itemProp="telephone" | "email" | "address"`) so the homepage emits a
 *     machine-readable local-business signal in the rendered DOM regardless of
 *     the JSON-LD `businessClass`.
 *
 * Wrapped by the caller in `<SafeSection>` so a crash here fails soft.
 */
function HomeContact() {
  const { name, phone, email, address, hours } = brand.business;
  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : '';
  const mapHref = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : '';
  const hasNap = Boolean(phone || email || address || hours);

  return (
    <section id="contact" className="relative py-24 border-t border-border">
      <div className="max-w-container-wide mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-accent text-sm font-mono tracking-widest uppercase">Get in touch</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold font-heading tracking-[-0.02em]">
            <span className="gradient-text">Request your free estimate</span>
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
            Tell us what you need and {name} will get back to you within one business day.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Working, Zod-validated lead form — the homepage conversion surface. */}
          <ContactForm />

          {/* NAP: click-to-call, email, directions, hours — with LocalBusiness microdata. */}
          <address
            className="not-italic space-y-4"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <meta itemProp="name" content={name} />
            {hasNap ? (
              <>
                {phone && (
                  <a
                    href={telHref}
                    className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-accent/40 transition-colors"
                    aria-label={`Call ${name} at ${phone}`}
                  >
                    <span className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-text font-medium">Call us</span>
                      <span className="block text-text-muted text-sm" itemProp="telephone">{phone}</span>
                    </span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-accent/40 transition-colors"
                    aria-label={`Email ${name} at ${email}`}
                  >
                    <span className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-text font-medium">Email us</span>
                      <span className="block text-text-muted text-sm break-all" itemProp="email">{email}</span>
                    </span>
                  </a>
                )}
                {address && (
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-accent/40 transition-colors"
                    aria-label={`Get directions to ${address}`}
                  >
                    <span className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-text font-medium">Visit us</span>
                      <span className="block text-text-muted text-sm" itemProp="address">{address}</span>
                    </span>
                  </a>
                )}
                {hours && (
                  <div className="glass rounded-2xl p-6 flex items-start gap-4">
                    <span className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-text font-medium">Hours</span>
                      <span className="block text-text-muted text-sm" itemProp="openingHours">{hours}</span>
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="glass rounded-2xl p-6 text-text-muted text-sm">
                Prefer to talk it through? Use the form and we&rsquo;ll reach out with next steps.
              </div>
            )}
          </address>
        </div>
      </div>
    </section>
  );
}

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

      {/*
        Conversion + local-SEO floor — a working lead form + click-to-call NAP
        with LocalBusiness microdata, on the homepage by default. Not feature-
        gated: every generated site must ship a way to convert + a machine-
        readable local-business signal even if only the hero was customized.
      */}
      <SafeSection name="contact">
        <HomeContact />
      </SafeSection>
    </>
  );
}
