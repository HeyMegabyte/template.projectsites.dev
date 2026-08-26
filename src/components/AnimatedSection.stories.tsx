import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedSection } from './AnimatedSection';

/**
 * `AnimatedSection` — the shared reveal-on-view wrapper used across nearly every
 * section (Testimonials, Timeline, Services, Contact, legal pages…). It watches
 * an IntersectionObserver and, once the element scrolls into view, plays a
 * cinematic **blur-rise**: the content lifts a touch, un-blurs
 * (`filter: blur(6px)→0`), and fades in on one expressive ease. GPU-friendly
 * (transform + opacity + filter only) so it composites at 60fps.
 *
 * The reveal styling lives in `index.css` (`.animate-on-scroll`); the base state
 * is fully visible + un-blurred, so no-JS / reduced-motion renders never hide or
 * soften content. Motion is gated behind `prefers-reduced-motion`.
 *
 * Props are stable: `children`, optional `className`, an optional Tailwind
 * `animation` override (default `animate-fadeInUp`; e.g. `animate-slideInLeft`),
 * and an optional `delay` (`animationDelay`) for staggering siblings.
 *
 * **Storybook caveat:** the reveal fires on scroll *and* Storybook's canvas
 * often has the element already in view, so it may render settled immediately.
 * The tall spacer in these stories lets you scroll a fresh instance into view to
 * watch the blur-rise play.
 */
const Card = ({ title }: { title: string }) => (
  <div className="card-tactile bg-surface p-6 sm:p-8">
    <h3 className="font-heading font-bold text-text text-xl">{title}</h3>
    <p className="mt-2 text-text-muted text-sm leading-relaxed">
      A sample content block wrapped by <code className="text-accent">AnimatedSection</code>. It rises,
      un-blurs, and fades into place as it enters the viewport.
    </p>
  </div>
);

const meta = {
  title: 'Components/AnimatedSection',
  component: AnimatedSection,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="bg-background">
        <div className="grid place-items-center text-text-subtle text-sm" style={{ minHeight: '70vh' }}>
          Scroll down to reveal the sections ↓
        </div>
        <div className="max-w-container-prose mx-auto pb-24">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AnimatedSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a single bare wrapper (how most sections use it): blur-rise fade-in. */
export const Default: Story = {
  args: {
    children: <Card title="Cinematic blur-rise reveal" />,
  },
};

/** Staggered siblings — the real pattern (grids/lists pass an incremental `delay`). */
export const Staggered: Story = {
  render: () => (
    <div className="space-y-6">
      {['First', 'Second', 'Third', 'Fourth'].map((label, i) => (
        <AnimatedSection key={label} delay={`${i * 0.15}s`}>
          <Card title={`${label} — delay ${(i * 0.15).toFixed(2)}s`} />
        </AnimatedSection>
      ))}
    </div>
  ),
};

/** Directional override — a caller passing `animation="animate-slideInLeft"`. */
export const SlideInLeft: Story = {
  args: {
    animation: 'animate-slideInLeft',
    children: <Card title="Slides in from the left (+ blur-clear)" />,
  },
};

/** On a light vertical — the tokens re-tint for free; the blur-rise is identical. */
export const OnLightTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background">
        <div className="grid place-items-center text-text-subtle text-sm" style={{ minHeight: '70vh' }}>
          Scroll down ↓
        </div>
        <div className="max-w-container-prose mx-auto pb-24">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    children: <Card title="Light theme — same blur-rise, token-driven colors" />,
  },
};
