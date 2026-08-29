#!/usr/bin/env node
/*
 * async-css.mjs — make the vite-emitted main stylesheet NON-render-blocking.
 *
 * WHY: the built site is a client-only SPA. Vite injects the app CSS as a
 * render-blocking `<link rel="stylesheet" href="/assets/index-*.css">` in <head>,
 * so the browser paints NOTHING until that bundle downloads (~3s on throttled
 * mobile → FCP ~3.6s). That also blocks the static splash hero (index.html #ps-splash,
 * styled by inline critical CSS) from painting early — defeating the whole prerender.
 *
 * FIX: rewrite the stylesheet link to the standard preload → onload-swap pattern
 * (+ a <noscript> fallback). The CSS still starts downloading immediately (preload,
 * high priority) but no longer blocks first paint, so the inline-CSS splash + hero
 * <img> paint at parse-time. The splash covers the viewport during the async window,
 * so the app (rendered only after React hydrates, by which point the CSS has loaded)
 * appears fully styled — no FOUC.
 *
 * The template's font <link> already uses an inline `onload` handler, so the served
 * CSP permits this pattern.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'dist/index.html';
if (!existsSync(FILE)) {
  console.warn('[async-css] dist/index.html not found — skipping');
  process.exit(0);
}

let html = readFileSync(FILE, 'utf8');
let count = 0;
html = html.replace(
  /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
  (_m, pre, href, post) => {
    count += 1;
    const attrs = `${pre}${post}`.replace(/\s+/g, ' ').trim();
    const spaced = attrs ? ` ${attrs}` : '';
    return (
      `<link rel="preload" as="style"${spaced} href="${href}" onload="this.onload=null;this.rel='stylesheet'">` +
      `<noscript><link rel="stylesheet"${spaced} href="${href}"></noscript>`
    );
  },
);

if (count === 0) {
  console.warn('[async-css] no render-blocking stylesheet link found (already async?)');
} else {
  writeFileSync(FILE, html);
  console.log(`[async-css] made ${count} stylesheet link(s) non-render-blocking`);
}
