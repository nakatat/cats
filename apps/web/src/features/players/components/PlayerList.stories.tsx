import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayerList } from '@/features/players/components/PlayerList';

import {
  playerListPlayers,
  playerLongName,
  playerWithoutOptionalFields,
} from './players.mock';

const meta = {
  title: 'Features/Players/PlayerList',
  component: PlayerList,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PlayerList>;

export default meta;

type Story = StoryObj<typeof meta>;

const manyPlayers = Array.from({ length: 24 }, (_, index) => ({
  ...playerListPlayers[index % playerListPlayers.length],
  playerId: 200 + index,
  uniformNumber: String((index % 24) + 1),
}));

export const Playground: Story = {
  args: {
    players: manyPlayers,
  },
};

export const Default: Story = {
  args: {
    players: playerListPlayers,
  },
};

export const Mobile: Story = {
  args: {
    players: playerListPlayers,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Empty: Story = {
  args: {
    players: [],
  },
};

export const LongPlayerName: Story = {
  args: {
    players: [playerLongName],
  },
};

export const MixedStatus: Story = {
  args: {
    players: playerListPlayers,
  },
};

export const WithoutOptionalFields: Story = {
  args: {
    players: [playerWithoutOptionalFields],
  },
};
