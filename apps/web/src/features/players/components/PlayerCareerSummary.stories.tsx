import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerCareerSummary } from '@/features/players/components/PlayerCareerSummary';

import {
  playerBattingOnly,
  playerDetailBatting,
  playerDetailCareerSeasons,
  playerDetailPitching,
  playerPitchingOnly,
} from './player-detail.mock';

const meta = {
  title: 'Features/Players/PlayerCareerSummary',
  component: PlayerCareerSummary,
  parameters: {
    layout: 'padded',
  },
  args: {
    batting: playerDetailBatting,
    pitching: playerDetailPitching,
    seasons: playerDetailCareerSeasons,
  },
} satisfies Meta<typeof PlayerCareerSummary>;

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

export const BattingOnly: Story = {
  args: {
    batting: playerBattingOnly,
    pitching: undefined,
  },
};

export const PitchingOnly: Story = {
  args: {
    batting: undefined,
    pitching: playerPitchingOnly,
  },
};

export const Empty: Story = {
  args: {
    batting: undefined,
    pitching: undefined,
  },
};
