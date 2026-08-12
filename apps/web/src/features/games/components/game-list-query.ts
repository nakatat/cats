/** URL queryへ出力しないfilterの既定値。 */
export const ALL_GAME_FILTER_VALUE = 'all';

/**
 * GameListのfilter state。
 *
 * season・tournament・resultの`all`は未指定を表し、sortの`date-desc`は既定の並び順を表す。
 */
export type GameFilterValues = {
  /** `all`なら年度で絞り込まない。 */
  season: string;
  /** `all`なら大会で絞り込まない。 */
  tournament: string;
  /** `all`なら勝敗で絞り込まない。 */
  result: string;
  /** `date-desc`は新しい順、`date-asc`は古い順。 */
  sort: string;
};

/**
 * URL queryからfilter値を取得する。
 *
 * <p>URLSearchParamsによるdecodeを行い、対象keyがない場合はfallbackを返す。
 */
export function getGameFilterValue(
  query: string,
  key: string,
  fallback: string
) {
  return new URLSearchParams(query).get(key) ?? fallback;
}

/**
 * GameListのfilter stateをURL queryへ変換する。
 *
 * season・tournament・resultの`all`と、sortの`date-desc`は既定値として
 * queryから省略する。その他の値はURLSearchParamsのencoding規則で出力する。
 */
export function createGameFilterQuery(filters: GameFilterValues) {
  const query = new URLSearchParams();

  if (filters.season !== ALL_GAME_FILTER_VALUE) {
    query.set('season', filters.season);
  }
  if (filters.tournament !== ALL_GAME_FILTER_VALUE) {
    query.set('tournament', filters.tournament);
  }
  if (filters.result !== ALL_GAME_FILTER_VALUE) {
    query.set('result', filters.result);
  }
  if (filters.sort !== 'date-desc') {
    query.set('sort', filters.sort);
  }

  return query.toString();
}
