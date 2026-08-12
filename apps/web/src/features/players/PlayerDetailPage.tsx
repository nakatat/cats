import Link from 'next/link';

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
  BattingStatsResponse,
  PitchingStatsResponse,
  PlayerResponse,
} from '@/lib/api/players';
import { withListQuery } from '@/lib/list-query';

import type {
  PlayerRecentGame,
  PlayerSeasonStats,
} from './components/player-detail.types';
import { PlayerCareerSummary } from './components/PlayerCareerSummary';
import { PlayerDetailPageContainer } from './components/PlayerDetailPageContainer';
import { PlayerNavigation } from './components/PlayerNavigation';
import { PlayerProfileCard } from './components/PlayerProfileCard';
import { PlayerRecentGames } from './components/PlayerRecentGames';

/**
 * 選手詳細ページへ渡す取得結果と表示用データ。
 *
 * player以外の成績取得に失敗しても、取得できたプロフィールを表示できるよう各データを分離している。
 */
type PlayerDetailPageProps = {
  playerResult: ApiResult<PlayerResponse>;
  /** 選手の通算打撃API結果。未指定・取得失敗時は打撃成績を表示しない。 */
  battingResult?: ApiResult<BattingStatsResponse[]>;
  /** 選手の通算投手API結果。未指定・取得失敗時は投手成績を表示しない。 */
  pitchingResult?: ApiResult<PitchingStatsResponse[]>;
  /** 成績のある年度だけを含むシーズン別データ。 */
  careerSeasons?: PlayerSeasonStats[];
  /** 日付の新しい順に絞り込まれた直近試合データ。 */
  recentGames?: PlayerRecentGame[];
  previousPlayer?: PlayerResponse;
  nextPlayer?: PlayerResponse;
  /** 選手一覧へ戻るリンクで維持するfilter/page query。 */
  listQuery?: string;
};

export function PlayerDetailPage({
  playerResult,
  battingResult,
  pitchingResult,
  careerSeasons = [],
  recentGames = [],
  previousPlayer,
  nextPlayer,
  listQuery,
}: Readonly<PlayerDetailPageProps>) {
  if (!playerResult.ok) {
    return (
      <PlayerDetailPageContainer>
        <Card padding="content" className="gap-3 rounded-xl">
          <Typography as="h1" variant="headingXl">
            選手詳細
          </Typography>
          <Typography as="p" variant="bodySm" tone="muted">
            選手情報を取得できませんでした。時間をおいて再度お試しください。
          </Typography>
        </Card>
      </PlayerDetailPageContainer>
    );
  }

  const player = playerResult.data;
  const playerName = player.name?.trim() || '名前未設定';
  const batting = battingResult?.ok
    ? battingResult.data.find((item) => item.playerId === player.playerId)
    : undefined;
  const pitching = pitchingResult?.ok
    ? pitchingResult.data.find((item) => item.playerId === player.playerId)
    : undefined;

  return (
    <PlayerDetailPageContainer>
      <Box display="flex" direction="column" gap="xl">
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
                <Link href={withListQuery('/players', listQuery)}>
                  選手一覧
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{playerName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PlayerProfileCard player={player} />
        <PlayerCareerSummary
          batting={batting}
          pitching={pitching}
          seasons={careerSeasons}
        />
        <PlayerRecentGames games={recentGames} />
        <PlayerNavigation
          previousPlayer={previousPlayer}
          nextPlayer={nextPlayer}
          listQuery={listQuery}
        />
      </Box>
    </PlayerDetailPageContainer>
  );
}
