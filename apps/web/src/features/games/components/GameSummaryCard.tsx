import { CalendarDays, Flag, MapPinned, Trophy } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import type { GameResponse } from '@/lib/api/games';
import { formatGameDateLong } from '@/lib/formatters';

import { ExpandableGameNote } from './ExpandableGameNote';
import type { InningScoreRow, InningScoreStatus } from './game-detail.types';
import { GameInfoItem } from './GameInfoItem';
import { GameScoreSection } from './GameScoreSection';

/**
 * 試合詳細の基本情報・スコア・補足をまとめて表示するProps。
 *
 * 試合基本情報があればscoreboardが未取得でも表示し、noteは長文時に折りたたみ対象になる。
 */
type GameSummaryCardProps = {
  game: GameResponse;
  endTime?: string | null;
  opponentLogoUrl?: string | null;
  /** 1行目から順に並んだチーム別イニングスコア。 */
  inningScores?: InningScoreRow[];
  /** scoreboard APIの試合単位の登録状態。 */
  inningScoreStatus?: InningScoreStatus;
  /** scoreboard APIの取得失敗状態。 */
  inningScoreError?: boolean;
  /** 試合メモ。未設定の場合は表示しない。 */
  note?: string | null;
};

export function GameSummaryCard({
  game,
  endTime,
  opponentLogoUrl,
  inningScores = [],
  inningScoreStatus,
  inningScoreError,
  note,
}: Readonly<GameSummaryCardProps>) {
  const opponentName = game.opponentName?.trim() || '対戦相手未定';
  const gameDate = formatGameDateLong(game.gameDate);

  return (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-0 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)] lg:p-8"
    >
      <GameScoreSection
        homeTeamName="新琴似CATS"
        awayTeamName={opponentName}
        homeLogoUrl="/brand/cats-logo-mark.png"
        awayLogoUrl={opponentLogoUrl}
        homeScore={game.runsFor}
        awayScore={game.runsAgainst}
        inningScores={inningScores}
        inningScoreStatus={inningScoreStatus}
        inningScoreError={inningScoreError}
        details={
          <Box
            display="flex"
            direction="column"
            gap="md"
            className="border-border/70 lg:border-l lg:pl-6"
          >
            <GameInfoItem
              value={
                <>
                  <span>{gameDate}</span>
                  {formatTimeRange(game.startTime, endTime) ? (
                    <span className="text-muted-foreground ml-3">
                      {formatTimeRange(game.startTime, endTime)}
                    </span>
                  ) : null}
                </>
              }
              icon={<CalendarDays aria-hidden="true" className="size-4" />}
            />
            <GameInfoItem
              label="大会"
              value={game.tournamentName ?? '大会未設定'}
              icon={<Trophy aria-hidden="true" className="size-4" />}
            />
            <GameInfoItem
              label="球場"
              value={game.stadiumName ?? game.venueName ?? '球場未設定'}
              icon={<MapPinned aria-hidden="true" className="size-4" />}
            />
            <GameInfoItem
              label="試合状態"
              value={formatGameStatus(game.status)}
              icon={<Flag aria-hidden="true" className="size-4" />}
            />
            <ExpandableGameNote note={note} />
          </Box>
        }
      />
    </Card>
  );
}

function formatTimeRange(startTime?: string | null, endTime?: string | null) {
  if (startTime && endTime) {
    return `${startTime}–${endTime}`;
  }

  return startTime ?? endTime ?? null;
}

function formatGameStatus(status?: string) {
  return (
    {
      scheduled: '予定',
      completed: '終了',
      cancelled: '中止',
      postponed: '延期',
    }[status ?? ''] ?? '未設定'
  );
}
