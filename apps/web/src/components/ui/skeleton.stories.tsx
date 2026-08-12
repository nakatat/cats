import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Card as CardComponent,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const meta = {
  title: 'Components/UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    className: 'h-5 w-48',
  },
};

export const Text: Story = {
  render: () => (
    <div aria-busy="true" className="flex max-w-md flex-col gap-3">
      <Skeleton className="h-6 w-2/5" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div aria-busy="true" className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <CardComponent aria-busy="true" className="max-w-md">
      <CardHeader className="flex flex-col gap-2">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-3/5" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="justify-end">
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </CardComponent>
  ),
};

export const PlayerList: Story = {
  render: () => (
    <div aria-busy="true" className="flex max-w-sm flex-col gap-3">
      {[1, 2, 3].map((player) => (
        <div key={player} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-8" />
        </div>
      ))}
    </div>
  ),
};

export const GameList: Story = {
  render: () => (
    <div aria-busy="true" className="flex max-w-lg flex-col gap-3">
      {[1, 2].map((game) => (
        <div
          key={game}
          className="border-border flex flex-col gap-3 rounded-xl border p-4"
        >
          <Skeleton className="h-3 w-28" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      ))}
    </div>
  ),
};
