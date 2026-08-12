'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reset the document position when moving between pages.
 *
 * Next.js intentionally keeps the current position when the first element of
 * the destination page is already visible. That behavior is useful for some
 * layouts, but this site uses page-level navigation where a new page should
 * start at the top. Browser history navigation is excluded so that Next.js
 * can restore the previous page position.
 */
export function RouteScrollReset() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const pendingPopStatePathname = useRef<string | null>(null);

  useEffect(() => {
    function handlePopState() {
      pendingPopStatePathname.current = window.location.pathname;
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    const isHistoryNavigation = pendingPopStatePathname.current === pathname;
    previousPathname.current = pathname;
    pendingPopStatePathname.current = null;

    if (isHistoryNavigation) {
      return;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
