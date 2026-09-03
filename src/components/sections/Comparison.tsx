import { type CSSProperties } from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scrubText } from '@/lib/placeholders';

type Cell = boolean | string | 'partial';

export interface ComparisonRow {
  feature: string;
  values: Cell[];
  description?: string;
}

interface Props {
  columns: string[];
  rows: ComparisonRow[];
  eyebrow?: string;
  headline?: string;
  /** Highlight a single column (0-indexed) as "the recommended one." */
  highlightColumn?: number;
  /** Label shown in the ribbon above the highlighted column. Default "Recommended". */
  highlightLabel?: string;
  className?: string;
}

/**
 * Competitive / tier comparison table. First column = features. Subsequent
 * columns are options. Cell values: `true|false|"partial"` render icons;
 * strings render verbatim.
 *
 * Cinematic layer (all component-scoped `.cmp-*` classes, ALL motion
 * double-gated behind `prefers-reduced-motion: no-preference` +
 * `prefers-reduced-data` and auto-neutralised by the global reduced-motion
 * reset — see the `COMPARISON` block in `index.css`):
 * - Each row **stagger-rises** into view keyed on the inline `--cmp-i` index via
 *   an `animation-timeline: view()` scroll-timeline; the answer icons **scale-pop**
 *   as their row settles.
 * - The highlighted ("recommended") column gets a soft twin-tone accent wash, a
 *   glowing **vertical accent rail that draws down** the column, and a ribbon that
 *   drops in via `@starting-style` on first paint.
 * - `clamp()` fluid column headers + `text-wrap: balance` keep the header row
 *   crisp across breakpoints.
 *
 * The base (no-motion) state renders every row fully visible, the rail fully
 * drawn, and the ribbon in place — nothing is hidden behind an un-fired
 * animation. Theme-token colours only, so it is correct on light AND dark and
 * holds AA contrast; every interactive surface keeps a focus-visible ring.
 *
 * Placeholder hygiene: unresolved tokens (`{COL_1}`, `{FEATURE_1}`) are scrubbed
 * — columns/rows that collapse to nothing are dropped, and the whole section
 * self-hides when no real data remains.
 */
export function Comparison({
  columns,
  rows,
  eyebrow,
  headline,
  highlightColumn,
  highlightLabel = 'Recommended',
  className,
}: Props) {
  // Scrub unresolved tokens. Keep column↔value alignment intact by tracking the
  // original indices of the columns that survive, then projecting each row's
  // values through the same index map (and re-mapping `highlightColumn`).
  const keptCols = columns
    .map((c, i) => ({ label: scrubText(c), i }))
    .filter((c) => c.label.length > 0);
  const keptIdx = keptCols.map((c) => c.i);
  const safeColumns = keptCols.map((c) => c.label);
  const safeRows = rows
    .map((row) => ({
      feature: scrubText(row.feature),
      description: scrubText(row.description),
      values: keptIdx.map((i) => row.values[i]),
    }))
    .filter((row) => row.feature.length > 0);
  const safeEyebrow = scrubText(eyebrow);
  const safeHeadline = scrubText(headline);
  const safeHighlightLabel = scrubText(highlightLabel, 'Recommended');
  // Re-map the highlight to the post-scrub column position (or drop it).
  const mappedHighlight =
    typeof highlightColumn === 'number' ? keptIdx.indexOf(highlightColumn) : -1;
  const hl = mappedHighlight >= 0 ? mappedHighlight : undefined;

  if (safeColumns.length === 0 || safeRows.length === 0) return null;

  return (
    <section className={cn('py-24 md:py-32 max-w-container-wide mx-auto px-6', className)}>
      {(safeEyebrow || safeHeadline) && (
        <div className="text-center mb-12 reveal-on-view">
          {safeEyebrow && (
            <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>
          )}
          {safeHeadline && (
            <h2 className="cmp-headline mt-4 font-bold font-heading text-text text-balance">{safeHeadline}</h2>
          )}
        </div>
      )}
      <div className="cmp-frame relative overflow-x-auto card-tactile reveal-on-view">
        <table className="cmp-table min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="text-left p-4 md:p-6 font-heading text-sm font-semibold text-text-muted uppercase tracking-wider"
              >
                Feature
              </th>
              {safeColumns.map((c, i) => {
                const isHl = hl === i;
                return (
                  <th
                    key={c}
                    scope="col"
                    data-cmp-hl={isHl ? '' : undefined}
                    className={cn(
                      'cmp-col-head relative p-4 md:p-6 font-heading font-bold',
                      isHl ? 'bg-accent/10 text-accent' : 'text-text'
                    )}
                  >
                    {isHl && (
                      <>
                        {/* Ribbon drops in via @starting-style on first paint. */}
                        <span className="cmp-ribbon" aria-hidden="true">
                          {safeHighlightLabel}
                        </span>
                        {/* Glowing accent rail that draws down the highlighted column. */}
                        <span className="cmp-rail" aria-hidden="true" />
                      </>
                    )}
                    {c}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {safeRows.map((row, r) => (
              <tr
                key={row.feature}
                style={{ '--cmp-i': r } as CSSProperties}
                className="cmp-row hover:bg-surface-elevated transition-colors motion-reduce:transition-none"
              >
                <th scope="row" className="text-left p-4 md:p-6 align-top">
                  <span className="block text-text font-medium">{row.feature}</span>
                  {row.description && (
                    <span className="block text-xs text-text-subtle mt-1">{row.description}</span>
                  )}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn('p-4 md:p-6 text-center', hl === i && 'cmp-cell-hl bg-accent/5')}
                  >
                    {v === true && (
                      <Check className="cmp-icon inline text-success" size={20} aria-label="Yes" />
                    )}
                    {v === false && (
                      <X className="cmp-icon inline text-text-subtle" size={20} aria-label="No" />
                    )}
                    {v === 'partial' && (
                      <Minus className="cmp-icon inline text-warning" size={20} aria-label="Partial" />
                    )}
                    {typeof v === 'string' && <span className="text-text-muted text-sm">{scrubText(v)}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Comparison;
