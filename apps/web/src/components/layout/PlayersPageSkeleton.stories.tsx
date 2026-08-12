import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  PlayersFiltersSkeleton,
  PlayersListSkeleton,
  PlayersPageSkeleton,
} from '@/components/layout/PlayersPageSkeleton';

const meta = {
  title: 'Components/Layout/PlayersPageSkeleton',
  component: PlayersPageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PlayersPageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <PlayersPageSkeleton />,
};

export const ListOnly: Story = {
  render: () => <PlayersListSkeleton />,
};

export const FiltersOnly: Story = {
  render: () => <PlayersFiltersSkeleton />,
};
