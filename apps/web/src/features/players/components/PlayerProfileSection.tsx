import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import type { PlayerResponse } from '@/lib/api/players';

import { formatJoinedYear, formatPitchInfo } from './player-formatters';
import { PlayerProfileItem } from './PlayerProfileItem';
import { PlayerStatusBadge } from './PlayerStatusBadge';

type PlayerProfileSectionProps = {
  player: PlayerResponse;
};

export function PlayerProfileSection({
  player,
}: Readonly<PlayerProfileSectionProps>) {
  return (
    <Card
      id="profile"
      padding="content"
      className="border-border/75 bg-card gap-6 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Typography as="h2" variant="headingSm">
        プロフィール
      </Typography>
      <Box className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <PlayerProfileItem label="名前" value={player.name} />
        <PlayerProfileItem label="ふりがな" value={player.kana} />
        <PlayerProfileItem label="投打" value={formatPitchInfo(player)} />
        <PlayerProfileItem label="ポジション" value={player.primaryPosition} />
        <PlayerProfileItem label="背番号" value={player.uniformNumber} />
        <PlayerProfileItem
          label="加入年"
          value={formatJoinedYear(player.joinedAt)}
        />
        <Box as="div" className="flex min-w-0 flex-col gap-1">
          <Typography as="span" variant="caption" tone="muted">
            在籍状況
          </Typography>
          <Box as="div">
            <PlayerStatusBadge player={player} />
          </Box>
        </Box>
      </Box>
      {player.description && (
        <Box className="border-border/70 border-t pt-5">
          <Typography as="h3" variant="bodySm" weight="semibold">
            紹介文
          </Typography>
          <Typography
            as="p"
            variant="bodySm"
            tone="muted"
            className="mt-2 whitespace-pre-line"
          >
            {player.description}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
