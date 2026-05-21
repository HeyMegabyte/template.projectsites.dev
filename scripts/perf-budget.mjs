#!/usr/bin/env node
/**
 * Performance budget gate (idea #82).
 *
 * After `npm run build`, asserts:
 *   - JS bundle (gzipped) per asset ≤ 250 KB
 *   - CSS bundle (gzipped) ≤ 50 KB
 *   - Total dist size ≤ 5 MB
 *   - No file over 500 KB raw (excluding screenshot PNGs in /applied/)
 *
 * Exit 0 if all budgets pass, 1 if any fail. Wire into CI as a hard gate.
 *
 *   npm run perf-budget
 *   npm run perf-budget -- --json     # machine-readable
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const dist = resolve(repoRoot, 'dist');
const wantJson = process.argv.includes('--json');

const BUDGETS = {
  jsGzip:    250 * 1024,   // 250 KB
  cssGzip:    50 * 1024,   //  50 KB
  totalDist:   5 * 1024 * 1024, // 5 MB
  singleRaw: 500 * 1024,   // 500 KB
};

if (!existsSync(dist)) {
  console.error(`✗ dist/ not found. Run \`npm run build\` first.`);
  process.exit(1);
}

function walk(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const p = join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) return walk(p);
    return [{ path: p.slice(repoRoot.length + 1), size: stat.size }];
  });
}

const files = walk(dist);
const violations = [];

let total = 0;
for (const file of files) {
  total += file.size;
  if (file.size > BUDGETS.singleRaw && !file.path.includes('/applied/')) {
    violations.push({ rule: 'singleRaw', file: file.path, size: file.size, budget: BUDGETS.singleRaw });
  }
}

if (total > BUDGETS.totalDist) {
  violations.push({ rule: 'totalDist', file: 'dist/', size: total, budget: BUDGETS.totalDist });
}

// Check gzipped JS + CSS
for (const file of files) {
  if (file.path.endsWith('.js') || file.path.endsWith('.css')) {
    const raw = readFileSync(resolve(repoRoot, file.path));
    const gz = gzipSync(raw).length;
    if (file.path.endsWith('.js') && gz > BUDGETS.jsGzip) {
      violations.push({ rule: 'jsGzip', file: file.path, size: gz, budget: BUDGETS.jsGzip });
    }
    if (file.path.endsWith('.css') && gz > BUDGETS.cssGzip) {
      violations.push({ rule: 'cssGzip', file: file.path, size: gz, budget: BUDGETS.cssGzip });
    }
  }
}

const report = {
  totalDist: total,
  fileCount: files.length,
  budgets: BUDGETS,
  violations,
  passed: violations.length === 0,
};

if (wantJson) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.passed ? 0 : 1);
}

const fmt = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`);

console.log(`\nPerf budget report — dist/`);
console.log(`  Total: ${fmt(total)} of ${fmt(BUDGETS.totalDist)} budget`);
console.log(`  Files: ${files.length}`);

if (violations.length === 0) {
  console.log(`\n  \x1b[32m✓ All budgets pass.\x1b[0m\n`);
  process.exit(0);
}

console.log(`\n  \x1b[31m✗ ${violations.length} budget violations:\x1b[0m\n`);
for (const v of violations) {
  console.log(`  • [${v.rule}] ${v.file}`);
  console.log(`      ${fmt(v.size)} > ${fmt(v.budget)} budget`);
}
console.log();
process.exit(1);
