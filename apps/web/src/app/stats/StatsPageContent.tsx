import { StatsPageData } from '@/features/stats/components/StatsPageData';
import { getSeasons } from '@/lib/api/games';
import { getBattingStats, getPitchingStats } from '@/lib/api/players';
import { getRankings } from '@/lib/api/rankings';
import { env } from '@/lib/env';

const RANKING_LEADER_LIMIT = 20;

/**
 * Stats pageがURLから受け取るquery。
 *
 * Next.jsのquery形式に合わせて配列を許容し、season=careerの場合は年度指定より優先して全期間を表示する。
 */
export type StatsPageSearchParams = {
  /** 4桁の年度。配列の場合は先頭値を使用する。 */
  seasonYear?: string | string[];
  /** `career`で全期間表示を指定する。 */
  season?: string | string[];
};

export async function StatsPageContent({
  searchParams,
}: Readonly<{ searchParams: Promise<StatsPageSearchParams> }>) {
  const params = await searchParams;
  const requestedSeasonYear = toSeasonYear(params.seasonYear);
  const isCareer = toSeason(params.season) === 'career';
  const seasonsResult = await getSeasons(env.DEFAULT_TEAM_SLUG);
  const seasonYear = isCareer
    ? undefined
    : (requestedSeasonYear ??
      (seasonsResult.ok
        ? (seasonsResult.data.find((season) => season.isCurrent)?.year ??
          seasonsResult.data
            .filter((season) => season.year != null)
            .sort((left, right) => (right.year ?? 0) - (left.year ?? 0))[0]
            ?.year)
        : undefined));

  const [
    battingResult,
    pitchingResult,
    rankingsResult,
    qualifiedRankingsResult,
  ] = await Promise.all([
    getBattingStats(env.DEFAULT_TEAM_SLUG, { seasonYear }),
    getPitchingStats(env.DEFAULT_TEAM_SLUG, { seasonYear }),
    getRankings(env.DEFAULT_TEAM_SLUG, {
      seasonYear,
      qualifiedOnly: false,
      limit: RANKING_LEADER_LIMIT,
    }),
    getRankings(env.DEFAULT_TEAM_SLUG, {
      seasonYear,
      qualifiedOnly: true,
      limit: RANKING_LEADER_LIMIT,
    }),
  ]);

  return (
    <StatsPageData
      battingResult={battingResult}
      pitchingResult={pitchingResult}
      rankingsResult={rankingsResult}
      qualifiedRankingsResult={qualifiedRankingsResult}
      seasonsResult={seasonsResult}
      seasonYear={seasonYear}
      seasonKey={isCareer ? 'career' : undefined}
    />
  );
}

function toSeasonYear(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !/^\d{4}$/.test(candidate)) {
    return undefined;
  }

  return Number(candidate);
}

function toSeason(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
