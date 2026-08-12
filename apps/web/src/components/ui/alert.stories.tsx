import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, CircleAlert, CircleX } from 'lucide-react';
import type { ComponentProps } from 'react';

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type AlertStoryArgs = ComponentProps<typeof Alert> & {
  description: string;
  title: string;
};

const meta = {
  title: 'Components/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
} satisfies Meta<AlertStoryArgs>;

export default meta;

type Story = StoryObj<AlertStoryArgs>;

export const Playground: Story = {
  args: {
    description: '試合日程の変更内容を確認してください。',
    title: 'お知らせ',
    variant: 'default',
  },
  render: ({ description, title, ...args }) => (
    <Alert {...args}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <AlertTitle>日程変更のお知らせ</AlertTitle>
        <AlertDescription>
          次回の試合開始時刻が変更になりました。
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>成績データを取得できません</AlertTitle>
        <AlertDescription>
          時間をおいてから、もう一度お試しください。
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <CircleAlert />
        <AlertTitle>試合中止のお知らせ</AlertTitle>
        <AlertDescription>
          悪天候のため、6月22日の試合は中止となりました。
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleX />
        <AlertTitle>成績データを取得できません</AlertTitle>
        <AlertDescription>
          通信状況を確認して、再読み込みしてください。
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert className="max-w-sm">
      <AlertTitle>日程変更のお知らせ</AlertTitle>
      <AlertDescription>試合開始時刻が変更になりました。</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          詳細を見る
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const InContent: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <CalendarDays />
        <AlertTitle>日程変更のお知らせ</AlertTitle>
        <AlertDescription>
          6月22日の試合は、開始時刻が7:30に変更となりました。
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>成績データを取得できません</AlertTitle>
        <AlertDescription>
          一時的に成績情報を表示できません。時間をおいてからご確認ください。
        </AlertDescription>
      </Alert>
    </div>
  ),
};
