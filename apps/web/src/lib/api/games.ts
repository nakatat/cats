import { cache } from 'react';

import { type ApiResult, fetchApiResult } from '@/lib/api/client';
import type { components, operations } from '@/types/api.generated';

export type GameResponse = components['schemas']['GameResponse'];
export type BattingLineResponse = components['schemas']['BattingLineResponse'];
export type PitchingLineResponse =
  components['schemas']['PitchingLineResponse'];
export type ScoreboardResponse = components['schemas']['ScoreboardResponse'];
export type SeasonResponse = components['schemas']['SeasonResponse'];
export type TournamentResponse = components['schemas']['TournamentResponse'];

export type GamesQuery = NonNullable<
  operations['getGames']['parameters']['query']
>;

export async function getGames(
  teamSlug: string,
  query?: GamesQuery
): Promise<ApiResult<GameResponse[]>> {
  const searchParams = new URLSearchParams();

  if (query?.seasonYear != null) {
    searchParams.set('seasonYear', String(query.seasonYear));
  }
  if (query?.status) {
    searchParams.set('status', query.status);
  }

  const suffix = searchParams.toString();
  const path = `/teams/${teamSlug}/games${suffix ? `?${suffix}` : ''}`;

  return fetchApiResult<GameResponse[]>(path);
}

export const getGame = cache(
  async (teamSlug: string, gameId: number): Promise<ApiResult<GameResponse>> =>
    fetchApiResult<GameResponse>(`/teams/${teamSlug}/games/${gameId}`)
);

export async function getBattingLines(
  teamSlug: string,
  gameId: number
): Promise<ApiResult<BattingLineResponse[]>> {
  return fetchApiResult<BattingLineResponse[]>(
    `/teams/${teamSlug}/games/${gameId}/batting-lines`
  );
}

export async function getPitchingLines(
  teamSlug: string,
  gameId: number
): Promise<ApiResult<PitchingLineResponse[]>> {
  return fetchApiResult<PitchingLineResponse[]>(
    `/teams/${teamSlug}/games/${gameId}/pitching-lines`
  );
}

export async function getScoreboard(
  teamSlug: string,
  gameId: number
): Promise<ApiResult<ScoreboardResponse>> {
  return fetchApiResult<ScoreboardResponse>(
    `/teams/${teamSlug}/games/${gameId}/scoreboard`
  );
}

export async function getSeasons(
  teamSlug: string
): Promise<ApiResult<SeasonResponse[]>> {
  return fetchApiResult<SeasonResponse[]>(`/teams/${teamSlug}/seasons`);
}

export async function getTournaments(
  teamSlug: string
): Promise<ApiResult<TournamentResponse[]>> {
  return fetchApiResult<TournamentResponse[]>(`/teams/${teamSlug}/tournaments`);
}
