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

export default function TrustBadges({ badges, rating, reviewCount }: TrustBadgesProps) {
  return (
    <section className="bg-white/[0.02] border-y border-white/5 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {/* Google rating */}
        {rating && reviewCount && (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                />
              ))}
            </div>
            <span className="font-semibold text-white">{rating}</span>
            <span>({reviewCount} reviews)</span>
          </div>
        )}

        {/* Badges */}
        {badges.map((badge) => {
          const Icon = badge.icon ? iconMap[badge.icon] : null;
          return (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-white/70">
              {badge.image ? (
                <img src={badge.image} alt={badge.label} className="h-8 w-auto" loading="lazy" />
              ) : Icon ? (
                <Icon size={18} className="text-[var(--color-accent)]" />
              ) : null}
              <span>{badge.value || badge.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
