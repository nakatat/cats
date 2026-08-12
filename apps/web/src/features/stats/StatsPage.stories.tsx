import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatsPage } from '@/features/stats/StatsPage';

import { statsMockData } from './data/statsMock';

const meta = {
  title: 'Features/Stats/StatsPage',
  component: StatsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/stats',
      },
    },
  },
  args: {
    data: statsMockData,
  },
} satisfies Meta<typeof StatsPage>;

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
