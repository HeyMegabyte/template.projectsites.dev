#!/usr/bin/env node
/**
 * Build `public/applied-manifest.json` by enumerating `examples/applied/`
 * and reading each example's `_brand.json` for metadata.
 *
 * Idempotent — preserves `screenshot` field if it already exists in the
 * previous manifest (added by `screenshot-applied.mjs`).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const appliedDir = resolve(repoRoot, 'examples/applied');
const manifestPath = resolve(repoRoot, 'public/applied-manifest.json');

const existing = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];
const existingByExample = Object.fromEntries(existing.map((e) => [e.example, e]));

const names = readdirSync(appliedDir).filter((n) => statSync(join(appliedDir, n)).isDirectory()).sort();

const manifest = names.map((example) => {
  const brandPath = join(appliedDir, example, '_brand.json');
  const b = JSON.parse(readFileSync(brandPath, 'utf8'));
  const project = `projectsites-demo-${example}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 58);

  return {
    example,
    name:          b.business?.name?.$value ?? example,
    tagline:       b.business?.tagline?.$value ?? '',
    description:   b.business?.description?.$value ?? '',
    businessClass: b.business?.businessClass?.$value ?? '',
    brandHue:      b.color?.brandHue?.$value ?? '',
    brandChroma:   b.color?.brandChroma?.$value ?? '',
    colorScheme:   b.colorScheme?.$value ?? 'dark',
    font:          { heading: b.font?.heading?.$value, body: b.font?.body?.$value },
    project,
    url:           `https://${project}.pages.dev`,
    screenshot:    existingByExample[example]?.screenshot ?? `/applied/${example}.png`,
  };
});

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✓ Manifest: ${manifest.length} entries → ${manifestPath}`);
console.log(manifest.map((m) => `  ${m.example.padEnd(28)} ${m.url}`).join('\n'));
