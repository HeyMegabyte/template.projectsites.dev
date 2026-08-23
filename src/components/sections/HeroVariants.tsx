import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KineticHeadline } from './KineticHeadline';
import { cn } from '@/lib/utils';
import { brand } from '@/brand';
import { scrubText, scrubImage } from '@/lib/placeholders';

type Trust = { icon?: 'star' | 'shield' | 'award'; label: string };

/**
 * Scrub trust badges: drop any whose label is an unresolved placeholder so the
 * hero never shows "{TRUST_BADGE_2}" next to real badges.
 */
function scrubTrust(items?: Trust[]): Trust[] {
  if (!items?.length) return [];
  return items.map((t) => ({ ...t, label: scrubText(t.label) })).filter((t) => t.label.length > 0);
}

/** Scrub a `{ label, href }` CTA; returns undefined when the label is a placeholder. */
function scrubCta(cta?: { label: string; href: string }): { label: string; href: string } | undefined {
  if (!cta) return undefined;
  const label = scrubText(cta.label);
  return label ? { label, href: cta.href } : undefined;
}

interface CommonProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  trustBadges?: Trust[];
  className?: string;
}

const TRUST_ICONS = { star: Star, shield: Shield, award: Award } as const;

function TrustRow({ items }: { items?: Trust[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-text-subtle text-sm">
      {items.map((t, i) => {
        const Icon = TRUST_ICONS[t.icon ?? 'star'];
        return (
          <div key={i} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-accent" />
            <span>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Centered cinematic hero with orbs + kinetic headline. */
export function HeroCenter({ eyebrow, headline, subheadline, primary, secondary, trustBadges, className }: CommonProps) {
  // The headline is the LCP + only <h1> — it must ALWAYS render, so fall back to
  // the real business name when the generation token is unresolved. Everything
  // else scrubs to empty/undefined and is hidden by its own guard.
  const safeHeadline = scrubText(headline, brand.business.name);
  const safeEyebrow = scrubText(eyebrow);
  const safeSubheadline = scrubText(subheadline);
  const safePrimary = scrubCta(primary);
  const safeSecondary = scrubCta(secondary);
  const safeTrust = scrubTrust(trustBadges);
  return (
    <section className={cn('relative min-h-screen flex items-center justify-center overflow-hidden', className)}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] animate-subtleFloat" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] animate-subtleFloat" style={{ animationDelay: '3s' }} />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="relative z-10 max-w-container-wide mx-auto px-6 text-center pt-32 pb-20">
        <KineticHeadline text={safeHeadline} eyebrow={safeEyebrow || undefined} />
        {safeSubheadline && (
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mt-8 leading-relaxed">
            {safeSubheadline}
          </p>
        )}
        {(safePrimary || safeSecondary) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            {safePrimary && (
              <Button asChild size="xl">
                <Link to={safePrimary.href}>
                  {safePrimary.label} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {safeSecondary && (
              <Button asChild variant="outline" size="xl">
                <Link to={safeSecondary.href}>{safeSecondary.label}</Link>
              </Button>
            )}
          </div>
        )}
        <TrustRow items={safeTrust} />
      </div>
    </section>
  );
}

interface SplitProps extends CommonProps {
  image: { src: string; alt: string };
}

/** Asymmetric hero: copy left, image right. Good for storefronts + services. */
export function HeroSplit({ eyebrow, headline, subheadline, primary, secondary, image, trustBadges, className }: SplitProps) {
  const safeHeadline = scrubText(headline, brand.business.name);
  const safeEyebrow = scrubText(eyebrow);
  const safeSubheadline = scrubText(subheadline);
  const safePrimary = scrubCta(primary);
  const safeSecondary = scrubCta(secondary);
  const safeTrust = scrubTrust(trustBadges);
  // Drop a placeholder hero image so `{HERO_IMAGE_URL}` never 404s. When there
  // is no real image the copy column spans full width (still a valid hero).
  const safeImage = scrubImage(image);
  return (
    <section className={cn('relative pt-32 pb-16 md:pb-24 max-w-container-wide mx-auto px-6', className)}>
      <div className={cn('grid gap-16 items-center', safeImage ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto text-center')}>
        <div>
          {safeEyebrow && (
            <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
          )}
          <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-[-0.03em] leading-[0.95]">
            <span className="gradient-text">{safeHeadline}</span>
          </h1>
          {safeSubheadline && (
            <p className="mt-6 text-lg md:text-xl text-text-muted leading-relaxed max-w-xl">{safeSubheadline}</p>
          )}
          {(safePrimary || safeSecondary) && (
            <div className={cn('mt-8 flex flex-col sm:flex-row gap-3', !safeImage && 'justify-center')}>
              {safePrimary && (
                <Button asChild size="lg">
                  <Link to={safePrimary.href}>
                    {safePrimary.label} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {safeSecondary && (
                <Button asChild size="lg" variant="outline">
                  <Link to={safeSecondary.href}>{safeSecondary.label}</Link>
                </Button>
              )}
            </div>
          )}
          <TrustRow items={safeTrust} />
        </div>
        {safeImage && (
          <div className="relative">
            <div className="card-tactile overflow-hidden rounded-2xl aspect-[5/4] shadow-lg">
              <img
                src={safeImage.src}
                alt={safeImage.alt}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 blur-3xl bg-accent/10 rounded-full" />
          </div>
        )}
      </div>
    </section>
  );
}
