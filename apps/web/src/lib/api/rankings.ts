import { type ApiResult, fetchApiResult } from '@/lib/api/client';
import type { components, operations } from '@/types/api.generated';

export type RankingResponse = components['schemas']['RankingResponse'];

export type RankingsQuery = NonNullable<
  operations['getRankings']['parameters']['query']
>;

export async function getRankings(
  teamSlug: string,
  query?: RankingsQuery
): Promise<ApiResult<RankingResponse>> {
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
  if (query?.qualifiedOnly != null) {
    searchParams.set('qualifiedOnly', String(query.qualifiedOnly));
  }
  if (query?.limit != null) {
    searchParams.set('limit', String(query.limit));
  }
  if (query?.category) {
    searchParams.set('category', query.category);
  }

  const suffix = searchParams.toString();
  return fetchApiResult<RankingResponse>(
    `/teams/${teamSlug}/rankings${suffix ? `?${suffix}` : ''}`
  );
}
