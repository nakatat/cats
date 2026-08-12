'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { TableCell, TableRow } from '@/components/ui/table';
import type { PlayerResponse } from '@/lib/api/players';
import { withListQuery } from '@/lib/list-query';

import { formatJoinedYear, formatPitchInfo } from './player-formatters';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerStatusBadge } from './PlayerStatusBadge';

type PlayerListItemProps = {
  player: PlayerResponse;
  hasPitchInfo: boolean;
  hasJoinedAt: boolean;
  returnQuery?: string;
};

export function PlayerListItem({
  player,
  hasPitchInfo,
  hasJoinedAt,
  returnQuery,
}: Readonly<PlayerListItemProps>) {
  const playerName = player.name?.trim() || '名前未設定';
  const playerId = player.playerId ?? 0;
  const router = useRouter();
  const detailPath = withListQuery(`/players/${playerId}`, returnQuery);

  function handleRowClick() {
    router.push(detailPath);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(detailPath);
    }
  }

  return (
    <TableRow
      className="group bg-card cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
      role="link"
      tabIndex={0}
      aria-label={`${playerName}の詳細を見る`}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
    >
      <TableCell className="text-center font-semibold">
        {player.uniformNumber || '—'}
      </TableCell>
      <TableCell>
        <Box display="flex" align="center" gap="md" className="min-w-0">
          <PlayerAvatar player={player} />
          <Box display="flex" direction="column" className="min-w-0">
            <Typography
              as="span"
              variant="bodySm"
              weight="semibold"
              className="group-hover:text-primary truncate"
            >
              {playerName}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{player.primaryPosition || '—'}</TableCell>
      {hasPitchInfo && <TableCell>{formatPitchInfo(player) ?? '—'}</TableCell>}
      {hasJoinedAt && (
        <TableCell>{formatJoinedYear(player.joinedAt) ?? '—'}</TableCell>
      )}
      <TableCell>
        <PlayerStatusBadge player={player} />
      </TableCell>
      <TableCell>
        <ChevronRight
          aria-hidden="true"
          className="text-muted-foreground size-5"
        />
      </TableCell>
    </TableRow>
  );
}
