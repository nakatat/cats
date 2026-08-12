'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * usePaginationのページ制御条件。
 *
 * `resetKey`またはpageSizeが変わると現在ページを1へ戻し、initialPageは初回表示ページとして扱う。
 */
type UsePaginationOptions = {
  /** 1ページに表示する件数。 */
  pageSize: number;
  /** filterなどの変更を検知してページをリセットする値。 */
  resetKey?: unknown;
  /** 初回表示ページ。1未満または整数でない値は1として扱う。 */
  initialPage?: number;
};

export function usePagination<T>(
  items: T[],
  { pageSize, resetKey, initialPage = 1 }: UsePaginationOptions
) {
  const normalizedInitialPage = Number.isInteger(initialPage)
    ? Math.max(1, initialPage)
    : 1;
  const [currentPage, setCurrentPage] = useState(normalizedInitialPage);
  const previousPageSize = useRef(pageSize);
  const previousResetKey = useRef(resetKey);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const shouldReset =
      previousPageSize.current !== pageSize ||
      previousResetKey.current !== resetKey;

    setCurrentPage(shouldReset ? 1 : normalizedInitialPage);
    previousPageSize.current = pageSize;
    previousResetKey.current = resetKey;
  }, [normalizedInitialPage, pageSize, resetKey]);

  return {
    currentPage: page,
    totalPages,
    visibleItems,
    onPageChange: setCurrentPage,
  };
}
