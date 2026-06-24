// validate-links — every internal <a href> resolves to a real file in dist/. Fail routes.dead_link.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { htmlFiles, fail } from './lib.mjs';

export function validateLinks(dist) {
  const out = [];
  const files = htmlFiles(dist);
  for (const f of files) {
    const html = readFileSync(f, 'utf8');
    const route = '/' + f.slice(dist.length).replace(/^\/+/, '');
    for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"'#]+)["']/gi)) {
      let href = m[1].trim();
      if (/^(https?:|mailto:|tel:|data:|\/\/)/i.test(href)) continue; // external/scheme
      if (href.startsWith('#') || href === '') continue;
      const clean = href.split('?')[0].split('#')[0];
      // resolve relative to dist root (absolute) — template uses absolute internal links
      let target = clean.startsWith('/') ? join(dist, clean) : join(f, '..', clean);
      const candidates = [target, target + '.html', join(target, 'index.html')];
      if (!candidates.some((c) => existsSync(c) && statSync(c).isFile())) {
        out.push(fail('validate-links', 'routes.dead_link', route, `unresolved internal href: ${href}`));
      }
    }
  }
  return out;
}
