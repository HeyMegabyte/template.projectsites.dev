import type { Meta, StoryObj } from '@storybook/react';
import {
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Clock,
  Leaf,
  Truck,
  Recycle,
  MapPin,
} from 'lucide-react';
import { BentoGrid } from './BentoGrid';

/**
 * `BentoGrid` — Apple-WWDC-style 12-col dense bento. The first tile is
 * auto-promoted to the hero cell (span-lg + tall) and carries a permanent OKLCH
 * accent wash. Tiles may carry an icon, an image background, and a `span`.
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`): each tile
 * lifts on hover/focus with an **accent ring + shadow**, a diagonal **glass
 * sheen** sweeps across, background images **zoom** gently, and tiles
 * **scroll-reveal** with a per-tile stagger. Focusable tiles keep a visible
 * focus ring (`:focus-within`).
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

/**
 * A LIGHT vertical (`data-theme="light"`) with mixed image + icon tiles and
 * explicit spans — proves the hover ring, glass sheen, accent wash, and image
 * zoom all stay legible + on-brand on a light canvas (no hardcoded white).
 */
export const LightVerticalLandscaping: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background">
        <Story />
      </div>
    ),
  ],
  args: {
    eyebrow: 'What we do',
    headline: 'A yard you’re proud of, all four seasons',
    description:
      'Design, build, and maintenance from one crew — organic-first, fully licensed, and obsessive about the details.',
    tiles: [
      {
        id: 'design',
        title: 'Landscape design & build',
        description:
          'Custom patios, native plantings, and low-water designs drawn around how you actually use the space.',
        image:
          'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Lush landscaped backyard garden with a stone patio',
        span: 'lg',
        tall: true,
        accent: true,
      },
      {
        id: 'organic',
        title: 'Organic lawn care',
        description: 'Chemical-free programs safe for kids and pets.',
        icon: <Leaf className="h-6 w-6" />,
      },
      {
        id: 'cleanup',
        title: 'Seasonal cleanups',
        description: 'Spring prep and fall leaf haul-away.',
        icon: <Recycle className="h-6 w-6" />,
      },
      {
        id: 'delivery',
        title: 'Mulch & soil delivery',
        description: 'By the yard, dropped exactly where you need it.',
        icon: <Truck className="h-6 w-6" />,
      },
      {
        id: 'local',
        title: 'Locally owned since 2011',
        description: 'Serving the whole metro — one neighborhood at a time.',
        icon: <MapPin className="h-6 w-6" />,
      },
    ],
  },
};
