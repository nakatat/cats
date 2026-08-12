import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PitchingStatsTable } from '@/features/stats/components/PitchingStatsTable';

import { statsMockData } from '../data/statsMock';

const meta = {
  title: 'Features/Stats/PitchingStatsTable',
  component: PitchingStatsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    stats: statsMockData.pitching,
  },
} satisfies Meta<typeof PitchingStatsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {};

export const FewPlayers: Story = {
  args: {
    stats: statsMockData.pitching.slice(0, 3),
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};
