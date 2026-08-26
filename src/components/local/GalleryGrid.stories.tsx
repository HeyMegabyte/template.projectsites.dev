import type { Meta, StoryObj } from '@storybook/react';
import GalleryGrid from './GalleryGrid';

/**
 * `GalleryGrid` — cinematic masonry image grid. Click any tile to open the
 * site-wide PhotoSwipe lightbox (tiles carry a `data-gallery` id, each image a
 * `data-caption`). `heading` defaults to "Gallery".
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`): tiles
 * **scroll-reveal** with a per-tile stagger, the image **zooms** on hover/focus
 * behind a glass-rounded frame, an **accent ring + shadow** lifts the tile, and
 * the caption bar slides up from the base. Focusable tiles keep a visible focus
 * ring. Theme-token colors keep it legible on light + dark verticals.
 */
const meta = {
  title: 'Local/GalleryGrid',
  component: GalleryGrid,
} satisfies Meta<typeof GalleryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OfficeTour: Story = {
  args: {
    heading: 'Take a look inside our office',
    galleryId: 'office-tour',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
        alt: 'Modern dental treatment room with a large window',
        caption: 'Treatment suite with a calming garden view',
      },
      {
        src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
        alt: 'Clear aligner trays on a reflective surface',
        caption: 'Invisalign consultations every day',
      },
      {
        src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
        alt: 'Smiling dentist in a white coat',
        caption: 'Meet Dr. Alvarez',
      },
      {
        src: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=900&q=80',
        alt: 'Comfortable reception and waiting area',
        caption: 'A waiting room that feels like a living room',
      },
    ],
  },
};

/**
 * A LIGHT vertical (`data-theme="light"`) — proves the hover zoom, accent ring,
 * scroll-reveal stagger, and caption bar all stay legible + on-brand on a light
 * canvas (no hardcoded white).
 */
export const LightVerticalPortfolio: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background">
        <Story />
      </div>
    ),
  ],
  args: {
    heading: 'Recent projects',
    galleryId: 'portfolio',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=900&q=80',
        alt: 'Lush landscaped backyard garden with a stone patio',
        caption: 'Full backyard transformation',
      },
      {
        src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
        alt: 'Native perennial garden bed in bloom',
        caption: 'Low-water native planting',
      },
      {
        src: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
        alt: 'Flagstone walkway winding through a garden',
        caption: 'Hand-laid flagstone path',
      },
      {
        src: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=900&q=80',
        alt: 'Mature trees framing a manicured lawn',
        caption: 'Four-season maintenance',
      },
    ],
  },
};

export const SingleImageHeadingDefault: Story = {
  args: {
    images: [
      {
        src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80',
        alt: 'Close-up of a bright, healthy smile',
      },
    ],
  },
};
