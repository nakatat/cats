import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatLeaders } from '@/features/stats/components/StatLeaders';

import { type StatLeader, statsMockData } from '../data/statsMock';

const imageLeader = statsMockData.battingLeaders[0];
const noImageLeader: StatLeader = {
  ...imageLeader,
  profileImageUrl: undefined,
};
const longNameLeader: StatLeader = {
  ...imageLeader,
  playerName: 'とても長い選手名のサンプル 太郎',
};

const meta = {
  title: 'Features/Stats/StatLeaders',
  component: StatLeaders,
  parameters: {
    layout: 'padded',
  },
  args: {
    leaders: statsMockData.battingLeaders,
    titleId: 'story-stats-leaders-title',
  },
} satisfies Meta<typeof StatLeaders>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = {
  args: {
    leaders: [imageLeader, ...statsMockData.battingLeaders.slice(1)],
  },
};

export const WithoutImage: Story = {
  args: {
    leaders: [noImageLeader, ...statsMockData.battingLeaders.slice(1)],
  },
};

export const LongName: Story = {
  args: {
    leaders: [longNameLeader, ...statsMockData.battingLeaders.slice(1)],
  },
};

export const FourItems: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
