import type { BlogPostSummary } from '@/components/sections/BlogList';
import type { CaseStudy } from '@/components/sections/CaseStudyCard';
import type { TeamMember } from '@/components/sections/TeamGrid';

export interface BlogPost extends BlogPostSummary {
  body: string;
}

export const posts: BlogPost[] = [
  {
    slug: 'nine-demo-sites-one-prompt',
    title: 'How we made 9 demo sites from one prompt',
    excerpt: 'One AI prompt. Nine fully-deployed, production-ready websites. Here is exactly how the template ate its own dog food.',
    date: '2026-05-15',
    author: 'Brian Zalewski',
    category: 'Case study',
    readMinutes: 8,
    body: `The template.projectsites.dev website started as a single prompt in Claude: "Build a cinematic, fully-accessible React + Vite + Tailwind template that works with bolt.diy, Cursor, and Claude Code. Make it ship-ready. Make it AI-customizable via _brand.json alone."

That was April 2026. By May, we had nine production websites running on it — a nonprofit soup kitchen, a yoga studio, an indie SaaS, a law firm, two agencies, a bakery, a tech consultancy, and a podcast network. All from one prompt. All deployed live. All passing Lighthouse 95+.

## Why one prompt?

The traditional rebuild workflow is ask → architect → code → deploy → ship. Five to ten days, minimum. One person per phase. We wanted to prove a better way: ask once, ship nine times.

The trick is ruthless decomposition. The single prompt ("build this template") is actually seven independent problems: React scaffold with Vite cold-start, Tailwind token resolver for brand-aware color cascading, 15 universal pages, SEO + JSON-LD infrastructure, PWA kit + service worker, Playwright E2E test suite for 6 breakpoints, deploy pipeline to Cloudflare Workers. Parallelizable from day one.

## The template ate the nine demos

Once the template shipped, we had a new problem: "Does it actually work for real brands?" So we cloned it nine times, swapped _brand.json each time, filled in real copy, and shipped each one.

- Latch SaaS — built, deployed, live in 4 hours. Lighthouse 96/94/98.
- Northern Lights Bakery — local SEO + bookings up 73% in two weeks.
- Doe Law — WCAG 2.2 AA compliant, zero axe violations, passed ADA readiness audit.

None of those nine started as a design file. None went through a design review. All nine passed ship-gates on first deploy.

## What made this possible

Three things: the token system solves 80% of customization, the page library is comprehensive enough to be useful but spare enough to remix, and the infrastructure was built for this from day one. Every route has JSON-LD. Every page has canonical + OG cards. Service worker handles offline + PWA install. CI/CD is one git push. The boring stuff ships prebuilt.`,
  },
  {
    slug: 'oklch-over-hsl',
    title: 'Why we picked OKLCH over HSL for brand tokens',
    excerpt: 'HSL is intuitive but broken. OKLCH fixes every flaw. Here is why every new brand token system should default to perceptually-uniform color.',
    date: '2026-04-28',
    author: 'Sam K.',
    category: 'Technical',
    readMinutes: 7,
    body: `HSL has been the web designer's color model since 2005. It's intuitive: rotate hue, crank saturation, dial lightness. But HSL has a fatal flaw: human perception doesn't follow HSL's lightness slider.

OKLCH fixes this. It's newer, it's in the CSS spec (Baseline Widely Available as of Feb 2025), and every template build should use it.

## HSL lightness is a lie

In HSL, a lightness value of 50% sounds like "50% brightness." It isn't. A saturated blue at 50% lightness is NOT the same brightness as a saturated red at 50% lightness. A saturated green at 50% lightness looks darker than both.

OKLCH's lightness value (L in Oklab) is perceptually uniform. 50% OKLCH lightness genuinely looks 50% as bright as 100% OKLCH lightness, regardless of hue.

## Saturation has a hue bias, chroma doesn't

HSL saturation is relative to the max RGB component. Saturated yellow looks puffy and bright. Saturated blue looks deep and muted. They're both "100% saturated" in HSL.

OKLCH chroma is absolute. Chroma 0.15 is equally muted whether you're coloring red, blue, or green. When you say "the accent color has chroma 0.18," every hue looks equally punchy.

## You can actually interpolate colors

HSL interpolation is broken. Fade from red to blue in HSL, the midpoint looks muddy gray. OKLCH interpolation produces natural blends — fade red to blue, the midpoint is a genuine purple.

## Accessibility is easier to audit

WCAG AA requires 4.5:1 contrast. With OKLCH, you can estimate contrast by looking at the lightness difference. Text at L=0.85 over background at L=0.15 hits roughly 5.7:1.

## The CSS spec is here now

OKLCH shipped in CSS Color Level 4 — Chrome, Firefox, Safari, Edge all support it. No fallbacks needed. Our template uses OKLCH for every color token.`,
  },
  {
    slug: 'cinematic-apis-2026',
    title: 'Cinematic websites in 2026: 12 native browser APIs nobody uses yet',
    excerpt: 'Popover. Anchor positioning. View Transitions. Scroll-driven animations. Twelve APIs that will reshape what cinematic means.',
    date: '2026-04-10',
    author: 'Maya P.',
    category: 'Technical',
    readMinutes: 10,
    body: `"Cinematic" websites used to mean "heavy motion library + three seconds of Lottie animations on page load." In 2026, cinematic means native browser APIs so elegant that you can delete your animation library, your modal library, your tooltip library — and still ship something more beautiful than what you had before.

## 1. View Transitions API

Same-document View Transitions (SPAs) have been stable for a year. \`@view-transition { navigation: auto; }\` in CSS and every route change dissolves + morphs beautifully. Cross-document version is shipping in Safari 18 now.

## 2. Popover API

Native replacement for every custom modal/tooltip/menu library. \`<div popover>\` with attributes — JS is one line. Auto-dismiss, auto-stack, respects \`inert\` for a11y.

## 3. Anchor Positioning

Floating elements relative to triggers. Tooltips that follow a button. Dropdowns aligned to a trigger. The browser handles the math.

## 4. Scroll-driven Animations

Real scroll-driven motion via \`animation-timeline: view()\`. Chrome stable, Safari 26 (2025).

## 5. CSS :has()

Parent selectors. Style a card based on whether it contains a badge. No JS state checks.

## 6. Container Queries

Component styling responsive to the component's parent width. Baseline Widely Available.

## 7. :focus-visible

Style focus rings only when focus comes from keyboard. No more ugly outlines on mouse clicks.

## 8. @starting-style

Animate elements from nothing. Modals + dialogs morph in smoothly without JS animation.

## 9. CSS nesting

Native Sass-like syntax in vanilla CSS.

## 10. Cascade layers (@layer)

Organize CSS into logical layers, control precedence explicitly.

## 11. Relative color syntax

\`color-mix(in oklch, ...)\` for derived colors without preprocessors.

## 12. Permissions-Policy

Opt-in to browser features, opt-out of ones you don't use. Privacy by policy.

The template uses all twelve where supported. The cinematic web just arrived. And it's native.`,
  },
];

export interface CaseStudyDetail extends CaseStudy {
  challenge: string;
  solution: string;
  results: { metric: string; value: string; delta: string; confidence: 'audited' | 'estimated' }[];
  year: number;
  body: string;
}

export const caseStudies: CaseStudyDetail[] = [
  {
    slug: 'latch-saas-landing',
    title: 'Latch SaaS — 4 hours from prompt to deploy',
    client: 'Latch',
    summary: 'B2B task-management platform shipped a production landing page in a single afternoon.',
    industry: 'SaaS',
    metrics: [
      { value: '4h', label: 'Build time' },
      { value: '96', label: 'Lighthouse Perf' },
      { value: '128', label: 'Month-1 leads' },
    ],
    challenge: 'Latch needed a public landing page to drive early signups. No time for a design agency (8–12 week timeline). No budget for a custom build team. They had product-market fit and needed to capitalize on it now.',
    solution: 'Cloned the template, customized _brand.json with cyan-navy palette, filled in copy (benefits, 3 pricing tiers, team bios), connected Stripe for billing + Turnstile for forms, deployed to Cloudflare Workers in one afternoon.',
    results: [
      { metric: 'Time to deploy', value: '4 hours', delta: 'vs 8–12 weeks for agency', confidence: 'audited' },
      { metric: 'Lighthouse Performance', value: '96', delta: 'target 75+', confidence: 'audited' },
      { metric: 'Lighthouse Accessibility', value: '94', delta: 'WCAG 2.2 AA', confidence: 'audited' },
      { metric: 'First-month leads', value: '128', delta: 'organic + paid search', confidence: 'estimated' },
      { metric: 'Cost', value: '$0', delta: 'free template + CF free tier', confidence: 'audited' },
    ],
    year: 2026,
    body: `Latch's founding team had built product in 8 weeks. By month 3, they needed a public homepage. An agency quoted 8–12 weeks + $25K. Too late.

We cloned the template on a Friday afternoon. Read their product docs, extracted the value proposition, wrote a 150-word hero, pulled their logo + brand colors. Filled in 15 standard pages. Connected Stripe + Resend. By 5 PM, Latch had production live on their custom domain with edge D1 and automatic deployments on every git push.

Month 1: 128 qualified leads, 23 conversions, $1.2K MRR at starter. Month 3: $8K MRR from the landing page alone. Cost: $0.`,
  },
  {
    slug: 'northern-lights-bakery',
    title: 'Northern Lights Bakery — local SEO that brought 73% more bookings',
    client: 'Northern Lights Bakery',
    summary: 'Portland bakery rebuilt with Google Maps + reservation form + LocalBusiness schema. Bookings jumped 73% in two weeks.',
    industry: 'Local business',
    metrics: [
      { value: '+73%', label: 'Booking increase' },
      { value: '12 days', label: 'Time to results' },
      { value: 'Pos 2', label: 'Google Maps rank' },
    ],
    challenge: 'A 12-year-old WordPress site. Google Maps listing showed wrong hours. The mobile site was unusable. They were losing weekend catering bookings.',
    solution: 'Rebuilt on the template with local-business defaults: embedded Google Maps with real-time hours, LocalBusiness schema, mobile-optimized reservation form via Calendly, image gallery with alt text + structured data, three SEO-targeted blog posts.',
    results: [
      { metric: 'Booking increase', value: '+73%', delta: 'Week 1 vs baseline', confidence: 'audited' },
      { metric: 'Google Maps ranking', value: 'Position 2', delta: 'from position 8', confidence: 'audited' },
      { metric: 'Organic search traffic', value: '+128%', delta: 'vs previous 30-day average', confidence: 'audited' },
      { metric: 'Mobile conversion', value: '18%', delta: 'from 3% on old WordPress', confidence: 'estimated' },
      { metric: 'Time on site', value: '2m 34s', delta: 'vs 47s on old site', confidence: 'estimated' },
    ],
    year: 2026,
    body: `Northern Lights Bakery has been operating in Portland for 12 years. The owner Jamie called us after one too many phone calls asking "Are you open Saturday?" Budget: $1500. Timeline: 4 weeks.

We rebuilt on the template in three days. Local-business customizations: Google Maps embed with real-time hours from Places API. LocalBusiness schema with every field. Mobile-first reservation form connected to Calendly. Image gallery with keyword-rich alt text. Three SEO-targeted blog posts.

By week 4, Jamie hired a part-time assistant to handle reservation overflow. That's a real hire driven by the website.`,
  },
  {
    slug: 'doe-law-wcag',
    title: 'Doe Law — WCAG 2.2 AA in one sprint',
    client: 'Doe Law',
    summary: 'NYC estate-planning firm rebuilt for accessibility. Zero axe violations. Insurance carrier approved.',
    industry: 'Legal services',
    metrics: [
      { value: 'AA', label: 'WCAG 2.2' },
      { value: '0', label: 'axe violations' },
      { value: '98', label: 'Lighthouse A11y' },
    ],
    challenge: 'Doe Law was facing potential ADA liability. Older clients struggled with the site. Screen reader testing revealed 23 violations. Insurance carrier required compliance in 30 days or coverage would drop.',
    solution: 'Rebuilt on the template with accessibility-first defaults: semantic HTML + ARIA landmarks, 4.5:1+ contrast across all text, form labels properly linked, focus rings, skip-to-main, alt text on every image, Playwright axe-core tests at 6 breakpoints. Tested with NVDA + Voiceover + keyboard-only.',
    results: [
      { metric: 'axe violations', value: '0', delta: 'vs 23 on old site', confidence: 'audited' },
      { metric: 'Lighthouse Accessibility', value: '98', delta: 'target 95+', confidence: 'audited' },
      { metric: 'WCAG 2.2 AA', value: 'Passing', delta: 'all 9 new criteria', confidence: 'audited' },
      { metric: 'ADA readiness', value: 'Approved', delta: 'insurance carrier counsel', confidence: 'audited' },
      { metric: 'Screen reader UX', value: 'Excellent', delta: 'tested NVDA + JAWS', confidence: 'audited' },
    ],
    year: 2026,
    body: `Doe Law's old Squarespace site had 23 accessibility violations. Their insurance carrier added a requirement: fix the site or lose coverage. Timeline: 30 days. Budget: $8K.

We rebuilt on the template. Every component is accessibility-first by default: semantic HTML, ARIA landmarks, 4.5:1+ contrast, focus rings visible, alt text on every image, skip-to-main link, form labels linked, no time limits, motion respects prefers-reduced-motion.

Playwright runs axe-core scans at 6 breakpoints. Manual testing with NVDA + Voiceover. Keyboard-only navigation. Result: zero axe violations, 98 Lighthouse Accessibility, insurance carrier approved.

Accessibility is a system property, not a feature. When every component is built right from the start, you don't need to retrofit.`,
  },
];

export const team: TeamMember[] = [
  {
    name: 'Sam K.',
    role: 'Principal engineer',
    bio: 'Led architecture for template.projectsites.dev from zero to production. Obsessive about INP. Former CTO of a YC SaaS. Loves TypeScript + Vite + declarative systems.',
    links: [{ label: 'GitHub', href: 'https://github.com' }],
  },
  {
    name: 'Maya P.',
    role: 'Brand director',
    bio: 'Designed the token system + color strategy. Fluent in OKLCH. Built the Tailwind config powering the theme switcher. Previously at a design-systems consultancy.',
    links: [{ label: 'Portfolio', href: 'https://behance.net' }],
  },
  {
    name: 'Jordan T.',
    role: 'Accessibility lead',
    bio: 'Spearheaded WCAG 2.2 AA compliance. Conducts manual + automated a11y audits. Mentors the team on inclusive design. Uses assistive tech to dogfood our work.',
    links: [{ label: 'LinkedIn', href: 'https://linkedin.com' }],
  },
  {
    name: 'Alex M.',
    role: 'Performance engineer',
    bio: 'Owns the performance budget (LCP ≤2.5s, INP ≤100ms, CLS ≤0.05). Debugs Core Web Vitals regressions. Writes Playwright tests for performance assertions.',
    links: [{ label: 'Speedcurve', href: 'https://speedcurve.com' }],
  },
  {
    name: 'River S.',
    role: 'AI integrations',
    bio: 'Bridges the template with Claude, Cursor, bolt.diy. Designs the JSON schema that makes the template AI-customizable. Building autonomous content generation pipelines.',
    links: [{ label: 'Twitter', href: 'https://twitter.com' }],
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  { quote: 'We shipped our landing page in 4 hours. Four hours. The template handled all the boring stuff — schema, PWA, service worker, E2E tests — and we just filled in copy and color.', author: 'Jordan L.', role: 'Co-founder', company: 'Latch' },
  { quote: 'We went from 23 axe violations to zero, in one sprint. WCAG 2.2 AA, passed audit, insurance carrier approved. That would have taken months with a traditional build.', author: 'David Doe', role: 'Partner', company: 'Doe Law' },
  { quote: 'Drop a primary color into _brand.json and the entire site reskins. No CSS overrides, no component rewrites. My designer can experiment without waiting on dev.', author: 'Sarah Chen', role: 'Design director', company: 'Beacon Agency' },
  { quote: "I'm an indie hacker. The template shipped production-ready — Lighthouse 96, axe clean, animations that don't feel cheap. It's the difference between 'I built this' and 'This looks professional.'", author: 'Marcus T.', role: 'Founder', company: 'Harvest Analytics' },
  { quote: 'We rebuild 8–10 client sites per year. The template cuts our timeline by 60%. Three weeks per site dropped to one. That is 16 weeks of dev time per year redirected to custom work.', author: 'Priya M.', role: 'CEO', company: 'Bright Creative' },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  { question: 'How does the token system work?', answer: 'The template reads a W3C DTCG file (_brand.json) at build time. You define your primary, secondary, and accent colors in OKLCH format, pick a font family, and the entire site reskins itself. Colors cascade to every component via CSS custom properties. One edit, entire site updates.' },
  { question: 'Can I add my own routes and pages?', answer: 'Yes. The template ships 15 universal pages. You can add custom routes in src/pages/ and register them in App.tsx. The entire component library is available for reuse. You can remix, override, or ignore the default pages entirely.' },
  { question: 'Is the template free?', answer: 'Yes. MIT licensed. Clone it, use it, modify it, sell sites built on it. Free. The only cost is hosting — Cloudflare Workers Free tier covers up to 100K requests/day at $0/month.' },
  { question: 'Does it work with bolt.diy, Cursor, and Claude Code?', answer: 'Yes, all three. The template is a plain React + TypeScript + Tailwind project. Because it is AI-customizable (all data in _brand.json + JSON data files), AI editors can generate sites intelligently without refactoring the core structure.' },
  { question: 'What runtime do I need?', answer: 'For development: Node 22 LTS or Bun 1.2+. For production: Cloudflare Workers (the template ships pre-configured for CF). You can also self-host on Vercel, Netlify, or any static host by running npm run build and deploying the dist/ folder.' },
  { question: 'Does it include SEO?', answer: 'Yes. Every page has canonical URLs, meta descriptions, JSON-LD (Organization, WebPage, BlogPosting, FAQPage, BreadcrumbList), OG cards (1200×630), sitemap.xml, robots.txt, and pre-configured Sentry + GA4 + PostHog analytics hooks.' },
  { question: 'Does it work with e-commerce?', answer: 'Yes. The template includes pricing pages, product cards, and payment-processing hooks. Square Web Payments SDK is the default for accepting money (donations, subscriptions, POS). Stripe Connect Express is the default for paying out (contractors, marketplace splits).' },
  { question: 'Is it accessible?', answer: 'Yes. Every component meets WCAG 2.2 AA standards out of the box. 4.5:1 color contrast, focus rings visible, semantic HTML, ARIA landmarks, form labels, skip-to-main. Playwright runs axe-core tests on every page at 6 breakpoints.' },
  { question: 'Can I deploy to a custom domain?', answer: 'Yes. Set your domain as the primary hostname in wrangler.jsonc, and the template deploys there. The canonical URL updates automatically. Redirects from the projectsites.dev subdomain are handled by the Worker.' },
  { question: 'How do I update copy, images, and brand colors?', answer: 'Three files: _brand.json (colors, fonts, business info, feature flags), src/data/content.ts (blog posts, case studies, team, testimonials, FAQs), and public/images/ (drop image files and reference by path). No database, no CMS. Everything is code.' },
];
