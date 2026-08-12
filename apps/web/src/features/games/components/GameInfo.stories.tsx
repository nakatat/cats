import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameInfo } from './GameInfo';

const meta = {
  title: 'Features/Games/GameInfo',
  component: GameInfo,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof GameInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gameDate: '2019-05-26',
    tournamentName: 'ルーキーリーグ',
    stadiumName: '星置公園',
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
  },
};

export const WithoutDetails: Story = {
  args: {
    gameDate: null,
    tournamentName: null,
    stadiumName: null,
    venueName: null,
  },
};
