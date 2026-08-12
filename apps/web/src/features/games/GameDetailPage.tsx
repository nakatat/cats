import Link from 'next/link';

import { PageIntro } from '@/components/layout/PageIntro';
import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import type { ApiResult } from '@/lib/api/client';
import type {
  BattingLineResponse,
  GameResponse,
  PitchingLineResponse,
  ScoreboardResponse,
} from '@/lib/api/games';
import { formatGameDate } from '@/lib/formatters';
import { withListQuery } from '@/lib/list-query';

import { BattingStatsTable } from './components/BattingStatsTable';
import type { InningScoreRow } from './components/game-detail.types';
import { GameDetailPageContainer } from './components/GameDetailPageContainer';
import { GameNavigation } from './components/GameNavigation';
import { GameSummaryCard } from './components/GameSummaryCard';
import { PitchingStatsTable } from './components/PitchingStatsTable';
import { toInningScoreRows } from './components/scoreboard';

/**
 * 試合詳細画面へ渡す取得結果と表示用の補助データ。
 *
 * 試合基本情報が取得できなくても専用のエラー表示へ切り替えられる一方、
 * 打撃・投球・スコアボードは個別に取得結果を扱い、取得できた範囲を表示する。
 */
type GameDetailPageProps = {
  /** 試合基本情報。失敗時は詳細画面全体をエラー表示にする。 */
  gameResult: ApiResult<GameResponse>;
  /** 打撃成績。取得失敗時は打撃表を空データとして表示する。 */
  battingResult: ApiResult<BattingLineResponse[]>;
  /** 投手成績。取得失敗時は投手表を空データとして表示する。 */
  pitchingResult: ApiResult<PitchingLineResponse[]>;
  /** スコアボードの取得結果。未指定時は事前に渡された`inningScores`を使用する。 */
  scoreboardResult?: ApiResult<ScoreboardResponse>;
  /** スコアボード取得前または取得失敗時に表示する既存のイニングスコア。 */
  inningScores?: InningScoreRow[];
  /** 一覧上で現在の試合の直前にある試合。 */
  previousGame?: GameResponse;
  /** 一覧上で現在の試合の直後にある試合。 */
  nextGame?: GameResponse;
  /** 試合一覧へ戻る際に引き継ぐURL query文字列。 */
  listQuery?: string;
  /** スコア表示や詳細ラベルを補う、一覧側で保持していた値。 */
  summary?: {
    /** 試合終了時刻。未設定の場合は終了時刻を表示しない。 */
    endTime?: string | null;
    /** 対戦相手ロゴのURL。未登録時はロゴのfallback表示を使用する。 */
    opponentLogoUrl?: string | null;
  };
};

export function GameDetailPage({
  gameResult,
  battingResult,
  pitchingResult,
  scoreboardResult,
  inningScores = [],
  previousGame,
  nextGame,
  listQuery,
  summary,
}: Readonly<GameDetailPageProps>) {
  if (!gameResult.ok) {
    return (
      <GameDetailPageContainer>
        <Card padding="content" className="gap-3 rounded-xl">
          <Typography as="h1" variant="headingXl">
            試合詳細
          </Typography>
          <Typography as="p" variant="bodySm" tone="muted">
            試合情報を取得できませんでした。時間をおいて再度お試しください。
          </Typography>
        </Card>
      </GameDetailPageContainer>
    );
  }

  const game = gameResult.data;
  const detailLabel = formatDetailLabel(game);
  const scoreboardRows = scoreboardResult?.ok
    ? toInningScoreRows(scoreboardResult.data, summary?.opponentLogoUrl)
    : (inningScores ?? []);
  const scoreboardStatus = scoreboardResult?.ok
    ? scoreboardResult.data.status
    : undefined;
  const scoreboardError = scoreboardResult != null && !scoreboardResult.ok;

  return (
    <GameDetailPageContainer>
      <Box display="flex" direction="column" gap="xl">
        <Box display="flex" direction="column" gap="lg">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">トップ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={withListQuery('/games', listQuery)}>
                    試合一覧
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{detailLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageIntro iconSrc="/icons/icon-games.png" title="試合詳細" />
        </Box>

        <GameSummaryCard
          game={game}
          {...summary}
          inningScores={scoreboardRows}
          inningScoreStatus={scoreboardStatus}
          inningScoreError={scoreboardError}
          note={game.note}
        />
        <BattingStatsTable stats={battingResult.ok ? battingResult.data : []} />
        <PitchingStatsTable
          stats={pitchingResult.ok ? pitchingResult.data : []}
        />
        <GameNavigation
          previousGame={previousGame}
          nextGame={nextGame}
          listQuery={listQuery}
        />
      </Box>
    </GameDetailPageContainer>
  );
}

function formatDetailLabel(game: GameResponse) {
  return [
    formatGameDate(game.gameDate),
    `${game.opponentName?.trim() || '対戦相手未定'}戦`,
  ].join('・');
}
