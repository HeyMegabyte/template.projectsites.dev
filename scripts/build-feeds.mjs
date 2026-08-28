#!/usr/bin/env node
// Generate /feed.xml (RSS 2.0), /atom.xml, /feed.json (JSON Feed v1.1), /sitemap.xml.
// Reads routes from src/App.tsx + blog/case-study slugs from src/data/content.ts.
// Run via `npm run build:feeds` or as part of `npm run build`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'public');

// Tolerate a missing _brand.json — a fresh build copy can transiently lack
// it (journey 2026-08-19: the postbuild hard-failed with ENOENT and killed
// the whole build). Every field below already has a fallback; degrade to
// them instead of throwing.
let brand = {};
try {
  brand = JSON.parse(fs.readFileSync(path.join(repoRoot, '_brand.json'), 'utf8'));
} catch {
  console.warn('[build-feeds] _brand.json missing — using template defaults');
}
const business = brand.business ?? {};
const SITE_URL = (business.url?.$value || business.url || 'https://template.projectsites.dev').replace(/\/$/, '');
const SITE_NAME = business.name?.$value || business.name || 'ProjectSites Template';
const SITE_TAGLINE = business.tagline?.$value || business.tagline || 'Cinematic React + Vite + Tailwind template';
const AUTHOR = business.contactEmail?.$value || business.contactEmail || 'hey@megabyte.space';

// Resolve a feature flag from _brand.json, tolerating the {$value} design-token
// wrapper (features may be `true` or `{ $value: true }`). Mirrors featureOn() in
// src/brand.ts so the sitemap agrees with the runtime nav/routes.
const FEATURES = brand.features ?? {};
const TEMPLATE_MODE = process.env.VITE_TEMPLATE_MODE === 'gallery';
function feat(key) {
  const v = FEATURES[key];
  return Boolean(v && typeof v === 'object' ? v.$value : v);
}

// Static routes (drives sitemap.xml → which routes prerender-spa.mjs renders +
// indexes). /pricing + /quote are vertical-specific: a medical/legal/nonprofit
// site has neither, so emitting them here would index a misleading SaaS-tier
// (or estimate) page. Gate them by feature — the template's own showcase
// (VITE_TEMPLATE_MODE=gallery) still lists everything.
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/gallery', priority: 0.9, changefreq: 'weekly' },
  { path: '/studio', priority: 0.8, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/services', priority: 0.8, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.9, changefreq: 'monthly', requiresFeature: 'pricing' },
  { path: '/quote', priority: 0.9, changefreq: 'monthly', requiresFeature: 'quote' },
  { path: '/faq', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/team', priority: 0.5, changefreq: 'monthly' },
  { path: '/case-studies', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/accessibility', priority: 0.4, changefreq: 'yearly' },
].filter((r) => !r.requiresFeature || TEMPLATE_MODE || feat(r.requiresFeature));

// Try to read posts from src/data/content.ts via dynamic import.
// Falls back gracefully if the file doesn't exist yet (content-writer agent hasn't finished).
let posts = [];
let caseStudies = [];
try {
  const contentPath = path.join(repoRoot, 'src/data/content.ts');
  if (fs.existsSync(contentPath)) {
    // Parse via regex (avoiding ts-node) — extract slugs from `slug: '...'` patterns.
    const src = fs.readFileSync(contentPath, 'utf8');
    const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
    const titleRegex = /title:\s*['"]([^'"]+)['"]/g;
    const dateRegex = /date:\s*['"]([^'"]+)['"]/g;
    const descRegex = /description:\s*['"]([^'"]+)['"]/g;

    const slugs = [...src.matchAll(slugRegex)].map((m) => m[1]);
    const titles = [...src.matchAll(titleRegex)].map((m) => m[1]);
    const dates = [...src.matchAll(dateRegex)].map((m) => m[1]);
    const descs = [...src.matchAll(descRegex)].map((m) => m[1]);

    // Heuristic: first N slugs = posts, next M = case studies. We only need slug + meta for feeds.
    // For the seed run we'll treat all as posts; the agent can refine.
    for (let i = 0; i < slugs.length && i < titles.length; i++) {
      posts.push({
        slug: slugs[i],
        title: titles[i],
        description: descs[i] || '',
        date: dates[i] || new Date().toISOString().slice(0, 10),
      });
    }
  }
} catch (err) {
  console.warn('[build-feeds] No content.ts yet, skipping post feeds:', err.message);
}

const now = new Date().toISOString();
const lastBuildDate = new Date().toUTCString();

// === RSS 2.0 ===
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_TAGLINE)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;

// === Atom 1.0 ===
const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
  <title>${esc(SITE_NAME)}</title>
  <subtitle>${esc(SITE_TAGLINE)}</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${SITE_URL}" />
  <id>${SITE_URL}/</id>
  <updated>${now}</updated>
  <author><name>${esc(SITE_NAME)}</name><email>${esc(AUTHOR)}</email></author>
${posts.map((p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${SITE_URL}/blog/${p.slug}" />
    <id>${SITE_URL}/blog/${p.slug}</id>
    <updated>${new Date(p.date).toISOString()}</updated>
    <summary>${esc(p.description)}</summary>
  </entry>`).join('\n')}
</feed>
`;

// === JSON Feed v1.1 ===
const jsonFeed = {
  version: 'https://jsonfeed.org/version/1.1',
  title: SITE_NAME,
  description: SITE_TAGLINE,
  home_page_url: SITE_URL,
  feed_url: `${SITE_URL}/feed.json`,
  language: 'en-US',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  items: posts.map((p) => ({
    id: `${SITE_URL}/blog/${p.slug}`,
    url: `${SITE_URL}/blog/${p.slug}`,
    title: p.title,
    summary: p.description,
    date_published: new Date(p.date).toISOString(),
  })),
};

// === Sitemap ===
const allUrls = [
  ...staticRoutes.map((r) => ({ loc: `${SITE_URL}${r.path}`, lastmod: now, priority: r.priority, changefreq: r.changefreq })),
  ...posts.map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: new Date(p.date).toISOString(), priority: 0.6, changefreq: 'yearly' })),
  ...caseStudies.map((c) => ({ loc: `${SITE_URL}/case-studies/${c.slug}`, lastmod: now, priority: 0.7, changefreq: 'yearly' })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// Write all four
fs.writeFileSync(path.join(outDir, 'feed.xml'), rss);
fs.writeFileSync(path.join(outDir, 'atom.xml'), atom);
fs.writeFileSync(path.join(outDir, 'feed.json'), JSON.stringify(jsonFeed, null, 2));
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);

console.log(`[build-feeds] Wrote feed.xml, atom.xml, feed.json, sitemap.xml`);
console.log(`[build-feeds] ${posts.length} posts · ${allUrls.length} total URLs in sitemap`);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
