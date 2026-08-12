import { cache } from 'react';

import { type ApiResult, fetchApiResult } from '@/lib/api/client';
import type { components, operations } from '@/types/api.generated';

export type PlayerResponse = components['schemas']['PlayerResponse'];
export type BattingStatsResponse =
  components['schemas']['BattingStatsResponse'];
export type PitchingStatsResponse =
  components['schemas']['PitchingStatsResponse'];

export type BattingStatsQuery = NonNullable<
  operations['getBattingStats']['parameters']['query']
>;
export type PitchingStatsQuery = NonNullable<
  operations['getPitchingStats']['parameters']['query']
>;

type StatsQuery = BattingStatsQuery | PitchingStatsQuery;

export async function getPlayers(
  teamSlug: string
): Promise<ApiResult<PlayerResponse[]>> {
  return fetchApiResult<PlayerResponse[]>(`/teams/${teamSlug}/players`);
}

export const getPlayer = cache(
  async (
    teamSlug: string,
    playerId: number
  ): Promise<ApiResult<PlayerResponse>> =>
    fetchApiResult<PlayerResponse>(`/teams/${teamSlug}/players/${playerId}`)
);

export async function getBattingStats(
  teamSlug: string,
  query?: BattingStatsQuery
): Promise<ApiResult<BattingStatsResponse[]>> {
  return fetchApiResult<BattingStatsResponse[]>(
    createStatsPath(teamSlug, 'batting', query)
  );
}

export async function getPitchingStats(
  teamSlug: string,
  query?: PitchingStatsQuery
): Promise<ApiResult<PitchingStatsResponse[]>> {
  return fetchApiResult<PitchingStatsResponse[]>(
    createStatsPath(teamSlug, 'pitching', query)
  );
}

function createStatsPath(
  teamSlug: string,
  type: 'batting' | 'pitching',
  query?: StatsQuery
) {
  const searchParams = new URLSearchParams();

  if (query?.seasonYear != null) {
    searchParams.set('seasonYear', String(query.seasonYear));
  }
  if (query?.tournamentId != null) {
    searchParams.set('tournamentId', String(query.tournamentId));
  }
  if (query?.status) {
    searchParams.set('status', query.status);
  }
  if (query?.includeGuests != null) {
    searchParams.set('includeGuests', String(query.includeGuests));
  }
  if (query?.sort) {
    searchParams.set('sort', query.sort);
  }

  const suffix = searchParams.toString();
  return `/teams/${teamSlug}/stats/${type}${suffix ? `?${suffix}` : ''}`;
}
