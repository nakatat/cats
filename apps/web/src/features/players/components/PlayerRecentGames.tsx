'use client';

import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { PlayerRecentGame } from './player-detail.types';
import { PlayerRecentGamesEmptyMessage } from './PlayerRecentGamesEmptyMessage';
import { RecentBattingTable } from './RecentBattingTable';
import { RecentPitchingTable } from './RecentPitchingTable';

/**
 * 選手の直近試合成績を表示するProps。
 *
 * gamesは呼び出し側で日付の新しい順に最大5試合へ絞り込んで渡す。
 */
type PlayerRecentGamesProps = {
  games: PlayerRecentGame[];
};

export function PlayerRecentGames({ games }: Readonly<PlayerRecentGamesProps>) {
  const hasBatting = games.some((item) => item.battingLine);
  const defaultTab = games.length === 0 || hasBatting ? 'batting' : 'pitching';

  return (
    <Card
      id="recent-games"
      padding="content"
      className="border-border/75 bg-card gap-2.5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Typography as="h2" variant="headingSm">
        直近5試合の成績
      </Typography>
      <Tabs defaultValue={defaultTab} className="min-w-0">
        <TabsList variant="line" className="w-full sm:w-fit">
          <TabsTrigger value="batting" className="flex-1 sm:flex-none">
            打撃
          </TabsTrigger>
          <TabsTrigger value="pitching" className="flex-1 sm:flex-none">
            投手
          </TabsTrigger>
        </TabsList>
        <TabsContent value="batting" className="px-0 pt-4">
          {games.length > 0 ? (
            <RecentBattingTable games={games} />
          ) : (
            <PlayerRecentGamesEmptyMessage>
              直近の試合成績はまだありません。
            </PlayerRecentGamesEmptyMessage>
          )}
        </TabsContent>
        <TabsContent value="pitching" className="px-0 pt-4">
          {games.length > 0 ? (
            <RecentPitchingTable games={games} />
          ) : (
            <PlayerRecentGamesEmptyMessage>
              直近の試合成績はまだありません。
            </PlayerRecentGamesEmptyMessage>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
