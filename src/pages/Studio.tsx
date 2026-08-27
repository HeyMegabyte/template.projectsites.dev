import { useEffect, useState } from 'react';
import { Copy, Download, Check, Palette } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { brand, applyBrand } from '@/brand';
import { Button } from '@/components/ui/button';

/**
 * Brand Studio (ideas #171-174) — live brand-token playground.
 *
 *   - Drag the hue slider to see the whole template reskin in real time
 *   - Drag chroma to go pastel ↔ vivid
 *   - Cycle dark / light / auto
 *   - Pick a Google Font for heading + body
 *   - Export the resulting `_brand.json` as a download
 *
 * All mutations happen via CSS custom properties on `:root`. The persisted
 * `_brand.json` is untouched — this is a live preview only.
 */

const PRESET_HEADING_FONTS = [
  'Space Grotesk', 'Inter Tight', 'Playfair Display', 'Archivo Black',
  'Cabinet Grotesk', 'Cormorant Garamond', 'Bebas Neue', 'Crimson Pro',
  'Lora', 'Fraunces', 'Geist', 'Manrope',
];

const PRESET_BODY_FONTS = [
  'Inter', 'Satoshi', 'Lora', 'Inter Tight',
  'Archivo', 'Source Sans 3', 'IBM Plex Sans', 'Geist',
];

export default function Studio() {
  useSEO({
    title: 'Brand Studio — ProjectSites · live brand-token playground',
    description: 'Play with brand hue, chroma, mode, fonts in real time. Export _brand.json.',
  });

  const [hue, setHue] = useState<number>(Number(brand.color.brandHue ?? 240));
  const [chroma, setChroma] = useState<number>(Number(brand.color.brandChroma ?? 0.18));
  const [mode, setMode] = useState<'dark' | 'light' | 'auto'>(brand.colorScheme as 'dark' | 'light' | 'auto');
  const [heading, setHeading] = useState(brand.font.heading);
  const [body, setBody] = useState(brand.font.body);
  const [copied, setCopied] = useState(false);

  // Apply changes live
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-hue', String(hue));
    root.style.setProperty('--brand-chroma', String(chroma));

    // Recompute the OKLCH colors that depend on hue/chroma
    root.style.setProperty('--color-primary', `oklch(0.62 ${chroma} ${hue})`);
    root.style.setProperty('--color-primary-hover', `oklch(0.56 ${chroma} ${hue})`);
    root.style.setProperty('--color-background', mode === 'light' ? `oklch(0.99 0.005 ${hue})` : `oklch(0.08 0.02 ${hue})`);
    root.style.setProperty('--color-surface', mode === 'light' ? `oklch(0.97 0.01 ${hue})` : `oklch(0.12 0.02 ${hue})`);
    root.style.setProperty('--color-surface-elevated', mode === 'light' ? `oklch(0.94 0.01 ${hue})` : `oklch(0.16 0.02 ${hue})`);
    root.style.setProperty('--color-border', mode === 'light' ? `oklch(0.88 0.02 ${hue})` : `oklch(0.22 0.02 ${hue})`);
    root.style.setProperty('--color-text', mode === 'light' ? `oklch(0.18 0.02 ${hue})` : `oklch(0.97 0.005 ${hue})`);
    root.style.setProperty('--color-text-muted', mode === 'light' ? `oklch(0.42 0.01 ${hue})` : `oklch(0.65 0.01 ${hue})`);
    root.style.setProperty('--color-text-subtle', mode === 'light' ? `oklch(0.49 0.01 ${hue})` : `oklch(0.60 0.01 ${hue})`);
    root.style.setProperty('--font-heading', `'${heading}', system-ui, sans-serif`);
    root.style.setProperty('--font-body', `'${body}', system-ui, sans-serif`);
    root.dataset.theme = mode;
  }, [hue, chroma, mode, heading, body]);

  // Restore brand on unmount
  useEffect(() => {
    return () => { applyBrand(); };
  }, []);

  // Inject Google Fonts on-the-fly when picker changes
  useEffect(() => {
    const id = 'studio-fonts';
    const fontsStr = `family=${encodeURIComponent(heading).replace(/%20/g, '+')}:wght@400;500;600;700;800&family=${encodeURIComponent(body).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
    const href = `https://fonts.googleapis.com/css2?${fontsStr}`;
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [heading, body]);

  function buildBrandJson() {
    const json = JSON.parse(JSON.stringify(brand)) as typeof brand;
    // Reset shape — the resolved `brand` doesn't have the $value wrappers.
    // Synthesize a minimal DTCG fragment for download.
    const out = {
      $schema: 'https://schemas.designtokens.org/2025-10',
      $description: 'Exported from /studio',
      business: {
        name: { $value: '{BUSINESS_NAME}' },
        shortName: { $value: '{BUSINESS_SHORT_NAME}' },
        tagline: { $value: '{BUSINESS_TAGLINE}' },
        description: { $value: '{BUSINESS_DESCRIPTION}' },
        url: { $value: '{BUSINESS_URL}' },
        businessClass: { $value: '{BUSINESS_CLASS}' },
        email: { $value: '{BUSINESS_EMAIL}' },
        phone: { $value: '{BUSINESS_PHONE}' },
        address: { $value: '{BUSINESS_ADDRESS}' },
        hours: { $value: '{BUSINESS_HOURS}' },
      },
      color: {
        brandHue: { $value: String(hue) },
        brandChroma: { $value: String(chroma) },
        primary: { $value: `oklch(0.62 {color.brandChroma} {color.brandHue})` },
        primaryHover: { $value: `oklch(0.56 {color.brandChroma} {color.brandHue})` },
        accent: { $value: json.color.accent },
        accentHover: { $value: json.color.accentHover },
        background: { $value: mode === 'light' ? `oklch(0.99 0.005 {color.brandHue})` : `oklch(0.08 0.02 {color.brandHue})` },
        surface: { $value: mode === 'light' ? `oklch(0.97 0.01 {color.brandHue})` : `oklch(0.12 0.02 {color.brandHue})` },
        surfaceElevated: { $value: mode === 'light' ? `oklch(0.94 0.01 {color.brandHue})` : `oklch(0.16 0.02 {color.brandHue})` },
        border: { $value: mode === 'light' ? `oklch(0.88 0.02 {color.brandHue})` : `oklch(0.22 0.02 {color.brandHue})` },
        text: { $value: mode === 'light' ? `oklch(0.18 0.02 {color.brandHue})` : `oklch(0.97 0.005 {color.brandHue})` },
        textMuted: { $value: mode === 'light' ? `oklch(0.42 0.01 {color.brandHue})` : `oklch(0.65 0.01 {color.brandHue})` },
        textSubtle: { $value: mode === 'light' ? `oklch(0.49 0.01 {color.brandHue})` : `oklch(0.60 0.01 {color.brandHue})` },
        success: { $value: 'oklch(0.74 0.16 152)' },
        warning: { $value: 'oklch(0.82 0.16 85)' },
        danger: { $value: 'oklch(0.66 0.22 28)' },
        info: { $value: 'oklch(0.72 0.15 235)' },
      },
      colorScheme: { $value: mode },
      font: {
        heading: { $value: heading },
        body: { $value: body },
        mono: { $value: 'JetBrains Mono' },
        weights: { $value: [400, 500, 600, 700, 800] },
        fluidScale: { $value: 'clamp' },
      },
    };
    return JSON.stringify(out, null, 2);
  }

  function download() {
    const blob = new Blob([buildBrandJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `_brand.studio-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    await navigator.clipboard?.writeText(buildBrandJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="pt-28 pb-20 max-w-container-wide mx-auto px-6">
      <header className="text-center mb-12 reveal-on-view">
        <span className="inline-flex items-center gap-2 text-accent text-sm font-mono tracking-widest uppercase">
          <Palette size={14} /> Brand studio
        </span>
        <h1 className="mt-4 text-fluid-4xl font-bold font-heading">
          <span className="gradient-text">Build a brand.</span> Watch it apply.
        </h1>
        <p className="mt-4 text-text-muted max-w-2xl mx-auto">
          Every site built from this template reads its tokens from one JSON file.
          Drag the sliders below to see what changes — then download the result.
        </p>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        {/* Controls */}
        <aside className="card-tactile p-6 space-y-6 reveal-on-view h-fit sticky top-24">
          <div>
            <label htmlFor="hue" className="flex items-center justify-between text-sm font-medium text-text mb-2">
              Brand hue <span className="font-mono text-text-subtle">{hue}°</span>
            </label>
            <input
              id="hue"
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: `oklch(0.62 ${chroma} ${hue})`,
                background: `linear-gradient(to right, oklch(0.62 ${chroma} 0), oklch(0.62 ${chroma} 60), oklch(0.62 ${chroma} 120), oklch(0.62 ${chroma} 180), oklch(0.62 ${chroma} 240), oklch(0.62 ${chroma} 300), oklch(0.62 ${chroma} 360))`,
                borderRadius: 'var(--radius-full)',
                height: '8px',
                appearance: 'none',
              }}
            />
          </div>

          <div>
            <label htmlFor="chroma" className="flex items-center justify-between text-sm font-medium text-text mb-2">
              Saturation <span className="font-mono text-text-subtle">{chroma.toFixed(2)}</span>
            </label>
            <input
              id="chroma"
              type="range"
              min={0.04}
              max={0.32}
              step={0.01}
              value={chroma}
              onChange={(e) => setChroma(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: `oklch(0.62 ${chroma} ${hue})` }}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-text mb-2">Color scheme</legend>
            <div className="flex gap-2">
              {(['dark', 'light', 'auto'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm capitalize transition-colors min-h-[44px] ${
                    mode === m
                      ? 'bg-accent text-background border-accent'
                      : 'border-border text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="heading-font" className="block text-sm font-medium text-text mb-2">
              Heading font
            </label>
            <select
              id="heading-font"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text min-h-[44px]"
            >
              {PRESET_HEADING_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="body-font" className="block text-sm font-medium text-text mb-2">
              Body font
            </label>
            <select
              id="body-font"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text min-h-[44px]"
            >
              {PRESET_BODY_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button onClick={download} size="lg" className="flex-1">
              <Download size={16} className="mr-2" /> Download
            </Button>
            <Button onClick={copyToClipboard} variant="outline" size="lg" className="flex-1">
              {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </Button>
          </div>
        </aside>

        {/* Preview */}
        <main className="space-y-8 reveal-on-view">
          <article className="card-tactile p-8 md:p-12">
            <span className="inline-block px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono tracking-widest uppercase mb-6">
              Live preview
            </span>
            <h2 className="text-fluid-3xl font-bold font-heading text-text mb-4" style={{ fontFamily: `'${heading}', sans-serif` }}>
              Every hue. Every mode. One template.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-6" style={{ fontFamily: `'${body}', sans-serif` }}>
              The whole template reads from one JSON file. Drag the slider on the left
              and the colors below recompute in real time using OKLCH lightness anchors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg">Primary action</Button>
              <Button size="lg" variant="outline">Secondary</Button>
            </div>
          </article>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['primary', 'accent', 'success', 'warning'] as const).map((tone) => (
              <div key={tone} className="card-tactile p-4">
                <div className={`h-20 rounded-md`} style={{ background: `var(--color-${tone})` }} />
                <p className="mt-2 text-text-muted text-xs font-mono">--color-{tone}</p>
              </div>
            ))}
          </div>

          <article className="card-tactile p-8">
            <h3 className="font-heading text-2xl text-text mb-4">Typography sample</h3>
            <p style={{ fontFamily: `'${body}', sans-serif` }} className="text-text-muted leading-relaxed">
              <strong className="text-text">Quick brown fox</strong> jumps over the lazy dog.
              The bakery at the corner sells <em>sourdough croissants</em>. SoC 2 Type II,
              GDPR-compliant, hosted on Cloudflare. <a href="#" className="text-accent underline-hover">Read more →</a>
            </p>
          </article>
        </main>
      </div>
    </section>
  );
}
