import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { PlayerResponse } from '@/lib/api/players';
import { cn } from '@/lib/design/utils';

import { formatJoinedYear, formatPitchInfo } from './player-formatters';
import { getPlayerImageFallback } from './player-image';
import { PlayerProfileValue } from './PlayerProfileValue';
import { PlayerStatusBadge } from './PlayerStatusBadge';

type PlayerProfileCardProps = {
  player: PlayerResponse;
};

export function PlayerProfileCard({
  player,
}: Readonly<PlayerProfileCardProps>) {
  const playerName = player.name?.trim() || '名前未設定';
  const playerImageUrl = player.profileImageUrl;
  const playerImageFallback = getPlayerImageFallback(player);

  return (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-4 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)] lg:p-8"
    >
      <Box className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 lg:gap-x-8 lg:gap-y-5">
        <Avatar
          size="default"
          className={cn(
            'row-start-1 shrink-0 after:hidden',
            player.description ? 'md:row-span-3' : 'md:row-span-2',
            'size-16 sm:size-20 md:size-24 lg:size-28',
            playerImageUrl ? 'bg-muted/45' : 'bg-primary/10 text-primary'
          )}
        >
          {playerImageUrl && (
            <AvatarImage
              src={playerImageUrl}
              alt={`${playerName}の選手写真`}
              sizes="(min-width: 1024px) 112px, (min-width: 768px) 96px, 80px"
            />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-lg leading-none font-bold whitespace-nowrap sm:text-xl md:text-2xl">
            {playerImageFallback}
          </AvatarFallback>
        </Avatar>

        <Box
          display="flex"
          align="center"
          justify="between"
          gap="sm"
          className="col-start-2 row-start-1 min-w-0"
        >
          <Typography
            as="h1"
            variant="headingLg"
            className="min-w-0 text-xl wrap-break-word sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {playerName}
            {player.uniformNumber ? (
              <span className="text-muted-foreground ml-1 text-lg font-semibold whitespace-nowrap sm:text-xl md:text-2xl">
                #{player.uniformNumber}
              </span>
            ) : null}
          </Typography>
          <PlayerStatusBadge player={player} />
        </Box>

        <Box className="col-span-2 row-start-2 grid grid-cols-3 gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-4 lg:col-span-1 lg:col-start-2 lg:max-w-3xl">
          <PlayerProfileValue
            label="ポジション"
            value={player.primaryPosition || '—'}
          />
          <PlayerProfileValue label="投打" value={formatPitchInfo(player)} />
          <PlayerProfileValue
            label="加入年"
            value={formatJoinedYear(player.joinedAt)}
          />
        </Box>
        {player.description ? (
          <Box className="border-border/70 col-span-2 row-start-3 border-t pt-2 lg:col-span-1 lg:col-start-2 lg:max-w-3xl lg:pt-3">
            <Typography as="h2" variant="bodySm" weight="semibold">
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
        ) : null}
      </Box>
    </Card>
  );
}
