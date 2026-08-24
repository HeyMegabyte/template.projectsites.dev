#!/usr/bin/env node
// build_validators.mjs — orchestrator. Runs every build-gate validator over dist/ and exits
// non-zero on any error-level finding (blocks deploy). Spec: heymegabyte-claude-skills
// rules/build-validators-manifest.md. Add validators here as they are implemented.
import { existsSync } from 'node:fs';
import { validateLinks } from './validators/validate-links.mjs';
import { validateRouteMetadata } from './validators/validate-route-metadata.mjs';
import { validateAssets } from './validators/validate-assets.mjs';
import { validateSsrHead } from './validators/validate-ssr-head.mjs';
import { validateDiffArtifacts } from './validators/validate-diff-artifacts.mjs';

const DIST = process.argv[2] || 'dist';
if (!existsSync(DIST)) { console.error(`build_validators: ${DIST}/ not found — run the build first`); process.exit(2); }

const VALIDATORS = [validateLinks, validateRouteMetadata, validateAssets, validateSsrHead, validateDiffArtifacts];
const findings = VALIDATORS.flatMap((v) => v(DIST));
const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');

for (const f of warns) console.warn(`⚠ [${f.code}] ${f.route} — ${f.detail}`);
for (const f of errors) console.error(`✗ [${f.code}] ${f.route} — ${f.detail}`);

if (errors.length) {
  console.error(`\nbuild_validators: ${errors.length} build-break finding(s) across ${VALIDATORS.length} validators. Fix before deploy.`);
  process.exit(1);
}
console.log(`✓ build_validators: ${VALIDATORS.length} validators passed over ${DIST}/ (${warns.length} warnings).`);
