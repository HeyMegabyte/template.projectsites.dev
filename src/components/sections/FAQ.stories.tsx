import type { Meta, StoryObj } from '@storybook/react';
import { FAQ } from './FAQ';

/**
 * `FAQ` — accessible disclosure widgets that also emit FAQPage JSON-LD.
 *
 * Cinematic behaviour (all gated behind `prefers-reduced-motion: no-preference`
 * and auto-neutralised for reduced-motion users): rows stagger-rise as the list
 * scrolls into view, the trigger lifts + reveals an accent hairline on
 * hover/focus, a focus-visible ring keeps it keyboard-operable, and the `+`
 * badge blooms into a glowing `×` while the open row gains a soft accent wash +
 * left accent bar. The answer slides via a `grid-rows` 0fr↔1fr transition with
 * a fade so there is zero layout jank. `exclusive` toggles single-open vs
 * multi-open. Try the "Interactions" a11y checks and toggle a row to see it.
 */
const meta = {
  title: 'Sections/FAQ',
  component: FAQ,
} satisfies Meta<typeof FAQ>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DentalFAQ: Story = {
  args: {
    eyebrow: 'Questions',
    headline: 'Frequently asked questions',
    description: 'Everything new patients ask us before their first appointment.',
    items: [
      {
        question: 'Do you accept my insurance?',
        answer:
          'We accept most PPO plans and file claims on your behalf. Call us with your provider and we will confirm your coverage in minutes.',
      },
      {
        question: 'How much does a new-patient visit cost?',
        answer:
          'A comprehensive exam, digital X-rays, and cleaning are $89 for uninsured patients. Insured patients typically pay nothing out of pocket.',
      },
      {
        question: 'Can I get seen the same day for a toothache?',
        answer:
          'Yes. We reserve same-day emergency slots every morning. Call before 10am and we will do our best to see you that afternoon.',
      },
      {
        question: 'Do you treat kids?',
        answer:
          'Absolutely — we are a family practice and welcome patients of every age, from toddlers to grandparents.',
      },
      {
        question: 'What if I have dental anxiety?',
        answer:
          'Tell us at booking. We offer nitrous, noise-cancelling headphones, and unhurried appointments so nervous patients stay comfortable start to finish.',
      },
    ],
  },
};

/** Single-open accordion mode — opening one row closes the others. */
export const ExclusiveAccordion: Story = {
  args: {
    exclusive: true,
    eyebrow: 'Treatment',
    headline: 'Invisalign, answered',
    items: [
      {
        question: 'Is Invisalign painful?',
        answer: 'Most patients feel mild pressure for a day or two after switching trays — never sharp pain.',
      },
      {
        question: 'How long is treatment?',
        answer: 'Simple cases finish in 6 months; complex cases take up to 18 months.',
      },
      {
        question: 'Can I eat with the aligners in?',
        answer: 'Take them out to eat and drink anything but water, then brush and pop them back in — 22 hours a day is the target.',
      },
    ],
  },
};

/** Long list — best for feeling the staggered scroll-in entrance. */
export const ManyQuestions: Story = {
  args: {
    eyebrow: 'Support',
    headline: 'Common questions',
    description: 'Scroll to watch each row stagger into view; hover a question for the accent lift.',
    items: Array.from({ length: 8 }, (_, i) => ({
      question: `Question number ${i + 1} — what should I expect?`,
      answer:
        'A clear, jargon-free answer that resolves the concern in a sentence or two, written the way a real front-desk teammate would explain it in person.',
    })),
  },
};
