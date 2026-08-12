import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import {
  type BattingStat,
  type StatLeader,
  type TeamStatsMetric,
} from '../data/stats';
import { BattingStatsTable } from './BattingStatsTable';
import { StatLeaders } from './StatLeaders';
import { TeamStatsSummary } from './TeamStatsSummary';

/**
 * 打撃成績セクションへ渡す表示用データ。
 *
 * leaders・summary・statsは同じfilter条件で作られ、qualificationThresholdは説明文に表示する閾値。
 */
type BattingStatsSectionProps = {
  leaders: StatLeader[];
  summary: TeamStatsMetric[];
  stats: BattingStat[];
  /** nullの場合は規定打席数を取得できなかったことを表す。 */
  qualificationThreshold: number | null;
};

export function BattingStatsSection({
  leaders,
  summary,
  stats,
  qualificationThreshold,
}: Readonly<BattingStatsSectionProps>) {
  return (
    <Box as="section" display="flex" direction="column" gap="lg">
      <StatLeaders leaders={leaders} titleId="batting-leaders-title" />
      <TeamStatsSummary title="チーム打撃成績サマリー" metrics={summary} />
      <BattingStatsTable stats={stats} />
      <Typography as="p" variant="caption" tone="muted">
        ※ 規定打席：
        {qualificationThreshold != null
          ? `${qualificationThreshold}打席以上`
          : '取得できませんでした'}
      </Typography>
    </Box>
  );
}
