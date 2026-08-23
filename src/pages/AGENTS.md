# AGENTS.md — src/pages/

> Scoped conventions for route components. Inherits from root `AGENTS.md`.

## Purpose

`pages/` holds one component per route. Each page composes section components from `src/components/sections/`. Pages do NOT define layouts directly — they compose.

## Hard rules

1. **One default export per file** — the page component.
2. **Filename matches route** — PascalCase. `/contact` → `Contact.tsx`, `/blog/:slug` → `BlogPost.tsx`.
3. **Call `useSEO` first** — sets `<title>` and `<meta name="description">`:
   ```tsx
   useSEO({
     title: `My Page — ${brand.business.name}`,
     description: 'Concise meta. 120-156 chars.',
   });
   ```
4. **Emit JSON-LD via `<JsonLd>`** — at least 1 node per page. Homepage and content-heavy pages get 5+.
5. **Wrap inner pages in `<Breadcrumbs>`** — except `/` and `*`. Breadcrumbs auto-emit `BreadcrumbList` JSON-LD.
6. **Close with a `<CTASection>`** — every page (except legal + 404) ends with a CTA pointing to the next step.
7. **Wrap every top-level section in `<SafeSection name="…">`** — fail-soft isolation. A render crash in one section (`Cannot read properties of undefined`, empty `services[0]`, missing brand token) must NOT blank the page. `SafeSection` catches it locally: that section vanishes while the hero, NAP, sibling sections, header/footer, and SEO head keep painting. See `src/components/SafeSection.tsx` + `src/pages/Home.tsx` for the pattern.
   ```tsx
   <SafeSection name="pricing">
     <Pricing tiers={tiers} headline="Plans" />
   </SafeSection>
   ```
8. **No layout chrome** — Header / Footer / Lightbox / CommandPalette come from `Layout.tsx` automatically.
8. **Lift section data to module scope** — define `services`, `tiers`, `faqs` etc. as top-level `const` arrays. Don't put them inside the component body unless they depend on state/props.

## File skeleton

```tsx
import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { brand } from '@/brand';
import {
  HeroSplit,
  FeatureSplit,
  FAQ,
  CTASection,
  type FAQItem,
} from '@/components/sections';

const faqs: FAQItem[] = [
  { question: '...', answer: '...' },
];

export default function MyPage() {
  useSEO({
    title: `My Page — ${brand.business.name}`,
    description: '120-156 char description.',
  });

  return (
    <>
      <Breadcrumbs baseUrl={brand.business.url} />

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'My Page',
      }} />

      <HeroSplit
        eyebrow="My Page"
        headline="Page headline"
        primary={{ label: 'Take action', href: '/contact' }}
        image={{ src: '/hero.jpg', alt: 'Descriptive alt text' }}
      />

      <FeatureSplit
        eyebrow="..."
        headline="..."
        description="..."
        image={{ src: '/image.jpg', alt: '...' }}
      />

      <FAQ items={faqs} headline="..." />

      <CTASection
        eyebrow="..."
        headline="..."
        primary={{ label: 'Next step', href: '/...' }}
      />
    </>
  );
}
```

## Register a new page — 5-step checklist

1. **Create** `src/pages/MyPage.tsx` (skeleton above)
2. **Register** in `src/App.tsx`:
   ```tsx
   <Route path="/my-page" element={<MyPage />} />
   ```
3. **Add to sitemap** `public/sitemap.xml`:
   ```xml
   <url><loc>{BUSINESS_URL}/my-page</loc><lastmod>{BUILD_DATE}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
   ```
4. **Add to Cmd+K palette** `src/components/CommandPalette.tsx` `DEFAULT_ACTIONS`:
   ```ts
   { id: 'my-page', label: 'My Page', group: 'Pages', href: '/my-page' },
   ```
5. **Add navigation entry** — `src/components/Footer.tsx` `DEFAULT_ROUTES` and/or `Header.tsx` `DEFAULT_LINKS` if user-facing.

## Copy guidelines

| Element | Length | Notes |
| --- | --- | --- |
| `<title>` | 50–60 chars HARD | Keyphrase first |
| Meta description | 120–156 chars HARD | Active voice + CTA |
| H1 (one per page) | 4–8 words | Bold claim |
| Hero subheadline | 15–25 words | Answers what/who/why |
| Section eyebrow | 2–4 words | All-caps short label |
| Section headline (H2) | 4–8 words | |
| Body paragraph | ≤25 words/sentence, ≤150 words/paragraph | Flesch ≥60 |
| CTA button | 2–4 words | Action verb |

Banned slop words (from `~/.claude/rules/copy-writing.md`): "revolutionize, leverage, innovative, world-class, cutting-edge, seamless, robust, scalable" — replace with specific claims.

## Performance

- LCP image: `loading="eager"` + `fetchPriority="high"` — only on ONE image per page
- All other images: `loading="lazy"`
- Use `<Image>` from `@/components/Image` for AVIF/WebP/JPEG fallback
- Avoid client-side fetches in the initial render — pre-bake content in module scope when possible

## What pages must NOT do

- ❌ Modify the DOM outside React (use components instead)
- ❌ Add their own Header / Footer (Layout.tsx handles)
- ❌ Mount the CommandPalette directly (it's global)
- ❌ Skip the `useSEO` call (every page must set title + description)
- ❌ Use `window.location.href = '...'` for nav (use `<Link>` from react-router-dom)
- ❌ Hard-code business name / phone / address (read from `brand` import)
