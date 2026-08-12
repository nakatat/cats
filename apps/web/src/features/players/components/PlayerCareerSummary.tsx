import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  BattingStatsResponse,
  PitchingStatsResponse,
} from '@/lib/api/players';

import { BattingCareerTable } from './BattingCareerTable';
import { PitchingCareerTable } from './PitchingCareerTable';
import type { PlayerSeasonStats } from './player-detail.types';
import { PlayerStatsEmptyMessage } from './PlayerStatsEmptyMessage';

/**
 * 選手の通算・シーズン別成績を表示するProps。
 *
 * battingまたはpitchingがない場合でも、seasonsに該当カテゴリの成績があればそのタブを表示できる。
 */
type PlayerCareerSummaryProps = {
  /** 通算打撃成績。未取得または成績なしの場合はundefined。 */
  batting?: BattingStatsResponse;
  /** 通算投手成績。未取得または成績なしの場合はundefined。 */
  pitching?: PitchingStatsResponse;
  /** 年度の新しい順に並んだ、カテゴリ別成績を含む年度一覧。 */
  seasons?: PlayerSeasonStats[];
};

export function PlayerCareerSummary({
  batting,
  pitching,
  seasons = [],
}: Readonly<PlayerCareerSummaryProps>) {
  const defaultTab =
    batting || seasons.some((season) => season.batting)
      ? 'batting'
      : 'pitching';

  return (
    <Card
      id="career-summary"
      padding="content"
      className="border-border/75 bg-card gap-2.5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Typography as="h2" variant="headingSm">
        通算成績
      </Typography>
      <Tabs defaultValue={defaultTab} className="min-w-0">
        <TabsList variant="line" className="w-full sm:w-fit">
          <TabsTrigger value="batting" className="flex-1 sm:flex-none">
            打撃
          </TabsTrigger>
          <TabsTrigger value="pitching" className="flex-1 sm:flex-none">
            投手
          </TabsTrigger>
        </TabsList>
        <TabsContent value="batting" className="px-0 pt-4">
          {batting || seasons.some((season) => season.batting) ? (
            <BattingCareerTable
              batting={batting}
              seasons={seasons.filter(
                (
                  season
                ): season is PlayerSeasonStats & {
                  batting: BattingStatsResponse;
                } => season.batting != null
              )}
            />
          ) : (
            <PlayerStatsEmptyMessage>
              打撃成績はまだありません。
            </PlayerStatsEmptyMessage>
          )}
        </TabsContent>
        <TabsContent value="pitching" className="px-0 pt-4">
          {pitching || seasons.some((season) => season.pitching) ? (
            <PitchingCareerTable
              pitching={pitching}
              seasons={seasons.filter(
                (
                  season
                ): season is PlayerSeasonStats & {
                  pitching: PitchingStatsResponse;
                } => season.pitching != null
              )}
            />
          ) : (
            <PlayerStatsEmptyMessage>
              投手成績はまだありません。
            </PlayerStatsEmptyMessage>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
