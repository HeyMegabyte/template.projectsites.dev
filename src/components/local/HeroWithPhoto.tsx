import { Phone, MapPin, Star } from 'lucide-react';

interface HeroWithPhotoProps {
  businessName: string;
  tagline: string;
  heroImage: string;
  phone?: string;
  directionsUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export default function HeroWithPhoto({
  businessName,
  tagline,
  heroImage,
  phone,
  directionsUrl,
  rating,
  reviewCount,
}: HeroWithPhotoProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt={`${businessName} storefront`}
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[var(--color-bg,#0a0a1a)]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Rating badge */}
        {rating && reviewCount && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-sm">
              {rating}/5 from {reviewCount} reviews
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight text-balance">
          {businessName}
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto text-pretty">
          {tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[#0a0a1a] font-bold px-8 py-4 rounded-lg text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/20 active:scale-[0.98]"
              onClick={() => {
                if (typeof gtag !== 'undefined') gtag('event', 'phone_click', { phone });
                if (typeof posthog !== 'undefined') posthog.capture('phone_click', { phone });
              }}
            >
              <Phone size={20} strokeWidth={2.5} />
              Call Now
            </a>
          )}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all hover:border-white/60 hover:bg-white/5 active:scale-[0.98]"
              onClick={() => {
                if (typeof gtag !== 'undefined') gtag('event', 'direction_click');
                if (typeof posthog !== 'undefined') posthog.capture('direction_click');
              }}
            >
              <MapPin size={20} />
              Get Directions
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
