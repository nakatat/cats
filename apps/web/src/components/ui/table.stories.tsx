import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/design/utils';

const battingRows = [
  { player: '山田 太郎', games: 8, atBats: 22, hits: 9, avg: '.409' },
  { player: '佐藤 花子', games: 7, atBats: 19, hits: 6, avg: '.316' },
  { player: '鈴木 次郎', games: 6, atBats: 14, hits: 4, avg: '.286' },
] as const;

const pitchingRows = [
  { player: '高橋 恒一', appearances: 5, wins: 3, losses: 1, era: '2.35' },
  { player: '中村 恒一', appearances: 4, wins: 2, losses: 1, era: '3.18' },
  { player: '伊藤 恒一', appearances: 3, wins: 1, losses: 1, era: '4.20' },
] as const;

const rankingRows = [
  { rank: 1, player: '山田 太郎', avg: '.409', hits: 9 },
  { rank: 2, player: '佐藤 花子', avg: '.316', hits: 6 },
  { rank: 3, player: '鈴木 次郎', avg: '.286', hits: 4 },
] as const;

const meta = {
  title: 'Components/UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

function TableFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-card max-w-3xl overflow-hidden rounded-lg border">
      {children}
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              試合数
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battingRows.slice(0, 2).map((row) => (
            <TableRow key={row.player}>
              <TableCell className="font-medium">{row.player}</TableCell>
              <TableCell className="text-right tabular-nums">
                {row.games}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.avg}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const BattingStats: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              試合数
            </TableHead>
            <TableHead className="text-right" scope="col">
              打数
            </TableHead>
            <TableHead className="text-right" scope="col">
              安打
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battingRows.map((row) => (
            <TableRow key={row.player}>
              <TableCell className="font-medium">{row.player}</TableCell>
              <TableCell className="text-right tabular-nums">
                {row.games}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.atBats}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.hits}
              </TableCell>
              <TableCell className="text-primary text-right font-semibold tabular-nums">
                {row.avg}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const PitchingStats: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              登板
            </TableHead>
            <TableHead className="text-right" scope="col">
              勝
            </TableHead>
            <TableHead className="text-right" scope="col">
              敗
            </TableHead>
            <TableHead className="text-right" scope="col">
              防御率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pitchingRows.map((row) => (
            <TableRow key={row.player}>
              <TableCell className="font-medium">{row.player}</TableCell>
              <TableCell className="text-right tabular-nums">
                {row.appearances}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.wins}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.losses}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.era}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const Ranking: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-right" scope="col">
              順位
            </TableHead>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
            <TableHead className="text-right" scope="col">
              安打
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankingRows.map((row) => (
            <TableRow key={row.rank}>
              <TableCell
                className={cn(
                  'text-right tabular-nums',
                  row.rank === 1 && 'font-semibold'
                )}
              >
                {row.rank}
              </TableCell>
              <TableCell className={cn(row.rank === 1 && 'font-semibold')}>
                {row.player}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.avg}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.hits}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableCaption>2026年度 打撃成績</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              試合数
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battingRows.slice(0, 2).map((row) => (
            <TableRow key={row.player}>
              <TableCell className="font-medium">{row.player}</TableCell>
              <TableCell className="text-right tabular-nums">
                {row.games}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.avg}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              打数
            </TableHead>
            <TableHead className="text-right" scope="col">
              安打
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battingRows.map((row) => (
            <TableRow key={row.player}>
              <TableCell className="font-medium">{row.player}</TableCell>
              <TableCell className="text-right tabular-nums">
                {row.atBats}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.hits}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.avg}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>チーム合計</TableCell>
            <TableCell className="text-right tabular-nums">55</TableCell>
            <TableCell className="text-right tabular-nums">19</TableCell>
            <TableCell className="text-right tabular-nums">.345</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableFrame>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <div className="border-border bg-card max-w-sm overflow-hidden rounded-lg border">
      <Table className="min-w-208">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              試合
            </TableHead>
            <TableHead className="text-right" scope="col">
              打席
            </TableHead>
            <TableHead className="text-right" scope="col">
              打数
            </TableHead>
            <TableHead className="text-right" scope="col">
              安打
            </TableHead>
            <TableHead className="text-right" scope="col">
              二塁打
            </TableHead>
            <TableHead className="text-right" scope="col">
              三塁打
            </TableHead>
            <TableHead className="text-right" scope="col">
              本塁打
            </TableHead>
            <TableHead className="text-right" scope="col">
              打点
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">山田 太郎</TableCell>
            <TableCell className="text-right tabular-nums">8</TableCell>
            <TableCell className="text-right tabular-nums">25</TableCell>
            <TableCell className="text-right tabular-nums">22</TableCell>
            <TableCell className="text-right tabular-nums">9</TableCell>
            <TableCell className="text-right tabular-nums">2</TableCell>
            <TableCell className="text-right tabular-nums">0</TableCell>
            <TableCell className="text-right tabular-nums">1</TableCell>
            <TableCell className="text-right tabular-nums">7</TableCell>
            <TableCell className="text-right tabular-nums">.409</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">選手</TableHead>
            <TableHead className="text-right" scope="col">
              試合数
            </TableHead>
            <TableHead className="text-right" scope="col">
              打率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              className="text-muted-foreground py-8 text-center"
              colSpan={3}
            >
              表示できる成績がありません
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableFrame>
  ),
};
