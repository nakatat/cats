import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlayersPage } from '@/features/players/PlayersPage';
import type { ApiResult } from '@/lib/api/client';
import type { PlayerResponse } from '@/lib/api/players';

import { playerListPlayers } from './components/players.mock';

const meta = {
  title: 'Features/Players/PlayersPage',
  component: PlayersPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/players',
      },
    },
  },
} satisfies Meta<typeof PlayersPage>;

export default meta;

type Story = StoryObj<typeof meta>;

const ok = <T,>(data: T): ApiResult<T> => ({
  ok: true,
  status: 200,
  data,
});

export const Default: Story = {
  args: {
    playersResult: ok<PlayerResponse[]>(playerListPlayers),
  },
};

export const Mobile: Story = {
  args: {
    playersResult: ok<PlayerResponse[]>(playerListPlayers),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Empty: Story = {
  args: {
    playersResult: ok<PlayerResponse[]>([]),
  },
};
