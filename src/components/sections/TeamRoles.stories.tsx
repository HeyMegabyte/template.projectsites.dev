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
 * Six roles across two rows — the case where the cinematic polish reads best: the
 * staggered reveal-on-view lifts each card in on an incremental scroll offset (keyed on
 * `--role-i`), every card carries its gradient top-accent bar (hover/focus to brighten +
 * draw it full-width), and the accent icon circle warms, scales, and rotates on hover.
 */
export const NonprofitSixRoles: Story = {
  args: {
    eyebrow: 'Our team',
    headline: 'The people who make it happen',
    intro:
      'Staff and volunteers who show up every day so no neighbor is turned away — hover a card to see it come alive.',
    roles: [
      {
        title: 'Program Directors',
        description:
          'Leaders who design services around real community need and keep every program running with care.',
      },
      {
        title: 'Case Managers',
        description:
          'Advocates who meet people where they are and walk with them from first visit to lasting stability.',
      },
      {
        title: 'Volunteers',
        description:
          'Neighbors who give their time — sorting, serving, and welcoming — and make the mission possible.',
      },
      {
        title: 'Community Partners',
        description:
          'Local businesses and faith groups who share resources so help reaches further, together.',
      },
      {
        title: 'Development & Outreach',
        description:
          'Storytellers who raise the funds and awareness that keep the doors open and the shelves full.',
      },
      {
        title: 'Board & Governance',
        description:
          'Stewards who guard the mission, the finances, and the trust the community places in us.',
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
