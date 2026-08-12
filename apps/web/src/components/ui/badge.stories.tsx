import Link from 'next/link';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, CircleCheck, CircleX, Tag, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const badgeVariants = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const;

const meta = {
  title: 'Components/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: badgeVariants,
    },
    asChild: {
      control: false,
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: '試合予定',
    variant: 'default',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {badgeVariants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const BaseballStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>試合予定</Badge>
      <Badge variant="outline">試合終了</Badge>
      <Badge variant="secondary">勝利</Badge>
      <Badge variant="destructive">敗北</Badge>
      <Badge variant="ghost">試合中止</Badge>
      <Badge variant="outline">ルーキーリーグ</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <CalendarDays data-icon="inline-start" />
        試合予定
      </Badge>
      <Badge variant="secondary">
        <CircleCheck data-icon="inline-start" />
        勝利
      </Badge>
      <Badge variant="destructive">
        <CircleX data-icon="inline-start" />
        敗北
      </Badge>
      <Badge variant="outline">
        <Trophy data-icon="inline-start" />
        大会
      </Badge>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Badge asChild variant="link">
      <Link href="/games">
        試合一覧
        <Tag data-icon="inline-end" />
      </Link>
    </Badge>
  ),
};

export const InContent: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>最近の試合結果</CardTitle>
          <Badge variant="destructive">敗北</Badge>
        </div>
        <CardDescription>2019年5月26日（日） / 星置公園</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <span className="font-semibold">新琴似CATS</span>
        <span className="text-2xl font-bold">0 - 3</span>
        <span className="font-semibold">フルスイングス</span>
      </CardContent>
    </Card>
  ),
};
