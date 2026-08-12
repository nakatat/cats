import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GameNavigation } from '@/features/games/components/GameNavigation';

import { nextGame, previousGame } from './game-detail.mock';

const meta = {
  title: 'Features/Games/GameNavigation',
  component: GameNavigation,
  parameters: {
    layout: 'padded',
  },
  args: {
    previousGame,
    nextGame,
  },
} satisfies Meta<typeof GameNavigation>;

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

export const PreviousOnly: Story = {
  args: {
    nextGame: undefined,
  },
};

export const NextOnly: Story = {
  args: {
    previousGame: undefined,
  },
};
