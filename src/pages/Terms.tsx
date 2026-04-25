import { AnimatedSection } from '@/components/AnimatedSection';
import { useSEO } from '@/hooks/useSEO';

export default function Terms() {
  useSEO({
    title: 'Terms of Service — {BUSINESS_NAME}',
    description: 'Terms of service for {BUSINESS_NAME}. Read our terms and conditions.',
  });

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="gradient-text">Terms of Service</span>
          </h1>
          <p className="text-white/40 text-sm mb-12">
            Last updated: {'{TERMS_LAST_UPDATED}'}
          </p>
        </AnimatedSection>

        <AnimatedSection delay="0.1s">
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Acceptance of Terms
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{TERMS_ACCEPTANCE_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Use of Services
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{TERMS_USAGE_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Limitation of Liability
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{TERMS_LIABILITY_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Contact
              </h2>
              <p className="text-white/50 leading-relaxed">
                For questions about these terms, contact{' '}
                <a
                  href="mailto:{BUSINESS_EMAIL}"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {'{BUSINESS_EMAIL}'}
                </a>
                .
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
