import Image from 'next/image';

import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function HomeHeroSkeleton() {
  return (
    <Box className="bg-primary -mt-16 pt-16 md:-mt-20 md:pt-20">
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,10,0.62)_0%,rgba(4,30,17,0.34)_46%,rgba(3,18,10,0.04)_100%)]" />
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
            <Skeleton className="h-4 w-44 bg-white/20" />
            <Box display="flex" direction="column" className="gap-3">
              <Skeleton className="h-14 w-80 max-w-full bg-white/20" />
              <Skeleton className="h-5 w-96 max-w-full bg-white/20" />
            </Box>
            <Box
              display="flex"
              direction="column"
              wrap="wrap"
              className="gap-3 sm:flex-row"
            >
              <Skeleton className="h-11 w-44 bg-white/20" />
              <Skeleton className="h-11 w-40 bg-white/20" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
