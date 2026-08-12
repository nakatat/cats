import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Components/UI/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  render: (args) => (
    <div className="flex h-24 w-full items-center justify-center">
      <Separator {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">試合結果</h3>
        <p className="text-muted-foreground text-sm">
          直近の試合結果をお知らせします。
        </p>
      </div>
      <Separator />
      <p className="text-muted-foreground text-sm">
        2019年5月26日（日） ルーキーリーグ / 星置公園
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-24 items-center gap-4">
      <span className="font-medium">新琴似CATS</span>
      <Separator orientation="vertical" />
      <span className="text-muted-foreground">フルスイングス</span>
    </div>
  ),
};

export const InContent: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>今季チーム成績</CardTitle>
        <CardDescription>2019年度の戦績です。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">試合数</span>
          <span className="text-xl font-bold">12</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">勝利</span>
          <span className="text-xl font-bold">8</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">勝率</span>
          <span className="text-xl font-bold">.727</span>
        </div>
      </CardContent>
    </Card>
  ),
};
