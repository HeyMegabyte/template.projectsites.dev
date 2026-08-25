import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/JsonLd';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { scrubText, scrubList } from '@/lib/placeholders';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  currency?: string;
  features: string[];
  cta?: { label: string; href: string };
  featured?: boolean;
  badge?: string;
}

interface Props {
  tiers: PricingTier[];
  eyebrow?: string;
  headline?: string;
  description?: string;
  showToggle?: boolean;
  className?: string;
}

/**
 * Pricing table with monthly/yearly toggle + featured-tier highlight + JSON-LD
 * Product schema per tier (each tier emits a Product node with Offer + price).
 */
export function Pricing({
  tiers,
  eyebrow = 'Pricing',
  headline = 'Simple, transparent pricing',
  description,
  showToggle = true,
  className,
}: Props) {
  const [annual, setAnnual] = useState(true);
  // Drop tiers whose name is an unresolved token; scrub each tier's description
  // + feature list. This also keeps the Product JSON-LD from emitting
  // `{TIER_1_NAME}` (which fails Rich Results).
  const safeTiers = tiers
    .map((t) => ({
      ...t,
      name: scrubText(t.name),
      description: scrubText(t.description),
      features: scrubList(t.features),
    }))
    .filter((t) => t.name.length > 0);
  const safeEyebrow = scrubText(eyebrow, 'Pricing');
  const safeHeadline = scrubText(headline, 'Simple, transparent pricing');
  const safeDescription = scrubText(description);
  if (safeTiers.length === 0) return null;
  const symbol = safeTiers[0]?.currency ?? '$';

  const jsonLd = safeTiers.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t.name,
    description: t.description,
    offers: {
      '@type': 'Offer',
      price: annual ? t.yearly : t.monthly,
      priceCurrency: t.currency === '$' || !t.currency ? 'USD' : t.currency,
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <section className={cn('py-24 md:py-32 max-w-container-wide mx-auto px-6', className)}>
      <JsonLd data={jsonLd} />
      <div className="text-center mb-12 reveal-on-view">
        <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
        <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-4 text-text">
          {safeHeadline}
        </h2>
        {safeDescription && <p className="text-text-muted max-w-2xl mx-auto text-lg">{safeDescription}</p>}
        {showToggle && (
          <div className="inline-flex mt-8 p-1 rounded-full border border-border bg-surface">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-colors',
                !annual ? 'bg-accent text-background' : 'text-text-muted hover:text-text'
              )}
              aria-pressed={!annual}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2',
                annual ? 'bg-accent text-background' : 'text-text-muted hover:text-text'
              )}
              aria-pressed={annual}
            >
              Yearly <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">save 20%</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeTiers.map((t) => {
          const badge = scrubText(t.badge);
          const ctaLabel = scrubText(t.cta?.label, 'Get started');
          return (
          <div
            key={t.id}
            className={cn(
              'relative rounded-xl border p-8 flex flex-col reveal-on-view transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0',
              t.featured
                ? 'border-accent bg-gradient-to-b from-accent/10 to-transparent shadow-glow ring-1 ring-accent/20'
                : 'border-border bg-surface hover:border-accent/50'
            )}
          >
            {badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-background text-xs font-bold inline-flex items-center gap-1">
                <Sparkles size={12} />
                {badge}
              </div>
            )}
            <h3 className="text-xl font-bold font-heading text-text">{t.name}</h3>
            {t.description && <p className="text-text-muted text-sm mt-2 min-h-[3em]">{t.description}</p>}
            <div className="mt-6 flex items-baseline gap-1">
              <span
                key={annual ? 'yr' : 'mo'}
                className="text-4xl md:text-5xl font-bold font-heading text-text tabular-nums price-swap"
              >
                {symbol}
                {annual ? t.yearly : t.monthly}
              </span>
              <span className="text-text-muted text-sm">/{annual ? 'yr' : 'mo'}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 text-text-muted text-sm">
                  <Check size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full" variant={t.featured ? 'default' : 'outline'}>
              <Link to={t.cta?.href ?? '/contact'}>{ctaLabel}</Link>
            </Button>
          </div>
          );
        })}
      </div>
    </section>
  );
}

export default Pricing;
