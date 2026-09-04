/**
 * Theme style presets — cohesive visual PERSONALITIES for generated sites.
 *
 * The token system in `_brand.json` varies COLOR per business (OKLCH hue/chroma),
 * but every site otherwise shared ONE look: the same font pairing, radius scale,
 * shadow character, and motion curve. That made generated sites feel same-y no
 * matter the vertical.
 *
 * A `themeStyle` picks one of the personalities below. `src/brand.ts` uses the
 * chosen preset as the BASE for `font`/`radius`/`shadow`/`motion` (a per-key
 * `_brand.json` value still wins, so source-extracted fonts are never clobbered),
 * and `applyBrand()` stamps `:root[data-style="<preset>"]` so `index.css` can add
 * a matching decorative flourish. `classic` reproduces the historical default
 * verbatim, so a build that omits `themeStyle` looks EXACTLY as before.
 *
 * Pure data + one pure resolver. Never throws — an unknown name degrades to
 * `classic` so a bad LLM value can never break a build.
 */

/** A cohesive font pairing. All families are Google Fonts with wide weight ranges. */
export interface PresetFont {
  readonly heading: string;
  readonly body: string;
  readonly mono: string;
}

/** Border-radius scale (rem strings + `full`). */
export interface PresetRadius {
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly '2xl': string;
  readonly full: string;
}

/** Elevation shadows + the accent `glow`. */
export interface PresetShadow {
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly glow: string;
}

/** Motion easing + the four named durations. */
export interface PresetMotion {
  readonly easing: string;
  readonly duration: { readonly fast: string; readonly base: string; readonly slow: string; readonly scroll: string };
}

/** One complete visual personality. */
export interface ThemePreset {
  /** Human label for the admin / research prompt. */
  readonly label: string;
  /** One-line "when to use" for the generation prompt. */
  readonly when: string;
  readonly font: PresetFont;
  readonly radius: PresetRadius;
  readonly shadow: PresetShadow;
  readonly motion: PresetMotion;
}

const MONO = 'JetBrains Mono';

/**
 * The preset registry. `classic` MUST stay byte-identical to the historical
 * `DEFAULT_BRAND` in `brand.ts` so an unset `themeStyle` is a no-op.
 */
export const THEME_PRESETS = {
  /** Modern, techy, geometric — the historical default. saas · tech · portfolio · auto. */
  classic: {
    label: 'Classic',
    when: 'saas, tech, auto-repair, general modern brands — geometric + confident',
    font: { heading: 'Space Grotesk', body: 'Inter', mono: MONO },
    radius: { sm: '0.375rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', full: '9999px' },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.25)',
      md: '0 4px 12px -2px rgb(0 0 0 / 0.35)',
      lg: '0 12px 32px -8px rgb(0 0 0 / 0.45)',
      glow: '0 0 40px -8px oklch(0.85 0.18 195 / 0.35)',
    },
    motion: { easing: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: { fast: '150ms', base: '250ms', slow: '450ms', scroll: '1200ms' } },
  },

  /** Serif headlines, generous rhythm, restrained shadows — trustworthy + literary. legal · medical · nonprofit · organization. */
  editorial: {
    label: 'Editorial',
    when: 'legal, medical, nonprofit, organization, consulting — trustworthy, calm, magazine-grade',
    font: { heading: 'Fraunces', body: 'Inter', mono: MONO },
    radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.25rem', full: '9999px' },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.18)',
      md: '0 6px 18px -6px rgb(0 0 0 / 0.28)',
      lg: '0 18px 44px -14px rgb(0 0 0 / 0.38)',
      glow: '0 0 32px -10px oklch(0.85 0.14 var(--brand-hue) / 0.28)',
    },
    motion: { easing: 'cubic-bezier(0.22, 1, 0.36, 1)', duration: { fast: '180ms', base: '320ms', slow: '560ms', scroll: '1400ms' } },
  },

  /** Rounded humanist type, big radii, soft diffuse light — inviting + friendly. restaurant · salon · gym · wellness · community. */
  warm: {
    label: 'Warm',
    when: 'restaurant, salon, gym, wellness, community, kids/family — inviting, soft, approachable',
    font: { heading: 'Poppins', body: 'Nunito Sans', mono: MONO },
    radius: { sm: '0.625rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '2.5rem', full: '9999px' },
    shadow: {
      sm: '0 2px 6px -1px rgb(0 0 0 / 0.18)',
      md: '0 8px 24px -6px rgb(0 0 0 / 0.28)',
      lg: '0 20px 52px -14px rgb(0 0 0 / 0.36)',
      glow: '0 0 56px -10px oklch(0.85 0.16 var(--brand-hue) / 0.40)',
    },
    motion: { easing: 'cubic-bezier(0.34, 1.4, 0.5, 1)', duration: { fast: '160ms', base: '280ms', slow: '500ms', scroll: '1300ms' } },
  },

  /** High-contrast serif display, tight radii, deep low shadows — refined + premium. fine dining · high-end retail · real-estate · hospitality. */
  luxe: {
    label: 'Luxe',
    when: 'fine dining, high-end retail, real-estate, hospitality, jewelry — refined, premium, editorial-elegant',
    font: { heading: 'Playfair Display', body: 'Inter', mono: MONO },
    radius: { sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.5rem', '2xl': '0.75rem', full: '9999px' },
    shadow: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.30)',
      md: '0 10px 30px -10px rgb(0 0 0 / 0.45)',
      lg: '0 28px 64px -20px rgb(0 0 0 / 0.55)',
      glow: '0 0 48px -12px oklch(0.86 0.10 var(--brand-hue) / 0.30)',
    },
    motion: { easing: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: { fast: '200ms', base: '400ms', slow: '700ms', scroll: '1600ms' } },
  },

  /** Heavy grotesk, near-zero radius, hard offset shadows, snappy motion — bold + confident. creative agency · portfolio · events · streetwear. */
  brutalist: {
    label: 'Brutalist',
    when: 'creative agency, portfolio, events, streetwear, bold modern brands — high-impact, editorial-bold',
    font: { heading: 'Archivo', body: 'Inter', mono: MONO },
    radius: { sm: '0', md: '0', lg: '0.125rem', xl: '0.25rem', '2xl': '0.25rem', full: '9999px' },
    shadow: {
      sm: '2px 2px 0 0 rgb(0 0 0 / 0.55)',
      md: '5px 5px 0 0 rgb(0 0 0 / 0.55)',
      lg: '9px 9px 0 0 rgb(0 0 0 / 0.55)',
      glow: '0 0 0 2px oklch(0.85 0.18 195 / 0.55)',
    },
    motion: { easing: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: { fast: '110ms', base: '190ms', slow: '300ms', scroll: '900ms' } },
  },
} as const satisfies Record<string, ThemePreset>;

/** Union of valid preset names. */
export type PresetName = keyof typeof THEME_PRESETS;

/** All preset names, for validation + prompt enumeration. */
export const PRESET_NAMES = Object.keys(THEME_PRESETS) as PresetName[];

/** The safe fallback personality. */
export const DEFAULT_PRESET: PresetName = 'classic';

/**
 * Resolve a (possibly untrusted) style name to a preset. Never throws.
 *
 * @param name - A candidate style name from `_brand.json.themeStyle` (any type).
 * @returns The matching {@link ThemePreset}, or the `classic` preset for any
 *   unknown / empty / non-string input.
 *
 * @example
 * resolvePreset('warm').font.heading   // → 'Poppins'
 * resolvePreset('nope').label          // → 'Classic'
 * resolvePreset(undefined).label       // → 'Classic'
 */
export function resolvePreset(name: unknown): ThemePreset {
  if (typeof name === 'string') {
    const key = name.trim().toLowerCase();
    if (key in THEME_PRESETS) return THEME_PRESETS[key as PresetName];
  }
  return THEME_PRESETS[DEFAULT_PRESET];
}

/**
 * Normalize a candidate style name to a valid {@link PresetName}.
 *
 * @param name - A candidate style name (any type).
 * @returns The matching preset name, or `classic` for anything invalid.
 *
 * @example
 * normalizePresetName('LUXE')  // → 'luxe'
 * normalizePresetName('')      // → 'classic'
 */
export function normalizePresetName(name: unknown): PresetName {
  if (typeof name === 'string') {
    const key = name.trim().toLowerCase();
    if (key in THEME_PRESETS) return key as PresetName;
  }
  return DEFAULT_PRESET;
}
