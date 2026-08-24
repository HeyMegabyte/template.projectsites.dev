// validate-diff-artifacts — reject any HTML that shipped a DIFF / PATCH-shaped placeholder
// instead of a resolved document. This is the "the AI emitted a patch and the pipeline wrote
// it verbatim" class of failed generation, and it is INVISIBLE to every other validator:
//
//   <head>
//     <!-- existing head content remains unchanged -->   ← ENTIRE SEO <head> replaced by a comment
//   </head>
//   <body>
//     …one hero stub…
//     <!-- existing scripts remain unchanged -->          ← script tags never resolved
//   </body>
//
// A whole build shipped exactly this (journey 2026-08-23, scored 2.2/10): empty <title>, no
// meta description, no canonical, no OG, no viewport, zero JSON-LD — because the generation
// step returned a unified-diff-shaped edit and the build wrote it as-is rather than applying it
// against the template's real `index.html` head. Comments are stripped by the browser, so the
// page "renders" (200, no console error) while being catastrophically broken for SEO/crawlers —
// nothing in validate-route-metadata/-ssr-head/-assets/-links flags a COMMENT.
//
// The fix is a hard build gate keyed on the structural tells of a diff/patch leak. When it
// fires, the pipeline must RE-DERIVE the document from the template's base <head> + the site's
// SEO SSOT rather than shipping the patch text. Pure node, no deps.
import { readFileSync } from 'node:fs';
import { htmlFiles, fail } from './lib.mjs';

/**
 * Structural tells of a diff/patch-shaped artifact that leaked into shipped HTML.
 * Each targets a WAY an AI abbreviates "leave the rest of the file alone" in an edit,
 * or a raw VCS conflict marker — none of which is ever legitimate in a built page.
 * Deliberately narrow so ordinary HTML comments (`<!-- Open Graph -->`, `<!-- PWA -->`,
 * the template's own annotation comments) never match.
 */
const DIFF_ARTIFACT_RES = Object.freeze([
  // The exact leak that shipped: an HTML comment saying content was left "unchanged".
  // Matches "existing head content remains unchanged", "existing scripts remain unchanged",
  // "rest of the head unchanged", "... content stays the same", etc.
  {
    code: 'diff.placeholder_comment',
    re: /<!--[^>]*?\b(?:remains?|stay|stays|left|is|are|kept)\s+(?:the\s+same|unchanged|as[- ]is|as\s+before|intact)\b[^>]*?-->/i,
    detail:
      'HTML comment describes content as "unchanged"/"the same"/"as-is" — a diff/patch placeholder shipped verbatim instead of the resolved document. Re-derive the <head> from the template base + SEO SSOT; never write the model\'s abbreviation comment.',
  },
  // "<!-- ... existing / rest / remaining ... (head|scripts|content|code|markup|meta|sections) ... -->"
  {
    code: 'diff.placeholder_comment',
    re: /<!--[^>]*?\b(?:existing|rest\s+of|remaining|previous|other|unchanged|abbreviated|truncated|omitted|elided)\b[^>]*?\b(?:head|scripts?|content|code|markup|html|meta|tags?|sections?|body|styles?)\b[^>]*?-->/i,
    detail:
      'HTML comment references "existing/rest-of/remaining/omitted <head|scripts|content|…>" — the generation returned a diff/patch shape and it was written unresolved. Apply the edit against the real base file, or re-generate the full document.',
  },
  // Ellipsis-only "keep everything here" placeholder comment: <!-- ... --> or <!-- … -->
  {
    code: 'diff.placeholder_comment',
    re: /<!--\s*(?:\.\.\.|…)\s*-->/,
    detail:
      'Bare ellipsis HTML comment (<!-- ... -->) — a "keep the rest" diff placeholder. The document was never fully materialised.',
  },
  // Raw VCS / merge conflict markers leaked into shipped HTML.
  {
    code: 'diff.conflict_marker',
    re: /^(?:<{7}|={7}|>{7})[ \t]|^(?:<{7}|>{7})[ \t]*\S|\n(?:<{7}|={7}|>{7})[ \t]/m,
    detail:
      'Unresolved VCS/merge-conflict marker (<<<<<<< / ======= / >>>>>>>) in shipped HTML. The document is a raw conflict, not a resolved page.',
  },
  // Unified-diff body lines (a hunk header or +/- prefixed HTML) that survived into output.
  {
    code: 'diff.unified_hunk',
    re: /(?:^|\n)@@[ \t]*-\d+(?:,\d+)?[ \t]+\+\d+(?:,\d+)?[ \t]*@@/,
    detail:
      'Unified-diff hunk header (@@ -a,b +c,d @@) in shipped HTML — a raw diff was written as the page instead of the applied result.',
  },
]);

/**
 * Scan every HTML file in dist/ (INCLUDING index.html — the diff leak most often lands there)
 * for diff/patch-shaped artifacts. index.html is deliberately NOT exempted: the shipped-shell
 * head is exactly where "existing head content remains unchanged" wipes out all SEO.
 */
export function validateDiffArtifacts(dist) {
  const out = [];
  for (const f of htmlFiles(dist)) {
    const html = readFileSync(f, 'utf8');
    const route = '/' + f.slice(dist.length).replace(/^\/+/, '');
    for (const { code, re, detail } of DIFF_ARTIFACT_RES) {
      const m = html.match(re);
      if (m) {
        const snippet = m[0].replace(/\s+/g, ' ').slice(0, 120);
        out.push(fail('validate-diff-artifacts', code, route, `${detail} (found: "${snippet}")`));
        break; // one finding per file is enough to block the build
      }
    }
  }
  return out;
}
