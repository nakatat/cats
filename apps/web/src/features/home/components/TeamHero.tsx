import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Button } from '@/components/ui/button';
import type { SummaryTeamResponse } from '@/lib/api/responses';

interface TeamHeroProps {
  team: SummaryTeamResponse;
}

export function TeamHero({ team }: Readonly<TeamHeroProps>) {
  return (
    <Box
      as="section"
      className="bg-primary text-primary-foreground relative overflow-hidden shadow-[0_18px_42px_rgba(11,79,42,0.14)]"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/hero/cats-hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover xl:object-[center_65%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,10,0.62)_0%,rgba(4,30,17,0.34)_46%,rgba(3,18,10,0.04)_100%)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,32,18,0.02)_0%,transparent_52%,rgba(3,18,10,0.10)_100%)]" />
      </div>

      <Box
        width="100%"
        maxWidth={1440}
        className="relative mx-auto px-4 pt-6 pb-8 sm:px-6 sm:pt-10 sm:pb-12 lg:px-8 lg:pt-12 lg:pb-16"
      >
        <Box
          display="flex"
          direction="column"
          className="max-w-4xl gap-4 sm:gap-5"
        >
          <Typography
            as="p"
            variant="caption"
            weight="semibold"
            className="text-secondary/95 text-[13px] tracking-[0.38em] uppercase sm:text-sm"
          >
            SHINKOTONI CATS
          </Typography>

          <Box display="flex" direction="column" className="gap-3">
            <Typography
              as="h1"
              variant="display"
              className="text-primary-foreground max-w-4xl font-extrabold text-pretty wrap-break-word lg:text-[3.5rem] lg:leading-[0.98] xl:text-[4rem]"
            >
              {team.name}
            </Typography>
            {team.description ? (
              <Typography
                as="p"
                variant="body"
                className="text-primary-foreground/90 max-w-3xl break-keep"
              >
                {team.description}
              </Typography>
            ) : null}
          </Box>

          <Box
            display="flex"
            direction="column"
            wrap="wrap"
            className="gap-3 sm:flex-row"
          >
            <Button asChild variant="secondary" className="min-w-44">
              <Link href="/games">
                試合結果を見る
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-primary-foreground hover:text-primary-foreground min-w-40 border-white/70 bg-black/10 hover:bg-white/10"
            >
              <Link href="/stats">
                成績を見る
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
