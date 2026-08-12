import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DialogStoryArgs = {
  showCloseButton: boolean;
};

const meta = {
  title: 'Components/UI/Dialog',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showCloseButton: {
      control: 'boolean',
    },
  },
} satisfies Meta<DialogStoryArgs>;

export default meta;

type Story = StoryObj<DialogStoryArgs>;

export const Playground: Story = {
  args: {
    showCloseButton: true,
  },
  render: ({ showCloseButton }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">詳細を開く</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>チーム成績の詳細</DialogTitle>
          <DialogDescription>
            今季の成績を確認し、必要に応じて一覧画面へ移動できます。
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm leading-6">
          現在の成績は12試合8勝3敗1分です。
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          表示設定を開く
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>表示設定を変更しますか？</DialogTitle>
          <DialogDescription>
            変更内容は成績一覧を閉じるまでこの画面に反映されます。
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          打率と防御率を小数点以下3桁で表示します。
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button>変更を反映</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          お知らせを開く
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>試合日程を更新しました</DialogTitle>
          <DialogDescription>
            次回試合の開始時刻が変更されています。
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm leading-6">
          6月22日（日）の試合は、7:30開始へ変更となりました。
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button>閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          規約を開く
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>大会参加に関するご案内</DialogTitle>
          <DialogDescription>
            参加前に確認が必要な内容を掲載しています。
          </DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground flex flex-col gap-4 text-sm leading-6">
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index}>
              第{index + 1}項:
              試合開始時刻の30分前までに集合し、登録内容と用具を確認してください。
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const GameDetails: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">試合詳細を見る</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>試合詳細</DialogTitle>
          <DialogDescription>
            2019年5月26日（日） ルーキーリーグ
          </DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-muted-foreground">対戦相手</dt>
          <dd className="font-medium">フルスイングス</dd>
          <dt className="text-muted-foreground">スコア</dt>
          <dd className="font-medium tabular-nums">
            新琴似CATS 0 - 3 フルスイングス
          </dd>
          <dt className="text-muted-foreground">球場</dt>
          <dd className="font-medium">星置公園</dd>
        </dl>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
