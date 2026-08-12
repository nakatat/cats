import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatsPageSkeleton } from './StatsPageSkeleton';

const meta = {
  title: 'Components/Layout/StatsPageSkeleton',
  component: StatsPageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof StatsPageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
