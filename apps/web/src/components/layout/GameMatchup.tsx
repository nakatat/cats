import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import { GameScoreValue } from './GameScoreValue';
import { GameTeamDisplay } from './GameTeamDisplay';

/**
 * 2チームの対戦とスコアを表示するProps。
 *
 * scoreがnullまたはundefinedの場合は未確定としてscorePlaceholderを表示し、
 * ロゴがない場合はチーム名の先頭文字をfallbackに使用する。
 */
type GameMatchupProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  /** 未確定のホームチーム得点。0は確定した無得点として扱う。 */
  homeScore?: number | null;
  /** 未確定のアウェイチーム得点。0は確定した無得点として扱う。 */
  awayScore?: number | null;
  /** 未確定スコアの代わりに表示する値。 */
  scorePlaceholder?: number | string;
  /** 表示先に応じたレイアウトのvariant。 */
  variant?: 'featured' | 'compact' | 'detail';
};

export function GameMatchup({
  homeTeamName,
  awayTeamName,
  homeLogoUrl,
  awayLogoUrl,
  homeScore,
  awayScore,
  scorePlaceholder = '',
  variant = 'compact',
}: Readonly<GameMatchupProps>) {
  const isFeatured = variant === 'featured';
  const isDetail = variant === 'detail';
  const isCompleted = homeScore != null && awayScore != null;
  const isHomeWin = isCompleted && homeScore! > awayScore!;
  const isAwayWin = isCompleted && homeScore! < awayScore!;

  return (
    <Box
      display="grid"
      align="center"
      className={
        isFeatured
          ? 'grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:gap-6'
          : isDetail
            ? 'grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1fr)] sm:gap-8 lg:gap-12'
            : 'grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:gap-5 lg:gap-8'
      }
    >
      <GameTeamDisplay
        teamName={homeTeamName}
        imageSrc={homeLogoUrl}
        variant={variant}
        className={
          isFeatured
            ? 'col-start-1 row-start-2 sm:col-start-1 sm:row-start-1'
            : undefined
        }
      />

      <Typography
        as="p"
        variant="headingLg"
        weight="bold"
        align="center"
        className={
          isFeatured
            ? 'col-span-2 row-start-1 grid grid-cols-[2.5ch_auto_2.5ch] justify-center text-4xl tracking-[0.12em] whitespace-nowrap tabular-nums sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:text-5xl'
            : isDetail
              ? 'grid grid-cols-[2.5ch_auto_2.5ch] justify-center text-3xl tracking-[0.12em] whitespace-nowrap tabular-nums sm:text-7xl'
              : 'grid grid-cols-[2.5ch_auto_2.5ch] justify-center text-3xl tracking-[0.12em] whitespace-nowrap tabular-nums sm:text-4xl'
        }
      >
        <GameScoreValue
          score={homeScore}
          placeholder={scorePlaceholder}
          isWinner={isHomeWin}
        />
        <span className="text-muted-foreground px-2 font-normal">-</span>
        <GameScoreValue
          score={awayScore}
          placeholder={scorePlaceholder}
          isWinner={isAwayWin}
        />
      </Typography>

      <GameTeamDisplay
        teamName={awayTeamName}
        imageSrc={awayLogoUrl}
        variant={variant}
        className={
          isFeatured
            ? 'col-start-2 row-start-2 sm:col-start-3 sm:row-start-1'
            : undefined
        }
      />
    </Box>
  );
}
