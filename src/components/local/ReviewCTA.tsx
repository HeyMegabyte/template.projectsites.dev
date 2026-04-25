import { Star, MessageSquare, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ReviewCTAProps {
  placeId: string;
  businessName: string;
  qrCodeSrc?: string;
}

export default function ReviewCTA({ placeId, businessName, qrCodeSrc }: ReviewCTAProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  const track = (event: string, props?: Record<string, unknown>) => {
    window.gtag?.('event', event, props);
    window.posthog?.capture(event, props);
  };

  const handleStarClick = (star: number) => {
    setRating(star);
    track('review_star_select', { rating: star, business: businessName });

    if (star >= 4) {
      track('review_click', { rating: star, destination: 'google' });
      window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowFeedback(true);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('private_feedback_submit', { rating, business: businessName });
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="max-w-lg mx-auto px-6">
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 via-transparent to-[var(--color-primary)]/20 pointer-events-none" />

          <div className="relative z-10">
            {!submitted ? (
              <>
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Star size={28} className="text-[var(--color-accent)]" />
                </div>

                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  Love our service?
                </h2>
                <p className="text-white/60 text-sm mb-6">
                  Your review helps others find {businessName}
                </p>

                {/* Star picker */}
                <div className="flex justify-center gap-2 mb-6" role="radiogroup" aria-label="Rate your experience">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      role="radio"
                      aria-checked={rating === star}
                    >
                      <Star
                        size={36}
                        className={
                          star <= (hoveredStar || rating)
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                            : 'text-white/20'
                        }
                      />
                    </button>
                  ))}
                </div>

                {/* Private feedback form */}
                {showFeedback && (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 motion-safe:animate-[fadeIn_200ms_ease-out]">
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <MessageSquare size={16} />
                      <span>We&apos;d love to hear how we can improve</span>
                    </div>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what happened..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[var(--color-accent)]/50 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-lg transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                      Send Feedback
                    </button>
                  </form>
                )}

                {/* QR Code */}
                {qrCodeSrc && !showFeedback && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-white/40 text-xs mb-3">Or scan to review</p>
                    <img
                      src={qrCodeSrc}
                      alt="Scan to leave a review"
                      className="w-28 h-28 mx-auto rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {!showFeedback && (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 text-sm font-medium mt-6 transition-colors"
                    onClick={() => track('review_click', { source: 'direct_link' })}
                  >
                    <ExternalLink size={14} />
                    Write a review on Google
                  </a>
                )}
              </>
            ) : (
              <div className="py-4">
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageSquare size={28} className="text-green-400" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">Thank you!</h3>
                <p className="text-white/60 text-sm">
                  Your feedback helps us serve you better.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
