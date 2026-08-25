import type { Meta, StoryObj } from '@storybook/react';
import { FAQ } from './FAQ';

/**
 * `FAQ` — accessible disclosure widgets that also emit FAQPage JSON-LD.
 * `exclusive` toggles single-open accordion vs multi-open disclosure.
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
    ],
  },
};

export const ExclusiveAccordion: Story = {
  args: {
    exclusive: true,
    items: [
      {
        question: 'Is Invisalign painful?',
        answer: 'Most patients feel mild pressure for a day or two after switching trays — never sharp pain.',
      },
      {
        question: 'How long is treatment?',
        answer: 'Simple cases finish in 6 months; complex cases take up to 18 months.',
      },
    ],
  },
};
