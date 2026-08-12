import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { cn } from '@/lib/design/utils';
import { formatGameDateWithWeekday } from '@/lib/formatters';

/**
 * 試合日・大会・会場を表示するProps。
 *
 * 大会名は未設定時に「大会未設定」、会場はstadiumName、venueNameの順でfallbackする。
 */
type GameInfoProps = {
  gameDate?: string | null;
  tournamentName?: string | null;
  stadiumName?: string | null;
  venueName?: string | null;
  /** compactでは一覧向けに短い表示スタイルを使用する。 */
  variant?: 'default' | 'compact';
  className?: string;
};

export function GameInfo({
  gameDate,
  tournamentName,
  stadiumName,
  venueName,
  variant = 'default',
  className,
}: Readonly<GameInfoProps>) {
  const isCompact = variant === 'compact';
  const gameMeta = [
    tournamentName ?? '大会未設定',
    stadiumName ?? venueName ?? '球場未設定',
  ].join(' ／ ');

  return (
    <Box
      display="flex"
      direction="column"
      gap="xs"
      className={cn('min-w-0', className)}
    >
      <Typography
        as="p"
        variant="bodySm"
        weight={isCompact ? 'bold' : 'semibold'}
      >
        {formatGameDateWithWeekday(gameDate)}
      </Typography>
      <Typography
        as="p"
        variant={isCompact ? 'caption' : 'bodySm'}
        tone={isCompact ? 'muted' : 'default'}
        weight={isCompact ? undefined : 'medium'}
        className={isCompact ? 'truncate' : undefined}
      >
        {gameMeta}
      </Typography>
    </Box>
  );
}
