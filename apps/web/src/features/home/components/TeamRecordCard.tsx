import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card, CardContent } from '@/components/ui/card';
import type { SummaryRecordResponse } from '@/lib/api/responses';
import { formatRecordPercentage } from '@/lib/formatters';

import { TeamRecordItem } from './TeamRecordItem';

interface TeamRecordCardProps {
  record: SummaryRecordResponse;
}

export function TeamRecordCard({ record }: Readonly<TeamRecordCardProps>) {
  return (
    <Card
      id="career-record"
      className="bg-primary text-primary-foreground gap-0 overflow-hidden rounded-xl border border-white/25 py-0 shadow-[0_14px_32px_rgba(0,0,0,0.16)]"
    >
      <Box
        display="flex"
        direction="row"
        align="center"
        className="gap-2 border-b border-white/15 px-4 py-3 sm:px-6 sm:py-3"
      >
        <Typography as="p" variant="body" weight="bold" tone="inherit">
          通算成績
        </Typography>
      </Box>
      <CardContent className="p-0">
        {/* Mobile */}
        <Box className="sm:hidden">
          <Box display="grid" className="grid-cols-4 border-b border-white/15">
            <TeamRecordItem label="試合数" value={record.games} />
            <TeamRecordItem label="勝ち" value={record.wins} />
            <TeamRecordItem label="負け" value={record.losses} />
            <TeamRecordItem label="引き分け" value={record.draws} />
          </Box>

          <Box display="grid" className="grid-cols-3">
            <TeamRecordItem
              label="勝率"
              value={formatRecordPercentage(record.winningPercentage)}
              highlighted
            />
            <TeamRecordItem label="総得点" value={record.runsFor} />
            <TeamRecordItem label="総失点" value={record.runsAgainst} />
          </Box>
        </Box>

        {/* Tablet / Desktop */}
        <Box display="grid" className="hidden sm:grid sm:grid-cols-7">
          <TeamRecordItem label="試合数" value={record.games} />
          <TeamRecordItem label="勝ち" value={record.wins} />
          <TeamRecordItem label="負け" value={record.losses} />
          <TeamRecordItem label="引き分け" value={record.draws} />
          <TeamRecordItem
            label="勝率"
            value={formatRecordPercentage(record.winningPercentage)}
            highlighted
          />
          <TeamRecordItem label="総得点" value={record.runsFor} />
          <TeamRecordItem label="総失点" value={record.runsAgainst} />
        </Box>
      </CardContent>
    </Card>
  );
}
