#!/usr/bin/env node
/**
 * Auto-load secrets from `get-secret` and sync them to a Cloudflare Pages /
 * Workers project. Run this BEFORE every deploy that depends on secrets.
 *
 * The script is idempotent: each secret is pushed via `wrangler pages secret
 * put`, which overwrites the previous value (or creates it). Secrets not
 * available via `get-secret` are silently skipped — they stay whatever the
 * Pages project already has set.
 *
 * Usage:
 *   import { syncSecretsToPages } from './lib/secrets.mjs';
 *   await syncSecretsToPages('template-projectsites-dev', ['RESEND_API_KEY', ...]);
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const GET_SECRET_BIN = '/Users/Apple/.local/bin/get-secret';

/** Try to read a secret from get-secret; return null if unavailable. */
export function tryGetSecret(key) {
  if (!existsSync(GET_SECRET_BIN)) return null;
  try {
    const out = execSync(`${GET_SECRET_BIN} ${key}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    // get-secret prints "The file /Users/.../secrets/KEY does not exist" on stdout for missing.
    // Detect that and treat as null. Real secrets won't start with "The file".
    if (!out || out.startsWith('The file ')) return null;
    return out;
  } catch {
    return null;
  }
}

/**
 * Set CF auth env vars from get-secret if not already set. Returns true if any
 * auth is available.
 *
 * Strategy: prefer API_KEY + EMAIL (global account scope) over API_TOKEN
 * because the user's TOKEN is sometimes scoped to fewer endpoints (e.g.,
 * deploys work but secret writes 403). When both are available, we set both
 * AND clear API_TOKEN from env so wrangler falls back to the broader API_KEY
 * path.
 */
export function ensureCloudflareAuth() {
  const haveKeyEmail = (process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_EMAIL);
  const haveToken = !!process.env.CLOUDFLARE_API_TOKEN;
  if (haveKeyEmail) {
    // Prefer the broader-scope path even if a token is also set.
    delete process.env.CLOUDFLARE_API_TOKEN;
    return true;
  }
  if (haveToken) return true;

  // Try get-secret. Prefer API_KEY+EMAIL when both available.
  const apiKey = tryGetSecret('CLOUDFLARE_API_KEY');
  const email = tryGetSecret('CLOUDFLARE_EMAIL');
  if (apiKey && email) {
    process.env.CLOUDFLARE_API_KEY = apiKey;
    process.env.CLOUDFLARE_EMAIL = email;
    delete process.env.CLOUDFLARE_API_TOKEN;
    return true;
  }

  const token = tryGetSecret('CLOUDFLARE_API_TOKEN');
  if (token) {
    process.env.CLOUDFLARE_API_TOKEN = token;
    return true;
  }
  return false;
}

/**
 * Push every available secret in `keys` to the given Pages project.
 *
 * @param {string} projectName  e.g. "template-projectsites-dev"
 * @param {string[]} keys       Secret names this project depends on. Each is
 *                              fetched via get-secret; missing ones skipped.
 * @returns {{ synced: string[]; skipped: string[] }}
 */
export function syncSecretsToPages(projectName, keys) {
  if (!ensureCloudflareAuth()) {
    console.warn(`[secrets] No Cloudflare auth available — skipping secret sync.`);
    return { synced: [], skipped: keys };
  }

  const synced = [];
  const skipped = [];

  for (const key of keys) {
    const value = tryGetSecret(key);
    if (!value) {
      console.log(`[secrets] ${key} not in get-secret — skip`);
      skipped.push(key);
      continue;
    }
    const res = spawnSync('npx', ['wrangler', 'pages', 'secret', 'put', key, `--project-name=${projectName}`], {
      input: value,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
      encoding: 'utf8',
    });
    if (res.status === 0) {
      console.log(`[secrets] ✓ ${key} synced to ${projectName}`);
      synced.push(key);
    } else {
      const err = (res.stderr || res.stdout || '').slice(0, 200);
      console.warn(`[secrets] ✗ ${key} failed: ${err}`);
      skipped.push(key);
    }
  }

  return { synced, skipped };
}

/**
 * Canonical list of secrets every project should TRY to sync. The function
 * silently skips any that get-secret doesn't have, so it's safe to call with
 * the union of every secret across the entire stack.
 */
export const COMMON_SECRETS = [
  // Email
  'RESEND_API_KEY',
  // AI providers
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_API_KEY',
  // Bot protection
  'TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY',
  // Payments
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SQUARE_ACCESS_TOKEN',
  // Analytics + monitoring
  'SENTRY_DSN',
  'POSTHOG_API_KEY',
  'GA4_MEASUREMENT_ID',
  // Auth
  'CLERK_SECRET_KEY',
  'CLERK_PUBLISHABLE_KEY',
];
