'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Box } from '@/components/system/Box';
import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';
import {
  getPageFromQuery,
  withListQuery,
  withPageQuery,
} from '@/lib/list-query';
import { usePagination } from '@/lib/use-pagination';

import {
  createSeasonOptions,
  createTournamentOptions,
  filterGames,
  resolveTournamentFilterValue,
  sortGames,
} from './game-list-calculations';
import {
  ALL_GAME_FILTER_VALUE,
  createGameFilterQuery,
  type GameFilterValues,
  getGameFilterValue,
} from './game-list-query';
import { GameListFilters } from './GameListFilters';
import { GameListResults } from './GameListResults';

/**
 * 試合一覧の入力Props。
 *
 * initialFilterQueryはServer Componentから渡す初期URL queryで、以後のfilter変更はブラウザURLへ同期する。
 */
type GameListProps = {
  games: GameResponse[];
  seasons?: SeasonResponse[];
  tournaments?: TournamentResponse[];
  /** 1ページに表示する試合数。省略時は5件。 */
  pageSize?: number;
  /** season・tournament・result・sortを含む初期query文字列。 */
  initialFilterQuery?: string;
};

const DEFAULT_PAGE_SIZE = 5;

export function GameList({
  games,
  seasons = [],
  tournaments = [],
  pageSize = DEFAULT_PAGE_SIZE,
  initialFilterQuery = '',
}: Readonly<GameListProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLDivElement>(null);
  const shouldScrollToResults = useRef(false);
  const [season, setSeason] = useState(() =>
    getGameFilterValue(initialFilterQuery, 'season', ALL_GAME_FILTER_VALUE)
  );
  const [tournament, setTournament] = useState(() =>
    getGameFilterValue(initialFilterQuery, 'tournament', ALL_GAME_FILTER_VALUE)
  );
  const [result, setResult] = useState(() =>
    getGameFilterValue(initialFilterQuery, 'result', ALL_GAME_FILTER_VALUE)
  );
  const [sort, setSort] = useState(() =>
    getGameFilterValue(initialFilterQuery, 'sort', 'date-desc')
  );

  useEffect(() => {
    setSeason(
      getGameFilterValue(initialFilterQuery, 'season', ALL_GAME_FILTER_VALUE)
    );
    setTournament(
      getGameFilterValue(
        initialFilterQuery,
        'tournament',
        ALL_GAME_FILTER_VALUE
      )
    );
    setResult(
      getGameFilterValue(initialFilterQuery, 'result', ALL_GAME_FILTER_VALUE)
    );
    setSort(getGameFilterValue(initialFilterQuery, 'sort', 'date-desc'));
  }, [initialFilterQuery]);

  const currentFilters = { season, tournament, result, sort };
  const filterQuery = createGameFilterQuery(currentFilters);
  const initialPage = getPageFromQuery(initialFilterQuery);
  const hasActiveFilters =
    season !== ALL_GAME_FILTER_VALUE ||
    tournament !== ALL_GAME_FILTER_VALUE ||
    result !== ALL_GAME_FILTER_VALUE ||
    sort !== 'date-desc';

  const seasonOptions = useMemo(
    () => createSeasonOptions(games, seasons),
    [games, seasons]
  );
  const tournamentOptions = useMemo(
    () => createTournamentOptions(games, tournaments),
    [games, tournaments]
  );
  const selectedTournament = useMemo(
    () => resolveTournamentFilterValue(tournament, tournamentOptions),
    [tournament, tournamentOptions]
  );
  const filteredGames = useMemo(
    () =>
      sortGames(filterGames(games, currentFilters, tournamentOptions), sort),
    [games, result, season, sort, tournament, tournamentOptions]
  );

  const {
    currentPage,
    totalPages,
    visibleItems: visibleGames,
    onPageChange,
  } = usePagination(filteredGames, {
    pageSize,
    resetKey: `${result}:${season}:${sort}:${tournament}`,
    initialPage,
  });

  useEffect(() => {
    if (!shouldScrollToResults.current) {
      return;
    }

    shouldScrollToResults.current = false;
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  function resetFilters() {
    updateFilters({
      season: ALL_GAME_FILTER_VALUE,
      tournament: ALL_GAME_FILTER_VALUE,
      result: ALL_GAME_FILTER_VALUE,
      sort: 'date-desc',
    });
  }

  function updateFilters(next: Partial<GameFilterValues>) {
    const nextFilters = {
      season: next.season ?? season,
      tournament: next.tournament ?? tournament,
      result: next.result ?? result,
      sort: next.sort ?? sort,
    };

    setSeason(nextFilters.season);
    setTournament(nextFilters.tournament);
    setResult(nextFilters.result);
    setSort(nextFilters.sort);
    router.replace(
      withListQuery(pathname, createGameFilterQuery(nextFilters)),
      { scroll: false }
    );
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
    <Box display="flex" direction="column" gap="xl">
      <GameListFilters
        season={season}
        tournament={selectedTournament}
        result={result}
        sort={sort}
        seasonOptions={seasonOptions}
        tournamentOptions={tournamentOptions}
        onSeasonChange={(value) => updateFilters({ season: value })}
        onTournamentChange={(value) => updateFilters({ tournament: value })}
        onResultChange={(value) => updateFilters({ result: value })}
        onSortChange={(value) => updateFilters({ sort: value })}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <Box ref={resultsRef} className="scroll-mt-16 md:scroll-mt-20">
        <GameListResults
          games={filteredGames}
          visibleGames={visibleGames}
          currentPage={currentPage}
          totalPages={totalPages}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          onPageChange={(page) => handlePageChange(page, onPageChange)}
          returnQuery={withPageQuery(filterQuery, currentPage)}
        />
      </Box>
    </Box>
  );
}
