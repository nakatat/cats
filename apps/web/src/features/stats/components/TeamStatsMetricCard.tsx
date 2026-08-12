import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card, CardContent } from '@/components/ui/card';

import type { TeamStatsMetric } from '../data/stats';

export function TeamStatsMetricCard({
  metric,
}: Readonly<{ metric: TeamStatsMetric }>) {
  return (
    <Card className="h-full rounded-xl py-0 shadow-[0_6px_18px_rgba(17,24,39,0.04)]">
      <CardContent className="flex min-w-0 flex-row items-center justify-between gap-3 p-3 sm:p-4">
        <Box display="flex" align="center" gap="sm" className="min-w-0">
          <Typography
            as="span"
            variant="caption"
            weight="semibold"
            className="min-w-0 whitespace-normal"
          >
            <span className="hidden sm:inline">{metric.label}</span>
            <span className="leading-tight sm:hidden">
              <span className="block">チーム</span>
              <span className="block">
                {metric.label.replace(/^チーム/, '')}
              </span>
            </span>
          </Typography>
        </Box>
        <Box display="flex" gap="xs" className="shrink-0 items-baseline">
          <Typography as="strong" variant="headingLg" weight="bold">
            {metric.value}
          </Typography>
          {metric.unit ? (
            <Typography as="span" variant="caption" tone="muted">
              {metric.unit}
            </Typography>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}
