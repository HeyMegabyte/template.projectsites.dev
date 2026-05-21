#!/usr/bin/env node
/**
 * Hue rotation preview (idea #83).
 *
 * Renders the template at 12 hues (0/30/60/.../330) by:
 *   1. Backing up `_brand.json`
 *   2. For each hue: edit brand, run vite build, launch headless Chromium,
 *      screenshot the homepage to `public/applied/hue-rotate/{hue}.png`
 *   3. Restore `_brand.json`
 *
 * Useful for evaluating brand-token system across the full color wheel +
 * proving the OKLCH cascade works at every hue.
 *
 *   npm run hue-rotate            # all 12 hues
 *   npm run hue-rotate -- 30      # just hue 30 (single preview)
 *   npm run hue-rotate -- --light # use light colorScheme for the rotation
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const brandPath = resolve(repoRoot, '_brand.json');
const outDir = resolve(repoRoot, 'public/applied/hue-rotate');
mkdirSync(outDir, { recursive: true });

const single = process.argv.find((a) => /^\d+$/.test(a));
const useLight = process.argv.includes('--light');
const hues = single ? [Number(single)] : [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

const backup = readFileSync(brandPath, 'utf8');
process.on('SIGINT', () => { writeFileSync(brandPath, backup); process.exit(1); });
process.on('SIGTERM', () => { writeFileSync(brandPath, backup); process.exit(1); });

console.log(`→ Hue-rotating ${hues.length} preview${hues.length === 1 ? '' : 's'} (${useLight ? 'light' : 'dark'} mode)\n`);

try {
  for (const hue of hues) {
    const brand = JSON.parse(readFileSync(brandPath, 'utf8'));
    brand.color.brandHue.$value = String(hue);
    if (useLight) brand.colorScheme.$value = 'light';
    writeFileSync(brandPath, JSON.stringify(brand, null, 2));

    console.log(`▸ hue ${hue}`);
    execSync('npx vite build', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'inherit'] });

    // Launch preview server
    const preview = spawn('npx', ['vite', 'preview', '--port', '4179', '--strictPort'], {
      cwd: repoRoot,
      stdio: 'ignore',
      detached: false,
    });

    // Wait briefly + screenshot
    await new Promise((r) => setTimeout(r, 1500));

    const pw = await import('@playwright/test');
    const browser = await pw.chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
    const page = await ctx.newPage();
    try {
      await page.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await page.waitForSelector('main', { timeout: 10_000 });
      await page.waitForTimeout(600);
      const file = resolve(outDir, `hue-${String(hue).padStart(3, '0')}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log(`  ✓ ${file}`);
    } finally {
      await browser.close();
      preview.kill('SIGTERM');
      // Wait briefly for the port to release
      await new Promise((r) => setTimeout(r, 500));
    }
  }
} finally {
  writeFileSync(brandPath, backup);
  console.log(`\n→ Restored original _brand.json`);
}
