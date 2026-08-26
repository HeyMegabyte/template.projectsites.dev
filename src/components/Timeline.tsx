import { AnimatedSection } from './AnimatedSection';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
}

interface Props {
  events: TimelineEvent[];
  headline?: string;
  eyebrow?: string;
}

export default function Timeline({ events, headline, eyebrow }: Props) {
  if (events.length === 0) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {(eyebrow || headline) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4">
                {headline}
              </h2>
            )}
          </div>
        )}
        <ol className="relative border-l border-border pl-8 space-y-10">
          {events.map((e, i) => (
            <AnimatedSection key={`${e.year}-${i}`} delay={`${i * 0.1}s`}>
              <li className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-4 ring-[#0a0a1a]"
                />
                <time className="text-[var(--color-accent)] font-mono text-sm tracking-widest">
                  {e.year}
                </time>
                <h3 className="text-xl font-bold text-text mt-1 mb-2 font-heading">
                  {e.title}
                </h3>
                <p className="text-text-muted leading-relaxed">{e.description}</p>
                {e.link && (
                  <a
                    href={e.link.href}
                    className="inline-block mt-3 text-sm text-[var(--color-accent)] hover:underline underline-offset-4"
                    {...(e.link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {e.link.label} →
                  </a>
                )}
              </li>
            </AnimatedSection>
          ))}
        </ol>
      </div>
    </section>
  );
}
