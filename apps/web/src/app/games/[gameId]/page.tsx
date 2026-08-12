import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { GameDetailPageSkeleton } from '@/components/layout/GameDetailPageSkeleton';
import { getGame } from '@/lib/api/games';
import { env } from '@/lib/env';
import {
  formatGameDateLong,
  formatGameResult,
  formatGameScore,
} from '@/lib/formatters';
import { createPageMetadata } from '@/lib/site-metadata';

import { GameDetailPageContent } from './GameDetailPageContent';

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ gameId: string }>;
}>): Promise<Metadata> {
  const { gameId: gameIdParam } = await params;
  const path = `/games/${encodeURIComponent(gameIdParam)}`;
  const gameId = Number(gameIdParam);

  if (!Number.isInteger(gameId)) {
    return createPageMetadata({ title: '試合詳細', path });
  }

  const gameResult = await getGame(env.DEFAULT_TEAM_SLUG, gameId);

  if (!gameResult.ok) {
    return createPageMetadata({ title: '試合詳細', path });
  }

  const game = gameResult.data;
  const opponentName = game.opponentName?.trim() || '対戦相手未定';
  const gameDate = formatGameDateLong(game.gameDate);
  const score = formatGameScore(game.runsFor, game.runsAgainst);
  const gameResultText = formatGameResult(game.result);

  return createPageMetadata({
    title: `${opponentName}戦`,
    path,
    description: `${gameDate}の新琴似CATS対${opponentName}。スコア${score}、結果は${gameResultText}。`,
  });
}

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ gameId: string }>;
  searchParams: Promise<import('@/lib/list-query').PageSearchParams>;
}>) {
  return (
    <Suspense
      fallback={
        <ApiStartupLoading>
          <GameDetailPageSkeleton />
        </ApiStartupLoading>
      }
    >
      <GameDetailPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
