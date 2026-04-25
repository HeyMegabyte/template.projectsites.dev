import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/button';

const services = [
  { title: '{SERVICE_1_TITLE}', description: '{SERVICE_1_FULL_DESCRIPTION}' },
  { title: '{SERVICE_2_TITLE}', description: '{SERVICE_2_FULL_DESCRIPTION}' },
  { title: '{SERVICE_3_TITLE}', description: '{SERVICE_3_FULL_DESCRIPTION}' },
  { title: '{SERVICE_4_TITLE}', description: '{SERVICE_4_FULL_DESCRIPTION}' },
  { title: '{SERVICE_5_TITLE}', description: '{SERVICE_5_FULL_DESCRIPTION}' },
  { title: '{SERVICE_6_TITLE}', description: '{SERVICE_6_FULL_DESCRIPTION}' },
];

export default function Services() {
  useSEO({
    title: 'Services — {BUSINESS_NAME}',
    description: '{SERVICES_META_DESCRIPTION}',
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          provider: { '@type': 'LocalBusiness', name: '{BUSINESS_NAME}' },
          name: '{SERVICES_HEADLINE}',
        }}
      />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mt-4 mb-6">
              <span className="gradient-text">{'{SERVICES_HEADLINE}'}</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              {'{SERVICES_SUBHEADLINE}'}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={i} delay={`${i * 0.1}s`}>
                <div className="group glass rounded-2xl p-8 hover:border-[var(--color-accent)]/20 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                    <Zap className="h-7 w-7 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <div className="glass rounded-3xl p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
                {'{SERVICES_CTA_HEADLINE}'}
              </h2>
              <p className="text-white/50 mb-8">
                {'{SERVICES_CTA_DESCRIPTION}'}
              </p>
              <Button asChild size="lg">
                <Link to="/contact">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
