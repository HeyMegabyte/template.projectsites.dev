import type { ReactNode } from 'react';
import { BadgeCheck, ShieldCheck, Clock, Star, Phone, MapPin, Award, HeartHandshake } from 'lucide-react';
import { brand, featureOn } from '@/brand';

/**
 * Trust strip rendered directly beneath the hero — wordless credibility above the
 * fold, the single most-cited conversion lever for local-service and considered
 * purchases. Renders promise-grade signals every business can stand behind (free
 * quotes, licensed & insured, fast response, satisfaction guaranteed) — NEVER a
 * fabricated review count or license number. When research surfaces real numbers,
 * pass them via `items` to override the defaults; a missing field is simply omitted.
 *
 * Theme tokens only, so it reads correctly on light (healthcare/wellness) and dark
 * (SaaS/agency) verticals alike.
 */
export interface TrustItem {
  icon: ReactNode;
  label: string;
}

interface Props {
  items?: TrustItem[];
}

/** Vertical-aware, fabrication-free defaults. Service verticals lead with the
 *  estimate + licensing promises; everyone else gets generic credibility. */
function defaultItems(): TrustItem[] {
  const svc = featureOn('quote');
  const base: TrustItem[] = svc
    ? [
        { icon: <BadgeCheck size={16} />, label: 'Free, no-obligation quotes' },
        { icon: <ShieldCheck size={16} />, label: 'Licensed & insured' },
        { icon: <Clock size={16} />, label: 'Fast, reliable response' },
        { icon: <HeartHandshake size={16} />, label: 'Satisfaction guaranteed' },
      ]
    : [
        { icon: <Star size={16} />, label: 'Trusted by our community' },
        { icon: <Award size={16} />, label: 'Experienced & professional' },
        { icon: <Clock size={16} />, label: 'Responsive support' },
        { icon: <HeartHandshake size={16} />, label: 'Client-first service' },
      ];
  // Fold in real contact facts when we actually have them.
  if (brand.business.phone) base.push({ icon: <Phone size={16} />, label: brand.business.phone });
  if (brand.business.address) {
    const city = brand.business.address.split(',').slice(-2, -1)[0]?.trim();
    if (city) base.push({ icon: <MapPin size={16} />, label: `Serving ${city} & nearby` });
  }
  return base;
}

export function TrustBar({ items }: Props) {
  const list = (items ?? defaultItems()).slice(0, 5);
  if (list.length === 0) return null;
  return (
    <section aria-label="Why choose us" className="border-y border-border bg-surface/60">
      <ul className="max-w-container-wide mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {list.map((it) => (
          <li key={it.label} className="flex items-center gap-2 text-sm text-text-muted">
            <span className="text-accent" aria-hidden="true">{it.icon}</span>
            <span className="font-medium">{it.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TrustBar;
