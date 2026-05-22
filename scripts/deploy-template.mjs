#!/usr/bin/env node
/**
 * Deploy the template repo itself to Cloudflare Pages as the project
 * `template-projectsites-dev`. The deploy uses:
 *
 *   - `_brand.gallery.json` swapped in as `_brand.json` (so the header
 *     shows "ProjectSites" + indigo branding instead of placeholders)
 *   - `VITE_TEMPLATE_MODE=gallery` build env so `/` renders the Gallery
 *     route instead of the placeholder Home
 *
 * After deploy, the script restores the original `_brand.json`.
 *
 * Run after `scripts/deploy-applied.mjs` + `scripts/screenshot-applied.mjs`
 * so `public/applied-manifest.json` and `public/applied/*.png` exist.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const brandPath = resolve(repoRoot, '_brand.json');
const galleryBrandPath = resolve(repoRoot, '_brand.gallery.json');

if (!existsSync(galleryBrandPath)) {
  console.error(`✗ Missing ${galleryBrandPath}`);
  process.exit(1);
}

if (!existsSync(resolve(repoRoot, 'public/applied-manifest.json'))) {
  console.warn(`! No applied-manifest.json — gallery will render empty.`);
  console.warn(`  Run: npm run deploy:applied && npm run screenshot:applied`);
}

const PROJECT = 'template-projectsites-dev';
const brandBackup = readFileSync(brandPath, 'utf8');

process.on('SIGINT', () => { writeFileSync(brandPath, brandBackup); process.exit(1); });
process.on('SIGTERM', () => { writeFileSync(brandPath, brandBackup); process.exit(1); });

try {
  console.log(`→ Swap in gallery brand`);
  writeFileSync(brandPath, readFileSync(galleryBrandPath, 'utf8'));

  console.log(`→ Generate feeds + sitemap with gallery brand`);
  execSync('node scripts/build-feeds.mjs', { cwd: repoRoot, stdio: 'inherit' });

  console.log(`→ Build with VITE_TEMPLATE_MODE=gallery`);
  execSync('npx vite build', {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, VITE_TEMPLATE_MODE: 'gallery' },
  });

  console.log(`→ Copy feeds into dist/`);
  for (const file of ['feed.xml', 'atom.xml', 'feed.json', 'sitemap.xml']) {
    const src = resolve(repoRoot, 'public', file);
    const dst = resolve(repoRoot, 'dist', file);
    if (existsSync(src)) writeFileSync(dst, readFileSync(src));
  }

  console.log(`→ Ensure Pages project ${PROJECT} exists`);
  try {
    execSync(`npx wrangler pages project create ${PROJECT} --production-branch=main`, {
      cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'], env: process.env,
    });
    console.log(`  ✓ Created`);
  } catch (err) {
    const msg = (err.stderr?.toString() ?? err.message);
    if (/already exists/i.test(msg)) console.log(`  • Already exists`);
    else console.log(`  • ${msg.split('\n')[0]}`);
  }

  console.log(`→ Deploy`);
  execSync(`npx wrangler pages deploy dist --project-name=${PROJECT} --branch=main --commit-dirty=true`, {
    cwd: repoRoot, stdio: 'inherit', env: process.env,
  });

  console.log(`\n✓ Deployed to https://${PROJECT}.pages.dev`);
  console.log(`  Custom domain: template.projectsites.dev (configure via Cloudflare dashboard if not already wired)`);
} finally {
  writeFileSync(brandPath, brandBackup);
  console.log(`→ Restored original _brand.json`);
}
