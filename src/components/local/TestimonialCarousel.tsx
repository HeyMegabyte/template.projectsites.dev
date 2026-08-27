import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  profilePhoto?: string;
}

interface TestimonialCarouselProps {
  reviews: Review[];
  googleReviewUrl?: string;
}

/**
 * `TestimonialCarousel` — an auto-advancing review carousel. Cinematic + theme-token:
 * a `card-tactile` glass card floats over a soft OKLCH accent aura behind a giant ghost
 * quote mark; each review crossfades + rises in, the stars pop in staggered, the active
 * dot elongates with an accent glow, and a 5s auto-advance progress rail fills across the
 * top and pauses on hover/focus (with `aria-live` announcing each change). Legible on BOTH
 * light and dark verticals — the old hardcoded `text-white`/`bg-white/5`/`border-white/10`
 * made it invisible on light themes (now `text-text` / `text-text-muted` / `card-tactile`).
 */
export default function TestimonialCarousel({ reviews, googleReviewUrl }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % reviews.length), [reviews.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length), [reviews.length]);

  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, reviews.length]);

  const track = () => {
    if (typeof gtag !== 'undefined') gtag('event', 'review_click');
    if (typeof posthog !== 'undefined') posthog.capture('review_click');
  };

  if (reviews.length === 0) {
    if (!googleReviewUrl) return null;
    return (
      <section className="py-20">
        <div className="max-w-2xl mx-auto text-center px-6 reveal-on-view">
          <h2 className="text-3xl font-heading font-bold text-text mb-4 text-balance">What Our Customers Say</h2>
          <p className="text-text-muted mb-8">Be the first to share your experience.</p>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-on-accent)] font-bold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            onClick={track}
          >
            <Star size={18} />
            Leave a Review
          </a>
        </div>
      </section>
    );
  }

  const r = reviews[current];

  return (
    <section
      className="py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-12 text-center text-balance reveal-on-view">
          What Our Customers Say
        </h2>

        <div className="relative reveal-on-view">
          {/* soft accent aura behind the card */}
          <div className="testimonial-aura" aria-hidden="true" />

          {/* Controls */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 card-tactile rounded-full p-2 transition-all hover:border-accent/50 hover:-translate-x-3 md:hover:-translate-x-5 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 motion-reduce:transition-none"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} className="text-text" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 card-tactile rounded-full p-2 transition-all hover:border-accent/50 hover:translate-x-3 md:hover:translate-x-5 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 motion-reduce:transition-none"
                aria-label="Next review"
              >
                <ChevronRight size={20} className="text-text" />
              </button>
            </>
          )}

          {/* Review card */}
          <div className="relative card-tactile rounded-2xl p-8 md:p-14 text-center overflow-hidden" aria-live="polite">
            {/* auto-advance progress rail (restarts each review, freezes on hover/focus) */}
            {reviews.length > 1 && (
              <span
                key={`bar-${current}`}
                className="testimonial-progress"
                data-paused={paused ? 'true' : 'false'}
                aria-hidden="true"
              />
            )}

            {/* ghost quote mark */}
            <Quote
              size={120}
              aria-hidden="true"
              className="pointer-events-none absolute -top-3 left-4 text-accent/10 rotate-180"
              strokeWidth={1}
            />

            {/* keyed inner → replays the enter animation on every change */}
            <div key={current} className="testimonial-enter relative">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => {
                  const filled = s <= r.rating;
                  return (
                    <Star
                      key={s}
                      size={20}
                      style={
                        {
                          ['--star-i' as string]: s,
                          ...(filled ? {} : { color: 'var(--color-text-subtle)', opacity: 0.5 }),
                        } as React.CSSProperties
                      }
                      className={`testimonial-star ${filled ? 'text-yellow-400 fill-yellow-400' : ''}`}
                    />
                  );
                })}
              </div>

              {/* Text */}
              <blockquote className="text-text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto text-pretty">
                &ldquo;{r.text.length > 220 ? r.text.slice(0, 220) + '…' : r.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/15 ring-1 ring-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                  {r.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-text font-semibold text-sm">{r.author}</p>
                  <p className="text-text-muted text-xs">{r.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
                    i === current
                      ? 'w-6 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]'
                      : 'w-2 bg-border hover:bg-accent/40'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === current ? 'true' : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Google review link */}
        {googleReviewUrl && (
          <div className="text-center mt-8 reveal-on-view">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded"
              onClick={track}
            >
              Read more reviews on Google →
            </a>
          </div>
        )}
      </div>

      <style>{`
        .testimonial-aura {
          position: absolute; inset: -12% -6% -18%;
          background: radial-gradient(60% 60% at 50% 30%, color-mix(in oklch, var(--color-accent) 16%, transparent), transparent 70%);
          filter: blur(28px); pointer-events: none; z-index: 0;
        }
        .testimonial-enter { animation: testimonialIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes testimonialIn {
          from { opacity: 0; transform: translateY(14px) scale(0.985); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .testimonial-star { animation: testimonialStar 0.4s cubic-bezier(0.34,1.56,0.64,1) both; animation-delay: calc(var(--star-i) * 60ms); }
        @keyframes testimonialStar {
          from { opacity: 0; transform: scale(0.4) rotate(-12deg); }
          to   { opacity: 1; transform: scale(1) rotate(0); }
        }
        .testimonial-progress {
          position: absolute; top: 0; left: 0; height: 3px; width: 100%;
          transform-origin: left; transform: scaleX(0);
          background: linear-gradient(90deg, color-mix(in oklch, var(--color-accent) 55%, transparent), var(--color-accent));
          animation: testimonialProgress 5s linear forwards;
        }
        .testimonial-progress[data-paused='true'] { animation-play-state: paused; }
        @keyframes testimonialProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-enter, .testimonial-star, .testimonial-progress { animation: none !important; }
          .testimonial-progress { transform: scaleX(1); }
          .testimonial-aura { display: none; }
        }
      `}</style>
    </section>
  );
}
