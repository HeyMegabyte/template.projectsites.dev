#!/usr/bin/env node
/**
 * Lighthouse CI runner (idea #81).
 *
 * Runs Lighthouse against every URL in `public/applied-manifest.json` and
 * reports Performance / Accessibility / Best-Practices / SEO scores.
 *
 *   npm run lighthouse              # text report
 *   npm run lighthouse -- --json    # JSON report for CI
 *
 * Requires `lighthouse` package — installs on first run via `npx`.
 *
 * Pass/fail thresholds:
 *   Performance ≥ 75
 *   Accessibility ≥ 90
 *   Best Practices ≥ 90
 *   SEO ≥ 95
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const manifestPath = resolve(repoRoot, 'public/applied-manifest.json');
const wantJson = process.argv.includes('--json');

if (!existsSync(manifestPath)) {
  console.error('✗ public/applied-manifest.json missing.');
  process.exit(1);
}

const THRESHOLDS = { performance: 0.75, accessibility: 0.9, 'best-practices': 0.9, seo: 0.95 };

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const reports = [];

for (const entry of manifest) {
  if (!entry.url) continue;
  console.error(`▸ ${entry.example}`);
  try {
    const stdout = execSync(
      `npx lighthouse "${entry.url}" --quiet --chrome-flags="--headless=new" --output=json --output-path=stdout --only-categories=performance,accessibility,best-practices,seo`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 50 * 1024 * 1024 },
    );
    const lh = JSON.parse(stdout);
    const scores = {};
    for (const k of Object.keys(THRESHOLDS)) {
      scores[k] = Math.round(lh.categories[k].score * 100);
    }
    const passes = Object.entries(scores).every(([k, v]) => v >= THRESHOLDS[k] * 100);
    reports.push({ example: entry.example, url: entry.url, scores, passes });
    if (!wantJson) {
      console.error(`  P:${scores.performance} A:${scores.accessibility} BP:${scores['best-practices']} SEO:${scores.seo}  ${passes ? '✓' : '✗'}`);
    }
  } catch (err) {
    reports.push({ example: entry.example, url: entry.url, error: err.message.slice(0, 200), passes: false });
    if (!wantJson) console.error(`  ✗ ${err.message.slice(0, 200)}`);
  }
}

if (wantJson) {
  console.log(JSON.stringify({ thresholds: THRESHOLDS, reports }, null, 2));
} else {
  const failing = reports.filter((r) => !r.passes).length;
  console.error(`\n${reports.length - failing}/${reports.length} pass · thresholds: P≥${THRESHOLDS.performance * 100} A≥${THRESHOLDS.accessibility * 100} BP≥${THRESHOLDS['best-practices'] * 100} SEO≥${THRESHOLDS.seo * 100}\n`);
}

process.exit(reports.some((r) => !r.passes) ? 1 : 0);
