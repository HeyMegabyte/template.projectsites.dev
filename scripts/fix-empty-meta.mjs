#!/usr/bin/env node
// fix-empty-meta.mjs — postbuild safety net: NO built page may ship an empty
// <meta name="description">. The container fills index.html's {BUSINESS_DESCRIPTION}
// from _brand.json.business.description; when that's blank the meta ships empty (a real
// SERP defect, confirmed on live sites). useSEO fixes it CLIENT-side (invisible to
// crawlers) and only sub-routes are prerendered, so the crawler-visible homepage stays
// empty. This runs AFTER vite build over dist/**/*.html — pure Node, no browser, so it's
// cache-immune (lives in the freshly-cloned template's postbuild, not the container image).
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

/** Recursively list every .html under a dir. */
function htmlFiles(dir) {
  const out = [];
  let entries = [];
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) out.push(...htmlFiles(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Strip tags → collapsed visible text. */
const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clamp = (s, max = 156) => (s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…');

/**
 * Derive a real description from the page when the meta is empty. Priority:
 * the first substantial body <p> (hero subhead / about intro) → the <h1> joined
 * with the <title>'s brand+tagline → the <title> alone. Always non-empty.
 */
function derive(html) {
  const bodyStart = html.indexOf('<body');
  const body =
    bodyStart >= 0
      ? html
          .slice(bodyStart)
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<noscript[\s\S]*?<\/noscript>/gi, '') // exclude the SPA no-JS notice
      : '';
  // 1. A real prerendered body paragraph (hero subhead / about intro), if present.
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const txt = strip(m[1]);
    if (txt.length >= 80 && !/^\{[A-Z_]+\}$/.test(txt) && !/javascript is required|enable javascript/i.test(txt)) {
      return clamp(txt);
    }
  }
  // 2. Fallback (always available, filled): the <title> (name + tagline), plus the <h1>
  //    when it adds something the title doesn't already say. Never the noscript text.
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
  const title = strip((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const parts = [title];
  if (h1 && !title.toLowerCase().includes(h1.toLowerCase().slice(0, 18))) parts.push(h1);
  const seed = parts.filter((x) => x && !/^\{/.test(x)).join('. ');
  return seed ? clamp(seed) : '';
}

/** Set (or insert) a meta tag's content; returns the patched html. */
function setMeta(html, attr, name, value) {
  const re = new RegExp(`(<meta\\s+${attr}=["']${name}["'][^>]*\\scontent=["'])([^"']*)(["'][^>]*>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1${value}$3`);
  // no tag at all → inject before </head>
  const tag = `<meta ${attr}="${name}" content="${value}" />`;
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

let fixed = 0;
for (const file of htmlFiles(DIST)) {
  let html = readFileSync(file, 'utf8');
  const cur = (html.match(/<meta\s+name=["']description["'][^>]*\scontent=["']([^"']*)["']/i) || [])[1];
  if (cur && cur.trim() && !/^\{[A-Z_]+\}$/.test(cur.trim())) continue; // already has a real description
  const desc = derive(html).replace(/"/g, '&quot;');
  if (!desc) continue;
  html = setMeta(html, 'name', 'description', desc);
  html = setMeta(html, 'property', 'og:description', desc);
  html = setMeta(html, 'name', 'twitter:description', desc);
  writeFileSync(file, html);
  fixed++;
}
console.log(`[fix-empty-meta] filled ${fixed} page(s) with a derived <meta description>`);
