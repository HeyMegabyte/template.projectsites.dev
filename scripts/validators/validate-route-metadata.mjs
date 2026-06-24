// validate-route-metadata — every HTML page has a non-empty <title> + meta description. Fail meta.missing.
import { readFileSync } from 'node:fs';
import { htmlFiles, fail } from './lib.mjs';

export function validateRouteMetadata(dist) {
  const out = [];
  for (const f of htmlFiles(dist)) {
    const html = readFileSync(f, 'utf8');
    const route = '/' + f.slice(dist.length).replace(/^\/+/, '');
    if (/\b(404|500|offline)\.html$/.test(f)) continue; // utility pages exempt from meta-desc
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim();
    const desc = (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1]?.trim();
    if (!title) out.push(fail('validate-route-metadata', 'meta.no_title', route, 'missing/empty <title>'));
    if (!desc) out.push(fail('validate-route-metadata', 'meta.no_description', route, 'missing/empty meta description'));
  }
  return out;
}
