/**
 * Brand source-of-truth resolver.
 *
 * Reads `_brand.json` (W3C DTCG format) at build time and exposes:
 *   - `brand`        — typed, alias-resolved object for use in components
 *   - `applyBrand()` — writes CSS custom properties to :root from the tokens
 *
 * Aliases like `oklch(0.62 {color.brandChroma} {color.brandHue})` are
 * resolved by recursive substitution before being written to CSS variables.
 * If a token references another token's value, this resolver handles it.
 */

// The shipped template carries _brand.json at the repo root. A FRESH build
// copy (e.g. the container's cp -r during site generation) can transiently
// miss it — the import then fails the whole build with a bare Node error
// (journey 2026-08-19: 'npm build failed or produced no dist/ files'). Use
// Vite's optional-glob import so a missing file degrades to {} instead —
// the per-field `pick` fallbacks below still resolve every surface.
const rawModules = import.meta.glob('../_brand.json', { eager: true });
const raw = (Object.values(rawModules)[0] ?? {}) as Record<string, unknown>;

type DtcgValue = string | number | boolean | unknown[] | Record<string, unknown>;
type DtcgNode = { $value: DtcgValue; $type?: string; $description?: string };
type DtcgTree = { [k: string]: DtcgNode | DtcgTree };

function isLeaf(v: unknown): v is DtcgNode {
  return typeof v === 'object' && v !== null && '$value' in v;
}

function getByPath(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function resolveString(value: string, root: unknown, depth = 0): string {
  if (depth > 8) return value;
  return value.replace(/\{([^}]+)\}/g, (_, path: string) => {
    const node = getByPath(root, path);
    if (isLeaf(node)) {
      const v = node.$value;
      return typeof v === 'string' ? resolveString(v, root, depth + 1) : String(v);
    }
    return `{${path}}`;
  });
}

function resolveTree(node: DtcgTree | DtcgNode, root: unknown): unknown {
  if (isLeaf(node)) {
    const v = node.$value;
    return typeof v === 'string' ? resolveString(v, root, 0) : v;
  }
  const out: Record<string, unknown> = {};
  for (const [k, child] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    out[k] = resolveTree(child as DtcgTree | DtcgNode, root);
  }
  return out;
}

const resolved = resolveTree(raw as unknown as DtcgTree, raw) as Record<string, unknown>;

export interface Brand {
  business: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    url: string;
    businessClass: string;
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  color: Record<string, string | number>;
  colorScheme: 'dark' | 'light' | 'auto';
  font: { heading: string; body: string; mono: string; weights: number[]; fluidScale: string };
  radius: Record<string, string>;
  spacing: Record<string, string>;
  shadow: Record<string, string>;
  motion: {
    easing: string;
    duration: { fast: string; base: string; slow: string; scroll: string };
  };
  layout: Record<string, string>;
  social: Record<string, string>;
  features: Record<string, boolean>;
}

// DTCG leaves that shipped UNRESOLVED (e.g. `{BUSINESS_NAME}` never
// substituted) would otherwise surface as "Business"/empty to the customer.
// Fall back per-field so a partially-materialized brand file still shows the
// real business name wherever the workflow DID provide one. (Journey defect
// 2026-08-19: a whole pipeline shipped as "Business" for 2 builds.)
const rawBusiness = (resolved as { business?: Record<string, unknown> }).business ?? {};
const pick = (key: string, fallback: string): string => {
  const v = rawBusiness[key];
  if (typeof v !== 'string') return fallback;
  const t = v.trim();
  // Reject EMPTY and PLACEHOLDER-shaped values: the shipped _brand.json has
  // {BUSINESS_NAME}-style leaves that the DTCG resolver outputs as literal
  // strings — a valid-looking leaf that is NOT real content. (Journey 2026-08-19:
  // a whole build shipped these placeholders live; the worker-side validator
  // caught it, this makes the template side self-healing.)
  if (t.length === 0) return fallback;
  if (/^\{[A-Z_]+\}$/.test(t)) return fallback;
  return t;
};
/**
 * Collapse the `..projectsites.dev` double-dot hostname in a business URL.
 *
 * The build LLM writes the canonical as `https://<slug>..projectsites.dev`
 * (slug already dot-suffixed in its model). Consumers (JSON-LD, OG, canonical)
 * embed `brand.business.url` verbatim, so normalize it at resolution time —
 * template-side self-healing, no LLM compliance involved. Pure.
 *
 * @example
 * normalizeUrl('https://urban-fitness..projectsites.dev/') // → 'https://urban-fitness.projectsites.dev/'
 */
export const normalizeUrl = (u: string): string => {
  const t = (u || '').trim();
  if (!t) return t;
  return t.replace(/\.\.projectsites\.dev/g, '.projectsites.dev');
};
const DEFAULT_NAME = 'Your Business';
const DEFAULTS = {
  name: DEFAULT_NAME,
  shortName: DEFAULT_NAME.slice(0, 12),
  tagline: 'Built for you',
  description: '',
  url: '',
  businessClass: 'organization',
  email: '',
  phone: '',
  address: '',
  hours: '',
};
export const brand: Brand = {
  business: {
    name: pick('name', DEFAULTS.name),
    shortName: pick('shortName', DEFAULTS.shortName),
    tagline: pick('tagline', DEFAULTS.tagline),
    description: pick('description', DEFAULTS.description),
    url: normalizeUrl(pick('url', DEFAULTS.url)),
    businessClass: pick('businessClass', DEFAULTS.businessClass),
    email: pick('email', DEFAULTS.email),
    phone: pick('phone', DEFAULTS.phone),
    address: pick('address', DEFAULTS.address),
    hours: pick('hours', DEFAULTS.hours),
  },
  ...(resolved as Record<string, unknown>),
} as unknown as Brand;

const COLOR_KEYS = [
  'primary', 'primaryHover', 'accent', 'accentHover',
  'background', 'surface', 'surfaceElevated', 'border',
  'text', 'textMuted', 'textSubtle',
  'success', 'warning', 'danger', 'info',
] as const;

const FLUID_TYPE = {
  '5xl': 'clamp(2.5rem, 5vw + 1rem, 5rem)',
  '4xl': 'clamp(2rem, 4vw + 0.75rem, 3.75rem)',
  '3xl': 'clamp(1.75rem, 3vw + 0.5rem, 3rem)',
  '2xl': 'clamp(1.5rem, 2vw + 0.5rem, 2.25rem)',
  xl:    'clamp(1.25rem, 1vw + 1rem, 1.5rem)',
} as const;

export function applyBrand(root: HTMLElement = document.documentElement): void {
  const c = brand.color;

  for (const k of COLOR_KEYS) {
    const v = c[k];
    if (typeof v === 'string') root.style.setProperty(`--color-${kebab(k)}`, v);
  }

  root.style.setProperty('--brand-hue', String(c.brandHue ?? 240));
  root.style.setProperty('--brand-chroma', String(c.brandChroma ?? 0.18));

  root.style.setProperty('--font-heading', `'${brand.font.heading}', system-ui, sans-serif`);
  root.style.setProperty('--font-body',    `'${brand.font.body}', system-ui, sans-serif`);
  root.style.setProperty('--font-mono',    `'${brand.font.mono}', ui-monospace, monospace`);

  for (const [k, v] of Object.entries(brand.radius)) root.style.setProperty(`--radius-${k}`, v);
  for (const [k, v] of Object.entries(brand.spacing)) root.style.setProperty(`--space-${k}`, v);
  for (const [k, v] of Object.entries(brand.shadow))  root.style.setProperty(`--shadow-${k}`, v);
  for (const [k, v] of Object.entries(FLUID_TYPE))    root.style.setProperty(`--text-${k}`, v);

  root.style.setProperty('--ease',         brand.motion.easing);
  root.style.setProperty('--duration-fast',brand.motion.duration.fast);
  root.style.setProperty('--duration-base',brand.motion.duration.base);
  root.style.setProperty('--duration-slow',brand.motion.duration.slow);

  root.style.setProperty('--container-wide',   brand.layout.containerWide);
  root.style.setProperty('--container-normal', brand.layout.containerNormal);
  root.style.setProperty('--container-prose',  brand.layout.containerProse);

  root.style.colorScheme = brand.colorScheme === 'auto' ? 'light dark' : brand.colorScheme;
  root.dataset.theme = brand.colorScheme;
}

function kebab(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function featureOn(key: keyof Brand['features']): boolean {
  return Boolean(brand.features[key]);
}

export function googleFontsHref(): string {
  const fams = [brand.font.heading, brand.font.body, brand.font.mono]
    .filter(Boolean)
    .map((name) => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${brand.font.weights.join(';')}`);
  return `https://fonts.googleapis.com/css2?${fams.join('&')}&display=swap`;
}
