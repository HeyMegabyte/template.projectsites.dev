import type { Meta, StoryObj } from '@storybook/react';
import { Comparison } from './Comparison';

/**
 * `Comparison` — a competitive / tier table. The first column lists features;
 * each following column is an option. Cell values `true | false | 'partial'`
 * render Check / X / Minus icons; strings render verbatim.
 *
 * Cinematic behaviour (all component-scoped `.cmp-*`, every effect gated behind
 * `prefers-reduced-motion: no-preference` + `prefers-reduced-data` and
 * auto-neutralised for reduced users): rows **stagger-rise** as the table
 * scrolls into view, the answer icons **scale-pop** as their row settles, the
 * highlighted column shows a soft accent wash + a **glowing rail that draws
 * down**, and its ribbon **drops in via `@starting-style`** on first paint.
 * `clamp()` keeps the headline + column heads fluid across breakpoints.
 *
 * Scroll the canvas to feel the stagger. Under `prefers-reduced-motion` /
 * `prefers-reduced-data` (OS setting or DevTools emulation) the full table is
 * shown instantly with the rail drawn and the ribbon in place — nothing is
 * hidden behind an un-fired animation, and contrast stays AA on light AND dark.
 */
const meta = {
  title: 'Sections/Comparison',
  component: Comparison,
} satisfies Meta<typeof Comparison>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The flagship state — a "why us" table with the middle column highlighted as
 * the recommended option (ribbon + accent wash + drawn rail).
 */
export const WhyChooseUs: Story = {
  args: {
    eyebrow: 'How we compare',
    headline: 'The clear choice for your project',
    highlightColumn: 1,
    highlightLabel: 'Recommended',
    columns: ['DIY builder', 'Our team', 'Agency'],
    rows: [
      { feature: 'Live in under 15 minutes', values: [false, true, false] },
      { feature: 'Human design review', values: ['—', true, true] },
      {
        feature: 'Ongoing edits included',
        description: 'No hourly billing for small changes',
        values: [false, true, 'partial'],
      },
      { feature: 'Hosting + SSL managed', values: ['partial', true, true] },
      { feature: 'Transparent flat price', values: [true, true, false] },
      { feature: 'Accessibility built in', values: [false, true, 'partial'] },
      { feature: 'Own your content', values: [true, true, false] },
    ],
  },
};

/**
 * Long table — best for feeling the staggered scroll-in. Scroll the canvas and
 * watch each row rise and the icons pop in sequence.
 */
export const FeatureMatrix: Story = {
  args: {
    eyebrow: 'Plans',
    headline: 'Everything, compared side by side',
    highlightColumn: 2,
    highlightLabel: 'Most popular',
    columns: ['Starter', 'Growth', 'Scale'],
    rows: [
      { feature: 'Pages included', values: ['5', '25', 'Unlimited'] },
      { feature: 'Team seats', values: ['1', '5', 'Unlimited'] },
      { feature: 'Custom domain', values: [true, true, true] },
      { feature: 'Analytics dashboard', values: [false, true, true] },
      { feature: 'A/B testing', values: [false, 'partial', true] },
      { feature: 'Priority support', values: [false, false, true] },
      { feature: 'SSO + audit log', values: [false, false, true] },
      { feature: 'Uptime SLA', values: ['—', '99.9%', '99.99%'] },
    ],
  },
};

/**
 * No highlighted column — a neutral capability grid. Confirms the section reads
 * cleanly with no ribbon / rail / accent wash.
 */
export const NeutralGrid: Story = {
  args: {
    eyebrow: 'Capabilities',
    headline: 'What each edition supports',
    columns: ['Basic', 'Pro'],
    rows: [
      { feature: 'Contact forms', values: [true, true] },
      { feature: 'Online booking', values: [false, true] },
      { feature: 'Blog + newsletter', values: ['partial', true] },
      { feature: 'E-commerce', values: [false, true] },
    ],
  },
};

/**
 * Placeholder hygiene — unresolved `{TOKEN}` columns/rows are scrubbed and the
 * surviving data stays index-aligned; the highlight re-maps to the kept column.
 * Here `{COL_MID}` is dropped, so the 3-value rows collapse to the two real
 * options and the highlight lands on the correct remaining column.
 */
export const ScrubsPlaceholders: Story = {
  args: {
    eyebrow: 'How we compare',
    headline: 'Placeholders never ship',
    highlightColumn: 2,
    columns: ['Them', '{COL_MID}', 'Us'],
    rows: [
      { feature: 'Fast turnaround', values: [false, '{VAL}', true] },
      { feature: '{FEATURE_PLACEHOLDER}', values: [false, false, true] },
      { feature: 'Flat pricing', values: ['partial', '{VAL}', true] },
    ],
  },
};
