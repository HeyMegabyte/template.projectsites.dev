// validate-ssr-head — detect the SEO-collapse anti-pattern: a multi-route SPA that serves
// every route from one index.html (SPA fallback) with NO per-route server head — no
// prerendered route HTML AND no edge HTMLRewriter. Crawlers then read the homepage head on
// every URL → site collapses to one indexable URL. Fail seo.client_only_head. (checklist #3)
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { htmlFiles, fail } from './lib.mjs';

export function validateSsrHead(dist, root = '.') {
  // 1. How many routes does the site claim? (sitemap <loc> count)
  let routeCount = 0;
  const sm = join(dist, 'sitemap.xml');
  if (existsSync(sm)) routeCount = (readFileSync(sm, 'utf8').match(/<loc>/g) || []).length;

  // 2. How many prerendered route HTML files exist (excluding utility shells)?
  const UTIL = /(?:^|\/)(?:404|500|offline|index)\.html$/;
  const prerendered = htmlFiles(dist).filter((f) => !UTIL.test(f)).length;

  // 3. SPA catch-all fallback present? (_redirects /* → /index.html)
  const redir = join(dist, '_redirects');
  const spaFallback = existsSync(redir) && /\/\*\s+\/index\.html\s+200/.test(readFileSync(redir, 'utf8'));

  // 4. Any edge worker that rewrites the per-route <head>?
  const fnDirs = ['functions', 'src/worker', 'workers'].map((d) => join(root, d)).filter(existsSync);
  const grepDir = (d) => readdirSync(d, { withFileTypes: true }).some((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) return grepDir(p);
    return /\.(ts|js|mjs)$/.test(e.name) && /HTMLRewriter|getMeta\(|rewrite.*<title|on\(['"]title/.test(readFileSync(p, 'utf8'));
  });
  const edgeRewriter = fnDirs.some(grepDir);

  // Verdict: multi-route + SPA-fallback + no prerender + no edge rewrite = client-only head.
  if (routeCount > 1 && spaFallback && prerendered === 0 && !edgeRewriter) {
    return [fail('validate-ssr-head', 'seo.client_only_head', '/*',
      `${routeCount} routes (sitemap) all serve one index.html (SPA fallback) with NO per-route server head — no prerendered route HTML, no edge HTMLRewriter. Crawlers read the homepage head on every URL → SEO collapse. Add SSG prerender (vite-ssg) OR a Worker HTMLRewriter keyed on getMeta(pathname).`)];
  }
  return [];
}
