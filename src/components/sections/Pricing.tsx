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
  /** Heading level for the headline — 'h1' for the FIRST section on a section-only
   *  page (FAQ/Pricing/Blog) so the page has exactly one h1. Default 'h2'. */
  as?: 'h1' | 'h2';
}

/**
 * Component-scoped cinematic ENHANCEMENT layer. The base cinematic behaviour
 * (card lift, hairline, glass wash, static aura, scroll-in stagger, price
 * crossfade) lives in the `.pricing-*` classes in `index.css`; THIS block adds
 * a second layer on distinctly-named `.pce-*` classes so the two never collide:
 *  - a slow-rotating conic accent ring behind the featured tier (`.pce-ring`),
 *  - a richer amount transition — the price scales + un-blurs as it settles
 *    (`.pce-amount`, key-driven remount), plus the `/period` suffix crossfades,
 *  - per-card hover that STAGGERS each feature row in (keyed on `--pce-fi`),
 *  - `text-wrap: balance` on the tier name for tidy multi-word wrapping.
 * Every keyframe is double-gated behind `prefers-reduced-motion: no-preference`
 * AND `prefers-reduced-data: no-preference`, with reduced-motion/reduced-data
 * safety nets that neutralise all motion + drop the ring's blur. Colours are
 * theme tokens + `--color-accent` only (validate-site gate). Transform / opacity
 * / filter only; every decorative node is `aria-hidden`.
 */
const PRICING_CINEMATIC_CSS = `
.pce-name { text-wrap: balance; }

/* Amount base — inherits the fluid clamp() from .pricing-amount; add a
   transform-origin so the settle scales from the baseline. */
.pce-amount { transform-origin: left bottom; display: inline-block; }

/* Rotating conic accent ring behind the featured tier — a premium halo that the
   static .pricing-aura sits inside. Masked to a thin rim so it reads as a ring,
   not a fill. Decorative + aria-hidden. */
.pce-ring {
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--pce-ring-angle, 0deg),
    transparent 0deg,
    color-mix(in oklch, var(--color-accent) 70%, transparent) 70deg,
    transparent 150deg,
    transparent 210deg,
    color-mix(in oklch, var(--color-accent) 45%, transparent) 290deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0.75;
  pointer-events: none;
}

@property --pce-ring-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
  /* The conic ring slowly rotates. */
  .pce-ring { animation: pce-ring-spin 9s linear infinite; will-change: --pce-ring-angle; }
  @keyframes pce-ring-spin {
    to { --pce-ring-angle: 360deg; }
  }

  /* Amount settle — scales up + un-blurs as it fades in on toggle flip. Layered
     on top of .price-swap's translate, so the number arrives with real weight. */
  .pce-amount { animation: pce-amount-settle 0.42s var(--ease) both; }
  @keyframes pce-amount-settle {
    from { transform: scale(0.9); filter: blur(3px); opacity: 0; }
    60%  { filter: blur(0); }
    to   { transform: scale(1); filter: blur(0); opacity: 1; }
  }

  /* Period suffix crossfades in just after the amount. */
  .pce-period { animation: pce-period-fade 0.42s var(--ease) both; animation-delay: 0.06s; }
  @keyframes pce-period-fade {
    from { opacity: 0; transform: translateX(-4px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Feature rows rest slightly recessed; on card hover/focus they STAGGER in —
     each row keyed on --pce-fi so they settle top-to-bottom. transform/opacity
     only. Base (no-hover) state stays fully legible for reduced-motion below. */
  .pce-feature {
    transition:
      transform var(--duration-base) var(--ease),
      opacity var(--duration-base) var(--ease);
    transition-delay: 0s;
  }
  .pricing-card:hover .pce-feature,
  .pricing-card:focus-within .pce-feature {
    transform: translateX(3px);
    transition-delay: calc(var(--pce-fi, 0) * 45ms);
  }
}

/* Reduced-data OR reduced-motion: kill the ring spin + keep every surface
   settled and legible (no blur, no offset, full opacity). */
@media (prefers-reduced-data: reduce), (prefers-reduced-motion: reduce) {
  .pce-ring { animation: none !important; opacity: 0.6; }
  .pce-amount,
  .pce-period,
  .pce-feature { animation: none !important; transform: none !important; filter: none !important; opacity: 1 !important; }
}
`;

/**
 * Pricing table with monthly/yearly toggle + featured-tier highlight + JSON-LD
 * Product schema per tier (each tier emits a Product node with Offer + price).
 *
 * Cinematic detail (all gated behind `prefers-reduced-motion: no-preference`
 * via the `.pricing-*` classes in `index.css`, and auto-neutralised by the
 * global reduced-motion reset): the grid rises in with a per-card stagger
 * (`--pricing-i`), every card lifts + reveals an accent hairline + soft glow
 * on hover/focus-within, and the featured tier stands proud — accent ring,
 * a subtle scale-up, a soft OKLCH accent glow, a glass wash + top hairline,
 * and a slow-drifting aura behind it — so the eye lands there first. The
 * amount is fluid (`clamp()`) and fades+rises when the toggle flips (the span
 * is keyed on the period, so React remounts it and replays `.price-swap`).
 * A component-scoped ENHANCEMENT layer (`.pce-*`, {@link PRICING_CINEMATIC_CSS})
 * adds a rotating conic accent ring behind the featured tier, a scale+un-blur
 * settle on the amount, a crossfading period suffix, and a per-card staggered
 * feature-row reveal on hover — all double-gated (reduced-motion + reduced-data).
 * Colors are theme tokens + `--color-accent` only (validate-site gate).
 */
export function Pricing({
  tiers,
  eyebrow = 'Pricing',
  headline = 'Simple, transparent pricing',
  description,
  showToggle = true,
  className,
  as = 'h2',
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
  const Heading = as;

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
      <style>{PRICING_CINEMATIC_CSS}</style>
      <JsonLd data={jsonLd} />
      <div className="text-center mb-12 reveal-on-view">
        <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
        <Heading className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-4 text-text">
          {safeHeadline}
        </Heading>
        {safeDescription && <p className="text-text-muted max-w-2xl mx-auto text-lg">{safeDescription}</p>}
        {showToggle && (
          <div className="pricing-toggle inline-flex mt-8 p-1 rounded-full border border-border bg-surface">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                'pricing-toggle__btn px-5 py-2 rounded-full text-sm font-medium transition-colors',
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
                'pricing-toggle__btn px-5 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2',
                annual ? 'bg-accent text-background' : 'text-text-muted hover:text-text'
              )}
              aria-pressed={annual}
            >
              Yearly <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">save 20%</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {safeTiers.map((t, i) => {
          const badge = scrubText(t.badge);
          const ctaLabel = scrubText(t.cta?.label, 'Get started');
          return (
          <div
            key={t.id}
            data-featured={t.featured ? '' : undefined}
            style={{ '--pricing-i': i } as React.CSSProperties}
            className={cn(
              'pricing-card relative rounded-xl border p-8 flex flex-col',
              t.featured
                ? 'pricing-card--featured border-accent bg-gradient-to-b from-accent/10 to-transparent'
                : 'border-border bg-surface'
            )}
          >
            {/* Featured aura — soft accent glow that drifts behind the card. */}
            {t.featured && <span aria-hidden="true" className="pricing-aura" />}
            {/* Featured ring — slow-rotating conic accent halo (enhancement layer). */}
            {t.featured && <span aria-hidden="true" className="pce-ring" />}
            {badge && (
              <div className="pricing-badge absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-background text-xs font-bold inline-flex items-center gap-1 z-10">
                <Sparkles size={12} className="pricing-badge__icon" />
                {badge}
              </div>
            )}
            <h3 className="pce-name text-xl font-bold font-heading text-text">{t.name}</h3>
            {t.description && <p className="text-text-muted text-sm mt-2 min-h-[3em]">{t.description}</p>}
            <div className="mt-6 flex items-baseline gap-1">
              <span
                key={annual ? 'yr' : 'mo'}
                className="pricing-amount pce-amount font-bold font-heading text-text tabular-nums price-swap"
              >
                {symbol}
                {annual ? t.yearly : t.monthly}
              </span>
              <span key={annual ? 'yr-p' : 'mo-p'} className="pce-period text-text-muted text-sm">
                /{annual ? 'yr' : 'mo'}
              </span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {t.features.map((f, fi) => (
                <li
                  key={f}
                  style={{ '--pce-fi': fi } as React.CSSProperties}
                  className="pce-feature flex gap-3 text-text-muted text-sm"
                >
                  <Check size={18} className="pricing-check text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="pricing-cta mt-8 w-full"
              variant={t.featured ? 'default' : 'outline'}
            >
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
