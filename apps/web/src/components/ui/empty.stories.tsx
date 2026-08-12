import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, Search, UsersRound } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type EmptyStoryArgs = ComponentProps<typeof Empty> & {
  description: string;
  title: string;
};

const meta = {
  title: 'Components/UI/Empty',
  component: Empty,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
} satisfies Meta<EmptyStoryArgs>;

export default meta;

type Story = StoryObj<EmptyStoryArgs>;

export const Playground: Story = {
  args: {
    description: '新しい情報が登録されると、ここに表示されます。',
    title: '表示できるデータがありません',
  },
  render: ({ description, title, ...args }) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays />
        </EmptyMedia>
        <EmptyTitle>今後の試合予定はありません</EmptyTitle>
        <EmptyDescription>
          試合日程が決まり次第、ここに表示されます。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyTitle>試合結果がありません</EmptyTitle>
        <EmptyDescription>
          最新の試合結果が登録されるまでお待ちください。
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">試合一覧を見る</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const NoGames: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays />
        </EmptyMedia>
        <EmptyTitle>試合結果がありません</EmptyTitle>
        <EmptyDescription>
          このシーズンの試合結果はまだ公開されていません。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const NoPlayers: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersRound />
        </EmptyMedia>
        <EmptyTitle>選手が登録されていません</EmptyTitle>
        <EmptyDescription>
          選手情報が登録されると、ここに一覧で表示されます。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const SearchNotFound: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>一致する結果がありません</EmptyTitle>
        <EmptyDescription>
          検索条件を変更して、もう一度お試しください。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
