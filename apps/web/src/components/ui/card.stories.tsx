import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, CircleAlert, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const meta = {
  title: 'Components/UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'highlight'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    padding: {
      control: 'select',
      options: ['default', 'content'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'default',
    padding: 'content',
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Playground</CardTitle>
          <CardDescription>
            Controls から variant と size を変更できます。
          </CardDescription>
        </CardHeader>
        <CardContent>Card の表示確認用コンテンツです。</CardContent>
      </>
    ),
  },
};

const stats = [
  { label: '試合数', value: '12', unit: '試合' },
  { label: '勝ち', value: '8', unit: '勝' },
  { label: '負け', value: '3', unit: '敗' },
  { label: '勝率', value: '.727', unit: '' },
];

const game = {
  date: '2019年5月26日（日）',
  league: 'ルーキーリーグ',
  stadium: '星置公園',
  home: '新琴似CATS',
  away: 'フルスイングス',
  score: '0 - 3',
  result: '負け',
};

function StoryGrid({ children }: { children: ReactNode }) {
  return <div className="grid max-w-5xl gap-4 md:grid-cols-3">{children}</div>;
}

function StoryLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
      {children}
    </p>
  );
}

export const Basic: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>今季チーム成績</CardTitle>
        <CardDescription>
          CardHeader / CardContent / CardFooter の基本構造です。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-6">
          汎用の表示枠として、意味を持つ表示内容は children で組み立てます。
          余白、枠線、角丸、背景色は Card 側の基準を使います。
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" variant="outline">
          詳細を見る
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <StoryGrid>
      {(['default', 'subtle', 'highlight'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <StoryLabel>{variant}</StoryLabel>
            <CardTitle>カード見出し</CardTitle>
            <CardDescription>
              背景、枠線、影の差を比較するためのカードです。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-6">
              Home や一覧画面で使う汎用表示枠として扱います。
            </p>
          </CardContent>
        </Card>
      ))}
    </StoryGrid>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StoryGrid>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Card key={size} size={size}>
          <CardHeader>
            <StoryLabel>{size}</StoryLabel>
            <CardTitle>カード見出し</CardTitle>
            <CardDescription>
              size による余白と文字サイズの基準を確認します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-6">
              小さい一覧から Hero 内の強調カードまでを想定しています。
            </p>
          </CardContent>
        </Card>
      ))}
    </StoryGrid>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="max-w-xl" variant="highlight">
      <CardHeader className="grid-cols-[1fr_auto] gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>次の試合</CardTitle>
          <CardDescription>試合予定の確認と詳細導線の例です。</CardDescription>
        </div>
        <Button size="sm">詳細</Button>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-xs font-medium">日付</p>
          <p className="text-lg font-semibold">2019年6月22日（土）</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">球場</p>
          <p className="text-lg font-semibold">もみじ台球場</p>
        </div>
      </CardContent>
      <CardFooter className="border-border/70 bg-muted/50 justify-between gap-3 border-t py-4">
        <span className="text-muted-foreground text-sm">BCリーグ</span>
        <Button size="sm" variant="outline">
          成績を見る
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          size="sm"
          variant={index === 3 ? 'highlight' : 'default'}
        >
          <CardContent className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              {stat.unit ? (
                <p className="text-muted-foreground pb-1 text-sm">
                  {stat.unit}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const GameCard: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{game.date}</CardTitle>
              <CardDescription>
                {game.league} / {game.stadium}
              </CardDescription>
            </div>
            <Badge variant="destructive">{game.result}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <p className="font-semibold">{game.home}</p>
            <p className="text-3xl font-bold tracking-tight">{game.score}</p>
            <p className="font-semibold">{game.away}</p>
          </div>
        </CardContent>
        <CardFooter className="border-border/70 bg-muted/50 grid grid-cols-3 gap-3 border-t py-4 text-sm">
          <span>試合状態</span>
          <span className="font-medium">試合終了</span>
          <span className="text-right font-medium">{game.result}</span>
        </CardFooter>
      </Card>

      <Card variant="highlight">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-primary size-5" />
            <CardTitle>今後の試合予定</CardTitle>
          </div>
          <CardDescription>次回試合のカード表示例です。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-sm">2019年6月22日</p>
              <p className="text-2xl font-bold">新琴似CATS vs 未定</p>
            </div>
            <p className="text-secondary-foreground bg-secondary rounded-lg px-3 py-2 text-xl font-bold">
              07:30
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm">BCリーグ</span>
          <Button size="sm" variant="outline">
            詳細
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const EmptyCard: Story = {
  render: () => (
    <Card className="max-w-md" variant="subtle">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <CircleAlert className="text-muted-foreground size-8" />
        <div className="flex flex-col gap-1">
          <CardTitle>表示できるデータがありません</CardTitle>
          <CardDescription>
            試合結果が登録されると、ここにカードとして表示されます。
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  ),
};

export const DenseCard: Story = {
  render: () => (
    <Card className="max-w-2xl" size="sm">
      <CardContent className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Trophy className="text-secondary size-4" />
            <p className="font-semibold">打撃ランキング</p>
          </div>
          <p className="text-muted-foreground text-sm">
            打率上位の選手を一覧内でコンパクトに表示する例です。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold">.421</p>
            <p className="text-muted-foreground text-xs">打率</p>
          </div>
          <div>
            <p className="text-lg font-bold">12</p>
            <p className="text-muted-foreground text-xs">安打</p>
          </div>
          <div>
            <p className="text-lg font-bold">9</p>
            <p className="text-muted-foreground text-xs">打点</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
