'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import { Button } from '../ui/button';

const navigationItems = [
  { href: '/', label: 'トップ' },
  { href: '/games', label: '試合' },
  { href: '/players', label: '選手' },
  { href: '/stats', label: '成績' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <Box
      as="header"
      className="bg-primary text-primary-foreground fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 backdrop-blur-md"
    >
      <Box
        width="100%"
        maxWidth={1440}
        display="flex"
        align="center"
        justify="between"
        gap="sm"
        className="mx-auto h-16 px-4 sm:px-6 md:h-20 lg:px-8"
      >
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src="/brand/cats-logo-mark.png"
            alt="新琴似CATS ロゴ"
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 object-contain md:h-16 md:w-16"
            priority
          />
          <Box
            display="flex"
            direction="column"
            gap="none"
            className="min-w-0 leading-tight"
          >
            <Typography
              as="span"
              variant="bodySm"
              tone="primaryForeground"
              weight="semibold"
              className="truncate text-[15px] tracking-[0.02em] md:hidden"
            >
              新琴似CATS
            </Typography>
            <Typography
              as="span"
              variant="bodySm"
              tone="primaryForeground"
              weight="semibold"
              className="hidden truncate text-[17px] tracking-[0.02em] md:inline"
            >
              SHINKOTONI CATS
            </Typography>
            <Typography
              as="span"
              variant="caption"
              tone="primaryForeground"
              weight="medium"
              className="text-[11px] tracking-[0.04em] opacity-[0.78] md:hidden"
            >
              非公式サイト
            </Typography>
            <Typography
              as="span"
              variant="caption"
              tone="primaryForeground"
              weight="medium"
              className="hidden tracking-[0.04em] opacity-[0.78] md:inline md:text-sm"
            >
              新琴似CATS 非公式サイト
            </Typography>
          </Box>
        </Link>

        <Box
          as="nav"
          aria-label="主要ナビゲーション"
          display="flex"
          align="center"
          justify="end"
          gap="xs"
          className="hidden md:flex md:gap-2"
        >
          {navigationItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 border-b-2 px-3 py-2 transition-colors ${
                  isActive
                    ? 'border-secondary text-primary-foreground'
                    : 'text-primary-foreground/85 hover:text-primary-foreground border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Typography
                  as="span"
                  variant="bodySm"
                  tone="inherit"
                  weight="semibold"
                >
                  {item.label}
                </Typography>
              </Link>
            );
          })}
        </Box>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-primary-foreground hover:text-primary-foreground min-h-11 border-white/25 bg-white/10 hover:bg-white/15 md:hidden"
          aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-4" />
          ) : (
            <Menu aria-hidden="true" className="size-4" />
          )}
          <Typography
            as="span"
            variant="bodySm"
            tone="inherit"
            weight="semibold"
          >
            {isMenuOpen ? '閉じる' : 'メニュー'}
          </Typography>
        </Button>
      </Box>

      {isMenuOpen ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] cursor-default bg-black/50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <Box
            id="mobile-navigation"
            as="nav"
            aria-label="モバイルナビゲーション"
            className="bg-primary absolute top-full right-0 left-0 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 px-4 py-3 shadow-[0_18px_30px_rgba(0,0,0,0.28)] md:hidden"
          >
            <Box
              width="100%"
              maxWidth={1440}
              display="flex"
              direction="column"
              gap="none"
              className="mx-auto"
            >
              {navigationItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`border-b border-white/10 px-2 py-3 transition-colors last:border-b-0 ${
                      isActive
                        ? 'text-secondary'
                        : 'text-primary-foreground/85 hover:text-primary-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Typography
                      as="span"
                      variant="bodySm"
                      tone="inherit"
                      weight="semibold"
                    >
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
