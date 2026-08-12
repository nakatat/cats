import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameScoreSection } from '@/features/games/components/GameScoreSection';

import { detailInningScores } from './game-detail.mock';

const meta = {
  title: 'Features/Games/GameScoreSection',
  component: GameScoreSection,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GameScoreSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    homeTeamName: '新琴似CATS',
    awayTeamName: 'フルスイングス',
    homeLogoUrl: '/brand/cats-logo-mark.png',
    homeScore: 0,
    awayScore: 3,
    inningScores: detailInningScores,
    inningScoreStatus: 'complete',
  },
};

export const WithoutScoreboard: Story = {
  args: {
    homeTeamName: '新琴似CATS',
    awayTeamName: 'フルスイングス',
    homeLogoUrl: '/brand/cats-logo-mark.png',
    homeScore: 0,
    awayScore: 3,
    showScoreboard: false,
    variant: 'compact',
  },
};
