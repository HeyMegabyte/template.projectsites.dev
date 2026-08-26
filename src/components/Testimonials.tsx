import { Star } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { AggregateRatingJsonLd } from './AggregateRatingJsonLd';

export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  quote: string;
  rating: number;
  avatar?: string;
  citationUrl?: string;
}

interface Props {
  itemName: string;
  testimonials: Testimonial[];
  headline?: string;
  eyebrow?: string;
}

export default function Testimonials({
  itemName,
  testimonials,
  headline = 'What our clients say',
  eyebrow = 'Testimonials',
}: Props) {
  if (testimonials.length === 0) return null;
  const avg =
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AggregateRatingJsonLd
          itemName={itemName}
          ratingValue={Number(avg.toFixed(1))}
          reviewCount={testimonials.length}
          reviews={testimonials.map((t) => ({
            author: t.name,
            reviewBody: t.quote,
            reviewRating: t.rating,
          }))}
        />
        <AnimatedSection className="text-center mb-16">
          <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4">{headline}</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimatedSection key={`${t.name}-${i}`} delay={`${i * 0.15}s`}>
              <figure className="glass rounded-2xl p-8 h-full flex flex-col">
                <div className="flex gap-1 mb-4" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      aria-hidden="true"
                      className="text-yellow-500"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <blockquote className="text-text-muted text-sm leading-relaxed mb-6 flex-1 italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                  )}
                  <div>
                    <p className="text-text font-medium text-sm">{t.name}</p>
                    <p className="text-text-subtle text-xs">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ''}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
