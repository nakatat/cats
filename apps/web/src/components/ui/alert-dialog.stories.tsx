import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CircleAlertIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type AlertDialogStoryArgs = {
  size: 'default' | 'sm';
};

const meta = {
  title: 'Components/UI/AlertDialog',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
} satisfies Meta<AlertDialogStoryArgs>;

export default meta;

type Story = StoryObj<AlertDialogStoryArgs>;

export const Playground: Story = {
  args: {
    size: 'default',
  },
  render: ({ size }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          確認ダイアログを開く
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogTitle>成績を更新しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            入力した試合結果を反映します。反映後も成績は編集できます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction>更新する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(['sm', 'default'] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline">
              {size} を開く
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle>試合日程を確認しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                サイズごとの幅を確認するための、少し長めの説明文です。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>戻る</AlertDialogCancel>
              <AlertDialogAction>確認する</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          注意事項を開く
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleAlertIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>試合開始時刻を確認してください</AlertDialogTitle>
          <AlertDialogDescription>
            集合時刻と試合開始時刻が変更されている場合があります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>戻る</AlertDialogCancel>
          <AlertDialogAction>確認した</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          削除確認を開く
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>試合結果を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction variant="destructive">削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const GameCancellation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          試合中止を確定
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>試合中止を確定しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            6月22日（日）のBCリーグ戦を中止として公開します。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>戻る</AlertDialogCancel>
          <AlertDialogAction>中止を確定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
