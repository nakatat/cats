import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerDetailPageSkeleton } from '@/components/layout/PlayerDetailPageSkeleton';

const meta = {
  title: 'Components/Layout/PlayerDetailPageSkeleton',
  component: PlayerDetailPageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PlayerDetailPageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <PlayerDetailPageSkeleton />,
};
