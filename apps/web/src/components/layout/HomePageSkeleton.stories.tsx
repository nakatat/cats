import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  HomeHeroSkeleton,
  HomePageSkeleton,
  RecentGameSectionSkeleton,
  TeamRecordCardSkeleton,
} from '@/components/layout/HomePageSkeleton';

const meta = {
  title: 'Components/Layout/HomePageSkeleton',
  component: HomePageSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomePageSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <HomePageSkeleton />,
};

export const Hero: Story = {
  render: () => <HomeHeroSkeleton />,
};

export const SeasonRecord: Story = {
  render: () => <TeamRecordCardSkeleton />,
};

export const RecentGames: Story = {
  render: () => <RecentGameSectionSkeleton />,
};
