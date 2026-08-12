import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import type { PitchingLineResponse } from '@/lib/api/games';

import { GamePitchingEmpty } from './GamePitchingEmpty';
import { GamePitchingTable } from './GamePitchingTable';

type PitchingStatsTableProps = {
  stats: PitchingLineResponse[];
};

export function PitchingStatsTable({
  stats,
}: Readonly<PitchingStatsTableProps>) {
  return (
    <Card
      padding="content"
      className="border-border/75 bg-card min-w-0 gap-5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Typography as="h2" variant="headingSm">
        投手成績
      </Typography>
      {stats.length > 0 ? (
        <div className="min-w-0">
          <GamePitchingTable stats={stats} />
        </div>
      ) : (
        <GamePitchingEmpty />
      )}
    </Card>
  );
}
