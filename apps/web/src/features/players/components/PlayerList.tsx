'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Box } from '@/components/system/Box';
import type { PlayerResponse } from '@/lib/api/players';
import {
  getPageFromQuery,
  withListQuery,
  withPageQuery,
} from '@/lib/list-query';
import { usePagination } from '@/lib/use-pagination';

import {
  ALL_FILTER_VALUE,
  DEFAULT_PLAYER_FILTERS,
  PlayerFilters,
  type PlayerFilterValues,
} from './PlayerFilters';
import { PlayerListResults } from './PlayerListResults';

/**
 * 選手一覧の入力Props。
 *
 * initialFilterQueryは初期URLから復元するfilterで、以後の変更はURL queryへ同期する。
 */
type PlayerListProps = {
  players: PlayerResponse[];
  /** 1ページに表示する選手数。省略時は10件。 */
  pageSize?: number;
  /** position・status・sort・search・pageを含む初期query文字列。 */
  initialFilterQuery?: string;
};

const DEFAULT_PAGE_SIZE = 10;

export function PlayerList({
  players,
  pageSize = DEFAULT_PAGE_SIZE,
  initialFilterQuery = '',
}: Readonly<PlayerListProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResults = useRef(false);
  const urlFilterQuery = searchParams.toString();
  const [filters, setFilters] = useState<PlayerFilterValues>(() =>
    getInitialPlayerFilters(urlFilterQuery || initialFilterQuery)
  );

  useEffect(() => {
    setFilters(getInitialPlayerFilters(urlFilterQuery || initialFilterQuery));
  }, [initialFilterQuery, urlFilterQuery]);

  const filterQuery = createPlayerFilterQuery(filters);
  const initialPage = getPageFromQuery(urlFilterQuery || initialFilterQuery);

  const filteredPlayers = useMemo(() => {
    const search = normalizePlayerSearch(filters.search);
    const matchingPlayers = players.filter((player) => {
      const matchesPosition =
        filters.position === ALL_FILTER_VALUE ||
        player.primaryPosition === filters.position ||
        (filters.position === '内野手' &&
          player.primaryPosition?.endsWith('塁手')) ||
        (filters.position === '内野手' &&
          player.primaryPosition === '遊撃手') ||
        (filters.position === '外野手' &&
          player.primaryPosition?.endsWith('翼手'));
      const matchesStatus =
        filters.status === ALL_FILTER_VALUE ||
        (filters.status === 'active' && player.leftAt == null) ||
        (filters.status === 'inactive' && player.leftAt != null);
      const searchableText = normalizePlayerSearch(player.name ?? '');
      const matchesSearch = search === '' || searchableText.includes(search);

      return matchesPosition && matchesStatus && matchesSearch;
    });

    return matchingPlayers.sort((left, right) => {
      if (filters.sort === 'name') {
        return (left.name ?? '').localeCompare(right.name ?? '', 'ja');
      }

      if (filters.sort === 'joined-desc' || filters.sort === 'joined-asc') {
        const leftDate = left.joinedAt ?? '';
        const rightDate = right.joinedAt ?? '';
        const result = leftDate.localeCompare(rightDate);
        return filters.sort === 'joined-desc' ? -result : result;
      }

      return compareUniformNumbers(left.uniformNumber, right.uniformNumber);
    });
  }, [filters, players]);

  const hasPitchInfo = players.some(
    (player) => player.throwingHand || player.battingHand
  );
  const hasJoinedAt = players.some((player) => player.joinedAt);
  const hasActiveFilters =
    filters.position !== ALL_FILTER_VALUE ||
    filters.status !== ALL_FILTER_VALUE ||
    filters.sort !== 'uniform-number' ||
    filters.search.trim() !== '';
  const {
    currentPage,
    totalPages,
    visibleItems: visiblePlayers,
    onPageChange,
  } = usePagination(filteredPlayers, {
    pageSize,
    resetKey: filterQuery,
    initialPage,
  });

  useEffect(() => {
    if (!shouldScrollToResults.current) {
      return;
    }

    shouldScrollToResults.current = false;
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  function handleFilterChange(value: PlayerFilterValues) {
    setFilters(value);
    router.replace(withListQuery(pathname, createPlayerFilterQuery(value)), {
      scroll: false,
    });
  }

  function handlePageChange(
    page: number,
    setCurrentPage: (page: number) => void
  ) {
    if (page !== currentPage) {
      shouldScrollToResults.current = true;
    }
    setCurrentPage(page);
    router.replace(withListQuery(pathname, withPageQuery(filterQuery, page)), {
      scroll: false,
    });
  }

  return (
    <Box as="section" id="players" display="flex" direction="column" gap="lg">
      <PlayerFilters value={filters} onChange={handleFilterChange} />

      <Box
        ref={resultsRef}
        display="flex"
        direction="column"
        gap="lg"
        className="scroll-mt-16 md:scroll-mt-20"
      >
        <PlayerListResults
          players={players}
          filteredPlayers={filteredPlayers}
          visiblePlayers={visiblePlayers}
          hasPitchInfo={hasPitchInfo}
          hasJoinedAt={hasJoinedAt}
          onReset={() => handleFilterChange(DEFAULT_PLAYER_FILTERS)}
          hasActiveFilters={hasActiveFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page, onPageChange)}
          returnQuery={withPageQuery(filterQuery, currentPage)}
        />
      </Box>
    </Box>
  );
}

function compareUniformNumbers(left?: string, right?: string) {
  const leftNumber = left ? Number(left) : Number.NaN;
  const rightNumber = right ? Number(right) : Number.NaN;
  const leftIsNumber = Number.isFinite(leftNumber);
  const rightIsNumber = Number.isFinite(rightNumber);

  if (leftIsNumber && rightIsNumber) return leftNumber - rightNumber;
  if (leftIsNumber) return -1;
  if (rightIsNumber) return 1;
  return (left ?? '').localeCompare(right ?? '', 'ja');
}

function getInitialPlayerFilters(query: string): PlayerFilterValues {
  const searchParams = new URLSearchParams(query);

  return {
    position: searchParams.get('position') ?? ALL_FILTER_VALUE,
    status: searchParams.get('status') ?? ALL_FILTER_VALUE,
    sort: searchParams.get('sort') ?? 'uniform-number',
    search: searchParams.get('search') ?? '',
  };
}

function createPlayerFilterQuery(filters: PlayerFilterValues) {
  const query = new URLSearchParams();

  if (filters.position !== ALL_FILTER_VALUE) {
    query.set('position', filters.position);
  }
  if (filters.status !== ALL_FILTER_VALUE) {
    query.set('status', filters.status);
  }
  if (filters.sort !== 'uniform-number') {
    query.set('sort', filters.sort);
  }
  if (filters.search.trim() !== '') {
    query.set('search', filters.search);
  }

  return query.toString();
}

function normalizePlayerSearch(value: string) {
  return value.replace(/\s/g, '').toLocaleLowerCase('ja');
}
