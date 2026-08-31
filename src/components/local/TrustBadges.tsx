import { Star, Shield, Award } from 'lucide-react';

interface Badge {
  label: string;
  image?: string;
  icon?: 'star' | 'shield' | 'award';
  value?: string;
}

interface TrustBadgesProps {
  badges: Badge[];
  rating?: number;
  reviewCount?: number;
}

const iconMap = {
  star: Star,
  shield: Shield,
  award: Award,
};

/**
 * `TrustBadges` — a compact social-proof strip (Google rating + credential badges). Cinematic
 * + theme-token: a subtle glass band framed by faint accent hairlines, each item fades up
 * staggered on load, the rating stars carry a soft glow, and every badge lifts a touch with an
 * accent-tinted icon on hover. Legible on light AND dark verticals (the old `text-white/70` /
 * `bg-white/[0.02]` assumed a dark canvas).
 */
export default function TrustBadges({ badges, rating, reviewCount }: TrustBadgesProps) {
  return (
    <section className="trust-badges relative bg-surface/40 backdrop-blur-sm border-y border-border py-6 overflow-hidden">
      <div className="trust-rule trust-rule-top" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {/* Google rating */}
        {rating && reviewCount && (
          <div className="tb-item flex items-center gap-2 text-sm text-text-muted" style={{ ['--badge-i' as string]: 0 } as React.CSSProperties}>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= Math.round(rating);
                return (
                  <Star
                    key={s}
                    size={16}
                    className={filled ? 'trust-star text-yellow-400 fill-yellow-400' : ''}
                    style={filled ? undefined : { color: 'var(--color-text-subtle)', opacity: 0.45 }}
                  />
                );
              })}
            </div>
            <span className="font-semibold text-text">{rating}</span>
            <span>({reviewCount} reviews)</span>
          </div>
        )}

        {/* Badges */}
        {badges.map((badge, i) => {
          const Icon = badge.icon ? iconMap[badge.icon] : null;
          return (
            <div
              key={badge.label}
              className="tb-item group flex items-center gap-2 text-sm text-text-muted transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{ ['--badge-i' as string]: i + 1 } as React.CSSProperties}
            >
              {badge.image ? (
                <img src={badge.image} alt={badge.label} className="h-8 w-auto" loading="lazy" />
              ) : Icon ? (
                <Icon
                  size={18}
                  className="text-accent transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : null}
              <span className="group-hover:text-text transition-colors motion-reduce:transition-none">
                {badge.value || badge.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="trust-rule trust-rule-bottom" aria-hidden="true" />
    </section>
  );
}
