import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { PlayerProfileCard } from '@/features/players/components/PlayerProfileCard';

import {
  longNamePlayer,
  playerDetailPlayer,
  playerWithImage,
  playerWithoutOptionalFields,
  retiredPlayer,
} from './player-detail.mock';

const meta = {
  title: 'Features/Players/PlayerProfileCard',
  component: PlayerProfileCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['component-test'],
  args: {
    player: playerDetailPlayer,
  },
} satisfies Meta<typeof PlayerProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithPlayerImage: Story = {
  args: {
    player: playerWithImage,
  },
};

export const WithoutPlayerImage: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const LongPlayerName: Story = {
  args: {
    player: longNamePlayer,
  },
};

export const RetiredPlayer: Story = {
  args: {
    player: retiredPlayer,
  },
};

export const WithoutOptionalFields: Story = {
  args: {
    player: playerWithoutOptionalFields,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: '芳尾' })
    ).toBeVisible();
    await expect(canvas.getByText('ポジション')).toBeVisible();
    await expect(canvas.queryByText('投打')).not.toBeInTheDocument();
    await expect(canvas.queryByText('加入年')).not.toBeInTheDocument();
  },
};
