# Prompt — Brand from description

Generate a complete `_brand.json` from a business description. Outputs the JSON only; no page edits.

## Use this when

- You have a business brief but want to populate `_brand.json` first, then run a separate copy pass
- You're A/B-testing brand palettes (run this 3-5 times with different "vibe" hints)
- You're seeding a programmatic generator that produces dozens of sites

## The prompt

--- PROMPT START ---

You generate `_brand.json` files for `projectsites-template@3.1.0` (W3C DTCG format).

Given the business description that follows, produce a complete `_brand.json` matching the schema below. Output ONLY the JSON. No commentary, no markdown fences — just the JSON.

## Schema (copy structure exactly)

```jsonc
{
  "$schema": "https://schemas.designtokens.org/2025-10",
  "$description": "Brand source-of-truth.",
  "business": {
    "name": { "$value": "..." },
    "shortName": { "$value": "..." },
    "tagline": { "$value": "..." },
    "description": { "$value": "..." },
    "url": { "$value": "https://..." },
    "businessClass": { "$value": "..." },
    "email": { "$value": "..." },
    "phone": { "$value": "..." },
    "address": { "$value": "..." },
    "hours": { "$value": "..." }
  },
  "color": {
    "brandHue":    { "$value": "..." },
    "brandChroma": { "$value": "..." },
    "primary":     { "$value": "oklch(0.62 {color.brandChroma} {color.brandHue})" },
    "primaryHover":{ "$value": "oklch(0.56 {color.brandChroma} {color.brandHue})" },
    "accent":      { "$value": "..." },
    "accentHover": { "$value": "..." },
    "background":  { "$value": "..." },
    "surface":     { "$value": "..." },
    "surfaceElevated": { "$value": "..." },
    "border":      { "$value": "..." },
    "text":        { "$value": "..." },
    "textMuted":   { "$value": "..." },
    "textSubtle":  { "$value": "..." },
    "success":     { "$value": "..." },
    "warning":     { "$value": "..." },
    "danger":      { "$value": "..." },
    "info":        { "$value": "..." }
  },
  "colorScheme": { "$value": "dark|light|auto" },
  "themeStyle": { "$value": "classic|editorial|warm|luxe|brutalist" },
  "font": {
    "heading":    { "$value": "Google Font name" },
    "body":       { "$value": "Google Font name" },
    "mono":       { "$value": "Google Font name" },
    "weights":    { "$value": [400,500,600,700,800] },
    "fluidScale": { "$value": "clamp" }
  },
  "radius":  { "sm": { "$value": "..." }, "md": { "$value": "..." }, "lg": { "$value": "..." }, "xl": { "$value": "..." }, "2xl": { "$value": "..." }, "full": { "$value": "..." } },
  "spacing": { "0": { "$value": "0" }, "1": { "$value": "0.25rem" }, "2": { "$value": "0.5rem" }, "3": { "$value": "0.75rem" }, "4": { "$value": "1rem" }, "6": { "$value": "1.5rem" }, "8": { "$value": "2rem" }, "12": { "$value": "3rem" }, "16": { "$value": "4rem" }, "24": { "$value": "6rem" }, "32": { "$value": "8rem" } },
  "shadow":  { "sm": { "$value": "..." }, "md": { "$value": "..." }, "lg": { "$value": "..." }, "glow": { "$value": "..." } },
  "motion":  { "easing": { "$value": "cubic-bezier(0.16, 1, 0.3, 1)" }, "duration": { "fast": { "$value": "150ms" }, "base": { "$value": "250ms" }, "slow": { "$value": "450ms" }, "scroll": { "$value": "1200ms" } } },
  "layout":  { "containerWide": { "$value": "80rem" }, "containerNormal": { "$value": "64rem" }, "containerProse": { "$value": "42rem" } },
  "social":  { "facebook": { "$value": "" }, "instagram": { "$value": "" }, "linkedin": { "$value": "" }, "twitter": { "$value": "" }, "youtube": { "$value": "" }, "tiktok": { "$value": "" }, "github": { "$value": "" } },
  "features": {
    "hero": { "$value": true }, "bento": { "$value": ... }, "stats": { "$value": ... }, "services": { "$value": ... },
    "process": { "$value": ... }, "testimonials": { "$value": ... }, "logoCloud": { "$value": ... },
    "pricing": { "$value": ... }, "faq": { "$value": true }, "blog": { "$value": ... }, "team": { "$value": ... },
    "caseStudies": { "$value": ... }, "newsletter": { "$value": ... }, "cta": { "$value": true }
  }
}
```

## Picking values

### `businessClass`

Pick one: `storefront | restaurant | medical | retail | salon | gym | auto-repair | saas | portfolio | nonprofit | legal | organization`. Mapping:

- Food/drink → `restaurant`
- Doctor/dentist/clinic → `medical`
- Lawyer → `legal`
- 501(c)(3) → `nonprofit`
- DTC brand → `retail`
- B2B software → `saas`
- Solo designer/dev/photographer → `portfolio`
- Plumber/electrician/HVAC → `storefront` (or specific subtype if you embed extra schema)
- Multi-person consultancy → `organization`

### `color.brandHue` + `color.brandChroma`

| Industry | Hue | Chroma | Mode |
| --- | --- | --- | --- |
| Bakery / café / restaurant | 20–40 | 0.18–0.24 | light |
| Hospitality / hotel | 30–60 | 0.10–0.16 | light |
| Health / nonprofit / wellness | 110–150 | 0.16–0.20 | light |
| Spa / organic | 150–180 | 0.14–0.18 | light |
| SaaS / dev tools | 200–260 | 0.18–0.22 | dark |
| Legal / finance / insurance | 210–240 | 0.08–0.14 | light |
| Premium / luxury SaaS / AI | 260–290 | 0.16–0.22 | dark |
| Beauty / fashion / creative | 290–340 | 0.16–0.22 | light or dark |
| DTC food / lifestyle / romance | 340–360 | 0.18–0.22 | light |

Pick a specific number from the range. Note the precise number reflects the brand's positioning (e.g. 25 = warm orange/coffee, 35 = amber/honey, 45 = mustard/gold).

### `color.accent`

Set this to a complementary OKLCH that contrasts with `primary` — typically 90-180° away on the hue wheel. Default: `oklch(0.85 0.18 195)` (cyan) for most dark-mode SaaS; `oklch(0.65 0.18 40)` (warm orange) for cool-blue brands.

### Light vs dark mode color values

Dark mode (use `oklch(0.08 0.02 {hue})` for background, `oklch(0.97 0.005 {hue})` for text):
```
background:       oklch(0.08 0.02 {color.brandHue})
surface:          oklch(0.12 0.02 {color.brandHue})
surfaceElevated:  oklch(0.16 0.02 {color.brandHue})
border:           oklch(0.22 0.02 {color.brandHue})
text:             oklch(0.97 0.005 {color.brandHue})
textMuted:        oklch(0.65 0.01 {color.brandHue})
textSubtle:       oklch(0.45 0.01 {color.brandHue})
```

Light mode (invert lightness):
```
background:       oklch(0.99 0.005 {color.brandHue})
surface:          oklch(0.97 0.01 {color.brandHue})
surfaceElevated:  oklch(0.94 0.01 {color.brandHue})
border:           oklch(0.88 0.02 {color.brandHue})
text:             oklch(0.18 0.02 {color.brandHue})
textMuted:        oklch(0.42 0.01 {color.brandHue})
textSubtle:       oklch(0.58 0.01 {color.brandHue})
```

### Fonts

Pick from Google Fonts. Curated pairings by industry:

- Tech / SaaS: `Inter Tight` (heading) + `Inter` (body)
- Bakery / hospitality: `Playfair Display` + `Inter`
- Legal / finance: `Cormorant Garamond` + `Lora`
- Editorial / fashion: `Archivo Black` + `Archivo`
- Brutalist / dev tools: `Space Grotesk` + `JetBrains Mono`
- Portfolio / creative: `Cabinet Grotesk` + `Satoshi`
- Wellness / health: `Crimson Pro` + `Inter`
- Default fallback: `Space Grotesk` + `Inter`

### `themeStyle` (visual personality — ALWAYS set)

The single biggest lever against every generated site looking identical. It bundles font pairing + radius + shadow + motion + a matching flourish. Pick the personality that fits the business:

- `classic` — saas, tech, auto-repair, general modern (geometric, confident)
- `editorial` — legal, medical, dental, nonprofit, consulting (serif, calm, trustworthy)
- `warm` — restaurant, salon, gym, wellness, family/kids (rounded, soft, inviting)
- `luxe` — fine dining, high-end retail, real-estate, hospitality, jewelry (refined serif, premium)
- `brutalist` — creative agency, portfolio, events, streetwear, bold brands (high-impact, hard-edged)

The font pairings above are already personality-aligned, so keep them OR omit the `font`/`radius` groups to let the chosen preset supply them (any color/token you genuinely extracted still wins per-key).

### `business.description`

120–156 chars HARD limit. Active voice. Mentions what, who-for, and where if local.

Good: `"Family-owned Anchorage bakery. Wild-yeast sourdough, almond croissants, seasonal cakes. Open Tue–Sun, 6am–3pm. Walk in or order online."` (148 chars)

Bad: `"We are the best bakery in town offering high-quality artisanal products."` (vague + uses banned words)

### `business.tagline`

3-5 words. ONE specific benefit. Not a generic adjective.

Good: `"Sourdough since 1987"` · `"Built for engineers"` · `"Estate plans for Alaska"`

Bad: `"Innovative solutions"` · `"Your trusted partner"` · `"Excellence in service"`

### Feature flags

| Preset | hero | bento | stats | services | process | testimonials | logoCloud | pricing | faq | blog | team | caseStudies | newsletter | cta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| saas | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| restaurant | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ |
| portfolio | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| agency | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| medical | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| legal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| nonprofit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| retail | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |
| local-service | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |

If the brief explicitly contradicts (e.g. "no pricing on our site" for a SaaS), respect the brief.

## Validation rules (your output MUST pass)

- `business.tagline.$value`: 3-5 words
- `business.description.$value`: 120-156 chars
- `business.url.$value`: starts `https://`, no trailing slash
- `business.phone.$value`: empty string OR matches `/^\+\d{8,15}$/`
- `color.brandHue.$value`: numeric string `"0"`-`"360"`
- `color.brandChroma.$value`: numeric string `"0.05"`-`"0.30"`
- `colorScheme.$value`: `"dark"` or `"light"` or `"auto"`
- `themeStyle.$value`: one of `"classic"` `"editorial"` `"warm"` `"luxe"` `"brutalist"`
- `font.heading.$value` + `font.body.$value`: real Google Fonts names

## Begin

Read the business description that follows. Output ONLY the `_brand.json` content. No prose. No fences.

--- USER BRIEF BEGINS ---

[append your description here]

--- USER BRIEF ENDS ---

--- PROMPT END ---

## After running

```bash
# Save the output to _brand.json then:
npm run validate:brand   # must pass
npm run dev              # smoke test in browser
```

If validation fails, the model produced an invalid structure — re-run with the exact errors in the brief so it can correct.
