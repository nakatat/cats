import Link from 'next/link';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getPlayerImageFallback } from '@/features/players/components/player-image';

import type { StatLeader, StatLeaderPlayer } from '../data/stats';

/**
 * Stats leader 1件の表示Props。
 *
 * leader.playersが設定されている場合は同率leaderとして複数選手を表示する。
 */
type StatLeaderCardProps = {
  leader: StatLeader;
};

export function StatLeaderCard({ leader }: Readonly<StatLeaderCardProps>) {
  const players: StatLeaderPlayer[] = leader.players?.length
    ? leader.players
    : [leader];

  return (
    <Card className="rounded-xl py-0 shadow-[0_6px_18px_rgba(17,24,39,0.04)]">
      <CardContent className="flex min-w-0 flex-col gap-1 p-3 sm:p-4">
        <Box display="flex" align="center" justify="between" gap="sm">
          <Box display="flex" align="center" gap="sm" className="min-w-0">
            <Typography as="h4" variant="caption" weight="bold">
              {leader.metric}
            </Typography>
          </Box>
          <Box display="flex" gap="xs" className="shrink-0 items-baseline">
            <Typography as="strong" variant="headingLg" weight="bold">
              {leader.value}
            </Typography>
            {leader.unit ? (
              <Typography as="span" variant="caption" tone="muted">
                {leader.unit}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box display="flex" direction="column" gap="xs" className="min-w-0">
          {players.map((player) => {
            const fallback = getPlayerImageFallback({
              name: player.playerName,
              uniformNumber: player.uniformNumber,
            });

            return (
              <Box
                key={player.playerId}
                display="flex"
                align="center"
                gap="md"
                className="min-w-0"
              >
                <Avatar
                  size="lg"
                  className="bg-primary/10 text-primary after:hidden"
                >
                  {player.profileImageUrl ? (
                    <AvatarImage
                      src={player.profileImageUrl}
                      alt={`${player.playerName}の選手画像`}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/players/${player.playerId}`}
                  className="text-primary focus-visible:ring-ring min-w-0 text-sm font-semibold wrap-break-word whitespace-normal hover:underline focus-visible:ring-3 focus-visible:outline-none"
                >
                  {player.playerName}
                  {player.uniformNumber && player.uniformNumber !== '—' ? (
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      #{player.uniformNumber}
                    </span>
                  ) : null}
                </Link>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
