/**
 * Next.js App Routerから渡されるページqueryの形。
 *
 * 同じkeyが複数指定された場合は、利用側で先頭の値へ正規化する。
 */
export type PageSearchParams = Record<string, string | string[] | undefined>;

export const GAME_LIST_FILTER_KEYS = [
  'season',
  'tournament',
  'result',
  'sort',
  'page',
] as const;

export const PLAYER_LIST_FILTER_KEYS = [
  'position',
  'status',
  'sort',
  'search',
  'page',
] as const;

export function pickListQuery(
  searchParams: PageSearchParams,
  keys: readonly string[]
) {
  const query = new URLSearchParams();

  for (const key of keys) {
    const value = searchParams[key];
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (normalizedValue) {
      query.set(key, normalizedValue);
    }
  }

  return query.toString();
}

export function withListQuery(path: string, query?: string) {
  return query ? `${path}?${query}` : path;
}

export function getPageFromQuery(query: string) {
  const page = Number(new URLSearchParams(query).get('page'));

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function withPageQuery(query: string, page: number) {
  const params = new URLSearchParams(query);

  if (page > 1) {
    params.set('page', String(page));
  } else {
    params.delete('page');
  }

  return params.toString();
}
