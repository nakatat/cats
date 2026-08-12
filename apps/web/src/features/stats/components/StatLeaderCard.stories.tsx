import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { StatLeaderCard } from '@/features/stats/components/StatLeaderCard';

import { statsMockData } from '../data/statsMock';

const defaultLeader = statsMockData.battingLeaders[0];

const meta = {
  title: 'Features/Stats/StatLeaderCard',
  component: StatLeaderCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['component-test'],
  args: {
    leader: defaultLeader,
  },
} satisfies Meta<typeof StatLeaderCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = {};

export const WithoutImage: Story = {
  args: {
    leader: { ...defaultLeader, profileImageUrl: undefined },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('打率')).toBeVisible();
    await expect(canvas.getByText('.456')).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: /田中 太郎/ })
    ).toHaveAttribute('href', '/players/101');
  },
};

export const LongName: Story = {
  args: {
    leader: {
      ...defaultLeader,
      playerName: 'とても長い選手名のサンプル 太郎',
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
