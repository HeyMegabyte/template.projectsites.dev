import type { Meta, StoryObj } from '@storybook/react';
import { TeamRoles } from './TeamRoles';

/**
 * `TeamRoles` — a role-based "meet the team / providers" credibility band. It presents
 * ROLES (title + description) inside accent-iconed glass cards rather than named
 * individuals, because generated sites must never fabricate real staff. It emits no
 * Person JSON-LD, filters any still-`{TOKEN}` role, and self-hides when none survive.
 */
const meta = {
  title: 'Sections/TeamRoles',
  component: TeamRoles,
} satisfies Meta<typeof TeamRoles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Restaurant: Story = {
  args: {
    eyebrow: 'Our team',
    headline: 'The people behind the plates',
    intro:
      'A from-scratch kitchen and a warm front-of-house team who treat every guest like family.',
    roles: [
      {
        title: 'Chefs & Kitchen',
        description:
          'Cooks who source local, make everything from scratch, and plate every dish with pride.',
      },
      {
        title: 'Bar & Beverage',
        description:
          'A craft team who pour thoughtful wine, beer, and house cocktails to match the menu.',
      },
      {
        title: 'Hospitality & Service',
        description:
          'A warm front-of-house crew who know the regulars and make every guest feel at home.',
      },
    ],
  },
};

export const Medical: Story = {
  args: {
    eyebrow: 'Our team',
    headline: 'The people who care for you',
    intro:
      'Real clinicians and staff who know your name, listen closely, and treat your whole family with warmth.',
    roles: [
      {
        title: 'Physicians & Providers',
        description:
          'Board-certified doctors who listen first, explain in plain language, and treat the whole person.',
      },
      {
        title: 'Nursing & Clinical Care',
        description:
          'A steady, compassionate care team who make every exam, lab, and follow-up feel calm and unhurried.',
      },
      {
        title: 'Front Office & Patient Support',
        description:
          'Friendly staff who make scheduling, insurance, and paperwork simple, so getting care is never a hassle.',
      },
    ],
  },
};

/**
 * Edge case — an unfilled token role is filtered out; the section still renders with the
 * surviving real roles (proving the self-heal never prints a `{TOKEN}` card).
 */
export const FiltersUnfilledTokens: Story = {
  args: {
    headline: 'The team behind the work',
    roles: [
      { title: 'Experienced Team', description: 'Seasoned pros who bring real craft to every project.' },
      { title: '{TEAM_ROLE_2_TITLE}', description: '{TEAM_ROLE_2_DESC}' },
      { title: 'Trusted Partners', description: 'A team who stand behind their work and your success.' },
    ],
  },
};
