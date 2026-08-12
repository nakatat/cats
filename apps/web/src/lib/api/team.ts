import { type ApiResult, fetchApiResult } from '@/lib/api/client';
import type { TeamSummaryResponse } from '@/lib/api/responses';
import type { operations } from '@/types/api.generated';

export type TeamSummaryQuery = NonNullable<
  operations['getSummary']['parameters']['query']
>;

export async function getTeamSummary(
  teamSlug: string,
  query?: TeamSummaryQuery
): Promise<ApiResult<TeamSummaryResponse>> {
  const searchParams = new URLSearchParams();

  if (query?.seasonYear != null) {
    searchParams.set('seasonYear', String(query.seasonYear));
  }
  if (query?.recentLimit != null) {
    searchParams.set('recentLimit', String(query.recentLimit));
  }
  if (query?.upcomingLimit != null) {
    searchParams.set('upcomingLimit', String(query.upcomingLimit));
  }

  const suffix = searchParams.toString();
  const path = `/teams/${teamSlug}/summary${suffix ? `?${suffix}` : ''}`;

  return fetchApiResult<TeamSummaryResponse>(path);
}
