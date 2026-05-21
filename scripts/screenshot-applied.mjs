#!/usr/bin/env node
/**
 * Screenshot every deployed applied example.
 *
 * Reads `public/applied-manifest.json` for URLs. For each, launches headless
 * Chromium, navigates, waits for `<main>` to be visible, captures viewport at
 * 1280×800, saves to `public/applied/{example}.png`.
 *
 * If the manifest doesn't exist yet, falls back to enumerating `examples/applied/`
 * + the conventional `projectsites-demo-{name}.pages.dev` URL pattern.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const manifestPath = resolve(repoRoot, 'public/applied-manifest.json');
const outDir = resolve(repoRoot, 'public/applied');
mkdirSync(outDir, { recursive: true });

let manifest;
if (existsSync(manifestPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} else {
  const appliedDir = resolve(repoRoot, 'examples/applied');
  const names = readdirSync(appliedDir).filter((n) => statSync(join(appliedDir, n)).isDirectory());
  manifest = names.map((example) => ({
    example,
    url: `https://projectsites-demo-${example}.pages.dev/`,
  }));
}

console.log(`→ Screenshotting ${manifest.length} sites…\n`);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2, // retina-ish for sharp screenshots
});

for (const entry of manifest) {
  if (!entry.url) {
    console.log(`✗ ${entry.example} — no URL`);
    continue;
  }
  const png = join(outDir, `${entry.example}.png`);
  const page = await context.newPage();
  try {
    await page.goto(entry.url, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForSelector('main', { timeout: 15_000 });
    // Settle animations
    await page.waitForTimeout(800);
    await page.screenshot({ path: png, fullPage: false, type: 'png' });
    console.log(`✓ ${entry.example} → public/applied/${entry.example}.png`);
    entry.screenshot = `/applied/${entry.example}.png`;
  } catch (err) {
    console.error(`✗ ${entry.example} — ${err.message}`);
    entry.screenshot = null;
    entry.screenshotError = err.message;
  } finally {
    await page.close();
  }
}

await browser.close();

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n✓ Manifest updated: ${manifestPath}`);
