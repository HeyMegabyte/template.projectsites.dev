# 100 Upgrades — v3.5

A research-backed catalog of 100 improvements applied to the template in one pass. Sources are linked at the bottom.

## Categories (10 × 10)

### A. Visual + motion + brand tokens (1-10)
1. Adopt **APCA contrast** algorithm in the brand-token system (alongside WCAG 2.x relative-luminance) — WCAG 3.0 draft direction
2. **OKLCH lightness anchors** — explicit lightness rungs (08/12/16/22 dark · 99/97/94/88 light) baked into surface tokens
3. **`@view-transition { navigation: auto; }`** + named per-element `view-transition-name` for hero, nav, cards (cross-document MPA support)
4. **`view-transition-class`** for grouped animations (Chromium 125+, Safari 18.4+)
5. **`@starting-style`** entry animations on hero + bento tiles + modal — no JS timing hacks
6. **CSS scroll-driven kinetic headline** with `animation-timeline: scroll()` + `font-variation-settings` `wght`/`wdth` axes
7. **`timeline-scope`** — share a scroll timeline across DOM branches for parallax-style choreography
8. **Container queries `@container scroll-state(stuck)`** — style sticky elements when pinned
9. **`shape()` clip-paths** for organic blob backgrounds (replaces SVG masks)
10. **`contrast-color()`** — auto-pick text color against any background

### B. Performance + Core Web Vitals (11-20)
11. **Long Animation Frame API** monitoring via `PerformanceObserver` with `type: 'long-animation-frame'`
12. **Soft Navigation API** support (Chrome 147+ origin trial) for SPA per-route INP measurement
13. **`scheduler.postTask()`** for click handlers — yield to main thread between heavy work
14. **`scheduler.yield()`** inside long loops
15. **`<Image>` improvements** — `<picture>` with AVIF→WebP→JPEG, width+height always, single `fetchpriority="high"` per page
16. **Critical CSS inline** in `<head>` for hero above-the-fold paint
17. **`prefers-reduced-data`** opt-out of large images
18. **DNS prefetch + preconnect** for fonts, analytics, demo URLs
19. **Speculation Rules** with prerender + `eagerness: 'moderate'` + selector-based exclusions
20. **Service worker cache strategies** — stale-while-revalidate for HTML, cache-first for hashed assets, network-first for /api/

### C. Accessibility WCAG 2.2 + 3.0-ready (21-30)
21. **`prefers-reduced-motion`** double-down — every CSS animation has a no-op fallback
22. **`prefers-reduced-transparency`** — replaces glass with solid surfaces
23. **`prefers-contrast: more`** — bumps text-muted to text, accent border weights
24. **`forced-colors: active`** — uses system keywords (`buttonText`, `Canvas`, `LinkText`) for high-contrast Windows
25. **`inverted-colors`** — disables backdrop-filter blur (which fights with inversion)
26. **Skip-link first-tab** + visible focus ring on every interactive element (WCAG 2.4.11 Focus Appearance)
27. **`aria-busy`** on the gallery during manifest fetch
28. **Roving `tabindex`** on the BentoGrid for keyboard nav through tiles
29. **`role="img"` + `aria-label`** on every emoji-heavy decoration
30. **Live-region announcements** on theme toggle + Cmd+K open/close

### D. SEO + GEO + structured data (31-40)
31. **HowTo JSON-LD** on process / install pages (high AI-citation rate)
32. **Speakable JSON-LD** on lead paragraphs (voice-assistant pickup)
33. **Article JSON-LD** with `articleSection`, `wordCount`, `dateModified` on every BlogPost
34. **Person JSON-LD** with `knowsAbout`, `sameAs`, `image`, `homeLocation` (EEAT)
35. **CollectionPage JSON-LD** on gallery (linking the 9 demos)
36. **SoftwareApplication JSON-LD** on SaaS pages with `featureList`, `applicationCategory`, `softwareVersion`
37. **Quotable answer blocks (40-60 words)** as first paragraph of every content page
38. **`<link rel="alternate" hreflang>`** stub for future i18n
39. **`humans.txt`** updated to v3.5
40. **Sitemap with `<image:image>` per route** + `<lastmod>` ISO 8601

### E. PWA + offline + native integration (41-50)
41. **`shortcuts[]`** in manifest with role-based actions
42. **`share_target`** for receiving shared URLs into the contact form
43. **`file_handlers`** for `.md` + `.json` (brand-token files)
44. **`protocol_handlers`** for `web+projectsites:` deep links
45. **`window-controls-overlay`** in `display_override` for desktop PWA installs
46. **Screen Wake Lock API** wrapper for video / chat sessions
47. **Declarative Web Push** stub (Safari 18.4+)
48. **`launch_handler` `client_mode: 'navigate-existing'`** for single-instance PWA
49. **Cache-versioning bumps** triggered by build hash
50. **`offline.html`** with brand-aware rendering (reads cached `_brand.json`)

### F. Forms + interactivity + React 19 (51-60)
51. **`useActionState`** on the contact form for pending/error/success lifecycle
52. **`useFormStatus`** on the submit button for built-in loading state
53. **`useOptimistic`** on the newsletter signup
54. **`<form action={async fn}>`** auto-reset on success
55. **Document Metadata in React 19** — `<title>` and `<meta>` rendered inside components, hoisted by React
56. **`use(promise)`** for the gallery manifest fetch — Suspense-friendly
57. **`ref` as a prop** — drop `forwardRef` in custom UI primitives
58. **`requestFormReset`** API for explicit form resets
59. **Turnstile invisible widget** stub for spam protection
60. **Zod schemas** for every form input

### G. Section components additions (61-70)
61. **`CommandBar`** (Linear-style top bar with ⌘K trigger + autocomplete)
62. **`Quote`** (large editorial pull quote with attribution + citation URL)
63. **`Spotlight`** (single-product highlight, can replace BentoGrid hero tile)
64. **`SocialProof`** (live counter — "342 customers active today")
65. **`Timeline.Horizontal`** (alternate to existing vertical Timeline)
66. **`MetricRow`** (4 bordered metric cards with delta indicators)
67. **`Feature.Tabs`** (Linear-style tabbed feature showcase)
68. **`Demo`** (interactive embedded iframe with `loading="lazy"`)
69. **`Spotlight.Compare`** (two product variants side-by-side)
70. **`AskAI`** (Cmd+K-style ask-anything pseudo-search)

### H. Brand-token system enhancements (71-80)
71. **`color.brandTriadic`** + **`color.brandAnalogous`** — auto-computed companion palettes via `color-mix(in oklch, ...)`
72. **`color.dark.*` + `color.light.*`** explicit overrides per mode (not just inversions)
73. **Per-section feature flag overrides** — `features.hero.variant: 'split'` or `'centered'`
74. **`motion.reduced.*`** — reduced-motion-specific durations (instant vs slow)
75. **`font.variation.*`** — variable-font axis defaults (`wght: 500, wdth: 100, opsz: 14`)
76. **`brand.copy.tone`** — `formal | warm | technical | playful` to seed copy generation
77. **`brand.locale`** — language + region defaults
78. **`brand.analytics`** — toggle GA4 / PostHog / Plausible
79. **`brand.security.csp`** — opt into strict CSP nonce mode
80. **DTCG `$extensions`** — namespace for tool-specific overrides

### I. Developer experience + scripts (81-90)
81. **`npm run lighthouse`** — automated Lighthouse CI run against deployed sites
82. **`npm run perf-budget`** — assert bundle size + LCP budgets
83. **`npm run hue-rotate`** — preview the template at 12 hues (0/30/60/.../330) → 12 PNGs
84. **`npm run analyze`** — `vite-bundle-visualizer` open
85. **`npm run new-section`** — scaffold a new section component
86. **`npm run new-page`** — scaffold a new route (with sitemap + palette + footer link)
87. **`npm run secrets:rotate`** — Stripe / Resend / Turnstile key check
88. **`npm run validate:all`** — meta-script: brand + presets + applied + prompt-evals
89. **VS Code workspace settings** — Tailwind IntelliSense + TS strict + Vitest runner
90. **GitHub PR template** + Issue templates (bug, feature, prompt-improvement)

### J. Security + production hardening (91-100)
91. **CSP Level 3** strict-dynamic + per-response nonce
92. **`require-trusted-types-for 'script'`** — enforced on production
93. **Permissions-Policy** locked-down (no camera/mic/usb/geolocation unless explicit)
94. **HSTS** with preload + `max-age=63072000`
95. **X-Content-Type-Options: nosniff** + X-Frame-Options DENY
96. **Reporting-Endpoints** header for CSP + COEP + COOP violations
97. **`integrity` (SRI) attributes** on every external CDN script
98. **`crossorigin="anonymous"`** on external resources
99. **`Cross-Origin-Opener-Policy: same-origin`** + COEP `credentialless`
100. **`Origin-Agent-Cluster: ?1`** for memory isolation per-origin

## Sources

- [Interop 2026 — CSS-Tricks](https://css-tricks.com/interop-2026/)
- [WebKit Interop 2026 announcement](https://webkit.org/blog/17818/announcing-interop-2026/)
- [CSS Snapshot 2026 — W3C](https://www.w3.org/TR/css-2026/)
- [React 19 release — react.dev](https://react.dev/blog/2024/12/05/react-19)
- [Core Web Vitals 2026 INP guide — BKND](https://www.bknddevelopment.com/seo-insights/core-web-vitals-inp-optimization-guide-2026/)
- [Soft Navigations API — Chrome for Developers](https://developer.chrome.com/docs/web-platform/soft-navigations-experiment)
- [WCAG 3.0 Working Draft 2026 — accessiBe](https://accessibe.com/blog/knowledgebase/wcag-3-point-0)
- [CSS media features for a11y — a11y-blog.dev](https://a11y-blog.dev/en/articles/css-media-features-for-a11y/)
- [Structured Data + AI Search — Stackmatix](https://www.stackmatix.com/blog/structured-data-ai-search)
- [GEO 2026 — Atlantis Marketing](https://atlantis.marketing/how-rank-chatgpt-perplexity-google-ai-overviews-2026-guide-businesses/)
- [Variable fonts 2026 — UDT](https://ultimatedesigntools.com/blog/how-to-use-variable-fonts-css/)
- [Image optimization 2026 — Two Row Studio](https://tworowstudio.com/image-optimization-2026/)
- [PWA capabilities 2026 — MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [CSP Level 3 — W3C](https://www.w3.org/TR/CSP3/)
- [Strict CSP — Google](https://csp.withgoogle.com/docs/strict-csp.html)
