import type { Meta, StoryObj } from '@storybook/react';
import BeforeAfterSlider from './BeforeAfterSlider';

/**
 * `BeforeAfterSlider` — drag the accent handle (or arrow-keys) to wipe between a
 * `before` and `after` image. Theme-token + OKLCH-accent handle with a soft glow,
 * a scroll-reveal frame, a spring knob, and a keyboard focus ring. Legible on both
 * light and dark verticals. Ideal for cosmetic/dental whitening + Invisalign,
 * HVAC/landscaping installs, and remodels.
 */
const meta = {
  title: 'Local/BeforeAfterSlider',
  component: BeforeAfterSlider,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BeforeAfterSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhiteningResult: Story = {
  args: {
    label: 'Professional whitening — one visit',
    beforeSrc:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    afterSrc:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    beforeAlt: 'Smile before professional whitening',
    afterAlt: 'Brighter smile after professional whitening',
  },
};

/** No label — the slider stands alone inside a custom section. */
export const NoLabel: Story = {
  args: {
    beforeSrc:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    afterSrc:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    beforeAlt: 'Room before the remodel',
    afterAlt: 'Room after the remodel',
  },
};
