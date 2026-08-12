import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameList } from '@/features/games/components/GameList';

import {
  gameListGames,
  gameListSeasons,
  gameListTournaments,
} from './games.mock';

const meta = {
  title: 'Features/Games/GameList',
  component: GameList,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GameList>;

export default meta;

type Story = StoryObj<typeof meta>;

const paginationGames = Array.from({ length: 24 }, (_, index) => ({
  ...gameListGames[index % gameListGames.length],
  gameId: 200 + index,
  gameDate: `2019-${String(8 - Math.floor(index / 3)).padStart(2, '0')}-${String((index % 3) * 7 + 1).padStart(2, '0')}`,
}));

export const Default: Story = {
  args: {
    games: gameListGames,
    seasons: gameListSeasons,
    tournaments: gameListTournaments,
  },
};

export const Empty: Story = {
  args: {
    games: [],
    seasons: gameListSeasons,
    tournaments: gameListTournaments,
  },
};

export const Mobile: Story = {
  args: {
    games: gameListGames,
    seasons: gameListSeasons,
    tournaments: gameListTournaments,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const LongTeamName: Story = {
  args: {
    games: [
      {
        ...gameListGames[0],
        opponentName: '札幌ベースボールクラブ長いチーム名サンプル',
      },
    ],
    seasons: gameListSeasons,
    tournaments: gameListTournaments,
  },
};

export const Pagination: Story = {
  args: {
    games: paginationGames,
    seasons: gameListSeasons,
    tournaments: gameListTournaments,
  },
};
