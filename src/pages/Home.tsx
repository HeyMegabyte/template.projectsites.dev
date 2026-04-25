import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Users, Target, Award } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { JsonLd } from '@/components/JsonLd';
import { useSEO } from '@/hooks/useSEO';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: '{FEATURE_1_TITLE}',
    description: '{FEATURE_1_DESCRIPTION}',
  },
  {
    icon: Zap,
    title: '{FEATURE_2_TITLE}',
    description: '{FEATURE_2_DESCRIPTION}',
  },
  {
    icon: Users,
    title: '{FEATURE_3_TITLE}',
    description: '{FEATURE_3_DESCRIPTION}',
  },
  {
    icon: Target,
    title: '{FEATURE_4_TITLE}',
    description: '{FEATURE_4_DESCRIPTION}',
  },
  {
    icon: Award,
    title: '{FEATURE_5_TITLE}',
    description: '{FEATURE_5_DESCRIPTION}',
  },
  {
    icon: Star,
    title: '{FEATURE_6_TITLE}',
    description: '{FEATURE_6_DESCRIPTION}',
  },
];

const testimonials = [
  {
    name: '{TESTIMONIAL_1_NAME}',
    role: '{TESTIMONIAL_1_ROLE}',
    quote: '{TESTIMONIAL_1_QUOTE}',
    rating: 5,
  },
  {
    name: '{TESTIMONIAL_2_NAME}',
    role: '{TESTIMONIAL_2_ROLE}',
    quote: '{TESTIMONIAL_2_QUOTE}',
    rating: 5,
  },
  {
    name: '{TESTIMONIAL_3_NAME}',
    role: '{TESTIMONIAL_3_ROLE}',
    quote: '{TESTIMONIAL_3_QUOTE}',
    rating: 5,
  },
];

const services = [
  { title: '{SERVICE_1_TITLE}', description: '{SERVICE_1_DESCRIPTION}' },
  { title: '{SERVICE_2_TITLE}', description: '{SERVICE_2_DESCRIPTION}' },
  { title: '{SERVICE_3_TITLE}', description: '{SERVICE_3_DESCRIPTION}' },
];

export default function Home() {
  useSEO({
    title: '{BUSINESS_NAME} — {BUSINESS_TAGLINE}',
    description: '{BUSINESS_DESCRIPTION}',
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: '{BUSINESS_NAME}',
          description: '{BUSINESS_DESCRIPTION}',
          url: '{BUSINESS_URL}',
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)]/5 blur-[120px] animate-subtleFloat" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] animate-subtleFloat" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/3 blur-[140px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
          <AnimatedSection animation="animate-blurIn">
            <span className="inline-block text-[var(--color-accent)] text-sm font-mono font-medium tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5">
              {'{BUSINESS_TAGLINE}'}
            </span>
          </AnimatedSection>

          <AnimatedSection delay="0.1s">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-[0.95] mb-8 tracking-tight">
              <span className="gradient-text">{'{HERO_HEADLINE}'}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay="0.2s">
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              {'{HERO_SUBHEADLINE}'}
            </p>
          </AnimatedSection>

          <AnimatedSection delay="0.3s">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl">
                <Link to="/contact">
                  {'{HERO_CTA}'} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/services">{'{HERO_SECONDARY_CTA}'}</Link>
              </Button>
            </div>
          </AnimatedSection>

          {/* Trust badges */}
          <AnimatedSection delay="0.5s" className="mt-16">
            <div className="flex flex-wrap justify-center gap-8 text-white/30 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                <span>{'{TRUST_BADGE_1}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
                <span>{'{TRUST_BADGE_2}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" />
                <span>{'{TRUST_BADGE_3}'}</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-6">
              <span className="gradient-text">{'{FEATURES_HEADLINE}'}</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              {'{FEATURES_SUBHEADLINE}'}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={`${i * 0.1}s`}>
                <div className="group glass rounded-2xl p-8 hover:border-[var(--color-accent)]/20 transition-all duration-300 hover:-translate-y-1 h-full">
                  <feature.icon className="h-8 w-8 text-[var(--color-accent)] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent)]/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="animate-slideInLeft">
              <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
                About Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-6">
                {'{ABOUT_HEADLINE}'}
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                {'{ABOUT_DESCRIPTION}'}
              </p>
              <p className="text-white/40 leading-relaxed mb-8">
                {'{ABOUT_DESCRIPTION_2}'}
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AnimatedSection>

            <AnimatedSection animation="animate-slideInRight">
              <div className="glass rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <span className="text-[var(--color-accent)] text-2xl font-bold font-heading">
                      {'{STAT_1_VALUE}'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{'{STAT_1_LABEL}'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <span className="text-purple-400 text-2xl font-bold font-heading">
                      {'{STAT_2_VALUE}'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{'{STAT_2_LABEL}'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-400 text-2xl font-bold font-heading">
                      {'{STAT_3_VALUE}'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{'{STAT_3_LABEL}'}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              Our Services
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 mb-6">
              <span className="gradient-text">{'{SERVICES_HEADLINE}'}</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={i} delay={`${i * 0.15}s`}>
                <div className="group relative glass rounded-2xl p-8 hover:border-[var(--color-accent)]/20 transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                      <Zap className="h-7 w-7 text-[var(--color-accent)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-heading">
                      {service.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4">
              {'{TESTIMONIALS_HEADLINE}'}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={`${i * 0.15}s`}>
                <div className="glass rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 text-yellow-500"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 via-purple-500/5 to-blue-500/5" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                  <span className="gradient-text">{'{CTA_HEADLINE}'}</span>
                </h2>
                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                  {'{CTA_DESCRIPTION}'}
                </p>
                <Button asChild size="xl">
                  <Link to="/contact">
                    {'{CTA_BUTTON}'} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
