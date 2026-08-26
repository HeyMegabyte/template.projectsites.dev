#!/usr/bin/env node
/**
 * Build-time site-integrity validator — prevents the defect classes from the
 * 2026-08-25 correction so they can never recur:
 *   1. LIGHT-ON-LIGHT CONTRAST — hardcoded `text-white`/`bg-white`/`border-white`
 *      on a theme surface is invisible on the 6 light verticals. Use the
 *      theme-aware tokens (text-text / text-text-muted / text-text-subtle /
 *      bg-surface / border-border) instead. A genuinely-dark surface on the same
 *      element (bg-[#0..], bg-primary, bg-black) or a `contrast-dark-ok` marker
 *      is allowed; the `components/local/` lightbox is exempt.
 *   2. INTERNAL LINKS THAT 404 — every `to="/x"` / `href="/x"` must resolve to a
 *      real <Route> (App.tsx) or a known static file (sitemap.xml, robots.txt…).
 *
 * Static source analysis — fast (<1s), zero build dependency, keeps the site
 * build well under 10 min. Run via `npm run validate:site`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const violations = [];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p);
  }
  return out;
}

// ── Known routes (App.tsx) + static public/ files ──
const appTsx = fs.readFileSync(path.join(SRC, 'App.tsx'), 'utf8');
const routes = new Set([...appTsx.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]));
const STATIC_OK = new Set([
  '/sitemap.xml', '/robots.txt', '/humans.txt', '/site.webmanifest', '/manifest.json',
  '/favicon.ico', '/browserconfig.xml', '/feed.xml', '/atom.xml', '/feed.json',
  '/.well-known/security.txt', '/offline.html', '/llms.txt',
]);

function linkResolves(link) {
  const base = link.split('#')[0] || '/';
  if (routes.has(base) || STATIC_OK.has(base)) return true;
  for (const r of routes) {
    if (!r.includes(':')) continue;
    if (new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$').test(base)) return true;
  }
  return false;
}

const CONTRAST_EXEMPT_DIR = /\/components\/local\//;

for (const f of walk(SRC)) {
  const rel = path.relative(ROOT, f);
  const src = fs.readFileSync(f, 'utf8');

  // 1) internal-link 404 check
  for (const m of src.matchAll(/\b(?:to|href)=["'](\/[^"'${}][^"'${}]*)["']/g)) {
    const link = m[1];
    if (!linkResolves(link)) {
      violations.push({ kind: 'link-404', file: rel, detail: `internal link "${link}" matches no <Route> or static file — it would 404` });
    }
  }

  // 2) contrast check
  if (CONTRAST_EXEMPT_DIR.test(rel)) continue;
  src.split('\n').forEach((line, i) => {
    if (/contrast-dark-ok/.test(line)) return;
    if (/bg-\[#0[0-9a-fA-F]/.test(line) || /\bbg-primary\b/.test(line) || /\bbg-black\b/.test(line)) return;
    const m = line.match(/\b(text-white(?:\/\d+)?|placeholder-white\/\d+|placeholder:text-white\/\d+|bg-white\/[\d.[\]]+|border-white\/\d+)\b/);
    if (m) {
      violations.push({ kind: 'contrast', file: rel, line: i + 1, detail: `hardcoded light class "${m[1]}" is invisible on light themes — use theme tokens (text-text / text-text-muted / text-text-subtle / bg-surface / border-border)` });
    }
  });
}

if (violations.length) {
  console.error(`\n✗ validate-site: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  [${v.kind}] ${v.file}${v.line ? ':' + v.line : ''} — ${v.detail}`);
  console.error('');
  process.exit(1);
}
console.log(`✓ validate-site: ${routes.size} routes; internal links resolve; no light-on-light contrast`);
