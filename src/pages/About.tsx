import { AnimatedSection } from '@/components/AnimatedSection';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';

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

      <section className="pt-32 pb-20">
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
            <div className="glass rounded-2xl p-8 md:p-12 mb-12">
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {'{ABOUT_PARAGRAPH_1}'}
              </p>
              <p className="text-white/50 leading-relaxed">
                {'{ABOUT_PARAGRAPH_2}'}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="0.2s">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-8">
              {'{ABOUT_MISSION_HEADLINE}'}
            </h2>
            <p className="text-white/50 leading-relaxed mb-12">
              {'{ABOUT_MISSION_TEXT}'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay="0.3s">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-[var(--color-accent)] font-heading mb-2">
                  {'{ABOUT_STAT_1_VALUE}'}
                </p>
                <p className="text-white/50 text-sm">{'{ABOUT_STAT_1_LABEL}'}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-purple-400 font-heading mb-2">
                  {'{ABOUT_STAT_2_VALUE}'}
                </p>
                <p className="text-white/50 text-sm">{'{ABOUT_STAT_2_LABEL}'}</p>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-blue-400 font-heading mb-2">
                  {'{ABOUT_STAT_3_VALUE}'}
                </p>
                <p className="text-white/50 text-sm">{'{ABOUT_STAT_3_LABEL}'}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
