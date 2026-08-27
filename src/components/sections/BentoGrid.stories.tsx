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
 * accent wash, a fine grain texture, and a soft breathing aura. Tiles may carry
 * an icon, an image background, and a `span`.
 *
 * Cinematic + interactive layer (every effect motion-gated behind
 * `prefers-reduced-motion`; the resting base state is fully visible so
 * reduced-motion / no-JS never hides a tile): each tile **stagger-reveals** on
 * scroll (keyed on `--bento-i`), then **lifts** on hover/focus with an **accent
 * ring + glow** and a **top accent hairline**; a **cursor-tracked spotlight**
 * (`--bento-mx/my`) follows the pointer on fine-pointer devices; a diagonal
 * **glass sheen** sweeps across; the **icon springs**; background images do a
 * slow **Ken-Burns** drift + brighten; link tiles glide an **arrow** in. Titles
 * are fluid (`clamp()`). Focusable tiles keep a visible focus ring
 * (`:focus-within`). Colors are theme tokens + `--color-accent` only.
 *
 * Try it: hover the hero tile (spotlight follows the cursor + aura breathes),
 * tab through the link tiles (focus ring + arrow glide), and toggle
 * `prefers-reduced-motion` — all motion snaps off, every tile stays legible.
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
 * Linked tiles — every tile is an anchor, so tab through to see the **focus
 * ring** + the **arrow glide**, and hover to watch the **cursor spotlight**
 * track the pointer. The hero tile also breathes its aura.
 */
export const LinkedTiles: Story = {
  args: {
    eyebrow: 'Explore',
    headline: 'Everything you can book online',
    tiles: [
      {
        id: 'whitening',
        title: 'Professional whitening',
        description: 'In-chair or take-home — brighter in a single visit.',
        href: '/services/whitening',
        span: 'lg',
        tall: true,
        accent: true,
      },
      { id: 'checkup', title: 'Routine check-ups', description: 'Twice-a-year visits, gently done.', href: '/services/checkups', icon: <Sparkles className="h-6 w-6" /> },
      { id: 'ortho', title: 'Orthodontics', description: 'Aligners and braces for every age.', href: '/services/orthodontics', icon: <HeartPulse className="h-6 w-6" /> },
      { id: 'urgent', title: 'Urgent care', description: 'Same-day relief when it counts.', href: '/services/urgent', icon: <Clock className="h-6 w-6" /> },
      { id: 'guarantee', title: 'Comfort guarantee', description: 'Anxiety-free, every appointment.', href: '/about', icon: <ShieldCheck className="h-6 w-6" /> },
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
