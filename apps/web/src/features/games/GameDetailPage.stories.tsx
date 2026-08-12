import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameDetailPage } from '@/features/games/GameDetailPage';
import type { ApiResult } from '@/lib/api/client';

import {
  detailBattingLines,
  detailInningScores,
  detailPitchingLines,
  detailScoreboard,
  gameDetailGame,
  nextGame,
  previousGame,
} from './components/game-detail.mock';

const meta = {
  title: 'Features/Games/GameDetailPage',
  component: GameDetailPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/games/126',
      },
    },
  },
} satisfies Meta<typeof GameDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const ok = <T,>(data: T): ApiResult<T> => ({
  ok: true,
  status: 200,
  data,
});

export const Default: Story = {
  args: {
    gameResult: ok(gameDetailGame),
    battingResult: ok(detailBattingLines),
    pitchingResult: ok(detailPitchingLines),
    scoreboardResult: ok(detailScoreboard),
    inningScores: detailInningScores,
    previousGame,
    nextGame,
    summary: {
      endTime: '11:10',
    },
  },
};

export const WithoutStats: Story = {
  args: {
    gameResult: ok(gameDetailGame),
    battingResult: ok([]),
    pitchingResult: ok([]),
    scoreboardResult: ok(detailScoreboard),
    inningScores: detailInningScores,
    previousGame,
    nextGame,
    summary: {
      endTime: '11:10',
    },
  },
};
