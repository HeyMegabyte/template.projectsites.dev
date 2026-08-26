import { ClipboardList, Camera, Calculator, CalendarCheck, ShieldCheck, Clock, MapPin, BadgeCheck } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { QuoteForm } from '@/components/QuoteForm';
import { FAQ } from '@/components/sections';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';
import { brand } from '@/brand';

/**
 * Quote-request page — the right conversion surface for service businesses
 * (contractors, HVAC, plumbing, roofing, landscaping, remodeling) where a fixed
 * price list is misleading. Replaces `/pricing` for those verticals: the visitor
 * submits contact + service address + project details + PHOTOS and gets a real
 * quote. 500+ words of relevant, trust-building supporting content; theme tokens.
 */
export default function Quote() {
  const slug = brand.business.url ? new URL(brand.business.url).hostname.split('.')[0] : 'default';
  const name = brand.business.name || 'our team';

  const steps = [
    { icon: <ClipboardList size={20} />, title: 'Tell us what you need', body: 'Share a few details about the project and the service address. It takes about two minutes.' },
    { icon: <Camera size={20} />, title: 'Add a few photos', body: 'A couple of clear pictures of the area let us quote accurately without a wasted trip.' },
    { icon: <Calculator size={20} />, title: 'Get a real quote', body: `${name} reviews your request and sends a clear, itemized quote — usually within one business day.` },
    { icon: <CalendarCheck size={20} />, title: 'Schedule the work', body: 'Approve the quote and pick a time that works. No pressure, no surprises on the final bill.' },
  ];

  const trust = [
    { icon: <BadgeCheck size={18} />, label: 'Free, no-obligation quotes' },
    { icon: <ShieldCheck size={18} />, label: 'Licensed & insured' },
    { icon: <Clock size={18} />, label: 'Response within one business day' },
    { icon: <Calculator size={18} />, label: 'Upfront, itemized pricing' },
  ];

  const photoTips = [
    'A wide shot of the whole area so we can see the full scope.',
    'A close-up of the specific problem — the leak, the unit, the damage.',
    'Any model or serial labels on existing equipment.',
    'The surrounding space we would need to work in or protect.',
  ];

  const faqs = [
    { question: 'Is the quote really free?', answer: 'Yes. Requesting a quote is completely free and carries no obligation. We review your details and photos and send a clear estimate so you can decide with full information.' },
    { question: 'Why do you ask for photos?', answer: 'Photos let us understand the real scope before we visit, so the quote we send is accurate and we rarely need a second trip. It saves you time and helps us give you a fair, honest price up front.' },
    { question: 'How fast will I hear back?', answer: 'We aim to send your quote within one business day. If the job is urgent, mention it in the details and note that emergency service may be available the same day.' },
    { question: 'What if my project changes?', answer: 'No problem. Your quote is a starting point. If the scope shifts once we begin, we talk it through and re-quote before doing any additional work — you always approve the price first.' },
  ];

  useSEO({
    title: `Request a Free Quote — ${brand.business.name || 'Our Company'}`,
    description: `Request a free, no-obligation quote from ${name}. Share your project details and a few photos, and we'll send an accurate, upfront estimate within one business day.`,
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Request a Quote from ${brand.business.name || 'Our Company'}`,
          description: `Request a free quote — share project details and photos for an accurate, upfront estimate.`,
        }}
      />

      <section className="pt-32 pb-16">
        <div className="max-w-container-wide mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-accent text-sm font-mono tracking-widest uppercase">Free Quote</span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mt-4 mb-6">
              <span className="gradient-text">Request your free quote</span>
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Every job is different, so we don&rsquo;t hide behind a generic price list. Tell us
              what you need, add a few photos, and {name} will send an accurate, upfront quote —
              usually within one business day. No pressure, no obligation, and no surprises on the
              final bill.
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8 text-sm text-text-muted">
              {trust.map((t) => (
                <li key={t.label} className="flex items-center gap-2">
                  <span className="text-accent" aria-hidden="true">{t.icon}</span>
                  {t.label}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <AnimatedSection className="lg:col-span-3">
              <QuoteForm slug={slug} />
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-2 space-y-8" delay="0.1s">
              <div className="glass rounded-2xl p-6">
                <h2 className="font-heading text-lg font-bold text-text mb-3 flex items-center gap-2">
                  <Camera size={18} className="text-accent" aria-hidden="true" /> What to include in your photos
                </h2>
                <ul className="space-y-2.5">
                  {photoTips.map((tip) => (
                    <li key={tip} className="flex gap-2.5 text-text-muted text-sm">
                      <span className="text-accent mt-0.5" aria-hidden="true">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="font-heading text-lg font-bold text-text mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-accent" aria-hidden="true" /> Serving your area
                </h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  We proudly serve {brand.business.address || 'the local community'} and the
                  surrounding area. Not sure if you&rsquo;re in our service range? Send your
                  request anyway and we&rsquo;ll confirm right away — we&rsquo;re often able to help
                  neighbors just outside our usual zone.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-container-wide mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-accent text-sm font-mono tracking-widest uppercase">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-4 text-text">From request to done in four simple steps</h2>
          </AnimatedSection>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="relative card-tactile p-6">
                <span aria-hidden="true" className="absolute -top-4 -left-2 font-heading text-6xl font-extrabold text-accent/15 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">{s.icon}</div>
                  <h3 className="font-heading text-lg font-bold text-text mb-2">{s.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQ items={faqs} eyebrow="Quote questions" headline="Questions before you request a quote" />
    </>
  );
}
