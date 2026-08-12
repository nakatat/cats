import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GamesPage } from '@/features/games/GamesPage';
import type { ApiResult } from '@/lib/api/client';
import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

import {
  gameListGames,
  gameListSeasons,
  gameListTournaments,
} from './components/games.mock';

const meta = {
  title: 'Features/Games/GamesPage',
  component: GamesPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/games',
      },
    },
  },
} satisfies Meta<typeof GamesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const ok = <T,>(data: T): ApiResult<T> => ({
  ok: true,
  status: 200,
  data,
});

export const Default: Story = {
  args: {
    gamesResult: ok<GameResponse[]>(gameListGames),
    seasonsResult: ok<SeasonResponse[]>(gameListSeasons),
    tournamentsResult: ok<TournamentResponse[]>(gameListTournaments),
  },
};

export const ApiError: Story = {
  args: {
    gamesResult: {
      ok: false,
      status: 503,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: '試合一覧 API が利用できません。',
        details: [],
      },
    },
    seasonsResult: ok<SeasonResponse[]>(gameListSeasons),
    tournamentsResult: ok<TournamentResponse[]>(gameListTournaments),
  },
};
