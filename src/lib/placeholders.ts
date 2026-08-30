/**
 * Placeholder scrubbing — the render-time firewall that stops an unresolved
 * generation token (e.g. `{ABOUT_HEADLINE}`, `{HERO_SUBHEADLINE}`,
 * `{ABOUT_IMAGE_URL}`) from ever reaching the DOM.
 *
 * @remarks
 * The template ships every page with literal `{TOKEN}` strings that the AI
 * generation step string-replaces with real copy (see `src/pages/*.tsx`). When
 * that step fails, only partially runs, or a token is simply forgotten, the raw
 * `{TOKEN}` used to render verbatim in the shipped SPA — headings read
 * "{ABOUT_HEADLINE}", bullet lists showed "{ABOUT_BULLET_1}", and an
 * `<img src="{ABOUT_IMAGE_URL}">` fired a guaranteed 404. A whole build shipped
 * this way and scored 2.8/10 (journey 2026-08-20): the good server-rendered
 * shell was overwritten at hydration by these unpopulated tokens.
 *
 * This mirrors the self-healing already done for BRAND data in `src/brand.ts`
 * (`pick()` rejects `{BUSINESS_NAME}`-shaped leaves). Here we do the same for
 * every user-facing PAGE prop, at the section-component boundary, so the fix is
 * template-side and structural — it works on EVERY generated site regardless of
 * how the generation step behaves. Pure functions, no side effects.
 *
 * The contract: a scrubbed placeholder becomes `''` (empty), and every section
 * component already guards its optional text with `{value && <h2>…</h2>}` /
 * `{description && <p>…</p>}`, so an empty string simply HIDES that element
 * instead of printing a token. Images with a placeholder `src` are dropped
 * entirely (via {@link hasRealImage}) so no broken 404 box renders.
 */

/**
 * A generation token that survived to runtime — one of:
 *
 *   - a bare token: `{ABOUT_HEADLINE}`, `{TIER_1_NAME}`
 *   - a token embedded in a wrapper: `https://{ABOUT_IMAGE_URL}`, `— {FOO} —`
 *   - a token with digits/dots: `{FAQ_1_Q}`, `{color.brandHue}`
 *
 * The shipped tokens are ALL-CAPS snake with optional digits (e.g.
 * `ABOUT_STAT_1_VALUE`), plus a few dotted brand refs (`{color.brandHue}`).
 * The pattern is deliberately broad enough to catch both while never matching
 * ordinary prose that happens to contain braces (rare on a marketing site, and
 * caught only when the braces wrap a token-shaped identifier).
 */
const PLACEHOLDER_RE = /\{[A-Za-z][A-Za-z0-9_.]*\}/;

/**
 * Leaked GENERATION-PLAN / INSTRUCTION prose — the second class of junk that
 * must never reach the DOM. Distinct from a `{TOKEN}`: this is real-looking
 * English that is actually the model's own section plan or prompt scaffolding
 * bleeding into user copy.
 *
 * @remarks
 * A whole build shipped with the raw section plan as its hero paragraph AND its
 * `<meta description>`, truncated mid-word: "…Sections: Hero, About our
 * roastery, Services (espresso bar, whol" (journey 2026-08-21, scored 2.2/10).
 * The `{TOKEN}` scrubber missed it because leaked-plan text has no braces — it
 * is ordinary prose. These patterns catch the tells of a plan/instruction leak
 * so the hero falls back to the business name and the meta/subline hide instead.
 *
 * Deliberately narrow — each pattern targets a structural tell of generation
 * scaffolding (a "Sections:" list, "# System"/"# User" prompt headers, "As an
 * AI"/"language model" refusals, a bare "Here is/are the …" preamble), NOT
 * ordinary marketing copy. A real business sentence never opens with these.
 */
const LEAKED_PLAN_RES: readonly RegExp[] = [
  // "Sections: Hero, About, Services…" — the exact leak that shipped.
  /\bsections?\s*:\s*(?:hero|about|services|home|contact|the\b)/i,
  // A plan/outline preamble: "The site will have the following sections", "Here are the sections".
  /\b(?:following|these)\s+sections\b/i,
  /\bhere\s+(?:is|are)\s+the\s+(?:sections?|pages?|plan|content|outline|website|copy)\b/i,
  // Prompt-scaffolding headers that leak from the .prompt.md format.
  /(?:^|\n)\s*#{1,3}\s*(?:system|user|assistant|task|instructions?|output)\b/i,
  /\b(?:you\s+are\s+an?\s+(?:elite|expert|ai|assistant)|as\s+an\s+ai|language\s+model)\b/i,
  // A meta narration of the build rather than the business.
  /\b(?:this\s+(?:website|site|page)\s+(?:will|should)\s+(?:have|include|contain|feature))\b/i,
];

/**
 * True when a value looks like leaked generation-plan / prompt-instruction prose
 * (see {@link LEAKED_PLAN_RES}). Used alongside the `{TOKEN}` check so both
 * classes of junk are firewalled at the same boundary.
 *
 * @param value - the candidate string (any type accepted for ergonomics)
 * @returns whether the value reads as a leaked plan / instruction
 *
 * @example
 * isLeakedPlanText('Sections: Hero, About our roastery, Services (espresso') // → true
 * isLeakedPlanText('# System\nYou are an elite web designer')                 // → true
 * isLeakedPlanText('Small-batch coffee roasted in Asheville since 2009')      // → false
 */
export function isLeakedPlanText(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return LEAKED_PLAN_RES.some((re) => re.test(value));
}

/**
 * True when a value is an unresolved generation placeholder that must not reach
 * the DOM — EITHER a `{TOKEN}` OR leaked generation-plan / instruction prose.
 *
 * A value is a placeholder when it is a string that is EITHER exactly a single
 * token (optionally surrounded by whitespace) OR contains a token anywhere OR
 * reads as leaked plan/instruction text. `null`/`undefined`/non-strings are not
 * placeholders (callers pass those through to their own defaults).
 *
 * @param value - the candidate string (any type accepted for ergonomics)
 * @returns whether the value is (or contains) an unresolved `{TOKEN}` or leaked plan text
 *
 * @example
 * isPlaceholder('{ABOUT_HEADLINE}')            // → true
 * isPlaceholder('https://{ABOUT_IMAGE_URL}')   // → true (embedded)
 * isPlaceholder('Sections: Hero, About, Serv') // → true (leaked plan)
 * isPlaceholder('Fresh sourdough, daily')      // → false
 * isPlaceholder('')                            // → false (empty, not a token)
 * isPlaceholder(undefined)                     // → false
 */
export function isPlaceholder(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return PLACEHOLDER_RE.test(value) || isLeakedPlanText(value);
}

/**
 * Scrub a single text prop: return the real string, or `fallback` when the
 * value is an unresolved placeholder / empty / non-string.
 *
 * Pass no `fallback` (default `''`) for OPTIONAL text — the section component's
 * own `{value && …}` guard then hides the element. Pass a real fallback for
 * text that must always render (e.g. a CTA label, a hero headline).
 *
 * @param value - the candidate string
 * @param fallback - what to return when `value` is a placeholder/empty (default `''`)
 * @returns the trimmed real value, or `fallback`
 *
 * @example
 * scrubText('{ABOUT_HEADLINE}')                 // → ''  (hidden by caller guard)
 * scrubText('{HERO_CTA}', 'Get started')        // → 'Get started'
 * scrubText('  Real copy  ')                    // → 'Real copy'
 * scrubText(undefined, 'Learn more')            // → 'Learn more'
 */
export function scrubText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (trimmed.length === 0) return fallback;
  if (isPlaceholder(trimmed)) return fallback;
  return trimmed;
}

/**
 * Guarantee a meta description in the SEO sweet spot (120–156 chars) — the
 * `meta.description_length` build invariant. Generation reliably fills a rich
 * HOMEPAGE description but often ships SHORT sub-page ones (`{ABOUT_META_DESCRIPTION}`
 * etc. land 70–118 chars). When the (already-scrubbed) description is under 120,
 * this pads it with REAL brand copy only — the tagline, then "serving <City>"
 * parsed from the address, then a neutral CTA — never a fabricated claim — and
 * clamps to ≤156 at a word boundary. A description already ≥120 is returned as-is
 * (only clamped if it somehow exceeds 156). Mirrors the live local-SEO title
 * padding lever. Pure — same inputs, same output.
 *
 * @param description - the scrubbed page description (may be short)
 * @param business - brand business fields (`name`, `tagline`, `address`)
 * @returns a description whose length is in [120, 156] whenever any real brand copy exists
 * @example
 * fitMetaDescription('About our team.', { name: 'Cedar Ridge', tagline: '', address: '..., Boise, ID' })
 * // → 'About our team. Proudly serving Boise and the surrounding area. Learn more about Cedar Ridge…'
 */
export function fitMetaDescription(
  description: string,
  business: { name?: string; tagline?: string; address?: string },
): string {
  const MIN = 120;
  const MAX = 156;
  const clampMax = (s: string): string => {
    if (s.length <= MAX) return s;
    const cut = s.slice(0, MAX);
    const sp = cut.lastIndexOf(' ');
    return sp > MIN - 2 ? cut.slice(0, sp) : cut;
  };

  let d = (description || '').trim();
  if (d.length >= MIN) return clampMax(d);

  const city = business.address ? (business.address.split(',')[1] || '').trim() : '';
  const pads = [
    (business.tagline || '').trim(),
    city ? `Proudly serving ${city} and the surrounding area.` : '',
    business.name ? `Learn more about ${business.name} and get in touch today.` : '',
    // Long neutral last-resort so a minimal brand (no tagline, no address) still
    // clears the 120 floor from a short base + name alone.
    'Get in touch with our team today to learn more about our services and how we can help you.',
  ].filter((s): s is string => s.length > 0);

  for (const pad of pads) {
    if (d.length >= MIN) break;
    if (d.includes(pad)) continue;
    const prefix = d.length === 0 ? '' : /[.!?]$/.test(d) ? ' ' : '. ';
    // Append token-by-token so we approach — but never overshoot — MAX. STOP at
    // the first word that won't fit (break, not skip) — skipping an interior word
    // while keeping its spaces produced broken grammar + a double space
    // ("…and the  area." instead of "…and the surrounding area.").
    for (const tok of (prefix + pad).split(/(\s+)/)) {
      if (d.length >= MAX) break;
      if ((d + tok).length <= MAX) d += tok;
      else break;
    }
  }

  // Collapse any stray double space, then strip a dangling trailing connector
  // ("…serving Portland and the") left when a pad was cut mid-phrase, so a
  // partially-appended pad always ends on a real word.
  d = d
    .replace(/\s{2,}/g, ' ')
    .replace(/[\s,;:-]+$/, '')
    .replace(/(?:\s+(?:and|the|a|an|of|to|for|with|in|on|at|or|&|but))+$/i, '');
  d = clampMax(d);
  if (!/[.!?]$/.test(d) && d.length < MAX) d += '.';
  return d;
}

/**
 * Scrub an array of text values, dropping every entry that is an unresolved
 * placeholder / empty / non-string. Preserves order of the survivors.
 *
 * Use for bullet lists, feature arrays, and any repeated text where a partial
 * generation should show the real items and silently omit the unfilled ones —
 * never render a `{ABOUT_BULLET_2}` next to real copy.
 *
 * @param values - candidate strings (undefined → treated as empty list)
 * @returns the real, trimmed strings only
 *
 * @example
 * scrubList(['Licensed & insured', '{ABOUT_BULLET_2}', 'Same-day quotes'])
 * // → ['Licensed & insured', 'Same-day quotes']
 * scrubList(['{ABOUT_BULLET_1}', '{ABOUT_BULLET_2}'])   // → []
 */
export function scrubList(values: readonly unknown[] | undefined | null): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    const s = scrubText(v);
    if (s) out.push(s);
  }
  return out;
}

/**
 * True when an image `src` is a real, renderable source — NOT an unresolved
 * placeholder and not empty. Gate every `<img>` on this so a `{ABOUT_IMAGE_URL}`
 * (or empty `src`) never fires a 404 / renders a broken image box.
 *
 * @param src - the candidate image URL/path
 * @returns whether it is safe to render an `<img src>` for this value
 *
 * @example
 * hasRealImage('/images/team.jpg')      // → true
 * hasRealImage('{ABOUT_IMAGE_URL}')     // → false → drop the <img>
 * hasRealImage('')                      // → false
 * hasRealImage(undefined)               // → false
 */
export function hasRealImage(src: unknown): src is string {
  if (typeof src !== 'string') return false;
  const t = src.trim();
  if (t.length === 0) return false;
  return !isPlaceholder(t);
}

/**
 * Scrub an `{ src, alt }` image descriptor. Returns the descriptor unchanged
 * (with a guaranteed non-placeholder `alt`) when the `src` is real, or
 * `undefined` when the `src` is a placeholder/empty — signalling the caller to
 * render NO image at all.
 *
 * @param image - the image descriptor, or undefined
 * @param fallbackAlt - alt text to use if the provided alt is itself a placeholder
 * @returns a safe descriptor, or `undefined` to render nothing
 *
 * @example
 * scrubImage({ src: '{ABOUT_IMAGE_URL}', alt: '{ABOUT_IMAGE_ALT}' })
 * // → undefined  (render no <img> — avoids the 404)
 * scrubImage({ src: '/team.jpg', alt: '{ABOUT_IMAGE_ALT}' }, 'Our team')
 * // → { src: '/team.jpg', alt: 'Our team' }
 */
export function scrubImage(
  image: { src: string; alt: string } | undefined | null,
  fallbackAlt = '',
): { src: string; alt: string } | undefined {
  if (!image || !hasRealImage(image.src)) return undefined;
  return { src: image.src.trim(), alt: scrubText(image.alt, fallbackAlt) };
}
