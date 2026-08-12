import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameDetailPageSkeleton } from '@/components/layout/GameDetailPageSkeleton';

const meta = {
  title: 'Components/Layout/GameDetailPageSkeleton',
  component: GameDetailPageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GameDetailPageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <GameDetailPageSkeleton />,
};
