import type { Meta, StoryObj } from '@storybook/react';
import { HeartPulse, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { BentoGrid } from './BentoGrid';

/**
 * `BentoGrid` — Apple-WWDC-style 12-col dense bento. The first tile is
 * auto-promoted to the hero cell (span-lg + tall). Tiles may carry an icon,
 * an image background, and a `span`.
 */
const meta = {
  title: 'Sections/BentoGrid',
  component: BentoGrid,
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DentalServices: Story = {
  args: {
    eyebrow: 'What we do',
    headline: 'Complete care under one roof',
    description: 'From routine cleanings to full smile makeovers — no referrals, no runaround.',
    tiles: [
      {
        id: 'cosmetic',
        title: 'Cosmetic & Invisalign',
        description:
          'Clear aligners, whitening, and porcelain veneers designed around your face, not a template.',
        image:
          'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Close-up of a bright, healthy smile',
        span: 'lg',
        tall: true,
        accent: true,
      },
      {
        id: 'preventive',
        title: 'Preventive cleanings',
        description: 'Gentle hygiene visits with same-day scheduling.',
        icon: <Sparkles className="h-6 w-6" />,
      },
      {
        id: 'emergency',
        title: 'Emergency dentistry',
        description: 'Chipped tooth or sudden pain? We keep same-day slots open.',
        icon: <Clock className="h-6 w-6" />,
      },
      {
        id: 'implants',
        title: 'Implants & restorations',
        description: 'Permanent, natural-looking replacements for missing teeth.',
        icon: <HeartPulse className="h-6 w-6" />,
      },
      {
        id: 'safety',
        title: 'Hospital-grade sterilization',
        description: 'Your safety is engineered into every appointment.',
        icon: <ShieldCheck className="h-6 w-6" />,
      },
    ],
  },
};

export const Minimal: Story = {
  args: {
    tiles: [
      { id: 'a', title: 'Same-day crowns', description: 'One visit, no temporaries.' },
      { id: 'b', title: 'Sedation options', description: 'Anxiety-free care for every patient.' },
      { id: 'c', title: 'Family-friendly', description: 'Kids and grandparents, same office.' },
    ],
  },
};
