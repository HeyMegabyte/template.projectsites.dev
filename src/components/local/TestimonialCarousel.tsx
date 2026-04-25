import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function TestimonialCarousel({ reviews, googleReviewUrl }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % reviews.length), [reviews.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length), [reviews.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (reviews.length === 0) {
    if (!googleReviewUrl) return null;
    return (
      <section className="py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-white/60 mb-8">Be the first to share your experience.</p>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[#0a0a1a] font-bold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5"
            onClick={() => {
              if (typeof gtag !== 'undefined') gtag('event', 'review_click');
              if (typeof posthog !== 'undefined') posthog.capture('review_click');
            }}
          >
            <Star size={18} />
            Leave a Review
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center">
          What Our Customers Say
        </h2>

        <div className="relative">
          {/* Controls */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full p-2 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full p-2 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Review card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={s <= reviews[current].rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                />
              ))}
            </div>

            {/* Text */}
            <blockquote className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              &ldquo;{reviews[current].text.length > 200
                ? reviews[current].text.slice(0, 200) + '...'
                : reviews[current].text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                {reviews[current].author.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">{reviews[current].author}</p>
                <p className="text-white/40 text-xs">{reviews[current].date}</p>
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
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-[var(--color-accent)]' : 'bg-white/20'}`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Google review link */}
        {googleReviewUrl && (
          <div className="text-center mt-8">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 text-sm font-medium transition-colors"
              onClick={() => {
                if (typeof gtag !== 'undefined') gtag('event', 'review_click');
                if (typeof posthog !== 'undefined') posthog.capture('review_click');
              }}
            >
              Read more reviews on Google →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
