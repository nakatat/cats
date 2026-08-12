import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TeamRecordCard } from '@/features/home/components/TeamRecordCard';

import { homeRecord } from './home.mock';

const meta = {
  title: 'Features/Home/TeamRecordCard',
  component: TeamRecordCard,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TeamRecordCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const noGamesRecord = {
  ...homeRecord,
  games: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winningPercentage: '.000',
  runsFor: 0,
  runsAgainst: 0,
};

const highScoringRecord = {
  ...homeRecord,
  games: 128,
  wins: 87,
  losses: 35,
  draws: 6,
  winningPercentage: '0.713',
  runsFor: 1024,
  runsAgainst: 987,
};

export const Default: Story = {
  args: {
    record: homeRecord,
  },
};

export const Mobile: Story = {
  args: {
    record: homeRecord,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const NoGames: Story = {
  args: {
    record: noGamesRecord,
  },
};

export const HighScoring: Story = {
  args: {
    record: highScoringRecord,
  },
};
