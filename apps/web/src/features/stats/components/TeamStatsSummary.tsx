import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { cn } from '@/lib/design/utils';

import type { TeamStatsMetric } from '../data/stats';
import { TeamStatsMetricCard } from './TeamStatsMetricCard';

/**
 * チーム成績サマリーの表示Props。
 *
 * metricsはpresenterが表示順を決めた配列で、各要素が1枚のmetric cardになる。
 */
type TeamStatsSummaryProps = {
  title: string;
  /** 表示順に並んだチーム指標。 */
  metrics: TeamStatsMetric[];
};

export function TeamStatsSummary({
  title,
  metrics,
}: Readonly<TeamStatsSummaryProps>) {
  const gridColumns =
    metrics.length === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-4';
  const titleId = title.includes('投手')
    ? 'team-pitching-stats-summary-title'
    : 'team-batting-stats-summary-title';

  return (
    <Box
      as="section"
      aria-labelledby={titleId}
      display="grid"
      gap="md"
      className={cn('grid-cols-2', gridColumns)}
    >
      <Typography as="h2" id={titleId} className="sr-only">
        {title}
      </Typography>
      {metrics.map((metric) => (
        <TeamStatsMetricCard key={metric.label} metric={metric} />
      ))}
    </Box>
  );
}
