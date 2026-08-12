import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import {
  type PitchingStat,
  type StatLeader,
  type TeamStatsMetric,
} from '../data/stats';
import { PitchingStatsTable } from './PitchingStatsTable';
import { StatLeaders } from './StatLeaders';
import { TeamStatsSummary } from './TeamStatsSummary';

/**
 * 投手成績セクションへ渡す表示用データ。
 *
 * qualificationThresholdTextはAPIが返す野球表記の投球回文字列をそのまま説明文へ利用する。
 */
type PitchingStatsSectionProps = {
  leaders: StatLeader[];
  summary: TeamStatsMetric[];
  stats: PitchingStat[];
  /** nullの場合は規定投球回数を取得できなかったことを表す。 */
  qualificationThresholdText: string | null;
};

export function PitchingStatsSection({
  leaders,
  summary,
  stats,
  qualificationThresholdText,
}: Readonly<PitchingStatsSectionProps>) {
  return (
    <Box as="section" display="flex" direction="column" gap="lg">
      <StatLeaders leaders={leaders} titleId="pitching-leaders-title" />
      <TeamStatsSummary title="チーム投手成績サマリー" metrics={summary} />
      <PitchingStatsTable stats={stats} />
      <Typography as="p" variant="caption" tone="muted">
        ※ 規定投球回：
        {qualificationThresholdText != null
          ? `${qualificationThresholdText}以上`
          : '取得できませんでした'}
      </Typography>
    </Box>
  );
}
