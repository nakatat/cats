import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import type { StatLeader } from '../data/stats';
import { StatLeaderCard } from './StatLeaderCard';

type StatLeadersProps = {
  leaders: StatLeader[];
  titleId: string;
};

export function StatLeaders({ leaders, titleId }: Readonly<StatLeadersProps>) {
  return (
    <Box
      as="section"
      aria-labelledby={titleId}
      display="flex"
      direction="column"
      gap="md"
    >
      <Box display="grid" gap="sm" className="grid-cols-[minmax(0,1fr)_auto]">
        <Typography
          as="h3"
          id={titleId}
          variant="headingSm"
          className="self-center"
        >
          各部門のトップ選手
        </Typography>
        <Typography
          as="p"
          variant="caption"
          tone="muted"
          className="col-span-2"
        >
          選択中の条件で各部門1位
        </Typography>
      </Box>
      <Box display="grid" gap="md" className="grid-cols-2 lg:grid-cols-4">
        {leaders.map((leader) => (
          <StatLeaderCard
            key={`${leader.metric}-${leader.playerId}`}
            leader={leader}
          />
        ))}
      </Box>
    </Box>
  );
}
