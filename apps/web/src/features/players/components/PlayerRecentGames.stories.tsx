import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerRecentGames } from '@/features/players/components/PlayerRecentGames';

import { playerDetailRecentGames } from './player-detail.mock';

const meta = {
  title: 'Features/Players/PlayerRecentGames',
  component: PlayerRecentGames,
  parameters: {
    layout: 'padded',
  },
  args: {
    games: playerDetailRecentGames,
  },
} satisfies Meta<typeof PlayerRecentGames>;

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
    games: [],
  },
};

export const LongOpponentName: Story = {
  args: {
    games: [
      {
        ...playerDetailRecentGames[0],
        game: {
          ...playerDetailRecentGames[0].game,
          opponentName: '札幌ベースボールクラブ長いチーム名サンプル',
        },
      },
    ],
  },
};
