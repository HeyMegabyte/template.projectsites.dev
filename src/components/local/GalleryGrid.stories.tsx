import type { Meta, StoryObj } from '@storybook/react';
import GalleryGrid from './GalleryGrid';

/**
 * `GalleryGrid` — masonry image grid with a click-to-open lightbox. Default
 * export component; `heading` defaults to "Gallery".
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

export const SingleColumnHeadingDefault: Story = {
  args: {
    images: [
      {
        src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80',
        alt: 'Close-up of a bright, healthy smile',
      },
    ],
  },
};
