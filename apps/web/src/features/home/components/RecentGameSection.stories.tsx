import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { detailInningScores } from '@/features/games/components/game-detail.mock';
import { RecentGameSection } from '@/features/home/components/RecentGameSection';

import { homeRecentGames } from './home.mock';

const meta = {
  title: 'Features/Home/RecentGameSection',
  component: RecentGameSection,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RecentGameSection>;

export default meta;

type Story = StoryObj<typeof meta>;

const longOpponentNameGames = [
  {
    ...homeRecentGames[0],
    opponentName: '札幌フルスイングスベースボールクラブ',
  },
];

export const Default: Story = {
  args: {
    game: homeRecentGames[0],
    inningScores: detailInningScores,
    inningScoreStatus: 'complete',
  },
};

export const Empty: Story = {
  args: {
    game: null,
  },
};

export const Mobile: Story = {
  args: {
    game: homeRecentGames[0],
    inningScores: detailInningScores,
    inningScoreStatus: 'complete',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const LongOpponentName: Story = {
  args: {
    game: longOpponentNameGames[0],
    inningScores: detailInningScores,
    inningScoreStatus: 'complete',
  },
};
