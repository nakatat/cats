import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BattingStatsTable } from '@/features/games/components/BattingStatsTable';

import { detailBattingLines } from './game-detail.mock';

const meta = {
  title: 'Features/Games/BattingStatsTable',
  component: BattingStatsTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    stats: detailBattingLines,
  },
} satisfies Meta<typeof BattingStatsTable>;

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

export const LongPlayerName: Story = {
  args: {
    stats: [
      {
        ...detailBattingLines[0],
        displayName: 'とても長い選手名の表示サンプル 太郎',
      },
    ],
  },
};
