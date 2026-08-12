import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

import {
  ALL_GAME_FILTER_VALUE,
  type GameFilterValues,
} from './game-list-query';

export type TournamentFilterOption = {
  value: string;
  label: string;
  tournamentIds: number[];
};

const TOURNAMENT_NAME_FILTER_PREFIX = 'tournament-name:';
const TOURNAMENT_ID_FILTER_PREFIX = 'tournament-id:';
const UNNAMED_TOURNAMENT_LABEL = '大会未設定';

function normalizeTournamentName(name: string) {
  return name
    .trim()
    .toLocaleLowerCase('ja')
    .replace(/[\s\u3000]+/g, '')
    .replace(/（/g, '(')
    .replace(/）/g, ')');
}

function getTournamentOptionKey(
  tournamentId: number,
  name: string | null | undefined
) {
  const normalizedName = name ? normalizeTournamentName(name) : '';
  return normalizedName
    ? `${TOURNAMENT_NAME_FILTER_PREFIX}${normalizedName}`
    : `${TOURNAMENT_ID_FILTER_PREFIX}${tournamentId}`;
}

/**
 * season・tournament・resultの全条件を満たす試合だけを返す。
 *
 * 値が`all`の条件は絞り込みに使用しない。
 */
export function filterGames(
  games: GameResponse[],
  filters: Pick<GameFilterValues, 'season' | 'tournament' | 'result'>,
  tournamentOptions: TournamentFilterOption[] = []
) {
  const selectedTournament = tournamentOptions.find(
    (option) => option.value === filters.tournament
  );
  const selectedTournamentIds = selectedTournament
    ? new Set(selectedTournament.tournamentIds)
    : null;

  return games.filter((game) => {
    const matchesSeason =
      filters.season === ALL_GAME_FILTER_VALUE ||
      String(game.seasonYear) === filters.season;
    const matchesTournament =
      filters.tournament === ALL_GAME_FILTER_VALUE ||
      (selectedTournamentIds
        ? game.tournamentId != null &&
          selectedTournamentIds.has(game.tournamentId)
        : String(game.tournamentId) === filters.tournament);
    const matchesResult =
      filters.result === ALL_GAME_FILTER_VALUE ||
      game.result === filters.result;

    return matchesSeason && matchesTournament && matchesResult;
  });
}

/**
 * 試合一覧を日付順に並べ替える。
 *
 * 入力配列は変更せず、`date-asc`だけ古い順、それ以外は新しい順とする。
 * 日付未設定は空文字として比較するため、古い順では先頭、新しい順では末尾になる。
 */
export function sortGames(games: GameResponse[], sort: string) {
  return [...games].sort((left, right) => {
    const leftDate = left.gameDate ?? '';
    const rightDate = right.gameDate ?? '';

    return sort === 'date-asc'
      ? leftDate.localeCompare(rightDate)
      : rightDate.localeCompare(leftDate);
  });
}

/**
 * season情報と試合データから年度選択肢を作成する。
 *
 * <p>season情報を優先し、試合にしか存在しない年度を補完する。同じ年度は1件にまとめ、
 * 年度の新しい順に返す。
 */
export function createSeasonOptions(
  games: GameResponse[],
  seasons: SeasonResponse[]
) {
  const values = new Map<number, string>();

  seasons.forEach((item) => {
    if (item.year != null) {
      values.set(item.year, item.name ?? `${item.year}年`);
    }
  });
  games.forEach((game) => {
    if (game.seasonYear != null && !values.has(game.seasonYear)) {
      values.set(game.seasonYear, `${game.seasonYear}年`);
    }
  });

  return [...values.entries()].sort(([left], [right]) => right - left);
}

/**
 * tournament情報と試合データから大会選択肢を作成する。
 *
 * <p>tournament情報を優先し、試合にしか存在しない大会を補完する。同じ大会名は年度をまたいで1件にまとめ、
 * 選択時に対象となる全大会IDを保持する。名前がない場合はID単位で大会未設定とする。
 */
export function createTournamentOptions(
  games: GameResponse[],
  tournaments: TournamentResponse[]
): TournamentFilterOption[] {
  const values = new Map<string, TournamentFilterOption>();
  const optionKeysByTournamentId = new Map<number, string>();

  function addOption(
    tournamentId: number,
    name: string | null | undefined,
    preferName: boolean
  ) {
    const existingKey = optionKeysByTournamentId.get(tournamentId);
    const key = existingKey ?? getTournamentOptionKey(tournamentId, name);
    const label = name?.trim() || UNNAMED_TOURNAMENT_LABEL;
    const existing = values.get(key);

    optionKeysByTournamentId.set(tournamentId, key);
    if (existing) {
      if (!existing.tournamentIds.includes(tournamentId)) {
        existing.tournamentIds.push(tournamentId);
      }
      if (preferName && existing.label === UNNAMED_TOURNAMENT_LABEL) {
        existing.label = label;
      }
      return;
    }

    values.set(key, {
      value: key,
      label,
      tournamentIds: [tournamentId],
    });
  }

  tournaments.forEach((item) => {
    if (item.tournamentId != null) {
      addOption(item.tournamentId, item.name, true);
    }
  });
  games.forEach((game) => {
    if (game.tournamentId != null) {
      addOption(game.tournamentId, game.tournamentName, false);
    }
  });

  return [...values.values()]
    .map((option) => ({
      ...option,
      tournamentIds: [...option.tournamentIds].sort(
        (left, right) => left - right
      ),
    }))
    .sort(
      (left, right) =>
        left.label.localeCompare(right.label, 'ja') ||
        left.value.localeCompare(right.value)
    );
}

/**
 * 旧URLの大会ID指定を、現在の大会名単位の選択値へ表示上だけ変換する。
 * 絞り込み側は旧URLの数値IDもそのまま処理できるため、既存リンクを壊さない。
 */
export function resolveTournamentFilterValue(
  value: string,
  tournamentOptions: TournamentFilterOption[]
) {
  if (value === ALL_GAME_FILTER_VALUE) {
    return value;
  }

  const tournamentId = Number(value);
  const option = tournamentOptions.find(
    (item) =>
      item.value === value ||
      (Number.isSafeInteger(tournamentId) &&
        String(tournamentId) === value &&
        item.tournamentIds.includes(tournamentId))
  );

  return option?.value ?? value;
}
