import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { cn } from '@/lib/design/utils';

import type { DetailNavigationItem } from './DetailNavigation';

export function DetailNavigationLink({
  direction,
  item,
  mobileLayout,
  hideTitleOnMobile,
  className,
}: Readonly<{
  direction: 'previous' | 'next';
  item: DetailNavigationItem;
  mobileLayout: 'stack' | 'row';
  hideTitleOnMobile: boolean;
  className?: string;
}>) {
  const isPrevious = direction === 'previous';

  return (
    <Link
      href={item.href}
      aria-label={`${item.label}: ${item.title}`}
      className={cn(
        'group focus-visible:ring-ring flex min-w-0 items-center gap-3 rounded-lg px-2 py-2 transition-colors focus-visible:ring-3 focus-visible:outline-none sm:w-auto sm:max-w-[48%]',
        mobileLayout === 'row' ? 'w-1/2' : 'w-full',
        isPrevious
          ? 'hover:bg-primary/4 text-left'
          : 'hover:bg-primary/4 justify-end text-right',
        className
      )}
    >
      {isPrevious ? (
        <ArrowLeft
          aria-hidden="true"
          className="text-primary size-5 shrink-0 transition-transform group-hover:-translate-x-1"
        />
      ) : (
        <span aria-hidden="true" />
      )}
      <Box
        display="flex"
        direction="column"
        gap="xs"
        className={cn('min-w-0', isPrevious ? 'items-start' : 'items-end')}
      >
        <Typography as="span" variant="caption" tone="muted">
          {item.label}
        </Typography>
        <Typography
          as="span"
          variant="bodySm"
          tone="default"
          weight="semibold"
          className={cn(
            'group-hover:text-primary block max-w-full truncate',
            hideTitleOnMobile && 'hidden sm:block'
          )}
        >
          {item.title}
        </Typography>
      </Box>
      {!isPrevious ? (
        <ArrowRight
          aria-hidden="true"
          className="text-primary size-5 shrink-0 transition-transform group-hover:translate-x-1"
        />
      ) : (
        <span aria-hidden="true" />
      )}
    </Link>
  );
}
