'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/design/utils';

/**
 * 一覧ページのページ移動に必要な表示状態。
 *
 * ページ番号は1始まりで、実際のURL更新はonPageChangeへ委譲する。
 */
type ListPaginationProps = {
  /** 現在表示している1始まりのページ番号。 */
  currentPage: number;
  /** 表示対象の総ページ数。1以下の場合はページャーを表示しない。 */
  totalPages: number;
  /** ページリンクが持つhref。client側のcallbackを使えない場合にも意味を持つ。 */
  href: string;
  /** ユーザーがページ番号・前後移動を選択したときに呼び出す。 */
  onPageChange: (page: number) => void;
};

export function ListPagination({
  currentPage,
  totalPages,
  href,
  onPageChange,
}: Readonly<ListPaginationProps>) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <Pagination className="w-fit pt-2">
      <PaginationContent className="gap-0">
        <PaginationItem>
          <PaginationPrevious
            href={href}
            text=""
            size="icon-sm"
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={cn(
              'min-h-11 min-w-10 sm:min-h-9 sm:min-w-9',
              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
            )}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pageItems.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={href}
                size="icon-sm"
                isActive={item === currentPage}
                className={cn(
                  'min-h-11 min-w-10 sm:min-h-9 sm:min-w-9',
                  item === currentPage
                    ? 'bg-primary! text-primary-foreground! hover:bg-primary/90! hover:text-primary-foreground!'
                    : undefined
                )}
                aria-label={`${item}ページ`}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={href}
            text=""
            size="icon-sm"
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={cn(
              'min-h-11 min-w-10 sm:min-h-9 sm:min-w-9',
              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            )}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPageItems(
  currentPage: number,
  totalPages: number
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
}
