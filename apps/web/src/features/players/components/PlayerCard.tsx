import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import type { PlayerResponse } from '@/lib/api/players';
import { withListQuery } from '@/lib/list-query';

import { formatJoinedYear, formatPitchInfo } from './player-formatters';
import { PlayerAvatar } from './PlayerAvatar';
import { PlayerCardDetail } from './PlayerCardDetail';
import { PlayerStatusBadge } from './PlayerStatusBadge';

/**
 * 選手一覧のカード表示Props。
 *
 * hasPitchInfoとhasJoinedAtは一覧全体の列構成を揃えるための値で、個別選手の有無ではない。
 */
type PlayerCardProps = {
  player: PlayerResponse;
  /** 一覧内に投打情報が1件でもある場合に投打欄を表示する。 */
  hasPitchInfo: boolean;
  /** 一覧内に加入日が1件でもある場合に加入年欄を表示する。 */
  hasJoinedAt: boolean;
  /** 詳細から選手一覧へ戻るときに維持するfilter/page query。 */
  returnQuery?: string;
};

export function PlayerCard({
  player,
  hasPitchInfo,
  hasJoinedAt,
  returnQuery,
}: Readonly<PlayerCardProps>) {
  const playerName = player.name?.trim() || '名前未設定';
  const playerId = player.playerId ?? 0;

  return (
    <Card className="gap-0 rounded-xl p-0 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <Link
        href={withListQuery(`/players/${playerId}`, returnQuery)}
        aria-label={`${playerName}の詳細を見る`}
        className="group focus-visible:ring-ring flex min-w-0 flex-col gap-3 p-3 focus-visible:ring-3 focus-visible:outline-none sm:gap-5 sm:p-5"
      >
        <Box display="flex" align="center" gap="md" className="min-w-0">
          <PlayerAvatar player={player} />
          <Box className="min-w-0 flex-1">
            <Typography
              as="p"
              variant="headingSm"
              className="group-hover:text-primary wrap-break-word"
            >
              {playerName}
              {player.uniformNumber ? (
                <span className="text-muted-foreground ml-1 text-sm font-medium">
                  #{player.uniformNumber}
                </span>
              ) : null}
            </Typography>
          </Box>
          <PlayerStatusBadge player={player} />
        </Box>

        <Box className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
          <PlayerCardDetail
            label="ポジション"
            value={player.primaryPosition || '—'}
          />
          {hasPitchInfo && (
            <PlayerCardDetail
              label="投打"
              value={formatPitchInfo(player) ?? '—'}
            />
          )}
          {hasJoinedAt && (
            <PlayerCardDetail
              label="加入年"
              value={formatJoinedYear(player.joinedAt) ?? '—'}
            />
          )}
        </Box>
        <Box className="border-border/70 text-primary flex items-center justify-end gap-1 border-t pt-2 text-sm font-semibold whitespace-nowrap sm:pt-3">
          詳細を見る
          <ChevronRight aria-hidden="true" className="size-4" />
        </Box>
      </Link>
    </Card>
  );
}
