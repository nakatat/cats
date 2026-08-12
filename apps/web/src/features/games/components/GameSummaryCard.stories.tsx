import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameSummaryCard } from '@/features/games/components/GameSummaryCard';

import { gameDetailGame } from './game-detail.mock';

const meta = {
  title: 'Features/Games/GameSummaryCard',
  component: GameSummaryCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    game: gameDetailGame,
    endTime: '11:10',
  },
} satisfies Meta<typeof GameSummaryCard>;

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

export const LongOpponentName: Story = {
  args: {
    game: {
      ...gameDetailGame,
      opponentName: '札幌ベースボールクラブ長いチーム名サンプル',
    },
  },
};

export const WithoutEndTime: Story = {
  args: {
    endTime: null,
  },
};
