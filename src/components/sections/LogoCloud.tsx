import { Marquee } from './Marquee';
import { cn } from '@/lib/utils';
import { scrubText, hasRealImage } from '@/lib/placeholders';

export interface Logo {
  name: string;
  src?: string;
  href?: string;
  /** Falls back to a styled wordmark when `src` is missing. */
}

interface Props {
  logos: Logo[];
  eyebrow?: string;
  headline?: string;
  variant?: 'marquee' | 'grid';
  className?: string;
}

/**
 * "As seen in" / partner / client logo strip. Two variants:
 * - `marquee` (default): infinite scroll
 * - `grid`: static responsive grid for static social proof.
 *
 * Missing logo files render as desaturated brand-name wordmarks so the section
 * never has gaps during development.
 */
export function LogoCloud({ logos, eyebrow, headline, variant = 'marquee', className }: Props) {
  // Drop logos whose name is an unresolved token (`{LOGO_1_NAME}`); keep only a
  // real `src`. If nothing real remains, hide the whole strip.
  const safeLogos = logos
    .map((l) => ({ ...l, name: scrubText(l.name), src: hasRealImage(l.src) ? l.src : undefined }))
    .filter((l) => l.name.length > 0);
  const safeEyebrow = scrubText(eyebrow);
  const safeHeadline = scrubText(headline);
  if (safeLogos.length === 0) return null;

  const items = safeLogos.map((l) => (
    <a
      key={l.name}
      href={l.href ?? '#'}
      className="opacity-50 hover:opacity-100 transition-opacity duration-base"
      aria-label={l.name}
    >
      {l.src ? (
        <img src={l.src} alt={l.name} className="h-8 md:h-10 w-auto object-contain" loading="lazy" />
      ) : (
        <span className="font-heading font-bold text-lg md:text-xl tracking-tight text-text">
          {l.name}
        </span>
      )}
    </a>
  ));

  return (
    <section className={cn('py-16 md:py-24 max-w-container-wide mx-auto px-6', className)}>
      {(safeEyebrow || safeHeadline) && (
        <div className="text-center mb-10">
          {safeEyebrow && <span className="text-accent text-xs font-mono tracking-widest uppercase">{safeEyebrow}</span>}
          {safeHeadline && <h2 className="text-xl md:text-2xl font-medium text-text-muted mt-3">{safeHeadline}</h2>}
        </div>
      )}
      {variant === 'marquee' ? (
        <Marquee items={items} speed="slow" pauseOnHover />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
          {safeLogos.map((l, i) => (
            <li key={l.name + i} className="opacity-50 hover:opacity-100 transition-opacity">
              {l.src ? (
                <img src={l.src} alt={l.name} className="h-8 md:h-10 w-auto object-contain" loading="lazy" />
              ) : (
                <span className="font-heading font-bold text-lg tracking-tight">{l.name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default LogoCloud;
