import { AnimatedSection } from '@/components/AnimatedSection';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';

// Guess-ahead sub-page copy: every token below is emitted by the content pack
// (scripts/gen-content-packs.mjs) for all 10 verticals, so nothing renders as a
// raw {TOKEN}. Theme tokens only (text-text / -muted / -subtle, bg-surface,
// border-border) — no hardcoded light classes (validate-site contrast gate).
const values = [
  { title: '{ABOUT_VALUE_1_TITLE}', desc: '{ABOUT_VALUE_1_DESC}' },
  { title: '{ABOUT_VALUE_2_TITLE}', desc: '{ABOUT_VALUE_2_DESC}' },
  { title: '{ABOUT_VALUE_3_TITLE}', desc: '{ABOUT_VALUE_3_DESC}' },
];

export default function About() {
  useSEO({
    title: 'About — {BUSINESS_NAME}',
    description: '{ABOUT_META_DESCRIPTION}',
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About {BUSINESS_NAME}',
          description: '{ABOUT_META_DESCRIPTION}',
        }}
      />

      {/* Intro — headline + opening paragraphs */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mt-4 mb-8">
              <span className="gradient-text">{'{ABOUT_HEADLINE}'}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay="0.1s">
            <div className="glass rounded-2xl p-8 md:p-12">
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                {'{ABOUT_PARAGRAPH_1}'}
              </p>
              <p className="text-text-subtle leading-relaxed mb-6">
                {'{ABOUT_PARAGRAPH_2}'}
              </p>
              <p className="text-text-subtle leading-relaxed mb-6">
                {'{ABOUT_PARAGRAPH_3}'}
              </p>
              <p className="text-text-subtle leading-relaxed">
                {'{ABOUT_PARAGRAPH_4}'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values — what we stand for (3-card grid) */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="mb-10">
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              What we stand for
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-heading text-text mt-3">
              The values behind everything we do
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <AnimatedSection key={i} delay={`${i * 0.1}s`}>
                <div className="glass rounded-2xl p-8 h-full">
                  <h3 className="text-xl font-bold font-heading text-text mb-3">{val.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{val.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Approach — how we work */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 md:p-12">
              <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
                How we work
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-text mt-3 mb-4">
                {'{ABOUT_APPROACH_TITLE}'}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {'{ABOUT_APPROACH_TEXT}'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Promise band */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 md:p-12 border-l-2 border-[var(--color-accent)]/40">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-text mb-4">
                {'{ABOUT_PROMISE_TITLE}'}
              </h2>
              <p className="text-text-muted leading-relaxed">
                {'{ABOUT_PROMISE_TEXT}'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission + stats */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection delay="0.2s">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-text mb-6">
              {'{ABOUT_MISSION_HEADLINE}'}
            </h2>
            <p className="text-text-subtle leading-relaxed mb-12">
              {'{ABOUT_MISSION_TEXT}'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay="0.3s">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-[var(--color-accent)] font-heading mb-2">
                  {'{ABOUT_STAT_1_VALUE}'}
                </p>
                <p className="text-text-subtle text-sm">{'{ABOUT_STAT_1_LABEL}'}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-purple-400 font-heading mb-2">
                  {'{ABOUT_STAT_2_VALUE}'}
                </p>
                <p className="text-text-subtle text-sm">{'{ABOUT_STAT_2_LABEL}'}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-blue-400 font-heading mb-2">
                  {'{ABOUT_STAT_3_VALUE}'}
                </p>
                <p className="text-text-subtle text-sm">{'{ABOUT_STAT_3_LABEL}'}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing sign-off */}
      <section className="py-16 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-text mb-4">
                {'{ABOUT_CLOSING_HEADLINE}'}
              </h2>
              <p className="text-text-muted leading-relaxed max-w-2xl mx-auto">
                {'{ABOUT_CLOSING_TEXT}'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
