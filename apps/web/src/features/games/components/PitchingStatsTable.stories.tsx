import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PitchingStatsTable } from '@/features/games/components/PitchingStatsTable';

import { detailPitchingLines } from './game-detail.mock';

const meta = {
  title: 'Features/Games/PitchingStatsTable',
  component: PitchingStatsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    stats: detailPitchingLines,
  },
} satisfies Meta<typeof PitchingStatsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};

export const MultiplePitchers: Story = {
  args: {
    stats: detailPitchingLines,
  },
};
