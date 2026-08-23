import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrubText, scrubList, scrubImage } from '@/lib/placeholders';

interface Props {
  eyebrow?: string;
  headline: string;
  description: string;
  bullets?: string[];
  image?: { src: string; alt: string };
  visual?: ReactNode;
  cta?: { label: string; href: string };
  imagePosition?: 'left' | 'right';
  className?: string;
}

/**
 * Image-left / image-right feature split. Pass either `image` for an `<img>`,
 * or pass `visual` for fully custom content (chart, demo, code block).
 */
export function FeatureSplit({
  eyebrow,
  headline,
  description,
  bullets = [],
  image,
  visual,
  cta,
  imagePosition = 'right',
  className,
}: Props) {
  const flip = imagePosition === 'left';
  // Scrub unresolved generation tokens so a raw `{ABOUT_HEADLINE}` /
  // `{ABOUT_DESCRIPTION}` never renders and a `{ABOUT_IMAGE_URL}` never 404s.
  // Empty → the guards below hide the element; a placeholder image → no <img>.
  const safeEyebrow = scrubText(eyebrow);
  const safeHeadline = scrubText(headline);
  const safeDescription = scrubText(description);
  const safeBullets = scrubList(bullets);
  const safeImage = scrubImage(image);
  // Nothing real to show on the copy side AND no headline → skip the whole
  // section rather than render an empty husk (SafeSection-style fail-soft).
  if (!safeHeadline && !safeDescription && safeBullets.length === 0 && !visual && !safeImage) {
    return null;
  }
  return (
    <section className={cn('py-24 md:py-32 max-w-container-wide mx-auto px-6', className)}>
      <div className={cn('grid lg:grid-cols-2 gap-12 items-center', flip && 'lg:[&>*:first-child]:order-2')}>
        <div className="reveal-on-view">
          {safeEyebrow && (
            <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
          )}
          {safeHeadline && (
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-6 text-text">
              {safeHeadline}
            </h2>
          )}
          {safeDescription && (
            <p className="text-text-muted text-lg leading-relaxed mb-6">{safeDescription}</p>
          )}
          {safeBullets.length > 0 && (
            <ul className="space-y-3 mb-8">
              {safeBullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-text-muted">
                  <span className="text-accent" aria-hidden="true">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {cta && scrubText(cta.label) && (
            <Button asChild variant="outline">
              <Link to={cta.href}>
                {scrubText(cta.label)} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <div className="reveal-on-view">
          {visual ? (
            visual
          ) : safeImage ? (
            <div className="card-tactile overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={safeImage.src}
                alt={safeImage.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default FeatureSplit;
