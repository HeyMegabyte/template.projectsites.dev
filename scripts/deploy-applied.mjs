#!/usr/bin/env node
/**
 * Deploy every applied example to Cloudflare Pages.
 *
 *   node scripts/deploy-applied.mjs                # deploy all 9
 *   node scripts/deploy-applied.mjs latch          # deploy one
 *   node scripts/deploy-applied.mjs --build-only   # skip deploy, just build to dist-applied/
 *
 * For each example:
 *   1. Backs up current _brand.json
 *   2. Swaps in the example's _brand.json
 *   3. Runs `npm run build`
 *   4. Copies the example's Home.tsx.snippet.tsx into src/pages/Home.tsx (and other snippets)
 *   5. Re-builds
 *   6. Deploys to `projectsites-demo-{name}` Pages project
 *   7. Restores the original _brand.json + Home.tsx
 *
 * Prints the live URL per example. Outputs a JSON manifest at
 * `public/applied-manifest.json` that the gallery page reads.
 */
import { readFileSync, writeFileSync, copyFileSync, readdirSync, statSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { syncSecretsToPages, ensureCloudflareAuth, COMMON_SECRETS } from './lib/secrets.mjs';

// Auto-load Cloudflare auth from get-secret if env vars aren't set
ensureCloudflareAuth();

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const appliedDir = resolve(repoRoot, 'examples/applied');
const brandPath = resolve(repoRoot, '_brand.json');
const homePath = resolve(repoRoot, 'src/pages/Home.tsx');
const pricingPath = resolve(repoRoot, 'src/pages/Pricing.tsx');
const faqPath = resolve(repoRoot, 'src/pages/FAQ.tsx');

const buildOnly = process.argv.includes('--build-only');
const targetArg = process.argv.find((a) => !a.startsWith('--') && a !== process.argv[0] && a !== process.argv[1]);

const allExamples = readdirSync(appliedDir).filter((n) => statSync(join(appliedDir, n)).isDirectory());
const examples = targetArg ? [targetArg] : allExamples;

if (targetArg && !allExamples.includes(targetArg)) {
  console.error(`✗ Unknown example: ${targetArg}`);
  console.error(`  Available: ${allExamples.join(', ')}`);
  process.exit(1);
}

const PAGES_PREFIX = 'projectsites-demo';
const manifest = [];

// Backup originals once
const brandBackup = readFileSync(brandPath, 'utf8');
const homeBackup = readFileSync(homePath, 'utf8');
const pricingBackup = existsSync(pricingPath) ? readFileSync(pricingPath, 'utf8') : null;
const faqBackup = existsSync(faqPath) ? readFileSync(faqPath, 'utf8') : null;

function projectName(example) {
  return `${PAGES_PREFIX}-${example}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 58);
}

function applyExample(example) {
  const dir = join(appliedDir, example);
  const examplePath = join(dir, '_brand.json');
  copyFileSync(examplePath, brandPath);

  // Inline-apply Home / Pricing / FAQ snippets so the deploy actually shows the customized site
  const homeSnippet = join(dir, 'Home.tsx.snippet.tsx');
  if (existsSync(homeSnippet)) writeFileSync(homePath, readFileSync(homeSnippet, 'utf8'));

  const pricingSnippet = join(dir, 'Pricing.tsx.snippet.tsx');
  if (existsSync(pricingSnippet)) writeFileSync(pricingPath, readFileSync(pricingSnippet, 'utf8'));

  const faqSnippet = join(dir, 'FAQ.tsx.snippet.tsx');
  if (existsSync(faqSnippet)) writeFileSync(faqPath, readFileSync(faqSnippet, 'utf8'));
}

function restore() {
  writeFileSync(brandPath, brandBackup);
  writeFileSync(homePath, homeBackup);
  if (pricingBackup) writeFileSync(pricingPath, pricingBackup);
  if (faqBackup) writeFileSync(faqPath, faqBackup);
}

function readBusinessName(example) {
  const b = JSON.parse(readFileSync(join(appliedDir, example, '_brand.json'), 'utf8'));
  return {
    name: b.business?.name?.$value ?? example,
    tagline: b.business?.tagline?.$value ?? '',
    description: b.business?.description?.$value ?? '',
    businessClass: b.business?.businessClass?.$value ?? '',
    brandHue: b.color?.brandHue?.$value ?? '',
    colorScheme: b.colorScheme?.$value ?? 'dark',
  };
}

process.on('SIGINT', () => { restore(); process.exit(1); });
process.on('SIGTERM', () => { restore(); process.exit(1); });

try {
  for (const example of examples) {
    console.log(`\n══ ${example} ══`);
    const meta = readBusinessName(example);
    const project = projectName(example);

    console.log(`→ Apply brand + page snippets`);
    applyExample(example);

    console.log(`→ Build (vite-only — applied snippets may have unused-locals noise)`);
    execSync('npx vite build', { cwd: repoRoot, stdio: 'inherit' });

    if (buildOnly) {
      const out = resolve(repoRoot, `dist-applied/${example}`);
      mkdirSync(dirname(out), { recursive: true });
      if (existsSync(out)) rmSync(out, { recursive: true, force: true });
      execSync(`cp -R dist ${out}`, { cwd: repoRoot });
      console.log(`→ Saved to ${out}`);
      manifest.push({ example, ...meta, project, url: `https://${project}.pages.dev`, builtAt: new Date().toISOString() });
      continue;
    }

    console.log(`→ Ensure Pages project ${project} exists`);
    try {
      execSync(`npx wrangler pages project create ${project} --production-branch=main`, {
        cwd: repoRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      });
      console.log(`  ✓ Created ${project}`);
    } catch (err) {
      // Project may already exist — that's fine; deploy will succeed below.
      const msg = (err.stderr?.toString() ?? err.message).slice(0, 200);
      if (/already exists/i.test(msg)) {
        console.log(`  • Already exists`);
      } else {
        console.log(`  • Create returned: ${msg.split('\n')[0]}`);
      }
    }

    console.log(`→ Sync available secrets from get-secret`);
    syncSecretsToPages(project, COMMON_SECRETS);

    console.log(`→ Deploy to ${project}.pages.dev`);
    try {
      execSync(`npx wrangler pages deploy dist --project-name=${project} --branch=main --commit-dirty=true`, {
        cwd: repoRoot,
        stdio: 'inherit',
        env: process.env,
      });
      manifest.push({ example, ...meta, project, url: `https://${project}.pages.dev`, deployedAt: new Date().toISOString() });
    } catch (err) {
      console.error(`✗ Deploy failed for ${example}: ${err.message}`);
      manifest.push({ example, ...meta, project, url: null, error: err.message });
    }
  }
} finally {
  restore();
  console.log(`\n→ Restored original _brand.json + Home.tsx`);
}

const manifestPath = resolve(repoRoot, 'public/applied-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n✓ Manifest: ${manifestPath}`);
console.log(`\n${manifest.map((m) => `  ${m.example} → ${m.url ?? 'FAILED'}`).join('\n')}`);
