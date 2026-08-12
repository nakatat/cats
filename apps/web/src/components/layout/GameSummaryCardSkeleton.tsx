import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';

import { GameInfoSkeleton } from './GameInfoSkeleton';
import { GameMatchupSkeleton } from './GameMatchupSkeleton';
import { InningScoreSkeleton } from './InningScoreSkeleton';

export function GameSummaryCardSkeleton() {
  return (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-0 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)] lg:p-8"
    >
      <Box display="flex" direction="column" gap="xl">
        <GameMatchupSkeleton />
        <Box className="border-border/70 border-t" />
        <Box className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-4">
          <InningScoreSkeleton />
          <GameInfoSkeleton />
        </Box>
      </Box>
    </Card>
  );
}
