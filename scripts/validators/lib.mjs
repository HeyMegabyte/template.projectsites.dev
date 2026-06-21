// Shared helpers for build validators. Pure node, no deps.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

/** Recursively list every .html file under dir. */
export function htmlFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) out.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  return out;
}

/** A build-break finding. */
export const fail = (validator, code, route, detail) => ({ validator, code, route, detail, level: 'error' });
export const warn = (validator, code, route, detail) => ({ validator, code, route, detail, level: 'warn' });
