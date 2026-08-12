'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { FilterResetButton } from '@/components/ui/filter-reset-button';
import { FilterSelect } from '@/components/ui/filter-select';
import { SelectItem } from '@/components/ui/select';

/** position・statusで絞り込まないことを表すfilter値。 */
export const ALL_FILTER_VALUE = 'all';

/**
 * PlayerListのfilter state。
 *
 * positionとstatusの`all`、sortの`uniform-number`、空のsearchが既定状態を表す。
 */
export type PlayerFilterValues = {
  /** `all`なら守備位置で絞り込まない。 */
  position: string;
  /** `all`・`active`・`inactive`で在籍状況を指定する。 */
  status: string;
  /** `uniform-number`・`name`・加入日の順序を表す値。 */
  sort: string;
  /** 選手名に対する部分一致検索文字列。空文字は検索なし。 */
  search: string;
};

export const DEFAULT_PLAYER_FILTERS: PlayerFilterValues = {
  position: ALL_FILTER_VALUE,
  status: ALL_FILTER_VALUE,
  sort: 'uniform-number',
  search: '',
};

/**
 * PlayerFiltersのcontrolled / uncontrolled利用を表すProps。
 *
 * valueを渡すとcontrolledになり、未指定時はdefaultValueを初期値とする内部stateで動作する。
 */
export type PlayerFiltersProps = {
  /** controlled利用時の現在値。指定時は親が状態を管理する。 */
  value?: PlayerFilterValues;
  /** uncontrolled利用時に一度だけ使用する初期値。 */
  defaultValue?: PlayerFilterValues;
  /** 選択・検索・リセット後の完全なfilter stateを渡す。 */
  onChange?: (value: PlayerFilterValues) => void;
};

export function PlayerFilters({
  value,
  defaultValue = DEFAULT_PLAYER_FILTERS,
  onChange,
}: Readonly<PlayerFiltersProps>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const hasActiveFilters =
    currentValue.position !== ALL_FILTER_VALUE ||
    currentValue.status !== ALL_FILTER_VALUE ||
    currentValue.sort !== 'uniform-number' ||
    currentValue.search.trim() !== '';
  function updateValue(key: keyof PlayerFilterValues, nextValue: string) {
    const nextFilterValue = { ...currentValue, [key]: nextValue };

    if (value === undefined) {
      setInternalValue(nextFilterValue);
    }
    onChange?.(nextFilterValue);
  }

  function resetFilters() {
    if (value === undefined) {
      setInternalValue(DEFAULT_PLAYER_FILTERS);
    }
    onChange?.(DEFAULT_PLAYER_FILTERS);
  }

  return (
    <Box as="section" aria-label="選手一覧の検索条件">
      <Box className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-[minmax(220px,20rem)_auto_auto] lg:items-end lg:gap-x-8 lg:gap-y-5">
        <Box className="relative col-span-3 lg:col-span-1">
          <label htmlFor="player-name-search" className="sr-only">
            選手名検索
          </label>
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            id="player-name-search"
            type="search"
            value={currentValue.search}
            onChange={(event) => updateValue('search', event.target.value)}
            placeholder="選手名で検索"
            className="border-input bg-card placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-md border py-2 pr-3 pl-9 text-base outline-none focus-visible:ring-3 sm:text-sm"
          />
        </Box>

        <Box className="col-span-3 -mx-4 flex min-w-0 items-center gap-2 overflow-x-auto pr-0 pl-4 sm:-mx-6 sm:pl-6 lg:col-span-1 lg:mx-0 lg:grid lg:grid-cols-[max-content_max-content_max-content] lg:gap-5 lg:overflow-visible lg:pl-0">
          <FilterSelect
            id="player-filter-position"
            label="ポジション"
            value={currentValue.position}
            onValueChange={(nextValue) => updateValue('position', nextValue)}
            valueLabel={
              currentValue.position === ALL_FILTER_VALUE
                ? 'ポジション'
                : undefined
            }
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value={ALL_FILTER_VALUE}>すべて</SelectItem>
            <SelectItem value="投手">投手</SelectItem>
            <SelectItem value="捕手">捕手</SelectItem>
            <SelectItem value="内野手">内野手</SelectItem>
            <SelectItem value="外野手">外野手</SelectItem>
          </FilterSelect>

          <FilterSelect
            id="player-filter-status"
            label="在籍状況"
            value={currentValue.status}
            onValueChange={(nextValue) => updateValue('status', nextValue)}
            valueLabel={
              currentValue.status === ALL_FILTER_VALUE ? '在籍状況' : undefined
            }
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value={ALL_FILTER_VALUE}>すべて</SelectItem>
            <SelectItem value="active">在籍中</SelectItem>
            <SelectItem value="inactive">退団</SelectItem>
          </FilterSelect>

          <FilterSelect
            id="player-filter-sort"
            label="並び順"
            value={currentValue.sort}
            onValueChange={(nextValue) => updateValue('sort', nextValue)}
            hideLabel
            className="w-max shrink-0"
          >
            <SelectItem value="uniform-number">背番号順</SelectItem>
            <SelectItem value="name">名前順</SelectItem>
            <SelectItem value="joined-desc">加入順（新）</SelectItem>
            <SelectItem value="joined-asc">加入順（古）</SelectItem>
          </FilterSelect>
        </Box>

        <FilterResetButton
          onReset={resetFilters}
          disabled={!hasActiveFilters}
          className="col-span-3 hidden h-6 justify-self-end md:col-span-1 md:inline-flex lg:justify-self-end"
        />
      </Box>
    </Box>
  );
}
