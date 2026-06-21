// validate-assets — every local asset ref (src/href to /assets, images, css, js) resolves in dist/. Fail assets.missing.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { htmlFiles, fail } from './lib.mjs';

export function validateAssets(dist) {
  const out = [];
  const seen = new Set();
  for (const f of htmlFiles(dist)) {
    const html = readFileSync(f, 'utf8');
    const route = '/' + f.slice(dist.length).replace(/^\/+/, '');
    for (const m of html.matchAll(/\b(?:src|href)=["'](\/[^"']+\.(?:png|jpe?g|webp|avif|svg|gif|ico|css|js|woff2?|json|webmanifest|xml|txt))["']/gi)) {
      const ref = m[1].split('?')[0];
      const key = route + '|' + ref;
      if (seen.has(key)) continue; seen.add(key);
      const target = join(dist, ref);
      if (!(existsSync(target) && statSync(target).isFile())) {
        out.push(fail('validate-assets', 'assets.missing', route, `asset ref does not resolve: ${ref}`));
      }
    }
  }
  return out;
}
