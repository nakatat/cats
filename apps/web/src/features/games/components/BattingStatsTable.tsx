import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import type { BattingLineResponse } from '@/lib/api/games';

import { GameBattingEmpty } from './GameBattingEmpty';
import { GameBattingTable } from './GameBattingTable';

type BattingStatsTableProps = {
  stats: BattingLineResponse[];
};

export function BattingStatsTable({ stats }: Readonly<BattingStatsTableProps>) {
  return (
    <Card
      padding="content"
      className="border-border/75 bg-card min-w-0 gap-5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Typography as="h2" variant="headingSm">
        打撃成績
      </Typography>
      {stats.length > 0 ? (
        <div className="min-w-0">
          <GameBattingTable stats={stats} />
        </div>
      ) : (
        <GameBattingEmpty />
      )}
    </Card>
  );
}
