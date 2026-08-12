import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerDetailPage } from '@/features/players/PlayerDetailPage';
import type { ApiResult } from '@/lib/api/client';
import type { PlayerResponse } from '@/lib/api/players';

import {
  longNamePlayer,
  playerDetailBatting,
  playerDetailCareerSeasons,
  playerDetailPitching,
  playerDetailPlayer,
  playerDetailRecentGames,
  playerWithoutOptionalFields,
  retiredPlayer,
} from './components/player-detail.mock';
import { playerListPlayers } from './components/players.mock';

const meta = {
  title: 'Features/Players/PlayerDetailPage',
  component: PlayerDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/players/1',
      },
    },
  },
} satisfies Meta<typeof PlayerDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const ok = <T,>(data: T): ApiResult<T> => ({
  ok: true,
  status: 200,
  data,
});

const commonArgs = {
  playerResult: ok<PlayerResponse>(playerDetailPlayer),
  battingResult: ok([playerDetailBatting]),
  pitchingResult: ok([playerDetailPitching]),
  careerSeasons: playerDetailCareerSeasons,
  recentGames: playerDetailRecentGames,
  previousPlayer: playerListPlayers[2],
  nextPlayer: playerListPlayers[1],
};

export const Default: Story = {
  args: commonArgs,
};

export const Mobile: Story = {
  args: commonArgs,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithoutPlayerImage: Story = {
  args: commonArgs,
};

export const RetiredPlayer: Story = {
  args: {
    ...commonArgs,
    playerResult: ok<PlayerResponse>(retiredPlayer),
  },
};

export const WithoutOptionalFields: Story = {
  args: {
    ...commonArgs,
    playerResult: ok<PlayerResponse>(playerWithoutOptionalFields),
    battingResult: ok([]),
    pitchingResult: ok([]),
    recentGames: [],
  },
};

export const LongPlayerName: Story = {
  args: {
    ...commonArgs,
    playerResult: ok<PlayerResponse>(longNamePlayer),
  },
};
