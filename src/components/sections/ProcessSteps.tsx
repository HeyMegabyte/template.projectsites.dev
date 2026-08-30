import { type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { scrubText } from '@/lib/placeholders';

export interface ProcessStep {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface Props {
  steps: ProcessStep[];
  eyebrow?: string;
  headline?: string;
  description?: string;
  className?: string;
}

/**
 * Numbered process steps with connector line. Three-or-more steps form a
 * horizontal flow on md+, a vertical timeline below. Each step is a tactile
 * card to anchor the editorial brutalism aesthetic.
 */
export function ProcessSteps({ steps, eyebrow = 'How it works', headline, description, className }: Props) {
  const safeEyebrow = scrubText(eyebrow, 'How it works');
  const safeHeadline = scrubText(headline);
  const safeDescription = scrubText(description);
  // Drop steps whose title is an unresolved token; scrub each description.
  const safeSteps = steps
    .map((s) => ({ ...s, title: scrubText(s.title), description: scrubText(s.description) }))
    .filter((s) => s.title.length > 0);
  if (safeSteps.length === 0) return null;
  return (
    <section className={cn('py-24 md:py-32 max-w-container-wide mx-auto px-6', className)}>
      <div className="text-center mb-16 reveal-on-view">
        <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
        {safeHeadline && (
          <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-4 text-text">
            {safeHeadline}
          </h2>
        )}
        {safeDescription && <p className="text-text-muted max-w-2xl mx-auto text-lg">{safeDescription}</p>}
      </div>

      <ol className="relative grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Connector line linking the steps into a flow (md+ horizontal row).
            Draws left→right on scroll (process-connector); base state is fully
            drawn so no-JS / reduced-motion renders it solid. */}
        <span
          aria-hidden="true"
          className="process-connector hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
        {safeSteps.map((step, i) => (
          <li
            key={step.title}
            style={{ '--step-i': i } as CSSProperties}
            className="relative card-tactile p-6 md:p-8 reveal-on-view transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/* Editorial ghost number — a faint watermark in the TOP-RIGHT corner so it
                never collides with the icon + title in the top-LEFT (it was `-left-2`,
                overlapping the icon). Decorative + behind the content (earlier in DOM),
                staggered scale-pop keyed on --step-i. */}
            <span
              aria-hidden="true"
              className="process-num pointer-events-none select-none absolute -top-4 right-3 font-heading text-6xl font-extrabold text-accent/15 leading-none"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative">
              {step.icon && (
                <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {step.icon}
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-text mb-2">{step.title}</h3>
              {step.description && <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ProcessSteps;
