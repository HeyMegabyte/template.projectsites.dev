#!/usr/bin/env node
// prerender-route-heads.mjs — INTERIM SEO-collapse fix. The app is a client SPA; crawlers read
// the static index.html shell, so every route shipped the homepage <title>+canonical=/+desc.
// This postbuild step writes dist/<route>/index.html per static route with a UNIQUE per-route
// <title>, self-referencing <link canonical>, AND per-route <meta description> — the last read
// straight from each page's own useSEO() call (single source of truth, no divergence; only the
// simple ${brand.business.name}/{BUSINESS_NAME} substitutions are resolved). CF Pages serves
// these file-based, before the /* → /index.html SPA fallback. Replace with vite-react-ssg later.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
const origin = (shell.match(/<link[^>]+rel=["']canonical["'][^>]*href=["'](https?:\/\/[^/"']+)/i) || [])[1] || '';
const homeTitle = (shell.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
const businessName = homeTitle.split(/\s[—–-]\s/)[0].trim() || homeTitle.trim();

// path → [page label (title), source component for description extraction]
const ROUTES = {
  '/about': ['About', 'About'], '/services': ['Services', 'Services'], '/contact': ['Contact', 'Contact'],
  '/pricing': ['Pricing', 'Pricing'], '/faq': ['FAQ', 'FAQ'], '/team': ['Team', 'Team'],
  '/gallery': ['Gallery', 'Gallery'], '/case-studies': ['Case studies', 'CaseStudies'],
  '/blog': ['Blog', 'Blog'], '/privacy': ['Privacy Policy', 'Privacy'], '/terms': ['Terms of Service', 'Terms'],
  '/accessibility': ['Accessibility', 'Accessibility'], '/studio': ['Brand Studio', 'Studio'],
};

// pull the description straight from the page's useSEO() — single source of truth.
function pageDescription(component) {
  const p = `src/pages/${component}.tsx`;
  if (!existsSync(p)) return null;
  const m = readFileSync(p, 'utf8').match(/useSEO\(\{[\s\S]{0,400}?description:\s*[`'"]([^`'"]+)[`'"]/);
  if (!m) return null;
  return m[1].replace(/\$\{brand\.business\.name\}/g, businessName).replace(/\{BUSINESS_NAME\}/g, businessName).trim();
}
const setMeta = (html, name, attr, val) =>
  html.replace(new RegExp(`(<meta[^>]+${attr}=["']${name}["'][^>]*content=["'])[^"']*(["'])`, 'i'), `$1${val}$2`);

let n = 0;
for (const [path, [label, comp]] of Object.entries(ROUTES)) {
  const title = `${label} — ${businessName}`;
  const canonical = `${origin}${path}`;
  const desc = pageDescription(comp);
  let html = shell
    .replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
    .replace(/(<link[^>]+rel=["']canonical["'][^>]*href=["'])[^"']*(["'])/i, `$1${canonical}$2`);
  html = setMeta(html, 'og:title', 'property', title);
  html = setMeta(html, 'og:url', 'property', canonical);
  if (desc) { html = setMeta(html, 'description', 'name', desc); html = setMeta(html, 'og:description', 'property', desc); }
  mkdirSync(join(DIST, path), { recursive: true });
  writeFileSync(join(DIST, path, 'index.html'), html);
  n++;
}
console.log(`[prerender-route-heads] wrote ${n} per-route HTML files (title+canonical+description) · business="${businessName}"`);
