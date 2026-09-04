# Brand Reference

Complete reference for `_brand.json` — the single source of truth.

## File location

`_brand.json` at the repo root. Never move it; `src/brand.ts` imports it with a relative path.

## Format

W3C Design Tokens Community Group spec, v2025.10. Every leaf node has `$value`, optional `$type`, and optional `$description`. Aliases use `{path.to.token}` syntax; the resolver in `src/brand.ts` substitutes them recursively.

## Top-level keys

```
business      identity (name, contact, hours, etc.)
color         OKLCH palette + master hue/chroma
colorScheme   "dark" | "light" | "auto"
themeStyle    visual personality preset (classic|editorial|warm|luxe|brutalist)
font          Google Fonts names + weights + scale strategy
radius        border-radius scale
spacing       8pt spacing scale
shadow        elevation system
motion        easing + duration scale
layout        container widths
social        social profile URLs
features      homepage section kill-switches
```

## business.*

| Key | Type | Description | Constraints |
| --- | --- | --- | --- |
| `name` | string | Full display name | 15–40 chars |
| `shortName` | string | Used in PWA install + nav | 4–12 chars |
| `tagline` | string | Eyebrow line above H1 | 3–5 words |
| `description` | string | Meta description | 120–156 chars HARD |
| `url` | string | Canonical URL | https, no trailing slash |
| `businessClass` | string | Schema.org type selector | enum below |
| `email` | string | Primary contact email | valid email |
| `phone` | string | Primary contact phone | E.164 format (+12025550100) |
| `address` | string | Physical address | one line, comma-separated |
| `hours` | string | Opening hours display | human-readable line |

### `businessClass` enum

| Value | Schema.org `@type` | Local? |
| --- | --- | --- |
| `storefront` | `LocalBusiness` | ✅ |
| `restaurant` | `Restaurant` | ✅ |
| `medical` | `MedicalBusiness` | ✅ |
| `retail` | `Store` | ✅ |
| `salon` | `BeautySalon` | ✅ |
| `gym` | `ExerciseGym` | ✅ |
| `auto-repair` | `AutoRepair` | ✅ |
| `saas` | `SoftwareApplication` | ❌ |
| `portfolio` | `Organization` | ❌ |
| `nonprofit` | `NGO` | ❌ |
| `legal` | `LegalService` | ❌ |
| `organization` | `Organization` | ❌ |

Local businesses get additional schema fields: `geo`, `openingHoursSpecification`, `priceRange`. Pass them on the homepage via the optional `BusinessProfile` shape in `src/lib/businessSchema.ts`.

## color.*

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `brandHue` | number (0–360) | `240` | Master OKLCH hue. Rotate to reskin. |
| `brandChroma` | number (0.05–0.30) | `0.18` | Saturation. 0.05=pastel, 0.30=vivid. |
| `primary` | color | `oklch(0.62 …)` | Brand action color |
| `primaryHover` | color | `oklch(0.56 …)` | Primary hover state |
| `accent` | color | `oklch(0.85 0.18 195)` | Highlight — kept distinct from primary |
| `accentHover` | color | `oklch(0.78 …)` | Accent hover state |
| `background` | color | `oklch(0.08 …)` | Page bg |
| `surface` | color | `oklch(0.12 …)` | Cards, panels |
| `surfaceElevated` | color | `oklch(0.16 …)` | Elevated panels |
| `border` | color | `oklch(0.22 …)` | Borders + dividers |
| `text` | color | `oklch(0.97 …)` | Primary text |
| `textMuted` | color | `oklch(0.65 …)` | Secondary text |
| `textSubtle` | color | `oklch(0.45 …)` | Tertiary text |
| `success` | color | `oklch(0.74 0.16 152)` | Green |
| `warning` | color | `oklch(0.82 0.16 85)` | Amber |
| `danger` | color | `oklch(0.66 0.22 28)` | Red |
| `info` | color | `oklch(0.72 0.15 235)` | Blue |

### How the cascade works

`primary` references `brandChroma` and `brandHue`:

```
primary = oklch(0.62 {color.brandChroma} {color.brandHue})
```

So changing `brandHue: 240` → `190` recomputes `primary` from `oklch(0.62 0.18 240)` to `oklch(0.62 0.18 190)` — the brand turns from blue to teal. The same applies to `background`, `surface`, `border`, `text`, `textMuted`, `textSubtle`.

`accent` is independent (`oklch(0.85 0.18 195)`) so you can pick a complementary highlight that doesn't shift with the brand hue. Set `accent` to `oklch(0.85 0.18 {color.brandHue})` if you want it to track.

### OKLCH lightness conventions

The template uses these lightness values as anchors:

| Role | L value |
| --- | --- |
| Page bg | 0.08 |
| Surface | 0.12 |
| Elevated | 0.16 |
| Border | 0.22 |
| Text subtle | 0.45 |
| Text muted | 0.65 |
| Text primary | 0.97 |
| Primary | 0.62 (slightly bright) |
| Accent | 0.85 (very bright) |

These are designed for a **dark-first** palette. For light mode, the `[data-theme='light']` block in `src/index.css` inverts these (background becomes `0.99`, text becomes `0.18`, etc.).

## colorScheme

```jsonc
{ "colorScheme": { "$value": "dark" } }   // or "light" or "auto"
```

- `dark` — always dark
- `light` — always light
- `auto` — follows `prefers-color-scheme`

The user can override at runtime via the `ThemeToggle` in the header. Their choice persists in `localStorage` under `projectsites:theme`.

## themeStyle

```jsonc
{ "themeStyle": { "$value": "editorial" } }   // classic | editorial | warm | luxe | brutalist
```

The site's visual **personality** — a preset that supplies the font pairing, radius scale, shadow character, motion curve, and a matching decorative flourish (`src/themePresets.ts`). It is the biggest lever against every generated site looking identical; `colorScheme` controls light/dark, `themeStyle` controls the whole feel.

- `classic` — saas, tech, auto, general modern (Space Grotesk/Inter — geometric)
- `editorial` — legal, medical, nonprofit, consulting (Fraunces serif — trustworthy)
- `warm` — restaurant, salon, gym, wellness, family (Poppins — rounded, inviting)
- `luxe` — fine dining, high-end retail, real-estate, hospitality (Playfair — refined)
- `brutalist` — creative agency, portfolio, events, bold brands (Archivo — hard-edged)

Precedence: the preset is the BASE; any `font`/`radius`/`shadow`/`motion` value you set explicitly in `_brand.json` still wins per-key. Omit those groups to let the preset drive them. Absent → `classic` (the historical default). `applyBrand()` stamps `:root[data-style="…"]` for the flourish layer.

## font.*

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | string | `Space Grotesk` | Display font (any Google Font name) |
| `body` | string | `Inter` | Body font |
| `mono` | string | `JetBrains Mono` | Mono font |
| `weights` | number[] | `[300,400,500,600,700,800,900]` | Weights to load |
| `fluidScale` | string | `clamp` | `clamp` \| `step` \| `fixed` |

After changing font names in `_brand.json`, also update the Google Fonts URL in `index.html`:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=YOUR+HEADING:wght@400;500;600;700&family=YOUR+BODY:wght@300;400;500;600;700&display=swap" />
```

Or call `googleFontsHref()` from `src/brand.ts` if you wire up a build-time HTML transform.

## radius / spacing / shadow

Standard scales. Tokens map to Tailwind utilities — e.g. `--radius-md` → `rounded-md`. Edit values to change the global shape language (sharper = `0.25rem`, rounder = `1.5rem` baseline).

## motion.*

```jsonc
{
  "easing":   { "$value": "cubic-bezier(0.16, 1, 0.3, 1)" },  // expo-out
  "duration": {
    "fast":   { "$value": "150ms" },
    "base":   { "$value": "250ms" },
    "slow":   { "$value": "450ms" },
    "scroll": { "$value": "1200ms" }
  }
}
```

Easing is the template's signature curve — fast accel, smooth decel. Change to `cubic-bezier(0.4, 0, 0.2, 1)` for more standard material-style motion.

## layout.*

```jsonc
{
  "containerWide":   { "$value": "80rem" },  // 1280px — hero, bento
  "containerNormal": { "$value": "64rem" },  // 1024px — cards, sections
  "containerProse":  { "$value": "42rem" }   // 672px — blog post body
}
```

Used via `max-w-container-wide` etc. in Tailwind.

## social.*

```jsonc
{
  "facebook":  { "$value": "https://facebook.com/yourpage" },
  "instagram": { "$value": "https://instagram.com/yourpage" },
  "linkedin":  { "$value": "https://linkedin.com/company/yourpage" },
  "twitter":   { "$value": "https://twitter.com/yourpage" },
  "youtube":   { "$value": "https://youtube.com/@yourpage" },
  "tiktok":    { "$value": "https://tiktok.com/@yourpage" },
  "github":    { "$value": "https://github.com/yourorg" }
}
```

Read by `src/components/SocialLinks.tsx` and `Footer.tsx`. Empty string = link hidden.

## features.*

Boolean kill-switches for entire homepage sections. Read via `featureOn(key)`:

| Flag | Default | Section it controls |
| --- | --- | --- |
| `hero` | `true` | Hero block on `/` |
| `bento` | `true` | BentoGrid features section |
| `stats` | `true` | Animated stats rollup |
| `services` | `true` | Services grid (on `/services` page always) |
| `process` | `false` | Numbered "how it works" steps |
| `testimonials` | `true` | Testimonials grid |
| `logoCloud` | `false` | Partner / client logo marquee |
| `pricing` | `false` | Pricing tier table |
| `faq` | `true` | FAQ accordion (emits FAQPage JSON-LD — **always recommended**) |
| `blog` | `false` | Blog preview |
| `team` | `false` | Team grid preview |
| `caseStudies` | `false` | Case study preview |
| `newsletter` | `true` | Newsletter signup block |
| `cta` | `true` | Closing CTA section |

`/pricing`, `/blog`, `/team`, `/case-studies` pages render regardless of flag. The flag only controls whether the **homepage preview block** appears.

## Recipes

### Make the brand teal-and-coral

```jsonc
{
  "color": {
    "brandHue":    { "$value": "180" },
    "brandChroma": { "$value": "0.20" },
    "accent":      { "$value": "oklch(0.75 0.20 25)" }   // coral
  }
}
```

### Switch to light mode by default

```jsonc
{ "colorScheme": { "$value": "light" } }
```

The `[data-theme='light']` block in `src/index.css` inverts the OKLCH ramp (text gets dark, bg gets light) using the same `brandHue`.

### Use a serif heading font

```jsonc
{
  "font": {
    "heading": { "$value": "Playfair Display" },
    "body":    { "$value": "Inter" }
  }
}
```

Then update `index.html` to load Playfair Display from Google Fonts.

### Pastel SaaS look

```jsonc
{
  "color": {
    "brandHue":    { "$value": "270" },
    "brandChroma": { "$value": "0.10" }
  },
  "colorScheme": { "$value": "light" }
}
```

### Editorial / brutalist tone

```jsonc
{
  "radius": {
    "sm":  { "$value": "0px" },
    "md":  { "$value": "0px" },
    "lg":  { "$value": "0px" },
    "xl":  { "$value": "0px" },
    "2xl": { "$value": "0px" }
  },
  "font": {
    "heading": { "$value": "Space Mono" },
    "body":    { "$value": "Geist Mono" }
  }
}
```

## Validation

The template ships without a JSON schema validator. To add one:

1. Install `ajv` + `ajv-formats`
2. Generate a schema from the `Brand` interface in `src/brand.ts` (e.g. via `ts-json-schema-generator`)
3. Add an npm script `validate:brand` that runs `ajv validate -s schema.json -d _brand.json`
4. Wire into `pre-commit` via lefthook

This is intentionally **not in v3.0** to keep the install footprint minimal. Add if you ship 10+ brand variants.
