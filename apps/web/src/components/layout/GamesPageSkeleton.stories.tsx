import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  GamesFiltersSkeleton,
  GamesListSkeleton,
  GamesPageSkeleton,
} from '@/components/layout/GamesPageSkeleton';

const meta = {
  title: 'Components/Layout/GamesPageSkeleton',
  component: GamesPageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GamesPageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <GamesPageSkeleton />,
};

export const ListOnly: Story = {
  render: () => <GamesListSkeleton />,
};

export const FiltersOnly: Story = {
  render: () => <GamesFiltersSkeleton />,
};
