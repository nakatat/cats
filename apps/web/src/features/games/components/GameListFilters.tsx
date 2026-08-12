import { Box } from '@/components/system/Box';
import { FilterResetButton } from '@/components/ui/filter-reset-button';
import { FilterSelect } from '@/components/ui/filter-select';
import { SelectItem } from '@/components/ui/select';

import type { TournamentFilterOption } from './game-list-calculations';
import { ALL_GAME_FILTER_VALUE } from './game-list-query';

/**
 * GameListのfilter UIに渡す現在値・選択肢・変更callback。
 *
 * 値の`all`は未指定を表し、hasActiveFiltersがfalseのときリセット操作を無効にする。
 */
type GameListFiltersProps = {
  /** 現在選択中の年度。`all`は全年度を表す。 */
  season: string;
  /** 現在選択中の大会。`all`は全大会を表す。 */
  tournament: string;
  /** 現在選択中の勝敗。`all`は全結果を表す。 */
  result: string;
  /** 現在の並び順。`date-desc`が新しい順の既定値。 */
  sort: string;
  /** 年度と表示名の組。年度の新しい順に整列済み。 */
  seasonOptions: Array<[number, string]>;
  /** 大会名単位にまとめた大会選択肢。各選択肢は対象IDを複数持てる。 */
  tournamentOptions: TournamentFilterOption[];
  /** 年度が変更されたとき、新しい選択値を渡す。 */
  onSeasonChange: (value: string) => void;
  /** 大会が変更されたとき、新しい選択値を渡す。 */
  onTournamentChange: (value: string) => void;
  /** 勝敗が変更されたとき、新しい選択値を渡す。 */
  onResultChange: (value: string) => void;
  /** 並び順が変更されたとき、新しい選択値を渡す。 */
  onSortChange: (value: string) => void;
  /** すべてのfilterを既定値へ戻す操作。 */
  onReset: () => void;
  /** いずれかのfilterが既定値から変更されているか。 */
  hasActiveFilters: boolean;
};

export function GameListFilters({
  season,
  tournament,
  result,
  sort,
  seasonOptions,
  tournamentOptions,
  onSeasonChange,
  onTournamentChange,
  onResultChange,
  onSortChange,
  onReset,
  hasActiveFilters,
}: Readonly<GameListFiltersProps>) {
  return (
    <Box as="section" aria-label="試合一覧の検索条件">
      <Box className="grid gap-2 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-8 lg:gap-y-5">
        <Box className="-mx-4 flex min-w-0 gap-2 overflow-x-auto pr-0 pl-4 sm:-mx-6 sm:pl-6 lg:mx-0 lg:grid lg:grid-cols-[max-content_max-content_max-content_max-content] lg:gap-5 lg:overflow-visible lg:pl-0">
          <FilterSelect
            id="game-filter-season"
            label="シーズン"
            value={season}
            onValueChange={onSeasonChange}
            valueLabel={
              season === ALL_GAME_FILTER_VALUE ? 'シーズン' : undefined
            }
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value={ALL_GAME_FILTER_VALUE}>すべて</SelectItem>
            {seasonOptions.map(([value, label]) => (
              <SelectItem key={value} value={String(value)}>
                {label}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            id="game-filter-tournament"
            label="大会"
            value={tournament}
            onValueChange={onTournamentChange}
            valueLabel={
              tournament === ALL_GAME_FILTER_VALUE ? '大会' : undefined
            }
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value={ALL_GAME_FILTER_VALUE}>すべて</SelectItem>
            {tournamentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </FilterSelect>

          <FilterSelect
            id="game-filter-result"
            label="勝敗"
            value={result}
            onValueChange={onResultChange}
            valueLabel={result === ALL_GAME_FILTER_VALUE ? '勝敗' : undefined}
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value={ALL_GAME_FILTER_VALUE}>すべて</SelectItem>
            <SelectItem value="win">勝利</SelectItem>
            <SelectItem value="loss">敗戦</SelectItem>
            <SelectItem value="draw">引き分け</SelectItem>
          </FilterSelect>

          <FilterSelect
            id="game-filter-sort"
            label="日付"
            value={sort}
            onValueChange={onSortChange}
            valueLabel={sort === 'date-desc' ? '日付' : '日付（古）'}
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value="date-desc">新しい順</SelectItem>
            <SelectItem value="date-asc">古い順</SelectItem>
          </FilterSelect>
        </Box>

        <FilterResetButton
          onReset={onReset}
          disabled={!hasActiveFilters}
          className="hidden h-6 justify-self-end sm:inline-flex lg:justify-self-end"
        />
      </Box>
    </Box>
  );
}
