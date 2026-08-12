import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameMatchup } from './GameMatchup';

const meta = {
  title: 'Components/Layout/GameMatchup',
  component: GameMatchup,
  parameters: {
    layout: 'padded',
  },
  args: {
    homeTeamName: '新琴似CATS',
    awayTeamName: 'フルスイングス',
    homeLogoUrl: '/brand/cats-logo-mark.png',
    homeScore: 0,
    awayScore: 3,
  },
} satisfies Meta<typeof GameMatchup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Compact: Story = {};

export const Featured: Story = {
  args: {
    variant: 'featured',
  },
};

export const Detail: Story = {
  args: {
    variant: 'detail',
  },
};

export const Scheduled: Story = {
  args: {
    homeScore: undefined,
    awayScore: undefined,
  },
};

export const Mobile: Story = {
  args: {
    variant: 'featured',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
