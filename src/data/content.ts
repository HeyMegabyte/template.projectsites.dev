import type { BlogPostSummary } from '@/components/sections/BlogList';
import type { CaseStudy } from '@/components/sections/CaseStudyCard';
import type { TeamMember } from '@/components/sections/TeamGrid';

export interface BlogPost extends BlogPostSummary {
  body: string;
}

export const posts: BlogPost[] = [
  {
    slug: 'website-speed-core-web-vitals-2026',
    title: 'Website speed in 2026: how Core Web Vitals win or lose customers',
    excerpt: 'A slow site turns buyers away before they ever see your offer. Here is what Core Web Vitals measure, the numbers to hit, and the fixes that move them.',
    date: '2026-08-18',
    author: 'Editorial Team',
    category: 'Web guide',
    readMinutes: 6,
    body: `Speed is not a technical vanity metric. It is the first impression your website makes, and visitors decide whether to stay in the time it takes a page to paint. Google has measured this for years through Core Web Vitals, and in 2026 those scores shape both how you rank in search and how many visitors turn into customers. Here is what they measure and how to move them.

## The three numbers that matter

Core Web Vitals boil the experience down to three measurements, each with a clear target:

- **Largest Contentful Paint (LCP)** — how long until the biggest thing on screen, usually the hero image or headline, finishes loading. Aim for under 2.5 seconds.
- **Interaction to Next Paint (INP)** — how quickly the page responds when someone taps a button or opens a menu. Aim for under 200 milliseconds.
- **Cumulative Layout Shift (CLS)** — how much the page jumps around as it loads. Aim for under 0.1, so a customer never taps the wrong thing because a banner pushed the page down.

Google reports these from real visits, not a lab test, so they reflect what your actual customers feel on their actual phones.

## Why a slow site quietly costs you money

Every extra second of load time thins out the people who wait. Studies across retail and services consistently show conversion falling as pages get slower, and mobile visitors are the least patient of all. A business that loads in one second routinely converts a meaningfully higher share of visitors than one that takes five, for the exact same offer. You are not losing customers because your prices are wrong. You are losing them before the page even appears.

## The fixes that actually move the needle

Most speed problems trace back to a short list of causes:

- **Oversized images.** A photo saved straight from a camera can be several megabytes. Serve modern formats like WebP or AVIF, sized to how they are actually displayed.
- **Too much code loading at once.** Defer scripts that are not needed for the first paint, and drop plugins you no longer use.
- **No caching.** A content delivery network keeps a copy of your site close to each visitor, so it arrives fast whether they are down the street or across the country.
- **Unreserved space for images and ads.** Set width and height so the layout does not lurch as things load, which fixes most layout shift.

## Measure, then improve

You cannot fix what you do not watch. Run your homepage and top landing pages through a free tool like PageSpeed Insights, note the three scores, make one change, and measure again. Treat it like a monthly habit rather than a one-time project, because new photos and features can slow a fast site back down.

## The bottom line

A fast website is not a luxury. It is table stakes for being chosen. Hit the three Core Web Vitals targets, keep your images lean, and re-check your key pages every month. The reward is a site that both ranks better and turns more of its hard-won visitors into paying customers.`,
  },
  {
    slug: 'local-seo-checklist-2026',
    title: 'The local SEO checklist every small business needs in 2026',
    excerpt: 'Ranking in your own town is mostly blocking and tackling. Here is the local SEO checklist that gets a small business into the map results and keeps it there.',
    date: '2026-08-04',
    author: 'Editorial Team',
    category: 'Local SEO guide',
    readMinutes: 6,
    body: `When someone nearby searches for what you sell, you want to be one of the three businesses in the map at the top of the results. That spot drives calls, direction requests, and walk-ins. Getting there is less about clever tricks and more about doing a handful of unglamorous things well and consistently. Here is the checklist.

## Get your basics identical everywhere

Search engines trust businesses whose details line up across the web. Your name, address, and phone number should be written exactly the same way on your website, your Google Business Profile, and every directory that lists you. A suite number on one and not the other, or an old phone number lingering on a review site, sends a small signal of doubt. Pick one format and make everything match.

## Claim and complete your Google Business Profile

This is the single highest-leverage thing a local business can do. Claim the profile, then fill in every field: hours, categories, services, service areas, and a genuine description. Add real photos of your space, your team, and your work. Businesses with complete profiles and fresh photos consistently earn more views and clicks than half-finished ones.

## Build pages that match local intent

Your website should make it obvious where you are and what you do:

- **A clear location.** Put your city and neighborhood in your homepage copy, your page titles, and your footer, next to an embedded map.
- **A page per major service.** One strong page about each service beats a single page that lists everything in a sentence.
- **Local proof.** Mention the neighborhoods you serve and the kinds of customers you help, in plain language a real person would use.

## Earn reviews and answer them

Reviews are both a ranking factor and a deciding factor for the human reading them. Ask happy customers at the natural moment, right after a good experience, and make it easy with a direct link. Then reply to every review, positive or negative, in a calm and human voice. A thoughtful response to a complaint often impresses future readers more than a wall of five-star ratings.

## Get listed where it counts

You do not need hundreds of directory listings. You need the ones people and search engines actually trust: the big general directories, plus the two or three that matter in your industry. Make sure each one carries your identical details and a link back to your site.

## Keep it fresh

Local SEO is not a one-time setup. Post an update or a photo to your profile now and then, refresh your hours around holidays, and add a new service page when your business grows. A profile that shows recent activity outranks one that has sat untouched for two years.

## The bottom line

Winning locally is a checklist, not a secret. Make your details identical everywhere, complete your Google Business Profile, build clear service and location pages, earn and answer reviews, and keep it all fresh. Do those five things and you will steadily climb into the map results where your neighbors are already looking.`,
  },
  {
    slug: 'repeat-customers-retention-2026',
    title: 'Turning first-time visitors into repeat customers',
    excerpt: 'Winning a new customer costs far more than keeping one. Here are the follow-up habits and small touches that turn a single visit into a lasting relationship.',
    date: '2026-07-21',
    author: 'Editorial Team',
    category: 'Growth guide',
    readMinutes: 5,
    body: `Most small businesses pour their energy into attracting new customers and almost none into keeping the ones they already earned. That is backwards. Winning a new customer typically costs several times more than keeping an existing one, and repeat customers spend more, refer friends, and forgive the occasional off day. Here is how to turn a first visit into a habit.

## Make the first experience easy to repeat

Retention starts before anyone thinks about coming back. The smoother the first experience, the more likely a second one becomes. Remove friction wherever you can: a booking page that works on a phone, clear pricing, a checkout that does not demand an account, and a genuine thank-you at the end. People return to places that respect their time.

## Follow up while you are still remembered

The window to cement a relationship is short. A simple, well-timed follow-up does most of the work:

- **A thank-you within a day.** A short, personal note beats a generic receipt.
- **A helpful nudge at the right moment.** A reminder when a service is due again, or a tip that helps them get more from what they bought.
- **A reason to return.** A small offer, early access, or a members-only perk that rewards coming back rather than shopping around.

None of this needs an expensive platform. A tidy email list and a calendar reminder will carry a small business a long way.

## Build a simple reason to stay

Loyalty does not require a points app. It requires a reason. That might be a punch card, a standing appointment, a subscription for something people buy regularly, or simply being the place that remembers their name and their usual order. The mechanism matters less than the feeling that they belong here and are recognized.

## Ask, then act on what you hear

Your repeat customers will tell you how to keep them if you ask. A one-question survey after a purchase, or a quick conversation at the counter, surfaces the small annoyances that quietly push people away. The businesses that grow are the ones that close the loop: they hear the feedback, fix the thing, and mention that they fixed it.

## Turn regulars into advocates

Your happiest repeat customers are your cheapest and most credible marketing. Make it easy for them to spread the word with a referral perk, a shareable link, or simply by asking for a review at the right moment. A recommendation from a friend outperforms any ad you could buy.

## The bottom line

Growth is not only about the top of the funnel. Deliver a smooth first experience, follow up while you are still fresh in mind, give people a real reason to return, and act on what they tell you. A modest lift in how many customers come back a second time compounds into steadier revenue than any single burst of new traffic.`,
  },
  {
    slug: 'online-reviews-trust-signals-2026',
    title: 'Online reviews: the trust signals that win new customers',
    excerpt: 'Most buyers read reviews before they ever call. Here is how to earn more of them, respond well, and turn your reputation into your best salesperson.',
    date: '2026-07-14',
    author: 'Editorial Team',
    category: 'Reputation guide',
    readMinutes: 6,
    body: `Before a new customer calls you, they check what other people say about you. Reviews have quietly become the most persuasive marketing you have, and unlike an ad, you do not write them. What you can do is earn more of them, shape how you respond, and make your reputation easy to find. Here is how to treat reviews as the asset they are.

## Why reviews carry so much weight

A stranger trusts other customers far more than they trust your own marketing. The number of reviews, how recent they are, your average rating, and how you respond all feed a quick gut judgment: is this business reliable or risky. That judgment happens in seconds, often on a phone, and it decides whether the call ever comes.

## Earn more reviews without begging

The businesses with the most reviews are rarely the biggest. They are the ones who ask well:

- **Ask at the peak moment.** Right after a job done well, when the customer is happiest, is when they are most willing.
- **Make it one tap.** Send a direct link to the review page. Every extra step loses people.
- **Ask everyone, not just the delighted.** A steady trickle of honest reviews reads as more trustworthy than a sudden pile of perfect ones.

A simple, consistent habit of asking beats any one-time campaign.

## Respond to every review, especially the hard ones

Responding is where reputation is truly built, because future customers read the responses more closely than the reviews. Thank people for the good ones briefly and warmly. For the critical ones, stay calm, take responsibility for anything that was yours, and offer to make it right offline. A gracious reply to a one-star review often wins more trust than the five-star reviews around it, because it shows how you treat people when things go wrong.

## Turn a bad review into a better business

A negative review is uncomfortable, but it is also free market research. If the same complaint shows up twice, it is not a fluke, it is a signal. Fix the underlying problem, then mention in your response that you have changed it. Prospective customers reading later see a business that listens and improves rather than one that argues.

## Put your reputation where people look

Once you are earning reviews, do not hide them. Feature a few genuine ones on your homepage and service pages, keep your review profiles complete, and make sure the star rating shows up when someone searches your name. Real quotes from real customers, with their first name and context, carry more weight than any slogan you could write about yourself.

## The bottom line

Reviews are the closest thing a small business has to a salesperson who works around the clock and costs nothing. Ask for them at the right moment, make leaving one effortless, respond to every one with grace, and fix what the critical ones reveal. Do that steadily and your reputation becomes the reason new customers choose you over the business next door.`,
  },
  {
    slug: 'google-business-profile-optimization-2026',
    title: 'Your Google Business Profile, optimized for 2026',
    excerpt: 'Your Google Business Profile is often the first thing a customer sees. Here is how to fill it out completely, keep it fresh, and turn views into visits.',
    date: '2026-07-02',
    author: 'Editorial Team',
    category: 'Local guide',
    readMinutes: 6,
    body: `For a local business, your Google Business Profile is often more important than your website, because it is what appears first when someone searches your name or your service nearby. It shows your hours, photos, reviews, and a map, all before anyone clicks through to your site. A complete, active profile earns more calls and visits than a neglected one. Here is how to get it right.

## Claim it and complete every field

Start by claiming and verifying the profile so you control it. Then fill in everything, because empty fields cost you. Set your exact hours, choose the most accurate primary category, add secondary categories for the other things you do, and list your services with short descriptions. Write a genuine business description in plain language. Google rewards completeness, and so do customers scanning for a reason to trust you.

## Choose your categories carefully

Your primary category is one of the strongest signals for which searches you show up in, so pick the one that describes your core business most precisely rather than the broadest option. Add secondary categories for legitimate additional services. A profile that claims to be everything ranks for nothing, so keep the list honest and specific.

## Add real photos, and keep adding them

Photos are the first thing most people look at, and profiles with fresh, genuine images consistently earn more clicks. Show what a customer actually wants to see:

- **Your space,** so people recognize it when they arrive.
- **Your team,** because faces build trust.
- **Your work or products,** shown honestly rather than staged.

Add a few new photos every month. A profile that keeps posting looks alive and open for business.

## Use posts, questions, and messaging

The profile is more than a listing. Use posts to share an offer, an event, or an update, which keeps the profile active and gives searchers a reason to act now. Watch the questions section and answer them yourself before someone else answers wrong. If you can reply quickly, turn on messaging so an interested customer can reach you in the moment they are ready.

## Keep it accurate and fresh

Nothing erodes trust like wrong information. Update your hours before every holiday, fix your phone number the day it changes, and remove services you no longer offer. Google may also let customers suggest edits, so check the profile now and then to make sure no one has changed your details incorrectly.

## The bottom line

Your Google Business Profile is a storefront that most of your future customers will see before anything else you own. Claim it, complete every field, choose precise categories, add fresh photos, stay active with posts and answers, and keep every detail accurate. It is free, it takes an hour to set up and minutes a week to maintain, and it is one of the highest-return investments a local business can make.`,
  },
  {
    slug: 'google-ai-overviews-seo-small-business-2026',
    title: 'How small businesses rank in Google AI Overviews in 2026',
    excerpt: 'Google AI Overviews now appear on nearly half of searches. Ranking #1 no longer guarantees clicks — being a cited source does. Here is how small businesses get cited.',
    date: '2026-07-08',
    author: 'Editorial Team',
    category: 'Marketing guide',
    readMinutes: 7,
    body: `Search changed under your feet. Google AI Overviews — the AI-generated answer box at the top of results — now appear on roughly half of all queries, and they are reshaping who gets traffic. Ranking first no longer guarantees clicks; being cited inside the AI answer does. For small businesses, that is both a threat and an opening. Here is how to earn those citations in 2026.

## What actually changed

Two facts drive everything else. First, AI Overviews pull from the same search index you have always optimized for — not a separate pool. Nearly all pages cited in an AI Overview come from the top organic results, so you have to rank organically first to have any chance of being quoted. Second, the clicks moved. Queries with an AI Overview see a large drop in click-through for the top blue links, but brands cited inside the overview earn meaningfully more clicks. The game is now about being source-worthy, not just being ranked.

The upside for small businesses: the traffic that does come through arrives with more context and higher intent, and cited brands report higher trust and more branded searches.

## Rank organically first — SEO still matters

Because AI Overviews draw from the organic index, the fundamentals still apply, and arguably matter more. Google itself frames "answer engine optimization" and "generative engine optimization" as part of ordinary SEO. If you are not in the top organic results for a query, you will not be cited in its AI answer. Solid technical SEO, fast pages, and relevant content remain the price of entry.

## Write for extraction, not word count

AI systems reward content they can lift cleanly:

- **Lead with the question, then answer it.** Use question-forward headings and put a concise, direct answer right underneath before you expand.
- **Structure for scanning.** Tables, numbered steps, and short lists are easy for a model to extract. Walls of text are not.
- **Favor substance over length.** A tight, data-rich 800-word guide can outrank a padded 4,000-word post if the shorter piece answers the question immediately.
- **Add structured data.** Article, FAQPage, Product, and Organization schema clarify context and help models parse your page.

## Build entity authority and E-E-A-T

To be treated as a trustworthy source, show experience, expertise, authority, and trust. Add author bylines, keep updated dates visible, cite verifiable references, and publish first-party data — the numbers only you have. Precise claims and clear entities beat vague, keyword-stuffed prose, which does nothing to help a model understand your page.

## Your local edge

This is where small businesses win. AI systems lean heavily on local entity data for recommendations, so a complete, active Google Business Profile is one of your strongest levers. Keep your hours, services, categories, and photos current, and answer the specific questions real customers ask. Local intent plus a well-maintained profile is a combination big national competitors cannot easily match on your home turf.

## Measure what matters now

Rankings are no longer the whole story. Track AI citation frequency and share of voice — how often you appear as a cited source and how you compare with competitors. Google Search Console has added AI Overview reporting to help. Treat AI Overviews and the newer conversational AI Mode as separate targets, since a page cited in one is frequently not cited in the other.

Rank organically, structure every page around clear questions and extractable answers, build first-party authority, and keep that Google Business Profile pristine. In 2026, visibility is earned by being the source the AI trusts.`,
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
