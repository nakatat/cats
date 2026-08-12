import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { PlayerDetailPageSkeleton } from '@/components/layout/PlayerDetailPageSkeleton';
import { getPlayer } from '@/lib/api/players';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/site-metadata';

import { PlayerDetailPageContent } from './PlayerDetailPageContent';

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ playerId: string }>;
}>): Promise<Metadata> {
  const { playerId: playerIdParam } = await params;
  const path = `/players/${encodeURIComponent(playerIdParam)}`;
  const playerId = Number(playerIdParam);

  if (!Number.isInteger(playerId)) {
    return createPageMetadata({ title: '選手詳細', path });
  }

  const playerResult = await getPlayer(env.DEFAULT_TEAM_SLUG, playerId);

  if (!playerResult.ok) {
    return createPageMetadata({ title: '選手詳細', path });
  }

  const player = playerResult.data;
  const playerName = player.name?.trim() || '名前未設定';
  const uniformNumber = player.uniformNumber?.trim();
  const playerTitle = uniformNumber
    ? `#${uniformNumber} ${playerName}`
    : playerName;
  const position = player.primaryPosition?.trim();
  const positionText = position ? `${position}の` : '';

  return createPageMetadata({
    title: playerTitle,
    path,
    description: `${playerTitle}。新琴似CATSの${positionText}プロフィールと成績を紹介します。`,
  });
}

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ playerId: string }>;
  searchParams: Promise<import('@/lib/list-query').PageSearchParams>;
}>) {
  return (
    <Suspense
      fallback={
        <ApiStartupLoading>
          <PlayerDetailPageSkeleton />
        </ApiStartupLoading>
      }
    >
      <PlayerDetailPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
