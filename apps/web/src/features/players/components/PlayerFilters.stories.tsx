import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import {
  ALL_FILTER_VALUE,
  PlayerFilters,
} from '@/features/players/components/PlayerFilters';

const meta = {
  title: 'Features/Players/PlayerFilters',
  component: PlayerFilters,
  parameters: {
    layout: 'padded',
  },
  args: {
    defaultValue: {
      position: ALL_FILTER_VALUE,
      status: ALL_FILTER_VALUE,
      sort: 'uniform-number',
      search: '',
    },
    onChange: fn(),
  },
} satisfies Meta<typeof PlayerFilters>;

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

export const WithActiveFilters: Story = {
  args: {
    defaultValue: {
      position: '投手',
      status: 'active',
      sort: 'name',
      search: '田中',
    },
  },
};
