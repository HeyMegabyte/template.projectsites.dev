import { useState } from 'react';
import { Plus } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { cn } from '@/lib/utils';
import { scrubText } from '@/lib/placeholders';

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  eyebrow?: string;
  headline?: string;
  description?: string;
  className?: string;
  /** Accordion mode (single-open) vs disclosure (multi-open). Default: disclosure. */
  exclusive?: boolean;
}

/**
 * FAQ with FAQPage JSON-LD (highest AI-citation rate across ChatGPT /
 * Perplexity / Google AI Overviews). Renders as accessible disclosure widgets.
 *
 * Cinematic detail (all gated behind `prefers-reduced-motion: no-preference`
 * via the `.faq-*` classes in `index.css`, and auto-neutralised by the global
 * reduced-motion reset): each row rises in on scroll with a per-item stagger
 * (`--faq-i`), the trigger lifts + reveals an accent hairline on hover/focus,
 * the `+` badge blooms into a glowing `×` when open, and the open row gets a
 * soft accent wash + left accent bar. The answer slides via a `grid-rows`
 * 0fr↔1fr transition with a fade so there is no layout jank.
 */
export function FAQ({
  items,
  eyebrow = 'Questions',
  headline = 'Frequently asked questions',
  description,
  exclusive = false,
  className,
}: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  // Drop Q&A pairs where either side is an unresolved token — this also keeps
  // the FAQPage JSON-LD from emitting `{FAQ_1_Q}` (which would fail Rich Results
  // and mislead AI-search crawlers). If nothing real remains, skip the section.
  const safeItems = items
    .map((it) => ({ question: scrubText(it.question), answer: scrubText(it.answer) }))
    .filter((it) => it.question.length > 0 && it.answer.length > 0);
  const safeEyebrow = scrubText(eyebrow, 'Questions');
  const safeHeadline = scrubText(headline, 'Frequently asked questions');
  const safeDescription = scrubText(description);
  if (safeItems.length === 0) return null;

  function toggle(i: number) {
    setOpen((prev) => {
      const next = exclusive ? new Set<number>() : new Set(prev);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section className={cn('py-24 md:py-32 max-w-container-prose mx-auto px-6', className)}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: safeItems.map((it) => ({
            '@type': 'Question',
            name: it.question,
            acceptedAnswer: { '@type': 'Answer', text: it.answer },
          })),
        }}
      />
      <div className="text-center mb-12 reveal-on-view">
        <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
        <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-4 text-text">{safeHeadline}</h2>
        {safeDescription && <p className="text-text-muted max-w-2xl mx-auto">{safeDescription}</p>}
      </div>
      <ul className="border-y border-border">
        {safeItems.map((it, i) => {
          const isOpen = open.has(i);
          return (
            <li
              key={i}
              className="faq-item"
              data-faq-open={isOpen ? '' : undefined}
              style={{ '--faq-i': i } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="faq-trigger flex items-center justify-between w-full py-6 pl-4 pr-1 text-left gap-6 min-h-[52px]"
              >
                <span className="font-heading text-lg md:text-xl font-semibold text-text transition-colors duration-200">
                  {it.question}
                </span>
                <span className="faq-badge shrink-0 h-9 w-9 rounded-full border border-border flex items-center justify-center text-accent">
                  <Plus size={16} className="faq-badge__icon" aria-hidden="true" />
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-label={it.question}
                className={cn(
                  'faq-panel grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <p className="faq-answer pb-6 pl-4 pr-1 text-text-muted leading-relaxed">{it.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FAQ;
