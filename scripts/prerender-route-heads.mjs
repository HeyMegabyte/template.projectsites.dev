#!/usr/bin/env node
// prerender-route-heads.mjs — INTERIM SEO-collapse fix. The app is a client SPA; crawlers
// read the static index.html shell, so every route ships the homepage <title>+canonical=/.
// This postbuild step writes dist/<route>/index.html for each static route with a UNIQUE
// per-route <title> + per-route <link canonical>, so CF Pages serves real per-route HTML
// (file-based, before the /* → /index.html SPA fallback). Descriptions stay shell-level
// pending the full vite-react-ssg fix (which resolves per-route desc by running React).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

// origin + business name from the shell's existing head.
const origin = (shell.match(/<link[^>]+rel=["']canonical["'][^>]*href=["'](https?:\/\/[^/"']+)/i) || [])[1] || '';
const homeTitle = (shell.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
const businessName = homeTitle.split(/\s[—–-]\s/)[0].trim() || homeTitle.trim();

// static routes → page label (dynamic /blog/:slug etc. handled by full SSR later).
const ROUTES = {
  '/about': 'About', '/services': 'Services', '/contact': 'Contact', '/pricing': 'Pricing',
  '/faq': 'FAQ', '/team': 'Team', '/gallery': 'Gallery', '/case-studies': 'Case studies',
  '/blog': 'Blog', '/privacy': 'Privacy Policy', '/terms': 'Terms of Service',
  '/accessibility': 'Accessibility', '/studio': 'Brand Studio',
};

let n = 0;
for (const [path, label] of Object.entries(ROUTES)) {
  const title = `${label} — ${businessName}`;
  const canonical = `${origin}${path}`;
  let html = shell
    .replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
    .replace(/(<link[^>]+rel=["']canonical["'][^>]*href=["'])[^"']*(["'])/i, `$1${canonical}$2`)
    .replace(/(<meta[^>]+property=["']og:title["'][^>]*content=["'])[^"']*(["'])/i, `$1${title}$2`)
    .replace(/(<meta[^>]+property=["']og:url["'][^>]*content=["'])[^"']*(["'])/i, `$1${canonical}$2`);
  mkdirSync(join(DIST, path), { recursive: true });
  writeFileSync(join(DIST, path, 'index.html'), html);
  n++;
}
console.log(`[prerender-route-heads] wrote ${n} per-route HTML files · business="${businessName}" · origin=${origin}`);
