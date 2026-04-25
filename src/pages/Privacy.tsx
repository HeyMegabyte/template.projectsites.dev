import { AnimatedSection } from '@/components/AnimatedSection';
import { useSEO } from '@/hooks/useSEO';

export default function Privacy() {
  useSEO({
    title: 'Privacy Policy — {BUSINESS_NAME}',
    description: 'Privacy policy for {BUSINESS_NAME}. Learn how we collect, use, and protect your data.',
  });

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="gradient-text">Privacy Policy</span>
          </h1>
          <p className="text-white/40 text-sm mb-12">
            Last updated: {'{PRIVACY_LAST_UPDATED}'}
          </p>
        </AnimatedSection>

        <AnimatedSection delay="0.1s">
          <div className="prose prose-invert max-w-none space-y-8">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Information We Collect
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{PRIVACY_COLLECTION_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                How We Use Your Information
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{PRIVACY_USAGE_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Data Protection
              </h2>
              <p className="text-white/50 leading-relaxed">
                {'{PRIVACY_PROTECTION_TEXT}'}
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4 font-heading">
                Contact Us
              </h2>
              <p className="text-white/50 leading-relaxed">
                Questions about this policy? Contact us at{' '}
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
