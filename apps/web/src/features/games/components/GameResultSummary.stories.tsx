import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { detailInningScores } from './game-detail.mock';
import { GameResultSummary } from './GameResultSummary';

const meta = {
  title: 'Features/Games/GameResultSummary',
  component: GameResultSummary,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GameResultSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  gameDate: '2019-05-26',
  tournamentName: 'ルーキーリーグ',
  stadiumName: '星置公園',
  homeTeamName: '新琴似CATS',
  awayTeamName: 'フルスイングス',
  homeLogoUrl: '/brand/cats-logo-mark.png',
  homeScore: 0,
  awayScore: 3,
};

export const Default: Story = {
  args: {
    ...commonArgs,
    showScoreboard: true,
    showDetailAction: true,
    inningScores: detailInningScores,
    inningScoreStatus: 'complete',
  },
};

export const ListLayout: Story = {
  args: {
    ...commonArgs,
    layout: 'list',
    showDetailAction: true,
  },
};
