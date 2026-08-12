import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameListItem } from '@/features/games/components/GameListItem';

import { gameListGames } from './games.mock';

const meta = {
  title: 'Features/Games/GameListItem',
  component: GameListItem,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GameListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    game: gameListGames[0],
  },
};

export const OpponentLogo: Story = {
  args: {
    game: gameListGames[0],
    opponentLogoUrl: '/brand/cats-logo-mark.png',
  },
};

export const LongTeamName: Story = {
  args: {
    game: {
      ...gameListGames[0],
      opponentName: '札幌ベースボールクラブ長いチーム名サンプル',
    },
  },
};

export const Scheduled: Story = {
  args: {
    game: {
      ...gameListGames[0],
      gameDate: '2019-10-13',
      opponentName: '対戦相手未定',
      status: 'scheduled',
      result: 'scheduled',
      runsFor: undefined,
      runsAgainst: undefined,
    },
  },
};
