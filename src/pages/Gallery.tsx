import { useEffect, useState } from 'react';
import { ExternalLink, Github, ArrowRight, Sparkles } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { JsonLd } from '@/components/JsonLd';
import { CTASection } from '@/components/sections';

interface ManifestEntry {
  example: string;
  name: string;
  tagline: string;
  description: string;
  businessClass: string;
  brandHue: string;
  brandChroma: string;
  colorScheme: string;
  font?: { heading?: string; body?: string };
  project: string;
  url: string;
  screenshot: string;
}

const REPO_URL = 'https://github.com/heymegabyte/template.projectsites.dev';

export default function Gallery() {
  const [entries, setEntries] = useState<ManifestEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Gallery — ProjectSites · 9 demos, one master prompt',
    description: 'Nine live demos built from the same template via one master prompt. Each picks a different industry preset, hue, font pairing, and section composition.',
  });

  useEffect(() => {
    fetch('/applied-manifest.json')
      .then((r) => r.json())
      .then((data: ManifestEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'ProjectSites — Applied examples',
          description: 'Live demos generated from the master prompt against nine industry briefs.',
          hasPart: entries.map((e) => ({
            '@type': 'WebSite',
            name: e.name,
            url: e.url,
            description: e.description,
          })),
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 max-w-container-wide mx-auto px-6 text-center">
        <span className="inline-block text-accent text-sm font-mono tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-accent/20 bg-accent/5">
          <Sparkles className="inline w-4 h-4 mr-1.5 align-text-bottom" /> Master prompt · v3.3
        </span>
        <h1 className="text-fluid-5xl font-extrabold font-heading tracking-[-0.03em] leading-[0.95]">
          <span className="gradient-text">Nine sites.</span><br />
          <span className="text-text">One prompt.</span>
        </h1>
        <p className="mt-8 text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Each demo below was generated from the same template by running{' '}
          <code className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-sm">
            PROMPT.md
          </code>{' '}
          against an industry brief. Bakery, SaaS, attorney, agency, dentist, designer, nonprofit, retail, plumber — same code, different `_brand.json`.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-background font-bold hover:bg-accent-hover transition-colors min-h-[44px]"
          >
            <Github size={18} /> Use this template
          </a>
          <a
            href={`${REPO_URL}/blob/main/PROMPT.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-text hover:bg-surface transition-colors min-h-[44px]"
          >
            Read the prompt <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-container-wide mx-auto px-6 py-10">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: entries.length, label: 'live demos' },
            { value: 21, label: 'section components' },
            { value: '63/63', label: 'prompt-evals gates' },
            { value: '88', label: 'Vitest tests' },
          ].map((s) => (
            <div key={s.label} className="card-tactile p-6">
              <dd className="font-heading text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</dd>
              <dt className="mt-1 text-text-muted text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Gallery grid */}
      <section className="max-w-container-wide mx-auto px-6 py-16">
        <div className="mb-10 text-center reveal-on-view">
          <span className="text-accent text-sm font-mono tracking-widest uppercase">The gallery</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold font-heading text-text">All nine live</h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            Click any card to open the live demo on Cloudflare Pages.
            Every site is built from the same React + Vite + Tailwind template — they only differ in <code className="text-sm font-mono">_brand.json</code>.
          </p>
        </div>

        {loading && (
          <p className="text-center text-text-muted">Loading demos…</p>
        )}

        {!loading && entries.length === 0 && (
          <p className="text-center text-text-muted">
            No demos yet. Run <code className="font-mono">npm run deploy:applied</code> to populate.
          </p>
        )}

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <li key={entry.example} className="reveal-on-view">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block card-tactile overflow-hidden interactive-4 h-full"
              >
                <figure className="aspect-[16/10] overflow-hidden border-b border-border bg-surface relative">
                  <img
                    src={entry.screenshot}
                    alt={`Homepage screenshot of ${entry.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-slow"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-background/80 text-text-muted backdrop-blur-sm border border-border"
                  >
                    {entry.businessClass}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-mono bg-background/80 text-text-muted backdrop-blur-sm border border-border"
                  >
                    hue {entry.brandHue} · {entry.colorScheme}
                  </span>
                </figure>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text underline-hover inline-block">
                        {entry.name}
                      </h3>
                      <p className="mt-1 text-accent font-mono text-xs uppercase tracking-widest">
                        {entry.tagline}
                      </p>
                    </div>
                    <ExternalLink size={16} className="text-text-subtle group-hover:text-accent transition-colors mt-1.5 shrink-0" />
                  </div>
                  <p className="mt-3 text-text-muted text-sm leading-relaxed line-clamp-3">
                    {entry.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-subtle">
                    {entry.font?.heading && (
                      <span className="font-mono">
                        {entry.font.heading}
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-mono truncate">{entry.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="max-w-container-normal mx-auto px-6 py-16">
        <div className="card-tactile p-8 md:p-12">
          <span className="text-accent text-sm font-mono tracking-widest uppercase">How it works</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold font-heading text-text">
            One template + one prompt + one JSON file
          </h2>
          <ol className="mt-6 space-y-4 text-text-muted">
            <li className="flex gap-4">
              <span className="font-heading font-extrabold text-2xl text-accent shrink-0 w-10">1</span>
              <div>
                <span className="text-text font-medium">Fork the template.</span>{' '}
                React 18 + Vite + Tailwind + 21 section components + 15 routes.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-heading font-extrabold text-2xl text-accent shrink-0 w-10">2</span>
              <div>
                <span className="text-text font-medium">Paste the master prompt.</span>{' '}
                <code className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-xs">PROMPT.md</code>{' '}
                into Claude, GPT, or Gemini with your business brief.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-heading font-extrabold text-2xl text-accent shrink-0 w-10">3</span>
              <div>
                <span className="text-text font-medium">Apply the output.</span>{' '}
                The model produces a customized{' '}
                <code className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-xs">_brand.json</code>{' '}
                + page snippets that build clean.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-heading font-extrabold text-2xl text-accent shrink-0 w-10">4</span>
              <div>
                <span className="text-text font-medium">Ship.</span>{' '}
                <code className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-xs">npm run build</code>,{' '}
                deploy to Cloudflare Pages, done.
              </div>
            </li>
          </ol>
        </div>
      </section>

      <CTASection
        eyebrow="Try it"
        headline="Use this template for your next site."
        description="Open-source. Cross-IDE compliant (AGENTS.md spec). Single-source-of-truth brand tokens. Zero dependencies on AI-generated stock photography."
        primary={{ label: 'Use this template', href: REPO_URL }}
        secondary={{ label: 'Read the docs', href: `${REPO_URL}/tree/main/docs` }}
        tone="emphatic"
      />
    </>
  );
}
