import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerNavigation } from '@/features/players/components/PlayerNavigation';

import { playerListPlayers } from './players.mock';

const meta = {
  title: 'Features/Players/PlayerNavigation',
  component: PlayerNavigation,
  parameters: {
    layout: 'padded',
  },
  args: {
    previousPlayer: playerListPlayers[2],
    nextPlayer: playerListPlayers[1],
  },
} satisfies Meta<typeof PlayerNavigation>;

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
    nextPlayer: undefined,
  },
};

export const NextOnly: Story = {
  args: {
    previousPlayer: undefined,
  },
};
