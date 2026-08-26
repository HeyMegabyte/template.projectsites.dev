#!/usr/bin/env node
// prerender-spa.mjs — browser-prerender (react-snap pattern). Runs the BUILT SPA in headless
// Chromium per route and saves the fully-rendered HTML → dist/<route>/index.html. Fixes the
// whole crawler-invisibility class at once (body content + per-route head + JSON-LD) with ZERO
// component/SSR-compat changes. Crawlers (no JS) get real content; users still hydrate the app.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
// Routes = every indexable URL from the sitemap (incl dynamic /blog/:slug, /case-studies/:slug),
// minus the home shell (left as-is). Falls back to the static set if no sitemap.
function discoverRoutes() {
  const sm = join(DIST, 'sitemap.xml');
  if (existsSync(sm)) {
    const locs = [...readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(/^(https?:\/\/[^/]+|\{[^}]+\})/, '').split('?')[0]) // strip scheme+host OR {PLACEHOLDER}
      .filter((p) => p && p.startsWith('/') && p !== '/');
    if (locs.length) return [...new Set(locs)];
  }
  return ['/about','/services','/contact','/pricing','/quote','/faq','/team','/gallery','/case-studies','/blog','/privacy','/terms','/accessibility'];
}
const ROUTES = discoverRoutes();
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon', '.webmanifest':'application/manifest+json', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2' };

// tiny static server with SPA fallback (so the app boots + client-routes)
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = join(DIST, p);
  if (!existsSync(f) || !extname(f)) f = join(DIST, 'index.html'); // SPA fallback
  try { const buf = await readFile(f); res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }); res.end(buf); }
  catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
let n = 0;
for (const route of ROUTES) {
  await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForFunction(() => { const r = document.getElementById('root'); return r && r.innerHTML.length > 500; }, { timeout: 10000 }).catch(() => {});
  const html = '<!DOCTYPE html>\n' + await page.evaluate(() => document.documentElement.outerHTML);
  await mkdir(join(DIST, route), { recursive: true });
  await writeFile(join(DIST, route, 'index.html'), html);
  n++;
}
await browser.close(); server.close();
console.log(`[prerender-spa] rendered ${n} routes to static HTML`);
