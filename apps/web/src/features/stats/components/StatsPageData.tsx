import type { ApiResult } from '@/lib/api/client';
import type { SeasonResponse } from '@/lib/api/games';
import type {
  BattingStatsResponse,
  PitchingStatsResponse,
} from '@/lib/api/players';
import type { RankingResponse } from '@/lib/api/rankings';

import {
  createStatsData,
  createStatsSeasonOptions,
  resolveStatsSeason,
} from '../stats-presenter';
import { StatsPageContent } from '../StatsPageContent';
import { StatsError } from './StatsError';

/**
 * API取得結果をStatsViewDataへ変換する境界のProps。
 *
 * 打撃・投手のどちらかが失敗した場合はページ全体をエラー表示とし、
 * rankingやseasonの失敗は取得できた範囲で表示用データを作る。
 */
type StatsPageDataProps = {
  battingResult: ApiResult<BattingStatsResponse[]>;
  pitchingResult: ApiResult<PitchingStatsResponse[]>;
  /** 通常条件のranking。閾値とleader選出に利用する。 */
  rankingsResult: ApiResult<RankingResponse>;
  /** 規定到達者に限定したranking。通常rankingの補完にも利用する。 */
  qualifiedRankingsResult: ApiResult<RankingResponse>;
  /** season選択肢の元データ。取得失敗時は空配列として扱う。 */
  seasonsResult: ApiResult<SeasonResponse[]>;
  /** URLから解釈した年度。career選択時は未指定になる。 */
  seasonYear?: number;
  /** `career`選択時に全期間表示を指定するキー。 */
  seasonKey?: string;
};

export function StatsPageData({
  battingResult,
  pitchingResult,
  rankingsResult,
  qualifiedRankingsResult,
  seasonsResult,
  seasonYear,
  seasonKey,
}: Readonly<StatsPageDataProps>) {
  if (!battingResult.ok || !pitchingResult.ok) {
    return <StatsError />;
  }

  const seasons = seasonsResult.ok ? seasonsResult.data : [];
  const selectedSeason = resolveStatsSeason(seasons, seasonYear, seasonKey);

  return (
    <StatsPageContent
      data={createStatsData(
        battingResult.data,
        pitchingResult.data,
        selectedSeason,
        createStatsSeasonOptions(seasons),
        rankingsResult.ok ? rankingsResult.data : undefined,
        qualifiedRankingsResult.ok ? qualifiedRankingsResult.data : undefined
      )}
    />
  );
}
