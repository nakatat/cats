import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BattingStatsTable } from '@/features/stats/components/BattingStatsTable';

import { statsMockData } from '../data/statsMock';

const meta = {
  title: 'Features/Stats/BattingStatsTable',
  component: BattingStatsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    stats: statsMockData.batting,
  },
} satisfies Meta<typeof BattingStatsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {};

export const FewPlayers: Story = {
  args: {
    stats: statsMockData.batting.slice(0, 3),
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};
